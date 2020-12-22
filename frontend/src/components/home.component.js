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
        this.assistant = props.assistant
    }

    onChange(e) {
        this.setState({
            gameId: e.target.value,
            wrongId: false
        })
    }

    createGame() {
        UserService.createGame().then((id) => {
            sessionStorage.setItem("mode", "online")
            sessionStorage.setItem("gameId", id)
            sessionStorage.setItem("side", "w")
            this.props.history.push("/game")
            this.assistant.sendData({action: {action_id: "started_online_host"}})
        })
    }

    joinGame() {
        if (this.state.gameId !== undefined) {
            UserService.getGameState(this.state.gameId).then((state) => {
                if (state.length !== 0) {
                    sessionStorage.setItem("mode", "online")
                    sessionStorage.setItem("gameId", this.state.gameId)
                    sessionStorage.setItem("side", "b")
                    this.props.history.push("/game")
                    this.assistant.sendData({action: {action_id: "started_online"}})
                } else {
                    this.setState({wrongId: true})
                }
            })
        }
    }

    joinGameById(id) {
        UserService.getGameState(id).then((state) => {
            if (state.length !== 0) {
                sessionStorage.setItem("mode", "online")
                sessionStorage.setItem("gameId", id)
                sessionStorage.setItem("side", "b")
                this.props.history.push("/game")
                this.assistant.sendData({action: {action_id: "started_online"}})
            } else {
                this.setState({wrongId: true})
            }
        })
    }

    createOfflineGame() {
        sessionStorage.setItem("mode", "offline")
        this.props.history.push("/game")
        this.assistant.sendData({action: {action_id: "started_offline"}})
    }

    render() {
        return (
            <div>
                <button onClick={this.createOfflineGame}>
                    Играть на одном устройстве
                </button>
                <hr className="line"/>
                <button onClick={this.createGame}>
                    Создать игру по сети
                </button>
                <br/>
                или
                <br/>
                <button onClick={this.joinGame}>
                    Присоединиться к игре
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