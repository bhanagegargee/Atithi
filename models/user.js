const mongoose = require("mongoose");
const passportLocalMongoose =
    require("passport-local-mongoose").default;

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },

    last_name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

      googleId: {
        type: String,
        unique: true,
        sparse: true
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);