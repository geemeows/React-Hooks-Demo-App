export default class ConsumeAPI {
    constructor(baseURL) {
        this.baseURL = baseURL
    }
    post = (endpoint, payload) => {
        return fetch(`${this.baseURL}/${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
    }
}