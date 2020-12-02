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
        let base = await db.Game.findOne({id: req.params.id})
        let state = base.state
        let type = state[req.body.i][req.body.j]
        state[req.body.i][req.body.j] = " "
        state[req.body.toI][req.body.toJ] = type
        let payload = base
        payload.state = state
        payload.whiteTurn = !base.whiteTurn
        await db.Game.findOneAndUpdate({id: req.params.id}, payload)
        return success(res, payload)
    } catch (err) {
        console.log(err)
        next({status: 400, message: "failed to make move"})
    }
}