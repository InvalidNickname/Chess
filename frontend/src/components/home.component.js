import React from "react";
import UserService from '../services/user.service'

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this)
        this.createGame = this.createGame.bind(this)
        this.joinGame = this.joinGame.bind(this)
        this.state = {
            gameId: undefined
        }
    }

    onChange(e) {
        this.setState({
            gameId: e.target.value
        })
    }

    createGame() {
        UserService.createGame().then((id) => {
            localStorage.setItem("gameId", id)
            localStorage.setItem("side", "w")
            this.props.history.push("/game")
            window.location.reload()
        })
    }

    joinGame() {
        if (this.state.gameId !== undefined) {
            UserService.getGameState(this.state.gameId).then(() => {
                localStorage.setItem("gameId", this.state.gameId)
                localStorage.setItem("side", "b")
                this.props.history.push("/game")
                window.location.reload()
            })
        }
    }

    render() {
        return (
            <div>
                <button onClick={this.createGame}>
                    Создать игру
                </button>
                <br/>
                <button onClick={this.joinGame}>
                    Присоединиться
                </button>
                <br/>
                <input type="text" placeholder={"Код игры"} value={this.state.gameId} onChange={this.onChange}/>
            </div>
        )
    }
}

export default Home