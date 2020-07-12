export default class ConsumeAPI {
    constructor(baseURL) {
        this.baseURL = baseURL
    }
    post = (route, payload) => {
        let endpoint 
        if (route.startsWith('/'))
            endpoint = route
        else 
            endpoint = `/${route}`

        return fetch(`${this.baseURL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
    }
    get = (route) => {
        let endpoint 
        if (route.startsWith('/'))
            endpoint = route
        else 
            endpoint = `/${route}`
        return fetch(`${this.baseURL}${endpoint}`)
    }
    delete = (route) => {
        let endpoint 
        if (route.startsWith('/'))
            endpoint = route
        else 
            endpoint = `/${route}`
        return fetch(`${this.baseURL}${endpoint}`, {
            method: 'DELETE'
        })
    }
}