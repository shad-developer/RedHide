const mongoose = require('mongoose');

const FeedStockSchema = new mongoose.Schema({
  feedType: {
    type: String,
    enum: ['Silage', 'Wanda', 'Wheat Straw'],
    required: true,
    unique: true 
  },
  currentStock: {
    type: Number,
    required: true,
    default: 0 
  },
  purchaseHistory: [{
    purchaseWeight: Number,
    pricePerUnit: Number,
    purchaseDate: Date
  }]
}, { timestamps: true });

// Method to decrease stock
FeedStockSchema.methods.decreaseStock = function(amount) {
  if (this.currentStock < amount) {
    throw new Error('Not enough stock');
  }
  this.currentStock -= amount;
  return this.save();
};

module.exports = mongoose.model('FeedStock', FeedStockSchema);

