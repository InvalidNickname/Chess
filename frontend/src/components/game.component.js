import React from "react";
import Board from "./board.component";
import UserService from '../services/user.service'

function isEmpty(i, j, board) {
    return board[i][j] === " "
}

function isEnemyOrEmpty(i, j, board, side) {
    return board[i][j][1] !== side
}

function isAlly(i, j, board, side) {
    return board[i][j][1] === side
}

function isEnemy(i, j, board, side) {
    let enemy = side === 'w' ? 'b' : 'w'
    return board[i][j][1] === enemy
}

function getHighlight(i, j, board) {
    let basic = [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]]
    if (board === null) return basic
    let type = board[i][j]
    switch (type[0]) {
        case "p":
            basic[i][j] = 1
            if (type[1] === "w") {
                // если перед ней никого нет, ходит на одну клетку
                if (i > 0 && isEmpty(i - 1, j, board)) {
                    basic[i - 1][j] = 1
                    // с начальной позиции пешка может ходить на 2 клетки, если там никого нет
                    if (i === 6 && isEmpty(i - 2, j, board)) {
                        basic[i - 2][j] = 1
                    }
                }
                // если впереди по диагонали враг - можно ходить на него
                if (j < 7 && i > 0 && isEnemy(i - 1, j + 1, board, type[1])) {
                    basic[i - 1][j + 1] = 1
                }
                if (j > 0 && i > 0 && isEnemy(i - 1, j - 1, board, type[1])) {
                    basic[i - 1][j - 1] = 1
                }
            } else {
                // если перед ней никого нет, ходит на одну клетку
                if (i < 7 && isEmpty(i + 1, j, board)) {
                    basic[i + 1][j] = 1
                    // с начальной позиции пешка может ходить на 2 клетки, если там никого нет
                    if (i === 1 && isEmpty(i + 2, j, board)) {
                        basic[i + 2][j] = 1
                    }
                }
                // если впереди по диагонали враг - можно ходить на него
                if (j < 7 && i < 7 && isEnemy(i + 1, j + 1, board, type[1])) {
                    basic[i - 1][j + 1] = 1
                }
                if (j > 0 && i < 7 && isEnemy(i + 1, j - 1, board, type[1])) {
                    basic[i - 1][j - 1] = 1
                }
            }
            break
        case "k":
            basic[i][j] = 1
            // король ходит на любую соседнюю клетку
            if (i > 0 && j > 0) {
                if (isEnemyOrEmpty(i - 1, j - 1, board, type[1])) {
                    basic[i - 1][j - 1] = 1
                }
                if (isEnemyOrEmpty(i, j - 1, board, type[1])) {
                    basic[i][j - 1] = 1
                }
                if (isEnemyOrEmpty(i - 1, j, board, type[1])) {
                    basic[i - 1][j] = 1
                }
            }
            if (i < 7 && j > 0) {
                if (isEnemyOrEmpty(i + 1, j, board, type[1])) {
                    basic[i + 1][j] = 1
                }
                if (isEnemyOrEmpty(i + 1, j - 1, board, type[1])) {
                    basic[i + 1][j - 1] = 1
                }
                if (isEnemyOrEmpty(i, j - 1, board, type[1])) {
                    basic[i][j - 1] = 1
                }
            }
            if (i < 7 && j < 7) {
                if (isEnemyOrEmpty(i + 1, j, board, type[1])) {
                    basic[i + 1][j] = 1
                }
                if (isEnemyOrEmpty(i, j + 1, board, type[1])) {
                    basic[i][j + 1] = 1
                }
                if (isEnemyOrEmpty(i + 1, j + 1, board, type[1])) {
                    basic[i + 1][j + 1] = 1
                }
            }
            if (i > 0 && j < 7) {
                if (isEnemyOrEmpty(i, j + 1, board, type[1])) {
                    basic[i][j + 1] = 1
                }
                if (isEnemyOrEmpty(i - 1, j, board, type[1])) {
                    basic[i - 1][j] = 1
                }
                if (isEnemyOrEmpty(i - 1, j + 1, board, type[1])) {
                    basic[i - 1][j + 1] = 1
                }
            }
            break
        case 'r':
            basic[i][j] = 1
            // ладья ходит по вертикали и горизонтали до конца доски или первой занятой клетки
            for (let y = i; y < 8; y++) {
                basic[y][j] = 1
                if (!isEmpty(y, j, board)) {
                    break
                }
            }
            for (let y = i; y >= 0; y--) {
                basic[y][j] = 1
                if (!isEmpty(y, j, board)) {
                    break
                }
            }
            for (let x = j; x < 8; x++) {
                basic[i][x] = 1
                if (!isEmpty(i, x, board)) {
                    break
                }
            }
            for (let x = j; x >= 0; x--) {
                basic[i][x] = 1
                if (!isEmpty(i, x, board)) {
                    break
                }
            }
            break
        case 'n':
            break
        case 'b':
            break
        case 'q':
            break
        default:
            break
    }
    return basic
}

