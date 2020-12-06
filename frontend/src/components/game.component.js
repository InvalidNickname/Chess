import React from "react";
import Board from "./board.component"
import UserService from '../services/user.service'

class Game extends React.Component {

    getZeroHighlight() {
        return [
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0]
        ]
    }

    isAlly(i, j, board, side) {
        return board[i][j][1] === side
    }

    isEnemyOrEmpty(i, j, board, side) {
        return board[i][j][1] !== side
    }

    constructor(props) {
        super(props)
        UserService.getGameState(localStorage.getItem("gameId")).then((state) => {
                if (state[0] !== undefined) {
                    this.setState({
                        loading: false,
                        current: state[0].state,
                        whiteIsNext: state[0].whiteTurn,
                        checkSet: state[0].checkSet,
                        winner: state[0].winner,
                        history: state[0].history,
                    })
                }
            }
        )
        let highlight = this.getZeroHighlight()
        setTimeout(() => {
            this.stateUpdater()
        }, 2000)
        this.state = {
            winner: "",
            checkSet: "",
            loading: true,
            id: localStorage.getItem("gameId"),
            current: undefined,
            highlight: highlight,
            whiteIsNext: true,
            figureRaised: "",
            side: localStorage.getItem("side"),
            raisedCoords: {y: -1, x: -1},
            gameOver: false
        };
        window.addEventListener("beforeunload", () => {
            this.setState({gameOver: true})
        })
    }

    stateUpdater() {
        UserService.getGameState(localStorage.getItem("gameId")).then((state) => {
                if (state[0] !== undefined) {
                    this.setState({
                        current: state[0].state,
                        whiteIsNext: state[0].whiteTurn,
                        checkSet: state[0].checkSet,
                        winner: state[0].winner,
                        history: state[0].history
                    })
                }
            }
        )
        if (!this.state.gameOver) {
            setTimeout(() => {
                this.stateUpdater()
            }, 1000)
        }
    }

    handleClick(i, j) {
        // если победа, дальше игра не продолжается
        if (this.state.winner !== "") return
        // иначе продолжаем
        let selfColor = this.state.side
        let myTurn = (selfColor === 'w' && this.state.whiteIsNext) || (selfColor === 'b' && !this.state.whiteIsNext)
        if (myTurn) {
            if (this.isAlly(i, j, this.state.current, selfColor) && this.state.figureRaised === "") {
                // если нажатие на свою фигуру - поднимаем её
                UserService.getHighlight(this.state.id, i, j).then((highlight) => {
                    this.setState({
                        highlight: highlight,
                        raisedCoords: {y: i, x: j},
                        figureRaised: this.state.current[i][j]
                    })
                })
            } else if (this.state.figureRaised !== "") {
                if (i === this.state.raisedCoords.y && j === this.state.raisedCoords.x) {
                    // если нажимаем на поднятую фигуру - опускаем её
                    this.setState({
                        highlight: this.getZeroHighlight(),
                        raisedCoords: {y: -1, x: -1},
                        figureRaised: ""
                    })
                } else if (this.isEnemyOrEmpty(i, j, this.state.current, selfColor) && this.state.highlight[i][j]) {
                    // если фигура поднята и нажат один из доступных квадратов - передвигаем
                    UserService.makeMove(this.state.id, this.state.raisedCoords.y, this.state.raisedCoords.x, i, j).then((newState) => {
                            this.setState({
                                winner: newState.winner,
                                checkSet: newState.checkSet,
                                current: newState.state,
                                history: newState.history,
                                figureRaised: "",
                                whiteIsNext: newState.whiteTurn,
                                highlight: this.getZeroHighlight(),
                                raisedCoords: {y: -1, x: -1}
                            })
                        }
                    )
                }
            }
        }
    }

    copyCode() {
        navigator.clipboard.writeText(this.state.id)
    }

    render() {
        if (this.state.id === null) {
            return <div>Не выполнено подключение к игре</div>;
        } else {
            if (this.state.loading) {
                return <div>Загрузка</div>;
            } else {
                return (
                    <div className="game">
                        <div className="game-board">
                            <Board
                                side={this.state.side}
                                current={this.state.current}
                                onClick={(i, j) => this.handleClick(i, j)}
                                highlight={this.state.highlight}
                            />
                        </div>
                        <div className="game-info" align="left">
                            <div>ID игры: {this.state.id} <span className="copy-button"
                                                                onClick={() => this.copyCode()}>⎘</span></div>
                            <div>Сейчас ходят: {this.state.whiteIsNext ? 'БЕЛЫЕ' : 'ЧЁРНЫЕ'}</div>
                            <div>Ваш цвет: {this.state.side === 'w' ? "БЕЛЫЕ" : "ЧЁРНЫЕ"}</div>
                            <div>{this.state.checkSet !== "" ? "ШАХ" : ""}</div>
                            <div>{this.state.winner === 'w' ? "Победитель: БЕЛЫЕ" : this.state.winner === 'b' ? "Победитель: ЧЁРНЫЕ" : ""}</div>
                            <hr className="line"/>
                            <div>История ходов:</div>
                            <div className="history">
                                {this.state.history.map((move, index) => {
                                    return <div>{index + 1}) {move.w} {move.b}</div>
                                })}
                            </div>
                        </div>
                    </div>
                );
            }
        }
    }
}

export default Game