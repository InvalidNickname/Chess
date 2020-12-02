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
    }
})

const gameModel = mongoose.model("Todo", gameSchema)

module.exports = gameModel