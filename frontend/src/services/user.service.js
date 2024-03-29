import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3001/' : 'https://sberchess.wrtc.ru/';

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

    async getHighlight(id, i, j) {
        const {data: highlight} = await axios.post(API_URL + "highlight/" + id, {i, j})
        return highlight
    }
}

export default new UserService();