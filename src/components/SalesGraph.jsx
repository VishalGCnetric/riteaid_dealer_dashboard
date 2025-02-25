import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";

const SalesGraph = () => {
  const salesGraphSelectOptions = ["Last Week", "This Month", "This Year"];
  const [selectedOption, setSelectedOption] = useState("Last Week");

  const [series, setSeries] = useState([
    { name: "Sales", data: [44, 55, 41, 67, 22, 43, 65] },
    { name: "Revenue", data: [13, 23, 20, 8, 13, 27, 15] },
  ]);

  const handleOptionChange = (event) => {
    const selected = event.target.value;
    setSelectedOption(selected);

    if (selected === "Last Week") {
      setSeries([
        { name: "Sales", data: [44, 55, 41, 67, 22, 43, 65] },
        { name: "Revenue", data: [13, 23, 20, 8, 13, 27, 15] },
      ]);
    } else if (selected === "This Month") {
      setSeries([
        { name: "Sales", data: [80, 70, 90, 85, 60, 75, 95] },
        { name: "Revenue", data: [30, 50, 45, 55, 35, 40, 60] },
      ]);
    } else if (selected === "This Year") {
      setSeries([
        { name: "Sales", data: [300, 400, 350, 500, 420, 480, 550] },
        { name: "Revenue", data: [120, 180, 150, 200, 160, 210, 250] },
      ]);
    }
  };

  const options = {
    colors: ["#4F6F52", "#C5D8A4"],
    chart: {
      fontFamily: "Satoshi, sans-serif",
      type: "bar",
      height: 335,
      stacked: true,
      toolbar: { show: true },
      zoom: { enabled: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 10,
        columnWidth: "25%",
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: ["M", "T", "W", "T", "F", "S", "S"],
      labels: { style: { colors: "darkgray" } },
    },
    yaxis: { labels: { style: { colors: "darkgray" } } },
    legend: {
      position: "top",
      horizontalAlign: "left",
      fontSize: "14px",
      labels: { colors: "darkgray" },
      markers: { radius: 99 },
    },
    fill: { opacity: 1 },
  };

  return (
    <div className="w-full bg-card p-4 rounded-lg shadow-md flex-1">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-card-foreground">Sales Graph</h2>
        <select
          className="border text-black p-2 rounded-lg"
          value={selectedOption}
          onChange={handleOptionChange}
        >
          {salesGraphSelectOptions.map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))}
        </select>
      </div>
      <div id="chartTwo" className="-ml-5 p-4 -mb-9">
        <ReactApexChart 
          key={selectedOption}  // Force re-render
          options={options} 
          series={series} 
          type="bar" 
          height={440} 
          width="100%" 
        />
      </div>
    </div>
  );
};

export default SalesGraph;
