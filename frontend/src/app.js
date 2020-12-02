import React, {Component} from "react"
import {Switch, Route} from "react-router-dom";
import Game from "./components/game.component";
import Home from "./components/home.component";

class App extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div align="center">
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