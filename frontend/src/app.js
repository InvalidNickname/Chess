import React, {Component} from "react"
import {Switch, Route} from "react-router-dom";
import Game from "./components/game.component";
import Home from "./components/home.component";

class App extends Component {
    render() {
        return (
            <div align="center" onContextMenu={(e) => e.preventDefault()}>
                <div>
                    <Switch>
                        <Route exact path="/" component={Home}/>
                        <Route exact path="/game" component={Game}/>
                    </Switch>
                </div>
            </div>
        )
    }
}

export default App