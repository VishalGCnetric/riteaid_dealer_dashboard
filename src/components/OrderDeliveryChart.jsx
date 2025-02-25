import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';

const OrderDeliveryChart = ({ data }) => {
  // Use mock data if no data is provided
  const [chartData, setChartData] = useState(data || [
    { month: 'Feb 2024', ordered: 20000, delivered: 16200, percentage: 81 },
    { month: 'Mar 2024', ordered: 26000, delivered: 20800, percentage: 80 },
    { month: 'Apr 2024', ordered: 25000, delivered: 17500, percentage: 83 },
    { month: 'May 2024', ordered: 19800, delivered: 8910, percentage: 80 },
    { month: 'Jun 2024', ordered: 26500, delivered: 21730, percentage: 82 },
    { month: 'Jul 2024', ordered: 26000, delivered: 21320, percentage: 82 },
    { month: 'Aug 2024', ordered: 26500, delivered: 22790, percentage: 83 },
    { month: 'Sep 2024', ordered: 21000, delivered: 16800, percentage: 80 },
    { month: 'Oct 2024', ordered: 20500, delivered: 16605, percentage: 81 },
    { month: 'Nov 2024', ordered: 28000, delivered: 21000, percentage: 75 },
    { month: 'Dec 2024', ordered: 25000, delivered: 20000, percentage: 80 },
    { month: 'Jan 2025', ordered: 15000, delivered: 12150, percentage: 81 },
    { month: 'Feb 2025', ordered: 14000, delivered: 11200, percentage: 80 }
  ]);

  // Update chartData when data prop changes
  useEffect(() => {
    if (data) {
      setChartData(data);
    }
  }, [data]);

  // Chart options configuration
  const options = {
    chart: {
      height: 350,
      type: 'line',
      stacked: false,
      toolbar: {
        show: false
      }
    },
    stroke: {
      width: [0, 0, 3],
      curve: 'smooth',
      dashArray: [0, 0, 0]
    },
    plotOptions: {
      bar: {
        columnWidth: '70%'
      }
    },
    colors: ['#C5D8A4', '#4F6F52', '#9E1030'],
    fill: {
      opacity: [1, 1, 1]
    },
    markers: {
      size: [0, 0, 5],
      colors: ['#9E1030'],
      strokeColors: '#fff',
      strokeWidth: 2
    },
    xaxis: {
      categories: chartData.map(item => item.month)
    },
    yaxis: [
      {
        seriesName: 'Quantity Ordered',
        min: 0,
        max: 30000,
        tickAmount: 6,
        title: {
          text: ''
        },
        labels: {
          formatter: function(val) {
            return val >= 1000 ? Math.floor(val/1000) + 'k' : val;
          }
        }
      },
      {
        seriesName: 'Quantity Delivered',
        show: false,
        min: 0,
        max: 30000
      },
      {
        opposite: true,
        seriesName: '%',
        min: 0,
        max: 100,
        title: {
          text: ''
        },
        labels: {
          formatter: function(val) {
            return val + '%';
          }
        }
      }
    ],
    tooltip: {
      shared: true,
      intersect: false
    },
    dataLabels: {
      enabled: false
    },
    legend: {
      position: 'bottom',
      offsetY: 5
    },
    annotations: {
      points: chartData.map(item => ({
        x: item.month,
        y: item.percentage,
        marker: {
          size: 0
        },
        label: {
          borderColor: 'transparent',
          offsetY: -15,
          style: {
            color: '#9E1030',
            background: 'transparent'
          },
          text: item.percentage + '%'
        }
      }))
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            height: 300
          },
          legend: {
            position: 'bottom'
          }
        }
      },
      {
        breakpoint: 480,
        options: {
          chart: {
            height: 250
          },
          xaxis: {
            labels: {
              rotate: -45,
              style: {
                fontSize: '10px'
              }
            }
          }
        }
      }
    ]
  };

  // Series data
  const series = [
    {
      name: 'Quantity Ordered',
      type: 'column',
      data: chartData.map(item => item.ordered)
    },
    {
      name: 'Quantity Delivered',
      type: 'column',
      data: chartData.map(item => item.delivered)
    },
    {
      name: '%',
      type: 'line',
      data: chartData.map(item => item.percentage)
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <h2 className="text-xl text-center font-semibold text-gray-700 my-4">Quantity Ordered vs. Delivered</h2>
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <Chart 
          options={options} 
          series={series} 
          type="line" 
          height={350} 
        />
      </div>
    </div>
  );
};

export default OrderDeliveryChart;