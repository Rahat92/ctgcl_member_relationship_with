import axios from "axios";

const api = axios.create({
    baseURL:'http://192.168.70.79:3001/api/v1',
    headers: {
        'Content-Type':'application/json'
    }
})

export default api;