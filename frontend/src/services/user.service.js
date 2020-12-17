import axios from 'axios';
import * as https from "https";
import * as fs from "fs";

const API_URL = process.env.API_URL || 'https://ec2-3-138-245-221.us-east-2.compute.amazonaws.com:3001/';

const instance = axios.create({
    baseURL: API_URL,
    httpsAgent: new https.Agent({
        cert: fs.readFileSync(`../../nginx-selfsigned.crt`),
        key: fs.readFileSync(`../../nginx-selfsigned.key`),
        rejectUnauthorized: false
    })
})

class UserService {

    async getGameState(id) {
        const {data: state} = await instance.get(API_URL + "state/" + id)
        return state
    }

    async makeMove(id, i, j, toI, toJ) {
        const {data: state} = await instance.post(API_URL + "move/" + id, {i, j, toI, toJ})
        return state
    }

    async createGame() {
        const {data: state} = await instance.get(API_URL + "create")
        return state.id
    }

    async getHighlight(id, i, j) {
        const {data: highlight} = await instance.post(API_URL + "highlight/" + id, {i, j})
        return highlight
    }
}

export default new UserService();