// src/generatePDF.js

const fs = require('fs');
const PDFDocument = require('pdfkit');

async function generatePDF(outputPath, orderDetails) {
  const doc = new PDFDocument();

  // Pipe the PDF content to a writable stream
  const stream = fs.createWriteStream(outputPath);
  doc.pipe(stream);

  // Add content to the PDF
  doc.fontSize(25).text('Order Invoice', { align: 'center' });
  doc.moveDown();

  doc.font('Helvetica-Bold').fontSize(12).text(`Order ID: ${orderDetails.orderId}`);
  doc.font('Helvetica').text(`Order Date: ${orderDetails.orderDate}`);
  doc.text(`Customer Name: ${orderDetails.customerName}`);
  doc.text(`Delivery Address: ${orderDetails.deliveryAddress}`);
  doc.moveDown();

  // Check if products are available before rendering the table
  if (orderDetails.products && Array.isArray(orderDetails.products) && orderDetails.products.length > 0) {
    // Table header
    const tableHeaders = ['Product', 'Quantity', 'Price', 'Total'];
    const tableRows = orderDetails.products.map(product => [
      product.name,
      product.quantity.toString(),
      product.price.toFixed(2),
      product.total.toFixed(2)
    ]);

    doc.font('Helvetica-Bold');
    doc.table({
      headers: tableHeaders,
      rows: tableRows,
      widths: ['*', 'auto', 'auto', 'auto'],
      layout: 'lightHorizontalLines'
    });
  } else {
    doc.text('No products found.', { align: 'center' });
  }

  // Total section
  doc.moveDown();
  doc.font('Helvetica-Bold').text(`Subtotal: ${orderDetails.subtotal.toFixed(2)}`);
  doc.text(`Discount: ${orderDetails.discount.toFixed(2)}`);
  doc.text(`Delivery Charge: ${orderDetails.deliveryCharge.toFixed(2)}`);
  doc.text(`VAT: ${orderDetails.vat.toFixed(2)}`);
  doc.font('Helvetica-Bold').text(`Total: ${orderDetails.total.toFixed(2)}`);

  // Finalize the PDF
  doc.end();
  console.log(`PDF created successfully at ${outputPath}`);
}

module.exports = generatePDF;
