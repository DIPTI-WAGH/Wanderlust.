const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

// Add username & password fields automatically
userSchema.plugin(passportLocalMongoose);

// IMPORTANT: Capital 'User' here
module.exports = mongoose.model("User", userSchema);
