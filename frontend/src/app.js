import React, {Component} from "react"
import {Switch, Route} from "react-router-dom";
import Game from "./components/game.component";
import Home from "./components/home.component";
import {createAssistant, createSmartappDebugger} from "@sberdevices/assistant-client";
import RuleBook from "./components/rulebook.component";

class App extends Component {

    constructor(props) {
        super(props);
        this.getAssistant = this.getAssistant.bind(this)
        this.processAction = this.processAction.bind(this)
        this.state = {
            cur: 'home',
            action: '',
        }
        this.home = React.createRef()
        this.game = React.createRef()
        this.rules = React.createRef()
        this.assistant = this.getAssistant(() => {
            return {cur: this.state.cur}
        })
        this.assistant.on("data", (event) => {
            this.processAction(event)
        })

        this.assistant.on("start", (event) => {
            console.log('aaa')
            this.assistant.sendData({action: {action_id: "first_start"}})
        })
    }

    getAssistant(getState) {
        if (process.env.NODE_ENV === 'development') {
            return createSmartappDebugger({
                token: process.env.REACT_APP_TOKEN,
                initPhrase: `Запусти ${process.env.REACT_APP_SMARTAPP}`,
                getState
            });
        }
        return createAssistant(getState)
    }

    processAction(event) {
        let command = event.navigation
        if (command !== undefined) {
            if (window.location.pathname === '/rules') {
                switch (command.command) {
                    case "UP":
                        this.rules.current.scrollUp()
                        break
                    case "DOWN":
                        this.rules.current.scrollDown()
                        break
                    default:
                        break
                }
            }
        }
        let action = event.action
        if (action === undefined) return
        if (window.location.pathname === '/') {
            switch (action.type) {
                case "start_offline":
                    this.home.current.createOfflineGame()
                    break
                case "start_online":
                    this.home.current.createGame()
                    break
                case "join_game":
                    let code = action.code.replaceAll(' ', '').toUpperCase()
                    this.home.current.joinGameById(code)
                    break
                case "open_rules":
                    this.home.current.openRules()
                    break
                default:
                    break
            }
        } else if (window.location.pathname === '/game') {
            switch (action.type) {
                case "make_move":
                    let j = this.letterToNumber(action.from[0])
                    let i = 7 - (action.from.charCodeAt(1) - 49)
                    let toJ = this.letterToNumber(action.to[0])
                    let toI = 7 - (action.to.charCodeAt(1) - 49)
                    this.game.current.makeMove(i, j, toI, toJ)
                    break
                case "dismiss_alert":
                    this.game.current.dismissAlert()
                    break
                case "exit":
                    this.game.current.exit()
                    break
                default:
                    break
            }
        } else {
            switch (action.type) {
                case "exit":
                    this.rules.current.goBack()
                    break
                case "scroll_up":
                    this.rules.current.scrollUp()
                    break
                case "scroll_down":
                    this.rules.current.scrollDown()
                    break
                default:
                    break
            }
        }
    }

    letterToNumber(letter) {
        switch (letter) {
            case 'а':
                return 0
            case 'б':
                return 1
            case 'с':
                return 2
            case 'д':
                return 3
            case 'е':
                return 4
            case 'ф':
                return 5
            case 'ж':
                return 6
            case 'н':
                return 7
            default:
                return 0
        }
    }

    render() {
        return (
            <div align="center" onContextMenu={(e) => e.preventDefault()}>
                <div>
                    <Switch>
                        <Route exact path="/" render={(props) => {
                            return <Home assistant={this.assistant} {...props} ref={this.home}/>
                        }}/>
                        <Route exact path="/game" render={(props) => {
                            return <Game assistant={this.assistant} {...props} ref={this.game}/>
                        }}/>
                        <Route exact path="/rules" render={(props) => {
                            return <RuleBook assistant={this.assistant} {...props} ref={this.rules}/>
                        }}/>
                    </Switch>
                </div>
            </div>
        )
    }
}

export default App