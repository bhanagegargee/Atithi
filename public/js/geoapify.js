
    // ---------------------------------------------------
    // DOM ELEMENTS
    // ---------------------------------------------------

    const searchInput = document.getElementById("location-search");
    const resultsContainer = document.getElementById("autocomplete-results");

    const selectedAddressInput =
        document.getElementById("selected-address");

    const locationInput =
        document.getElementById("location");

    const countryInput =
        document.getElementById("country");

    const latitudeInput =
        document.getElementById("latitude");

    const longitudeInput =
        document.getElementById("longitude");

    const statusBox =
        document.getElementById("location-status");

    const saveButton =
        document.getElementById("save-listing-btn");


    // ---------------------------------------------------
    // MAP INITIALIZATION (only runs on pages that have #map)
    // ---------------------------------------------------

    const mapContainer = document.getElementById("map");

    if (mapContainer) {

    const map = L.map("map").setView(
        [19.0760, 72.8777],
        10
    );


    // ---------------------------------------------------
    // OPENSTREETMAP + GEOAPIFY TILES
    // ---------------------------------------------------

    const geoapifyApiKey = "<%= process.env.GEOAPIFY_API_KEY %>";

    L.tileLayer(
        `https://maps.geoapify.com/v1/tile/osm-bright-smooth/{z}/{x}/{y}.png?apiKey=${geoapifyApiKey}`,
        {
            attribution:
                '© OpenStreetMap contributors | Powered by Geoapify',
            maxZoom: 20
        }
    ).addTo(map);


    // ---------------------------------------------------
    // MARKER
    // ---------------------------------------------------

    let marker = null;


    // ---------------------------------------------------
    // SELECT LOCATION ON MAP
    // ---------------------------------------------------

    map.on("click", function (event) {

        const latitude = event.latlng.lat;
        const longitude = event.latlng.lng;

        selectLocation(latitude, longitude);

    });



    // ---------------------------------------------------
    // SELECT EXACT LOCATION
    // ---------------------------------------------------

    async function selectLocation(latitude, longitude) {

        latitude = Number(latitude);
        longitude = Number(longitude);


        // Validate
        if (
            !Number.isFinite(latitude) ||
            !Number.isFinite(longitude)
        ) {
            return;
        }


        // ------------------------------------------------
        // UPDATE HIDDEN INPUTS
        // ------------------------------------------------

        latitudeInput.value = latitude;
        longitudeInput.value = longitude;


        // ------------------------------------------------
        // MOVE MAP
        // ------------------------------------------------

        map.setView(
            [latitude, longitude],
            16
        );


        // ------------------------------------------------
        // CREATE / MOVE MARKER
        // ------------------------------------------------

        if (!marker) {

            marker = L.marker(
                [latitude, longitude],
                {
                    draggable: true
                }
            ).addTo(map);


            // Marker drag event
            marker.on(
                "dragend",
                function () {

                    const position =
                        marker.getLatLng();

                    selectLocation(
                        position.lat,
                        position.lng
                    );

                }
            );

        } else {

            marker.setLatLng([
                latitude,
                longitude
            ]);

        }


        // ------------------------------------------------
        // UI STATUS
        // ------------------------------------------------

        if (statusBox) {
            statusBox.style.display = "flex";
            statusBox.className = "flash-msg flash-info";
            statusBox.innerText = "Getting exact address...";
        }


        if (saveButton) saveButton.disabled = true;


        // ------------------------------------------------
        // REVERSE GEOCODING
        // ------------------------------------------------

        try {

            const response = await fetch(
                `/listings/reverse-geocode?lat=${latitude}&lon=${longitude}`
            );


            const data = await response.json();


            if (!response.ok || !data.success) {

                throw new Error(
                    data.message ||
                    "Reverse geocoding failed"
                );

            }


            // --------------------------------------------
            // ADDRESS
            // --------------------------------------------

            const address =
                data.address || "";


            if (selectedAddressInput) selectedAddressInput.value = address;

            if (locationInput) locationInput.value = address;

            if (countryInput) countryInput.value = data.country || "";


            // --------------------------------------------
            // USE GEOAPIFY'S FINAL COORDINATES
            // --------------------------------------------

            if (data.latitude) {

                latitudeInput.value =
                    data.latitude;

            }

            if (data.longitude) {

                longitudeInput.value =
                    data.longitude;

            }


            // --------------------------------------------
            // SUCCESS
            // --------------------------------------------

            if (statusBox) {
                statusBox.className = "flash-msg flash-success";
                statusBox.innerText =
                    "Location selected successfully. You can drag the marker to adjust the exact property location.";
            }


            if (saveButton) saveButton.disabled = false;


        } catch (error) {

            console.error(
                "Reverse geocoding error:",
                error
            );

            if (statusBox) {
                statusBox.className = "flash-msg flash-error";
                statusBox.innerText =
                    "Could not determine the address. Please select another location.";
            }

            if (saveButton) saveButton.disabled = true;

        }

    }

    }
