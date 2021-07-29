const { Decimal128 } = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema; 
const dummyCoinSchema =  new Schema({
  name: {
    type: String,
    required: true
  },
  abbreviation: {
      type: String,
      required: true
  },
  price: {
      type: Decimal128,
      
  },

  marketCap: {
      type: String
  },

  dailyVolume: {
      type: String
  }


});

module.exports = mongoose.model('DummyCoin', dummyCoinSchema);