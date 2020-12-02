import React from "react";
import Board from "./board.component";
import UserService from '../services/user.service'

class Game extends React.Component {

    constructor(props) {
        super(props)
        UserService.getGameState(localStorage.getItem("gameId")).then((state) => {
            console.log(state)
                this.setState({
                    loading: false,
                    current: state[0].state,
                    whiteIsNext: state[0].whiteTurn
                })
            }
        )
        let highlight = this.getHighlight(0, 0, " ")
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

    getHighlight(i, j, type) {
        let basic = [
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0]]
        switch (type[0]) {
            case "p":
                if (type[1] === "w") {
                    if (i === 6) {
                        basic[i - 2][j] = 1
                    }
                    basic[i - 1][j] = 1
                } else {
                    if (i === 1) {
                        basic[i + 2][j] = 1
                    }
                    basic[i + 1][j] = 1
                }
                break
            case "k":
                if (i > 0 && j > 0) {
                    basic[i - 1][j - 1] = 1
                    basic[i][j - 1] = 1
                    basic[i - 1][j] = 1
                }
                if (i < 7 && j > 0) {
                    basic[i + 1][j] = 1
                    basic[i + 1][j - 1] = 1
                    basic[i][j - 1] = 1
                }
                if (i < 7 && j < 7) {
                    basic[i + 1][j] = 1
                    basic[i][j + 1] = 1
                    basic[i + 1][j + 1] = 1
                }
                if (i > 0 && j < 7) {
                    basic[i][j + 1] = 1
                    basic[i - 1][j] = 1
                    basic[i - 1][j + 1] = 1
                }
        }
        return basic
    }

    handleClick(i, j) {
        let selfColor = this.state.whiteIsNext ? "w" : "b"
        let enemyColor = this.state.whiteIsNext ? "b" : "w"
        if (this.state.current[i][j][1] === selfColor && this.state.figureRaised === "") {
            this.setState({
                highlight: this.getHighlight(i, j, this.state.current[i][j]),
                raisedCoords: {y: i, x: j},
                figureRaised: this.state.current[i][j]
            })
        } else if (this.state.figureRaised !== "") {
            if (i === this.state.raisedCoords.y && j === this.state.raisedCoords.x) {
                this.setState({
                    highlight: this.getHighlight(0, 0, " "),
                    raisedCoords: {y: -1, x: -1},
                    figureRaised: ""
                })
            } else if (this.state.current[i][j][1] === enemyColor && this.state.highlight[i][j]) {
                let squares = this.state.current
                squares[i][j] = this.state.figureRaised
                squares[this.state.raisedCoords.y][this.state.raisedCoords.x] = " "
                this.setState({
                    current: squares,
                    figureRaised: "",
                    whiteIsNext: !this.state.whiteIsNext,
                    highlight: this.getHighlight(0, 0, ""),
                    raisedCoords: {y: -1, x: -1}
                })
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
                let status = 'Next player: ' + (this.state.whiteIsNext ? 'W' : 'B');
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
                            <div>{status}</div>
                            <div>Game ID: {this.state.id}</div>
                        </div>
                    </div>
                );
            }
        }
    }
}

export default Game