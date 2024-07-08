import React, { useContext } from 'react'
import Card from "./Card"
import ThemeContext from '../context/ThemeContext';

const Details = ({ details }) => {

    const { darkMode } = useContext(ThemeContext);
    const detailsList = {
        name: "Name",
        country: "Country",
        currency: "Exchange",
        ipo: "IPO Date",
        marketCapitalization: "Market Capitalization",
        finhubIndustry: "Industry"
    };

    const convertMillionToBillion = (number) => {
        return (number / 1000).toFixed(3);
    };


    return (
        <Card>
            <ul className={`w-full h-full flex flex-col justify-between divide-y-1 ${darkMode ? "divide-gray-800" : null}`}>
                {Object.keys(detailsList).map((item) => {
                    return <li key={item} 
                    className="flex-1 flex justify-between items-center">
                        <span>{detailsList[item]}</span>
                        <span>{item === "marketCapitalization" ? `${convertMillionToBillion(details[item])}B1` : 
                        details[item]}</span>
                    </li>
                }
                )}
            </ul>
        </Card>
      )
    }

export default Details