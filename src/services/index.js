import CONFIG from "../config";


const API_URL = CONFIG.API_URL;

/**
 * Fetch All Supported Currency Pairs
 * @returns Array of Currencies
 */
const fetchAllSupportedCurrencyPairs = async () => {
    const response = await fetch(API_URL + "/products");
    const jsonResponse = await response.json();
    //console.log(jsonResponse);
    return jsonResponse
}

const fetchCryptoCurrencyDetail = async (currencyId) => {
    const response = await fetch(API_URL + "/currencies/" + currencyId);
    const jsonResponse = await response.json();
    return jsonResponse
}

const fetch24HourStats = async (pairId) => {
    const response = await fetch(API_URL + `/products/${pairId}/stats`);
    const jsonResponse = await response.json();
    return jsonResponse
}


export {
    fetchAllSupportedCurrencyPairs,
    fetchCryptoCurrencyDetail,
    fetch24HourStats
}