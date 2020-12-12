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

async function createUniqueId() {
    let id = GameChecker.createId()
    const found = await db.Game.findOne({id: id})
    if (found === null) {
        return id
    } else {
        await createUniqueId()
    }
}

exports.createGame = async (req, res, next) => {
    try {
        let id = await createUniqueId()
        let startPositions = GameChecker.setStartPositions()
        const state = await db.Game.create({id: id, whiteTurn: true, state: startPositions, checkSet: "", winner: ""})
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
        // проверка рокировки
        if (state[req.body.i][req.body.j] === 'kw' && req.body.toI === 7 && req.body.toJ === 6 && req.body.i === 7 && req.body.j === 4) {
            state[7][6] = 'kw'
            state[7][5] = 'rw'
            state[7][4] = ' '
            state[7][7] = ' '
        } else if (state[req.body.i][req.body.j] === 'kw' && req.body.toI === 7 && req.body.toJ === 2 && req.body.i === 7 && req.body.j === 4) {
            state[7][2] = 'kw'
            state[7][3] = 'rw'
            state[7][4] = ' '
            state[7][0] = ' '
        } else if (state[req.body.i][req.body.j] === 'kb' && req.body.toI === 0 && req.body.toJ === 6 && req.body.i === 0 && req.body.j === 4) {
            state[0][6] = 'kb'
            state[0][5] = 'rb'
            state[0][4] = ' '
            state[0][7] = ' '
        } else if (state[req.body.i][req.body.j] === 'kb' && req.body.toI === 0 && req.body.toJ === 2 && req.body.i === 0 && req.body.j === 4) {
            state[0][2] = 'kb'
            state[0][3] = 'rb'
            state[0][4] = ' '
            state[0][0] = ' '
        } else if (state[req.body.i][req.body.j] === 'pw' && req.body.toI === 0) {
            state[req.body.i][req.body.j] = " "
            state[req.body.toI][req.body.toJ] = 'qw'
        } else if (state[req.body.i][req.body.j] === 'pb' && req.body.toI === 7) {
            state[req.body.i][req.body.j] = " "
            state[req.body.toI][req.body.toJ] = 'qb'
        } else {
            state[req.body.i][req.body.j] = " "
            state[req.body.toI][req.body.toJ] = type
        }
        let check = GameChecker.checkCheck(state, 'w') ? "b" : ""
        check += GameChecker.checkCheck(state, 'b') ? "w" : ""
        let payload = base
        payload.state = state
        payload.whiteTurn = !base.whiteTurn
        if (base.checkSet.includes('b') && check.includes('b')) {
            payload.winner = 'b'
        } else if (base.checkSet.includes('w') && check.includes('w')) {
            payload.winner = 'w'
        } else {
            payload.winner = ''
        }
        payload.checkSet = check
        let move = type[0] + GameChecker.numberToLetter(req.body.toJ + 1) + (req.body.toI + 1)
        let newHistory = base.history
        if (type[1] === 'w') {
            newHistory.push({w: move, b: ""})
        } else {
            newHistory[newHistory.length - 1].b = move
        }
        payload.history = newHistory
        await db.Game.findOneAndUpdate({id: req.params.id}, payload)
        return success(res, payload)
    } catch (err) {
        console.log(err)
        next({status: 400, message: "failed to make move"})
    }
}

exports.getHighlight = async (req, res, next) => {
    try {
        let {state} = await db.Game.findOne({id: req.params.id})
        let highlight = GameChecker.getHighlight(req.body.i, req.body.j, state)
        return success(res, highlight)
    } catch (err) {
        next({status: 400, message: "failed to get highlight"})
    }
}