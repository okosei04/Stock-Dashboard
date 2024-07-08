import React, { useContext, useState, useEffect } from "react"; // Import useState from 'react'
import Card from "./Card";
import { chartConfig } from "../constants/config";
import { convertDateTounixTimestamp,
  convertUnixTimestampToDate,
  createDate,
 } from "../helperFunctions/date-function";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import ChartFilter from "./ChartFilter";
import ThemeContext from "../context/ThemeContext";
import { fetchHistoryData } from "../api/stock-api";
import StockContext from "../context/StockContext";

const Chart = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("1W");
  const {darkMode} = useContext(ThemeContext);
  const {stockSymbol} = useContext(StockContext);

  const formatData = (data) => {
    return data.c.map((item, index) => {
      return {
        value: item.toFixed(2),
        date: convertUnixTimestampToDate(data.t[index]),
      };
    });
  };

  useEffect(() => {
    const getDateRange =  () => {
      const { days, weeks, months, years } = chartConfig[filter];
      const endDate = new Date();
      const startDate = createDate(endDate, -days, -weeks, -months, -years);

      const startTimestampUnix = convertDateTounixTimestamp(startDate);
      const endTimestampUnix = convertDateTounixTimestamp(endDate);

      return { startTimestampUnix, endTimestampUnix };

    };
    const updateChartData = async () => {
      try {
        const { startTimestampUnix, endTimestampUnix } = getDateRange();
        const resolution = chartConfig[filter].resolution;
        const result = await fetchHistoryData(stockSymbol, resolution, startTimestampUnix, endTimestampUnix);
        setData(formatData(result));
    } catch(error) {
      setData([]);
      console.log(error);
    }
  };

    updateChartData();
  }, [stockSymbol, filter]);



  return (
      <Card>
          <ul className="flex absolute top-2 right-2 z-40">
              {Object.keys(chartConfig).map((item) => {
                  return (
                      <li key={item}>
                          <ChartFilter text= {item} active={filter === item} onClick={() => {setFilter(item)}} />
                      </li>
                  );
              })}
          </ul>
        <ResponsiveContainer>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="chartColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" 
              stopColor= {darkMode ? "rgb(0, 0, 119)" : "rgb(37, 99, 235)"} 
              stopOpacity={0.9} />
              <stop offset="95%" stopColor={darkMode ? "rgb(137, 199, 255)" : "rgb(37, 99, 235)"} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke="#BFDBFE"
            fillOpacity={2}
            strokeWidth={0.5}
            fill="url(#chartColor)"
          />
          <Tooltip contentStyle={darkMode ? {backgroundColor: "#111827"}: null}
          itemStyle={darkMode ? {color: "#BFDBFE"}:null}
          />
          <XAxis dataKey="date" />
          <YAxis domain={["dataMin", "dataMax"]} />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default Chart;
