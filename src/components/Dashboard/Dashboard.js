import React, { useState, useRef, useEffect, useCallback } from "react";
import CONFIG from "../../config";
import { fetchAllSupportedCurrencyPairs } from "../../services";
import { formatData, formatDropdownData } from "../../utils";
import CurrencyDescription from "../CurrencyDescription/CurrencyDescription";
import CustomChart from "../CustomChart";
import Filters from "../Filters";
import "./Dashboard.css";


const availableBaseCurrencies = Object.values(CONFIG.BASE_CURRENCIES)
  .map(({ symbol, description, id }) => ({
    key: id,
    text: `${id} - ${description}`,
    value: id,
    symbol
  }))



const Dashboard = () => {
  //#region State


  const [availableCurrencyPairs, setAvailableCurrencyPairs] = useState([]);

  //all available crypto Currencies For Base Currency
  const [cryptoCurrenciesForBase, setCryptoCurrenciesForBase] = useState([]);

  //current currency pair selected by the user
  const [currencyPair, setCurrencyPair] = useState("");

  //price of the current currency
  const [price, setprice] = useState("0.00");

  //historical price data from current currency
  const [pastData, setpastData] = useState({});

  const [baseCurrency, setBaseCurrency] = useState(CONFIG.BASE_CURRENCIES.USD.id)
  //#endregion


  //#region Callback
  const filterCurrencyPairs = useCallback(
    () => {

      if (!availableCurrencyPairs) return []

      let filtered = availableCurrencyPairs.filter((pair) => pair.quote_currency === baseCurrency);

      //sort filtered currency pairs alphabetically
      return filtered.sort((a, b) => {
        if (a.base_currency < b.base_currency) {
          return -1;
        }
        if (a.base_currency > b.base_currency) {
          return 1;
        }
        return 0;
      });
    },
    [baseCurrency, availableCurrencyPairs],
  )
  //#endregion
  //#region Ref

  //a persistent websocket object
  const webSocket = useRef(null);
  let first = useRef(false);

  //#endregion

  //#region UseEffect
  useEffect(() => {
    // connect to WebSocket URL
    webSocket.current = new WebSocket(CONFIG.API_WEBSOCKET);

    const apiCall = async () => {
      const availablePairs = await fetchAllSupportedCurrencyPairs();
      setAvailableCurrencyPairs(availablePairs);
      first.current = true;
    };

    //call API
    apiCall();

  }, []);

  useEffect(() => {
    const filteredCurrencies = filterCurrencyPairs(baseCurrency);

    setCryptoCurrenciesForBase(formatDropdownData(filteredCurrencies));
  }, [availableCurrencyPairs, baseCurrency, filterCurrencyPairs])


  useEffect(() => {
    if (!first.current || !currencyPair) {
      return;
    }



    let msg = {
      type: "subscribe",
      product_ids: [currencyPair],
      channels: ["ticker"],
    };
    let jsonMsg = JSON.stringify(msg);
    webSocket.current.send(jsonMsg);

    let historicalDataURL = `${CONFIG.API_URL}/products/${currencyPair}/candles?granularity=86400`;
    const fetchHistoricalData = async () => {
      let dataArr = [];
      await fetch(historicalDataURL)
        .then((res) => res.json())
        .then((data) => (dataArr = data));

      let formattedData = formatData(dataArr);
      setpastData(formattedData);

      webSocket.current.onmessage = (e) => {
        let data = JSON.parse(e.data);
        if (data.type !== "ticker") {
          return;
        }

        if (data.product_id === currencyPair) {
          setprice(data.price);
        }
      };
    };

    fetchHistoricalData();
  }, [currencyPair]);
  //#endregion


  //#region Handlers
  const handleSelect = (syntheticBaseEvent, event) => {
    let unsubMsg = {
      type: "unsubscribe",
      product_ids: [currencyPair],
      channels: ["ticker"]
    };
    let unsub = JSON.stringify(unsubMsg);

    webSocket.current.send(unsub);
    setCurrencyPair(event.value);
  };

  const handleBaseCurrencyChange = (e, { value }) => {
    setCurrencyPair("")
    setBaseCurrency(value)
  }
  //#endregion
  const showChart = !!currencyPair;

  const currencyId = currencyPair.split("-")[0];

  const baseCurrSymbol = CONFIG.BASE_CURRENCIES[baseCurrency].symbol;

  return (
    <section className="mainContainer">

      <Filters
        baseCurrencies={availableBaseCurrencies}
        selectedBaseCurrency={baseCurrency}
        currencyPairArray={cryptoCurrenciesForBase}
        handleCurrencyPairChange={handleSelect}
        onBaseCurrencyChange={handleBaseCurrencyChange}
        baseCurrSymbol={baseCurrSymbol}
        price={price}
      />
      {currencyId ? <div className="priceCurrencyContainer">
        <CurrencyDescription currencyId={currencyId} />

      </div> : ""}

      <CustomChart data={pastData} showChart={showChart} />
    </section>
  );
};

export default Dashboard;
