// import React from 'react';
// import QRCode from 'qrcode.react';

// const QRCodeComponent = ({ orderId }) => {
//   const qrValue = orderId;

//   return (
//     <div className='py-4 space-y-4'>
//       <QRCode value={qrValue} />
//       <p>Scan the QR code to get the order details.</p>
//     </div>
//   );
// };

// export default QRCodeComponent;
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

const QRCodeComponent = ({ orderId, additionalInfo = {} }) => {
  // Create a more comprehensive value for the QR code
  // You can include just the orderId or add more details based on your needs
  const qrValue = typeof additionalInfo === 'object' && Object.keys(additionalInfo).length > 0
    ? JSON.stringify({ orderId, ...additionalInfo })
    : orderId;

  return (
    <div className='flex flex-col items-center py-4 space-y-4'>
      <div className='p-2 bg-white border border-gray-200 rounded-lg shadow-sm'>
        <QRCodeSVG 
          value={qrValue}
          size={150}
          level="H"
          includeMargin={true}
          className='rounded'
        />
      </div>
      <p className='text-sm text-gray-600 text-center'>
        Scan the QR code to get the order details.
      </p>
    </div>
  );
};

export default QRCodeComponent;