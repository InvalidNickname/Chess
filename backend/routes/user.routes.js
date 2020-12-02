const controller = require("../controllers/user.controller");

module.exports = function (app) {

    app.get("/state/:id", controller.getGameState)

    app.get("/create", controller.createGame)

    app.post("/move/:id", controller.makeMove)

    app.post("/highlight/:id", controller.getHighlight)
};