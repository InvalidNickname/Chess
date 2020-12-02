const db = require("../models");
const GameChecker = require('./game.checker')

function success(res, payload) {
    return res.status(200).json(payload)
}

exports.getGameState = async (req, res, next) => {
    try {
        const state = await db.Game.find({id: req.params.id})
        return success(res, state)
    } catch (err) {
        next({status: 400, message: "failed to get game state"})
    }
};

exports.createGame = async (req, res, next) => {
    try {
        let id = Date.now()
        let startPositions = GameChecker.setStartPositions()
        const state = await db.Game.create({id: id, whiteTurn: true, state: startPositions})
        return success(res, state)
    } catch (err) {
        next({status: 400, message: "failed to create a new game"})
    }
};

exports.makeMove = async (req, res, next) => {
    try {
        //const todo = await db.Todo.create(req.body)
        return success(res, todo)
    } catch (err) {
        next({status: 400, message: "failed to make move"})
    }
}