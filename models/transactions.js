const { Decimal128 } = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema; 
const transactionsSchema =  new Schema({
  coinId: {
    type: { type: Schema.Types.ObjectId, ref: 'DummyCoin', required: true}
  },
  coinName: {
      type: String,
      required: true
  },
  quantity: {
      type: Number,
      required: true
  },
  price: {
      type: Number,
      required: false,
  },

  date: { 
      type: Date, 
      required: false 
  },
  userId : { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true
    }

});

module.exports = mongoose.model('Transactions', transactionsSchema);