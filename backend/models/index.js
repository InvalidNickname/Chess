const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost/chess", {
    keepAlive: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
mongoose.set("debug", false)
mongoose.Promise = Promise

module.exports.Game = require("./game.model")