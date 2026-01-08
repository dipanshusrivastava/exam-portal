const {Schema, model} = require("mongoose");
const { type } = require("node:os");

const userSchema = Schema({
    name: {
        type: String,
        // required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role : {
        type: String,
        required: true,
        enum: ["CREATOR", "TAKER"],
    }
});

module.exports = model("User", userSchema);