const CONFIG = {
    API_URL: process.env.REACT_APP_API_URL,
    API_WEBSOCKET: process.env.REACT_APP_API_WEBSOCKET,
    BASE_CURRENCIES: {
        USD: {
            id: "USD",
            symbol: "$",
            description: "US Dollar"
        },
        EUR: {
            id: "EUR",
            symbol: "€",
            description: "Euros"
        },
    }
}


export default CONFIG;