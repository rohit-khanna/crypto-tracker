import React from 'react';
import { Line } from "react-chartjs-2";
import { Message } from 'semantic-ui-react';

const CustomChart = ({ data, showChart }) => {
    const opts = {
        tooltips: {
            intersect: false,
            mode: "index"
        },
        responsive: true,
        maintainAspectRatio: false
    };

    return (
        <div className="dashboard">
            {showChart ? <>

                <div className="chart-container">
                    <Line data={data} options={opts} />
                </div>
            </> : <Message className="infoMessage" icon="line graph"
                content="Please Select a Currency Pair to see the historical data in graph"
            />}
        </div>
    );
};

export default CustomChart;