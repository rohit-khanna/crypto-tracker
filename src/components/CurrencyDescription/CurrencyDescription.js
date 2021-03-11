import React, { useEffect, useState } from 'react';
import { Label } from 'semantic-ui-react';
import { fetchCryptoCurrencyDetail } from '../../services';
import './CurrencyDescription.css'

const CurrencyDescription = ({ currencyId }) => {


    const [currencyDetail, setCurrencyDetail] = useState({})

    useEffect(() => {
        const apiCall = async () => {
            if (currencyId) {
                const detail = await fetchCryptoCurrencyDetail(currencyId);
                setCurrencyDetail(detail)
            }
        }

        apiCall()

    }, [currencyId])

    const { name } = currencyDetail;
    return (
        <div className="currencyDescContainer">

            {name ? <Label size="large" color='teal' >
                {name}
            </Label> : ""}
        </div>

    );
};

export default CurrencyDescription;