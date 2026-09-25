// public/js/reservation.js
// ---------------------------------------------------------------------------
// Reservation card on the listing page (views/listing/show.ejs).
//
//   Part 1  AtithiCalendarRules  pure date rules, no DOM (also unit-tested in Node)
//   Part 2  the widget           fetches availability, draws the calendar, fills the form
//
// Everything here is for USER EXPERIENCE only. The server checks the dates,
// guests, price and availability again when the form is submitted.
//
// Stay model: [checkIn, checkOut). checkIn is inclusive, checkOut is exclusive.
// Booking 8 Oct -> 10 Oct occupies the NIGHTS of 8 and 9 Oct, so:
//   * 8 and 9 Oct cannot be a check-in date
//   * 10 Oct is free as a check-in date, and can be a check-out date for 6 -> 10
// ---------------------------------------------------------------------------

var AtithiCalendarRules = (function () {
    "use strict";

    var DAY = 24 * 60 * 60 * 1000;

    // "YYYY-MM-DD" -> ms at 00:00 UTC (NaN if not a real date)
    function toMs(str) {
        if (typeof str !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(str)) return NaN;
        var p = str.split("-");
        var ms = Date.UTC(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
        return toStr(ms) === str ? ms : NaN;
    }

    function toStr(ms) {
        return new Date(ms).toISOString().slice(0, 10);
    }

    // options: { today: "YYYY-MM-DD", ranges: [{checkIn, checkOut}], maxNights: Number }
    function create(options) {
        var today = toMs(options.today);
        var maxNights = options.maxNights || 30;

        var booked = (options.ranges || [])
            .map(function (r) { return { s: toMs(r.checkIn), e: toMs(r.checkOut) }; })
            .filter(function (r) { return !isNaN(r.s) && !isNaN(r.e) && r.e > r.s; })
            .sort(function (a, b) { return a.s - b.s; });

        // Is the NIGHT that starts on this day already taken?
        function isNightBooked(ms) {
            for (var i = 0; i < booked.length; i++) {
                if (booked[i].s <= ms && ms < booked[i].e) return true;
            }
            return false;
        }

        // A check-in day needs a free night that starts on it, and must not be in the past.
        function canCheckIn(ms) {
            return ms >= today && !isNightBooked(ms);
        }

        // Latest possible check-out for a given check-in: the start of the next
        // booking (that day is the hand-over day, so it is allowed), or the
        // maximum stay length, whichever comes first.
        function lastCheckOut(checkInMs) {
            var limit = checkInMs + maxNights * DAY;
            for (var i = 0; i < booked.length; i++) {
                if (booked[i].s > checkInMs) {
                    limit = Math.min(limit, booked[i].s);
                    break;
                }
            }
            return limit;
        }

        // A check-out day must be after check-in and no night in between may be taken.
        function canCheckOut(checkInMs, ms) {
            return typeof checkInMs === "number" && ms > checkInMs && ms <= lastCheckOut(checkInMs);
        }

        function isValidRange(checkInStr, checkOutStr) {
            var a = toMs(checkInStr);
            var b = toMs(checkOutStr);
            return !isNaN(a) && !isNaN(b) && canCheckIn(a) && canCheckOut(a, b);
        }

        return {
            today: today,
            isNightBooked: isNightBooked,
            canCheckIn: canCheckIn,
            canCheckOut: canCheckOut,
            lastCheckOut: lastCheckOut,
            isValidRange: isValidRange,
        };
    }

    return { DAY: DAY, toMs: toMs, toStr: toStr, create: create };
})();

if (typeof module !== "undefined" && module.exports) {
    module.exports = AtithiCalendarRules;
}

// ===========================================================================
// Part 2: the widget (browser only)
// ===========================================================================
if (typeof document !== "undefined") {
    (function () {
        "use strict";

        var Rules = AtithiCalendarRules;
        var DAY = Rules.DAY;

        var root = document.getElementById("reservation");
        var form = document.getElementById("reservation-form");
        if (!root || !form) return; // owner view / no price: nothing to set up

        var el = {
            inBtn: document.getElementById("res-checkin-btn"),
            outBtn: document.getElementById("res-checkout-btn"),
            inText: document.getElementById("res-checkin-text"),
            outText: document.getElementById("res-checkout-text"),
            inValue: document.getElementById("res-checkin-value"),
            outValue: document.getElementById("res-checkout-value"),
            guests: document.getElementById("res-guests"),
            calendar: document.getElementById("res-calendar"),
            title: document.getElementById("cal-title"),
            grid: document.getElementById("cal-grid"),
            prev: document.getElementById("cal-prev"),
            next: document.getElementById("cal-next"),
            hint: document.getElementById("cal-hint"),
            clear: document.getElementById("cal-clear"),
            status: document.getElementById("res-status"),
            submit: document.getElementById("res-submit"),
            summary: document.getElementById("res-summary"),
            summaryLabel: document.getElementById("res-summary-label"),
            summaryAmount: document.getElementById("res-summary-amount"),
        };

        var price = Number(root.dataset.price);
        var maxNights = Number(root.dataset.maxNights) || 30;
        var maxGuests = Number(root.dataset.maxGuests) || 1;
        var prefill = {};
        try { prefill = JSON.parse(root.dataset.prefill || "{}") || {}; } catch (e) { prefill = {}; }

        var rules = null;      // built from the availability response
        var loading = true;
        var checkIn = null;    // ms (UTC midnight) or null
        var checkOut = null;
        var mode = "in";       // which date the next calendar click sets: "in" | "out"
        var viewMonth = null;  // ms of the first day of the month being shown
        var isOpen = false;
        var prefillApplied = false;

        // ------------------------------------------------------------ formatting
        function fmtShort(ms) {
            return new Date(ms).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
        }
        function fmtLong(ms) {
            return new Date(ms).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
        }
        function fmtMonth(ms) {
            return new Date(ms).toLocaleDateString("en-IN", { month: "long", year: "numeric", timeZone: "UTC" });
        }
        function fmtINR(n) {
            return "\u20B9" + n.toLocaleString("en-IN", { maximumFractionDigits: 2 });
        }
        function monthStart(ms) {
            var d = new Date(ms);
            return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1);
        }

        // ------------------------------------------------------------ status line
        function setStatus(message, kind, retry) {
            el.status.textContent = message || "";
            el.status.className = "res-status" + (kind ? " res-status-" + kind : "");
            if (retry) {
                var b = document.createElement("button");
                b.type = "button";
                b.className = "res-retry";
                b.textContent = "Try again";
                b.addEventListener("click", function () { loadAvailability(false); });
                el.status.appendChild(document.createTextNode(" "));
                el.status.appendChild(b);
            }
        }

        // ------------------------------------------------------------ state -> UI
        function isReady() {
            return !!(rules && !loading && checkIn !== null && checkOut !== null &&
                rules.canCheckIn(checkIn) && rules.canCheckOut(checkIn, checkOut));
        }

        function syncFields() {
            el.inText.textContent = checkIn !== null ? fmtShort(checkIn) : "Add date";
            el.outText.textContent = checkOut !== null ? fmtShort(checkOut) : "Add date";
            el.inValue.value = checkIn !== null ? Rules.toStr(checkIn) : "";
            el.outValue.value = checkOut !== null ? Rules.toStr(checkOut) : "";

            var canPick = !!rules && !loading;
            el.inBtn.disabled = !canPick;
            el.outBtn.disabled = !canPick;
            el.submit.disabled = !isReady();

            if (isReady()) {
                var nights = Math.round((checkOut - checkIn) / DAY);
                el.summary.hidden = false;
                el.summaryLabel.textContent = fmtINR(price) + " \u00D7 " + nights + " night" + (nights === 1 ? "" : "s");
                el.summaryAmount.textContent = fmtINR(price * nights);
            } else {
                el.summary.hidden = true;
            }
        }

        // ------------------------------------------------------------ calendar
        function renderCalendar() {
            if (!rules) return;
            el.title.textContent = fmtMonth(viewMonth);
            el.prev.disabled = viewMonth <= monthStart(rules.today);

            var d = new Date(viewMonth);
            var daysInMonth = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate();
            var firstWeekday = d.getUTCDay(); // 0 = Sunday

            el.grid.textContent = "";
            for (var i = 0; i < firstWeekday; i++) {
                var blank = document.createElement("span");
                blank.className = "cal-blank";
                el.grid.appendChild(blank);
            }

            for (var day = 1; day <= daysInMonth; day++) {
                var ms = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), day);

                var asCheckOut = mode === "out" && checkIn !== null && rules.canCheckOut(checkIn, ms);
                var asCheckIn = rules.canCheckIn(ms);
                var clickable = asCheckOut || asCheckIn;
                var nightTaken = rules.isNightBooked(ms);
                var past = ms < rules.today;

                var btn = document.createElement("button");
                btn.type = "button";
                btn.className = "cal-day";
                btn.textContent = String(day);
                btn.dataset.ms = String(ms);
                btn.disabled = !clickable;

                var label = fmtLong(ms);
                if (past) {
                    btn.classList.add("is-past");
                    label += ", in the past";
                } else if (nightTaken && !asCheckOut) {
                    btn.classList.add("is-booked");
                    label += ", unavailable";
                } else if (nightTaken && asCheckOut) {
                    btn.classList.add("is-handover");
                    label += ", available as check-out day only";
                }

                if (checkIn !== null && ms === checkIn) { btn.classList.add("is-selected"); label += ", check-in"; }
                if (checkOut !== null && ms === checkOut) { btn.classList.add("is-selected"); label += ", check-out"; }
                if (checkIn !== null && checkOut !== null && ms > checkIn && ms < checkOut) btn.classList.add("is-in-range");

                btn.setAttribute("aria-label", label);
                el.grid.appendChild(btn);
            }

            el.hint.textContent = mode === "in" || checkIn === null
                ? "Choose your check-in date"
                : "Now choose your check-out date";
        }

        function openCalendar(nextMode) {
            if (!rules || loading) return;
            mode = nextMode === "out" && checkIn !== null ? "out" : "in";
            var anchor = mode === "out" && checkIn !== null ? checkIn : (checkIn !== null ? checkIn : rules.today);
            viewMonth = monthStart(anchor);
            isOpen = true;
            el.calendar.hidden = false;
            el.inBtn.setAttribute("aria-expanded", "true");
            el.outBtn.setAttribute("aria-expanded", "true");
            renderCalendar();
            // Fetch fresh availability every time the picker opens (quietly, no spinner).
            loadAvailability(true);
        }

        function closeCalendar(returnFocusTo) {
            if (!isOpen) return;
            isOpen = false;
            el.calendar.hidden = true;
            el.inBtn.setAttribute("aria-expanded", "false");
            el.outBtn.setAttribute("aria-expanded", "false");
            if (returnFocusTo) returnFocusTo.focus();
        }

        function onDayClick(ms) {
            if (mode === "out" && checkIn !== null && rules.canCheckOut(checkIn, ms)) {
                checkOut = ms;
                closeCalendar(el.outBtn);
            } else if (rules.canCheckIn(ms)) {
                checkIn = ms;
                checkOut = null;
                mode = "out";
                renderCalendar();
            }
            setStatus(isReady() ? "" : "Choose your check-out date.", "");
            syncFields();
        }

        // ------------------------------------------------------------ availability
        function revalidateSelection() {
            if (checkIn === null) return; // nothing chosen yet
            // A check-in on its own (check-out still to be picked) is a valid, partial choice.
            var stillOk = rules.canCheckIn(checkIn) &&
                (checkOut === null || rules.canCheckOut(checkIn, checkOut));
            if (!stillOk) {
                checkIn = null;
                checkOut = null;
                mode = "in";
                setStatus("Those dates are no longer available. Please choose different dates.", "error");
            }
        }

        function applyPrefillOnce() {
            if (prefillApplied) return;
            prefillApplied = true;
            if (!prefill.checkIn || !prefill.checkOut) return;
            if (rules.isValidRange(prefill.checkIn, prefill.checkOut)) {
                checkIn = Rules.toMs(prefill.checkIn);
                checkOut = Rules.toMs(prefill.checkOut);
            } else {
                setStatus("Those dates are no longer available. Please choose different dates.", "error");
            }
        }

        function loadAvailability(silent) {
            if (!silent) {
                loading = true;
                setStatus("Checking availability...", "info");
                syncFields();
            }
            return fetch(root.dataset.availabilityUrl, {
                headers: { Accept: "application/json" },
                cache: "no-store",
                credentials: "same-origin",
            })
                .then(function (res) {
                    if (!res.ok) throw new Error("HTTP " + res.status);
                    return res.json();
                })
                .then(function (data) {
                    rules = Rules.create({
                        today: data.today,
                        ranges: data.unavailableDates,
                        maxNights: maxNights,
                    });
                    loading = false;
                    applyPrefillOnce();
                    revalidateSelection();
                    if (!el.status.classList.contains("res-status-error")) {
                        setStatus(isReady() ? "" : "Choose your dates to book.", "");
                    }
                    syncFields();
                    if (isOpen) renderCalendar();
                })
                .catch(function () {
                    // Keep whatever we already had when a quiet refresh fails.
                    if (silent && rules) return;
                    loading = false;
                    rules = null;
                    setStatus("We couldn't load availability.", "error", true);
                    syncFields();
                });
        }

        // ------------------------------------------------------------ events
        el.inBtn.addEventListener("click", function () {
            if (isOpen && mode === "in") closeCalendar(); else { if (isOpen) closeCalendar(); openCalendar("in"); }
        });
        el.outBtn.addEventListener("click", function () {
            if (isOpen && mode === "out") closeCalendar(); else { if (isOpen) closeCalendar(); openCalendar("out"); }
        });

        el.grid.addEventListener("click", function (event) {
            var target = event.target.closest ? event.target.closest(".cal-day") : null;
            if (!target || target.disabled) return;
            onDayClick(Number(target.dataset.ms));
        });

        el.prev.addEventListener("click", function () {
            var d = new Date(viewMonth);
            viewMonth = Date.UTC(d.getUTCFullYear(), d.getUTCMonth() - 1, 1);
            renderCalendar();
        });
        el.next.addEventListener("click", function () {
            var d = new Date(viewMonth);
            viewMonth = Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1);
            renderCalendar();
        });

        el.clear.addEventListener("click", function () {
            checkIn = null;
            checkOut = null;
            mode = "in";
            setStatus("Choose your dates to book.", "");
            syncFields();
            renderCalendar();
        });

        document.addEventListener("click", function (event) {
            if (!isOpen) return;
            // Clicking a day re-draws the grid, so by the time this listener runs the
            // clicked button may already be detached from the page. composedPath() still
            // remembers where the click really came from.
            var path = event.composedPath ? event.composedPath() : [];
            var inside = path.length
                ? path.indexOf(el.calendar) !== -1 || path.indexOf(el.inBtn) !== -1 || path.indexOf(el.outBtn) !== -1
                : el.calendar.contains(event.target) || el.inBtn.contains(event.target) || el.outBtn.contains(event.target);
            if (inside) return;
            closeCalendar();
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && isOpen) closeCalendar(mode === "out" ? el.outBtn : el.inBtn);
        });

        el.guests.addEventListener("change", syncFields);

        form.addEventListener("submit", function (event) {
            if (!isReady()) {
                event.preventDefault();
                return;
            }
            var guests = Number(el.guests.value);
            if (!(guests >= 1 && guests <= maxGuests)) {
                event.preventDefault();
                setStatus("Please choose a valid number of guests.", "error");
                return;
            }

            // Logged-out visitor: go through login and come back here with the same selection.
            if (root.dataset.authenticated !== "true") {
                event.preventDefault();
                var query = new URLSearchParams({
                    checkIn: Rules.toStr(checkIn),
                    checkOut: Rules.toStr(checkOut),
                    guests: String(guests),
                }).toString();
                window.location.href = root.dataset.bookUrl + "?" + query;
                return;
            }

            el.submit.disabled = true; // stops double clicks
            el.submit.textContent = "Booking...";
        });

        // Coming back with the browser's Back button: reset the button, refresh availability.
        window.addEventListener("pageshow", function (event) {
            if (event.persisted) {
                el.submit.textContent = "Book Now";
                loadAvailability(false);
            }
        });

        // ------------------------------------------------------------ start
        syncFields();
        loadAvailability(false);
    })();
}
