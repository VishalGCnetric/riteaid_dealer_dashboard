import React, { useState, useEffect, useRef } from 'react';
import ReactApexChart from 'react-apexcharts';

const SalesAnalytics = () => {
  const chartRef = useRef(null);
  const [chartOptions, setChartOptions] = useState(null);
  const [chartSeries, setChartSeries] = useState(null);

  useEffect(() => {
    setChartOptions({
      chart: {
        id: 'sales-analytics-chart',
        type: 'line',
        height: 320,
        zoom: { enabled: false }
      },
      colors: ['#4F6F52', '#B0BFB2'],
      xaxis: {
        categories: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
        labels: { style: { colors: 'darkgray' } }
      },
      yaxis: { labels: { style: { colors: 'darkgray' } } },
      stroke: { curve: 'smooth' },
      legend: {
        position: 'top',
        horizontalAlign: 'left',
        fontFamily: 'Satoshi',
        fontWeight: 500,
        fontSize: '14px',
        markers: { radius: 99 }
      }
    });

    setChartSeries([
      { name: 'Product One', data: [20, 90, 40, 35, 50, 55, 60, 70, 80, 60, 70, 90] },
      { name: 'Product Two', data: [25, 45, 45, 40, 55, 60, 65, 75, 15, 65, 75, 95] }
    ]);

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy(); // Cleanup
      }
    };
  }, []);

  const salesAnalyticsSelectOptions = ['Yearly', 'Monthly', 'Weekly'];

  if (!chartOptions || !chartSeries) return null; // Prevents rendering before state is set

  return (
    <div className="w-full bg-card p-4 rounded-lg shadow-md flex-1">
      <div className="w-full flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-card-foreground">Sales Analytics</h2>
        <select className="border-1 text-black p-2 rounded-lg">
          {salesAnalyticsSelectOptions.map((option, index) => (
            <option key={index}>{option}</option>
          ))}
        </select>
      </div>
      <div id="chartTwo" className="-ml-5 p-4 -mb-9">
        <ReactApexChart ref={chartRef} options={chartOptions} series={chartSeries} type="line" height={440} width="100%" />
      </div>
    </div>
  );
};

export default SalesAnalytics;
