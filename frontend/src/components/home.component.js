import React from "react";
import UserService from '../services/user.service'

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this)
        this.createGame = this.createGame.bind(this)
        this.joinGame = this.joinGame.bind(this)
        this.createOfflineGame = this.createOfflineGame.bind(this)
        this.state = {
            gameId: undefined,
            wrongId: false
        }
    }

    onChange(e) {
        this.setState({
            gameId: e.target.value,
            wrongId: false
        })
    }

    createGame() {
        UserService.createGame().then((id) => {
            localStorage.setItem("mode", "online")
            localStorage.setItem("gameId", id)
            localStorage.setItem("side", "w")
            this.props.history.push("/game")
        })
    }

    joinGame() {
        if (this.state.gameId !== undefined) {
            console.log(this.state.gameId)
            UserService.getGameState(this.state.gameId).then((state) => {
                if (state.length !== 0) {
                    localStorage.setItem("mode", "online")
                    localStorage.setItem("gameId", this.state.gameId)
                    localStorage.setItem("side", "b")
                    this.props.history.push("/game")
                } else {
                    this.setState({wrongId: true})
                }
            })
        }
    }

    joinGameById(id) {
        UserService.getGameState(id).then((state) => {
            if (state.length !== 0) {
                localStorage.setItem("mode", "online")
                localStorage.setItem("gameId", id)
                localStorage.setItem("side", "b")
                this.props.history.push("/game")
            } else {
                this.setState({wrongId: true})
            }
        })
    }

    createOfflineGame() {
        localStorage.setItem("mode", "offline")
        this.props.history.push("/game")
    }

    render() {
        return (
            <div>
                <button onClick={this.createOfflineGame}>
                    Играть на одном устройстве
                </button>
                <hr className="line"/>
                <button onClick={this.createGame}>
                    Создать игру
                </button>
                <br/>
                <button onClick={this.joinGame}>
                    Присоединиться
                </button>
                <br/>
                <input className="code-input" type="text" placeholder={"Код игры"} value={this.state.gameId}
                       onChange={this.onChange}/>
                {this.state.wrongId ? <div className="error">Игры с таким кодом не существует</div> : ""}
            </div>
        )
    }
}

export default Home