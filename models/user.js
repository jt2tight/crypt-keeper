const { Decimal128 } = require('mongodb');
const mongoose = require('mongoose');
const { update } = require('./coins');
const Schema = mongoose.Schema; 
const userSchema =  new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  resetToken: String,
  resetTokenExpiration: Date, 
  portfolio: {
    items: [
      {
        coinId: { 
          type: Schema.Types.ObjectId, 
          ref: 'DummyCoin', 
          required: true}, //using "DummyCoin" for testing purposes only, use "Coin" once API is conencted
        
        name: {
          type: String,
      
        },

        abbreviation: {
          type: String
        },

        quantity: {
          type: Number, 
          required: true }
      }
    ]
  },
  transactions: {

    items: [
      {
        coinId: { type: Schema.Types.ObjectId, ref: 'DummyCoin', required: true}, //using "DummyCoin" for testing purposes only, use "Coin" once API is conencted
        coinName: { type: String},
        quantity: { type: Number, required: true },
        price: { type: Number, required: false },
        date: { type: Date, required: false }

      }
    ]
  }  

});


userSchema.methods.addCoinTransaction = function(coin, coinQuantity, price, date) {

    //Input Validity Check
    if(isNaN(this.price)){
      this.price = 0; 
    }


  //ADD COINS TO THE PORTFOLIO
    const portfolioIndex = this.portfolio.items.findIndex(cp => {
      return cp.coinId.toString() === coin._id.toString();
    });

    const updatedPortfolioItems = [...this.portfolio.items];
    let newQuantity = parseFloat(coinQuantity); 

    if (portfolioIndex >= 0) {
      updatedPortfolioItems[portfolioIndex].quantity += newQuantity;

    } else {
      updatedPortfolioItems.push({
        coinId: coin._id,
        quantity: parseFloat(coinQuantity),
        name: coin.name,
        abbreviation: coin.abbreviation
      });
    }
    const updatedPortfolio = {
      items: updatedPortfolioItems
    };
    this.portfolio = updatedPortfolio; 

    // ADD TRANSACTION
    const updatedtransactionItems = [...this.transactions.items];
    

    updatedtransactionItems.push({
      coinId: coin._id,
      coinName: coin.name,
      quantity: parseFloat(coinQuantity),
      price: parseFloat(price),
      date: date
    });

    const updatedTransactions = {
      items: updatedtransactionItems
    };

    this.transactions = updatedTransactions
    this.save();
};

userSchema.methods.removeCoinQuantity = function(coinId, name, coinQuantity, price, date){
  //Value check
  if (coinQuantity === 'NaN'){
    coinQuantity = 0; 
  }

  if (price === 'NaN'){
      price = 0; 
  }

  if(!Date.parse(date)){
      date = '';
    }

  //REMOVE COINS FROM THE PORTFOLIO
  const portfolioIndex = this.portfolio.items.findIndex(cp => {
    return cp.coinId.toString() === coinId.toString();
  });

    const updatedPortfolioItems = [...this.portfolio.items];
    let reduceQuantity = parseFloat(coinQuantity); 

    if (reduceQuantity >= updatedPortfolioItems[portfolioIndex].quantity) {
      updatedPortfolioItems.splice(portfolioIndex, 1);

    } else {
      updatedPortfolioItems[portfolioIndex].quantity -= reduceQuantity;

    }
    const updatedPortfolio = {
      items: updatedPortfolioItems
    };
    this.portfolio = updatedPortfolio; 

    // ADD TRANSACTION

    const updatedtransactionItems = [...this.transactions.items];
    updatedtransactionItems.push({
      coinId: coinId,
      coinName: name,
      quantity: -(parseFloat(coinQuantity)),
      price: parseFloat(price),
      date: date
    });

    const updatedTransactions = {
      items: updatedtransactionItems
    };

    this.transactions = updatedTransactions
    this.save();

};

userSchema.methods.deleteCoin = function(coinId){
  const portfolioIndex = this.portfolio.items.findIndex(cp => {
    return cp.coinId.toString() === coinId.toString();
  });

  const updatedPortfolioItems = [...this.portfolio.items];

  updatedPortfolioItems.splice(portfolioIndex, 1);

  // const updatedPortfolioItems = this.portfolio.items.filter(coin =>{
  //   return coin._id.toString() !== coinId.toString();
  // });
  this.portfolio.items = updatedPortfolioItems; 
  return this.save();
};




module.exports = mongoose.model('User', userSchema)