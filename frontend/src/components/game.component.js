import React from "react";
import Board from "./board.component"
import UserService from '../services/user.service'
import GameChecker from '../services/game.checker'

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
        this.exit = this.exit.bind(this)
        let highlight = this.getZeroHighlight()
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
            history: [],
            gameOver: false,
            mode: localStorage.getItem("mode"),
            showIdAlert: true
        }
        if (this.state.mode === 'online') {
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
            setTimeout(() => {
                this.stateUpdater()
            }, 2000)
            window.addEventListener("beforeunload", () => {
                this.setState({gameOver: true})
            })
        } else {
            this.state.current = GameChecker.setStartPositions()
            this.state.loading = false
        }
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

    makeMove(i, j, toI, toJ) {
        // если победа, дальше игра не продолжается
        if (this.state.winner !== "") return
        // иначе продолжаем
        if ((this.state.whiteIsNext && this.state.current[i][j][1] !== 'w') || (!this.state.whiteIsNext && this.state.current[i][j][1] !== 'b')) return;
        if (this.state.mode === 'online') {
            let selfColor = this.state.side
            let myTurn = (selfColor === 'w' && this.state.whiteIsNext) || (selfColor === 'b' && !this.state.whiteIsNext)
            if (!myTurn) return;
            UserService.getHighlight(this.state.id, i, j).then((highlight) => {
                if (highlight[toI][toJ]) {
                    UserService.makeMove(this.state.id, i, j, toI, toJ).then((newState) => {
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
            })
        } else {
            if (GameChecker.getHighlight(i, j, this.state.current)[toI][toJ]) {
                let newState = GameChecker.makeMove(
                    this.state.current, i, j, toI, toJ,
                    this.state.whiteIsNext, this.state.checkSet, this.state.history
                )
                this.setState({
                    winner: newState.winner,
                    checkSet: newState.check,
                    current: newState.state,
                    history: newState.history,
                    side: this.state.side === 'w' ? 'b' : 'w',
                    figureRaised: "",
                    whiteIsNext: newState.whiteTurn,
                    highlight: this.getZeroHighlight(),
                    raisedCoords: {y: -1, x: -1}
                })
            }
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
                if (this.state.mode === 'online') {
                    UserService.getHighlight(this.state.id, i, j).then((highlight) => {
                        this.setState({
                            highlight: highlight,
                            raisedCoords: {y: i, x: j},
                            figureRaised: this.state.current[i][j]
                        })
                    })
                } else {
                    this.setState({
                        highlight: GameChecker.getHighlight(i, j, this.state.current),
                        raisedCoords: {y: i, x: j},
                        figureRaised: this.state.current[i][j]
                    })
                }
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
                    this.makeMove(this.state.raisedCoords.y, this.state.raisedCoords.x, i, j)
                }
            }
        }
    }

    exit() {
        this.props.history.push("/")
    }

    copyCode() {
        navigator.clipboard.writeText(this.state.id)
    }

    dismissAlert() {
        this.setState({showIdAlert: false})
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
                            {
                                this.state.showIdAlert && this.state.mode === 'online' && this.state.side === 'w' &&
                                <div className="fullscreen-alert">
                                    <span>Сообщите другому игроку этот код: {this.state.id}</span>
                                    <br/>
                                    <button onClick={() => {
                                        this.setState({showIdAlert: false})
                                    }}>
                                        OK
                                    </button>
                                </div>
                            }
                            {
                                this.state.winner !== '' &&
                                <div className="fullscreen-alert">
                                    <span>{this.state.winner === 'w' ? "Победитель: БЕЛЫЕ" : this.state.winner === 'b' ? "Победитель: ЧЁРНЫЕ" : ""}</span>
                                    <br/>
                                    <button onClick={this.exit}>
                                        Выйти
                                    </button>
                                </div>
                            }
                            <Board
                                side={this.state.side}
                                current={this.state.current}
                                onClick={(i, j) => this.handleClick(i, j)}
                                highlight={this.state.highlight}
                            />
                        </div>
                        <div className="game-info" align="left">
                            {
                                this.state.mode === 'online' &&
                                <div>ID игры: {this.state.id} <span className="copy-button"
                                                                    onClick={() => this.copyCode()}>⎘</span>
                                </div>
                            }
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
                            <button className="exit-button" onClick={this.exit}>Выход из игры</button>
                        </div>
                    </div>
                );
            }
        }
    }
}

export default Game