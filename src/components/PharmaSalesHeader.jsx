import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

const PharmaSalesHeader = () => {
  // Dummy data
  const data = {
    date: "February 2025",
    yearToDate: {
      value: "$215k",
      vsLastYear: 102,
      plan: {
        value: "$243k",
        percentage: 88
      }
    },
    monthToDate: {
      value: "$105k",
      vsLastYear: 96,
      plan: {
        value: "$110k",
        percentage: 96
      }
    },
    filters: {
      productGroup: "10 selected",
      productName: "17 selected",
      country: "162 selected",
      customer: "Doctors, Hospitals..."
    }
  };

  return (
    <div className="w-full">
      {/* Main header */}
      <div className="bg-[#7a9950] text-white p-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold mr-6">DASHBOARD</h1>
          <div className="w-px h-8 bg-white mx-4"></div>
          <h2 className="text-xl">SALES ANALYSIS</h2>
        </div>
        <div className="text-sm">{data.date}</div>
      </div>

      {/* Stats and filters section */}
      <div className="bg-[#e1e8ce] p-2">
        <div className="flex flex-wrap">
          {/* YTD Section */}
          <div className="flex flex-wrap w-full md:w-1/2">
            {/* YearToDate */}
            <div className="w-1/2">
              <div className="bg-[#a6bb7b] p-2 text-center font-medium text-white">
                YearToDate
              </div>
              <div className="bg-white p-4 m-1 text-center">
                <div className="text-[#7a9950] text-3xl font-bold">{data.yearToDate.value}</div>
                <div className="text-sm text-gray-600 mt-1">
                  Vs Last Year: <span className="text-green-600 font-medium">▲ {data.yearToDate.vsLastYear}%</span>
                </div>
              </div>
            </div>
            
            {/* % Var to plan for YTD */}
            <div className="w-1/2">
              <div className="bg-[#a6bb7b] p-2 text-center font-medium text-white">
                % Var to plan
              </div>
              <div className="bg-white p-4 m-1 text-center">
                <div className="text-[#7a9950] text-3xl font-bold">+ {data.yearToDate.plan.percentage}%</div>
                <div className="text-sm text-gray-600 mt-1">
                  Plan: {data.yearToDate.plan.value}
                </div>
              </div>
            </div>
          </div>

          {/* MTD Section */}
          <div className="flex flex-wrap w-full md:w-1/2">
            {/* MonthToDate */}
            <div className="w-1/2">
              <div className="bg-[#a6bb7b] p-2 text-center font-medium text-white">
                MonthToDate
              </div>
              <div className="bg-white p-4 m-1 text-center">
                <div className="text-[#7a9950] text-3xl font-bold">{data.monthToDate.value}</div>
                <div className="text-sm text-gray-600 mt-1">
                  Vs Last Year: <span className="text-green-600 font-medium">▲ {data.monthToDate.vsLastYear}%</span>
                </div>
              </div>
            </div>
            
            {/* % Var to plan for MTD */}
            <div className="w-1/2">
              <div className="bg-[#a6bb7b] p-2 text-center font-medium text-white">
                % Var to plan
              </div>
              <div className="bg-white p-4 m-1 text-center">
                <div className="text-[#7a9950] text-3xl font-bold">+ {data.monthToDate.plan.percentage}%</div>
                <div className="text-sm text-gray-600 mt-1">
                  Plan: {data.monthToDate.plan.value}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters row */}
        <div className="flex flex-wrap mt-4 gap-2 pb-4">
          <div className="w-full md:w-1/5 px-1">
            <div className="text-[#4a6137] font-medium mb-1">Product Group</div>
            <div className="relative">
              <select className="w-full p-2 border border-gray-300 rounded appearance-none bg-white">
                <option>{data.filters.productGroup}</option>
              </select>
              <ChevronDown className="absolute right-2 top-3 w-4 h-4 text-gray-500" />
            </div>
          </div>
          
          <div className="w-full md:w-1/4 px-1">
            <div className="text-[#4a6137] font-medium mb-1">Product Name</div>
            <div className="relative">
              <select className="w-full p-2 border border-gray-300 rounded appearance-none bg-white">
                <option>{data.filters.productName}</option>
              </select>
              <ChevronDown className="absolute right-2 top-3 w-4 h-4 text-gray-500" />
            </div>
          </div>
          
          <div className="w-full md:w-1/4 px-1">
            <div className="text-[#4a6137] font-medium mb-1">Country</div>
            <div className="relative">
              <select className="w-full p-2 border border-gray-300 rounded appearance-none bg-white">
                <option>{data.filters.country}</option>
              </select>
              <ChevronDown className="absolute right-2 top-3 w-4 h-4 text-gray-500" />
            </div>
          </div>
          
          <div className="w-full md:w-1/4 px-1">
            <div className="text-[#4a6137] font-medium mb-1">Customer</div>
            <div className="relative">
              <select className="w-full p-2 border border-gray-300 rounded appearance-none bg-white">
                <option>{data.filters.customer}</option>
              </select>
              <ChevronDown className="absolute right-2 top-3 w-4 h-4 text-gray-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmaSalesHeader;