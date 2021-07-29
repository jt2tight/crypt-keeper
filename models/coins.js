const mongoose = require('mongoose');
const Schema = mongoose.Schema; 
const coinSchema =  new Schema({
  name: {
    type: String,
    required: true
  },
  abbreviation: {
      type: String,
      required: true
  }

});

module.exports = mongoose.model('Coin', coinSchema);