import React from "react";
import Board from "./board.component"
import UserService from '../services/user.service'
import {getHighlight, isAlly, isEnemyOrEmpty} from "../helpers/game.helper"

class Game extends React.Component {

    constructor(props) {
        super(props)
        UserService.getGameState(localStorage.getItem("gameId")).then((state) => {
                if (state[0] !== undefined) {
                    this.setState({
                        loading: false,
                        current: state[0].state,
                        whiteIsNext: state[0].whiteTurn
                    })
                }
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
                // если нажатие на свою фигуру - поднимаем её
                this.setState({
                    highlight: getHighlight(i, j, this.state.current),
                    raisedCoords: {y: i, x: j},
                    figureRaised: this.state.current[i][j]
                })
            } else if (this.state.figureRaised !== "") {
                if (i === this.state.raisedCoords.y && j === this.state.raisedCoords.x) {
                    // если нажимаем на поднятую фигуру - опускаем её
                    this.setState({
                        highlight: getHighlight(0, 0, null),
                        raisedCoords: {y: -1, x: -1},
                        figureRaised: ""
                    })
                } else if (isEnemyOrEmpty(i, j, this.state.current, selfColor) && this.state.highlight[i][j]) {
                    // если фигура поднята и нажат один из доступных квадратов - передвигаем
                    UserService.makeMove(this.state.id, this.state.raisedCoords.y, this.state.raisedCoords.x, i, j).then((newState) => {
                            this.setState({
                                current: newState.state,
                                figureRaised: "",
                                whiteIsNext: newState.whiteTurn,
                                highlight: getHighlight(0, 0, null),
                                raisedCoords: {y: -1, x: -1}
                            })
                        }
                    )
                }
            }
        }
    }

    render() {
        if (this.state.id === null) {
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