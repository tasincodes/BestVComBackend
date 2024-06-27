// utils/getSMSText.js
const getSMSText = (status, firstName) => {
    const messages = {
      'Received': `সম্মানিত গ্রাহক,\nআপনার অর্ডারটি গ্রহন করা হলো - ${firstName}`,
      'Confirmed': `সম্মানিত গ্রাহক,\nআপনার অর্ডারটি নিশ্চিত করা হলো - ${firstName}`,
      'Dispatched': `সম্মানিত গ্রাহক,\nআপনার অর্ডারটি প্রেরণ করা হলো - ${firstName}`,
      'Delivered': `সম্মানিত গ্রাহক,\nআপনার অর্ডারটি পৌঁছে গেছে - ${firstName}`,
      'On-Hold': `সম্মানিত গ্রাহক,\nআপনার অর্ডারটি স্থগিত রাখা হয়েছে - ${firstName}`,
      'Cancelled': `সম্মানিত গ্রাহক,\nআপনার অর্ডারটি বাতিল করা হয়েছে - ${firstName}`,
      'Spammed': `সম্মানিত গ্রাহক,\nআপনার অর্ডারটি স্প্যাম হিসাবে চিহ্নিত করা হয়েছে - ${firstName}`
    };
    return messages[status] || `সম্মানিত গ্রাহক,\nআপনার অর্ডারের স্ট্যাটাস পরিবর্তন করা হয়েছে - ${firstName}`;
  };
  
module.exports = getSMSText;
  