import React from 'react';
import Square from "./square.component";

class Board extends React.Component {

    renderSquare(i, j, highlight) {
        let className = "square"
        if ((i % 2 !== 0 && j % 2 !== 0) || (i % 2 === 0 && j % 2 === 0)) {
            className += " white"
        } else {
            className += " black"
        }
        if (highlight) {
            className += " highlight"
        }
        return (
            <Square
                key={8 * i + j}
                className={className}
                value={this.props.current[i][j]}
                onClick={() => this.props.onClick(i, j)}
            />
        );
    }

    render() {
        let board = Array(8)
        for (let i = 0; i < 8; i++) {
            board[i] = Array(8)
            for (let j = 0; j < 8; j++) {
                board[i][j] = this.renderSquare(i, j, this.props.highlight[i][j])
            }
        }
        return (
            <div>
                <div className="board-row">
                    <div className={"empty-square"}/>
                    <div className={"horizontal-row-number"}>A</div>
                    <div className={"horizontal-row-number"}>B</div>
                    <div className={"horizontal-row-number"}>C</div>
                    <div className={"horizontal-row-number"}>D</div>
                    <div className={"horizontal-row-number"}>E</div>
                    <div className={"horizontal-row-number"}>F</div>
                    <div className={"horizontal-row-number"}>G</div>
                    <div className={"horizontal-row-number"}>H</div>
                </div>
                <div className="board-row">
                    <div className={"vertical-row-number"}>1</div>
                    {board[0]}
                </div>
                <div className="board-row">
                    <div className={"vertical-row-number"}>2</div>
                    {board[1]}
                </div>
                <div className="board-row">
                    <div className={"vertical-row-number"}>3</div>
                    {board[2]}
                </div>
                <div className="board-row">
                    <div className={"vertical-row-number"}>4</div>
                    {board[3]}
                </div>
                <div className="board-row">
                    <div className={"vertical-row-number"}>5</div>
                    {board[4]}
                </div>
                <div className="board-row">
                    <div className={"vertical-row-number"}>6</div>
                    {board[5]}
                </div>
                <div className="board-row">
                    <div className={"vertical-row-number"}>7</div>
                    {board[6]}
                </div>
                <div className="board-row">
                    <div className={"vertical-row-number"}>8</div>
                    {board[7]}
                </div>
            </div>
        );
    }
}

export default Board