import React from 'react';
import Square from "./square.component";

class Board extends React.Component {

    renderSquare(i, j, highlight) {
        let className = "square"
        if ((i % 2 !== 0 && j % 2 !== 0) || (i % 2 === 0 && j % 2 === 0)) {
            className += " black"
        } else {
            className += " white"
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
                    {board[0]}
                </div>
                <div className="board-row">
                    {board[1]}
                </div>
                <div className="board-row">
                    {board[2]}
                </div>
                <div className="board-row">
                    {board[3]}
                </div>
                <div className="board-row">
                    {board[4]}
                </div>
                <div className="board-row">
                    {board[5]}
                </div>
                <div className="board-row">
                    {board[6]}
                </div>
                <div className="board-row">
                    {board[7]}
                </div>
            </div>
        );
    }
}

export default Board