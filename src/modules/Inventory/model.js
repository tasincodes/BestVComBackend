const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
    productIds: [{
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Product' // Assuming  product model is named 'Product'
    }],
    quantity: {
        type: Number,
        required: true
    },
    outletId:
    {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'outlet' // Assuming  outlet model is named 'Outlet'
    }

}, { versionKey: false });


const InventoryModel = mongoose.model('inventory', InventorySchema);