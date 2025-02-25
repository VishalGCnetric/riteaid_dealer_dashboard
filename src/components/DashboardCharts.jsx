import React from 'react';
import SalesAnalytics from './SalesAnalytics'; // Adjust the import according to your file structure
import SalesGraph from './SalesGraph'; // Adjust the import according to your file structure
import OrderDeliveryChart from './OrderDeliveryChart';

const DashboardCharts = () => {
  return (
    <div className="w-full p-4 my-2 flex flex-col gap-4">
      {/* First row with two charts side by side */}
      <div className="w-full flex flex-col lg:flex-row lg:gap-4">
        <div className="w-full lg:w-[55%]  bg-[#EAF1E0] dark:bg-customBlue p-4 rounded-lg mb-4 lg:mb-0">
          <SalesAnalytics />
        </div>
        <div className="w-full lg:w-[45%]  bg-[#EAF1E0] dark:bg-customBlue p-4 rounded-lg">
          <SalesGraph />
        </div>
      </div>
      
      {/* Second row with OrderDeliveryChart taking full width */}
      <div className="w-full  bg-[#EAF1E0] dark:bg-customBlue p-4 rounded-lg">
        <OrderDeliveryChart />
      </div>
    </div>
  );
};

export default DashboardCharts;