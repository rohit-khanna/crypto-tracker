import React from 'react';
import { Dropdown, Statistic } from 'semantic-ui-react';
import './Filters.css';



const Filters = ({
    baseCurrencies,
    selectedCurrencyPair,
    handleCurrencyPairChange,
    currencyPairArray,
    onBaseCurrencyChange, baseCurrSymbol, price,
    selectedBaseCurrency }) => {
    return (
        <div className="filterContainer">
            <Dropdown
                button
                selection
                options={baseCurrencies}
                className="filters"
                search
                placeholder='Base Currency'
                onChange={onBaseCurrencyChange}
                defaultValue={selectedBaseCurrency}
                title="Base Currency"
            />
            <Dropdown
                button
                selection
                className="filters"
                options={currencyPairArray}
                search
                placeholder='Select Currency Pair'
                onChange={handleCurrencyPairChange}
                value={selectedCurrencyPair}
                title="Selected Pair"
            />

            {selectedBaseCurrency ? <Statistic size="small" className="currentPrice"
                label={`Current Price in "${baseCurrSymbol}" `} value={`${price}`} /> : ""}
        </div>
    );
};

export default Filters;