class Game extends React.Component {

    constructor(props) {
        super(props)
        UserService.getGameState(localStorage.getItem("gameId")).then((state) => {
                this.setState({
                    loading: false,
                    current: state[0].state,
                    whiteIsNext: state[0].whiteTurn
                })
            }
        )
        let highlight = getHighlight(0, 0, null)
        this.state = {
            loading: true,
            id: localStorage.getItem("gameId"),
            current: undefined,
            highlight: highlight,
            whiteIsNext: true,
            figureRaised: "",
            side: localStorage.getItem("side"),
            raisedCoords: {y: -1, x: -1},
            gameId: localStorage.getItem("gameId")
        };
    }

    handleClick(i, j) {
        let selfColor = this.state.side
        let myTurn = (selfColor === 'w' && this.state.whiteIsNext) || (selfColor === 'b' && !this.state.whiteIsNext)
        if (myTurn) {
            if (isAlly(i, j, this.state.current, selfColor) && this.state.figureRaised === "") {
                this.setState({
                    highlight: getHighlight(i, j, this.state.current),
                    raisedCoords: {y: i, x: j},
                    figureRaised: this.state.current[i][j]
                })
            } else if (this.state.figureRaised !== "") {
                if (i === this.state.raisedCoords.y && j === this.state.raisedCoords.x) {
                    this.setState({
                        highlight: getHighlight(0, 0, null),
                        raisedCoords: {y: -1, x: -1},
                        figureRaised: ""
                    })
                } else if (isEnemyOrEmpty(i, j, this.state.current, selfColor) && this.state.highlight[i][j]) {
                    let squares = this.state.current
                    squares[i][j] = this.state.figureRaised
                    squares[this.state.raisedCoords.y][this.state.raisedCoords.x] = " "
                    this.setState({
                        current: squares,
                        figureRaised: "",
                        whiteIsNext: !this.state.whiteIsNext,
                        highlight: getHighlight(0, 0, null),
                        raisedCoords: {y: -1, x: -1}
                    })
                }
            }
        }
    }

    render() {
        if (this.state.gameId === undefined) {
            return <div>Не выполнено подключение к игре</div>;
        } else {
            if (this.state.loading) {
                return <div>Загрузка</div>;
            } else {
                let status = 'Сейчас ходят: ' + (this.state.whiteIsNext ? 'БЕЛЫЕ' : 'ЧЁРНЫЕ');
                return (
                    <div className="game">
                        <div className="game-board">
                            <Board
                                current={this.state.current}
                                onClick={(i, j) => this.handleClick(i, j)}
                                highlight={this.state.highlight}
                            />
                        </div>
                        <div className="game-info" align="left">
                            <div>ID игры: {this.state.id}</div>
                            <div>{status}</div>
                            <div>Ваш цвет: {this.state.side === 'w' ? "БЕЛЫЕ" : "ЧЁРНЫЕ"}</div>
                        </div>
                    </div>
                );
            }
        }
    }
}

export default Game