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

    boardRow(side) {
        return (
            <div className="board-row">
                <div className={"empty-square"}/>
                <div className={"horizontal-row-number"}>{side === 'b' ? "H" : "A"}</div>
                <div className={"horizontal-row-number"}>{side === 'b' ? "G" : "B"}</div>
                <div className={"horizontal-row-number"}>{side === 'b' ? "F" : "C"}</div>
                <div className={"horizontal-row-number"}>{side === 'b' ? "E" : "D"}</div>
                <div className={"horizontal-row-number"}>{side === 'b' ? "D" : "E"}</div>
                <div className={"horizontal-row-number"}>{side === 'b' ? "C" : "F"}</div>
                <div className={"horizontal-row-number"}>{side === 'b' ? "B" : "G"}</div>
                <div className={"horizontal-row-number"}>{side === 'b' ? "A" : "H"}</div>
            </div>
        )
    }

    render() {
        let board = Array(8)
        if (this.props.side === 'w') {
            for (let i = 0; i < 8; i++) {
                board[i] = Array(8)
                for (let j = 0; j < 8; j++) {
                    board[i][j] = this.renderSquare(i, j, this.props.highlight[i][j])
                }
            }
        } else {
            for (let i = 0; i < 8; i++) {
                board[7 - i] = Array(8)
                for (let j = 0; j < 8; j++) {
                    board[7 - i][7 - j] = this.renderSquare(i, j, this.props.highlight[i][j])
                }
            }
        }
        return (
            <div>
                {this.boardRow(this.props.side)}
                <div className="board-row">
                    <div className={"vertical-row-number"}>{this.props.side === 'b' ? "1" : "8"}</div>
                    {board[0]}
                    <div className={"vertical-row-number"}>{this.props.side === 'b' ? "1" : "8"}</div>
                </div>
                <div className="board-row">
                    <div className={"vertical-row-number"}>{this.props.side === 'b' ? "2" : "7"}</div>
                    {board[1]}
                    <div className={"vertical-row-number"}>{this.props.side === 'b' ? "2" : "7"}</div>
                </div>
                <div className="board-row">
                    <div className={"vertical-row-number"}>{this.props.side === 'b' ? "3" : "6"}</div>
                    {board[2]}
                    <div className={"vertical-row-number"}>{this.props.side === 'b' ? "3" : "6"}</div>
                </div>
                <div className="board-row">
                    <div className={"vertical-row-number"}>{this.props.side === 'b' ? "4" : "5"}</div>
                    {board[3]}
                    <div className={"vertical-row-number"}>{this.props.side === 'b' ? "4" : "5"}</div>
                </div>
                <div className="board-row">
                    <div className={"vertical-row-number"}>{this.props.side === 'b' ? "5" : "4"}</div>
                    {board[4]}
                    <div className={"vertical-row-number"}>{this.props.side === 'b' ? "5" : "4"}</div>
                </div>
                <div className="board-row">
                    <div className={"vertical-row-number"}>{this.props.side === 'b' ? "6" : "3"}</div>
                    {board[5]}
                    <div className={"vertical-row-number"}>{this.props.side === 'b' ? "6" : "3"}</div>
                </div>
                <div className="board-row">
                    <div className={"vertical-row-number"}>{this.props.side === 'b' ? "7" : "2"}</div>
                    {board[6]}
                    <div className={"vertical-row-number"}>{this.props.side === 'b' ? "7" : "2"}</div>
                </div>
                <div className="board-row">
                    <div className={"vertical-row-number"}>{this.props.side === 'b' ? "8" : "1"}</div>
                    {board[7]}
                    <div className={"vertical-row-number"}>{this.props.side === 'b' ? "8" : "1"}</div>
                </div>
                {this.boardRow(this.props.side)}
            </div>
        );
    }
}

export default Board