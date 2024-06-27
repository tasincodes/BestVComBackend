const getSMSText = (orderStatus, customerName) => {
  const messages = {
    'Received': `সম্মানিত গ্রাহক ${customerName},\nআপনার অর্ডারটি গ্রহন করা হলো - অন্ন`,
    'Confirmed': `সম্মানিত গ্রাহক ${customerName},\nআপনার অর্ডারটি নিশ্চিত করা হলো - অন্ন`,
    'Dispatched': `সম্মানিত গ্রাহক ${customerName},\nআপনার অর্ডারটি প্রেরণ করা হয়েছে - অন্ন`,
    'Delivered': `সম্মানিত গ্রাহক ${customerName},\nআপনার অর্ডারটি সরবরাহ করা হয়েছে - অন্ন`,
    'On-Hold': `সম্মানিত গ্রাহক ${customerName},\nআপনার অর্ডারটি স্থগিত রাখা হয়েছে - অন্ন`,
    'Cancelled': `সম্মানিত গ্রাহক ${customerName},\nআপনার অর্ডারটি বাতিল করা হয়েছে - অন্ন`,
    'Spammed': `সম্মানিত গ্রাহক ${customerName},\nআপনার অর্ডারটি স্প্যাম হিসাবে চিহ্নিত করা হয়েছে - অন্ন`,
  };

  return messages[orderStatus] || '';
};

module.exports = {
  getSMSText
};
