const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: "" },
    score: { type: Number, default: 0 },
    calories: { type: Number,default: 0 },
    createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model("User", UserSchema)