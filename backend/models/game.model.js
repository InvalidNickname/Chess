const mongoose = require("mongoose")

const gameSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true,
        required: true,
    },
    whiteTurn: {
        type: Boolean,
        required: true
    },
    state: {
        type: [[]],
        required: true
    },
    checkSet: {
        type: String
    },
    winner: {
        type: String
    }
})

const gameModel = mongoose.model("Game", gameSchema)

module.exports = gameModel