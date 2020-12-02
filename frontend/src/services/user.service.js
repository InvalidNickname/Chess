import axios from 'axios';

const API_URL = 'http://localhost:3001/';

class UserService {

    async getGameState(id) {
        const {data: state} = await axios.get(API_URL + "state/" + id)
        return state
    }

    async makeMove(id, i, j, toI, toJ) {
        const {data: state} = await axios.post(API_URL + "move/" + id, {i, j, toI, toJ})
        return state
    }

    async createGame() {
        const {data: state} = await axios.get(API_URL + "create")
        return state.id
    }
}

export default new UserService();