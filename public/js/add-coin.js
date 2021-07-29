
let selectedCoin = document.querySelector('#coin-selection');
let quantity = document.querySelector('#quantity'); 
let coin;
let coinName = document.querySelector('#coin-name-display');
let coinPrice = document.querySelector('#price');
let quantityTotal = document.querySelector('#quantity-total');
let quantityAmount;
let date = document.querySelector('#date').value;
let today = new Date();

const bitcoinHead = document.querySelector('#bitcoin-head-price');
const btcPriceChangePercent = document.querySelector('#btcChangePercent');
const ethereumHead = document.querySelector('#ethereum-head-price');
const ethPriceChangePercent = document.querySelector('#ethChangePercent');

let btcDailyAvgPrice;
let btcAvgPricePercentChange; 
let ethDailyAvgPrice;
let ethAvgPricePercentChange;


function precisionRound(number, precision) {
    var factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
  }

// selectedCoin.addEventListener('click', ()=>{
//     coin = selectedCoin.value;
//     coinName.textContent = coin;
        
// });

const getData = ()=> {
  axios.get(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc%2C%20volume_asc%2C%20gecko_desc&per_page=100&page=1&sparkline=false&price_change_percentage='24h%2C7d%2C1y'%20")
      .then(result => {
            btcDailyAvgPrice = (result.data[0].high_24h + result.data[0].low_24h)/2;
            btcAvgPricePercentChange = (1 - (btcDailyAvgPrice / result.data[0].current_price)) * 100;
            ethDailyAvgPrice = (result.data[1].low_24h + result.data[1].high_24h)/2;
            ethAvgPricePercentChange = (1 - (ethDailyAvgPrice / result.data[1].current_price)) * 100;


            if (result.data[0].current_price >= btcDailyAvgPrice) {
                bitcoinHead.innerText = `$${result.data[0].current_price}`;
                bitcoinHead.style.color = "#2dc28e";
                btcPriceChangePercent.innerText = `(+${btcAvgPricePercentChange.toFixed(2)}%)`;
                btcPriceChangePercent.style.color = "#2dc28e";

            } else {
                bitcoinHead.innerText = `$${result.data[0].current_price}`;
                bitcoinHead.style.color = "red";
                btcPriceChangePercent.innerText = `(-${btcAvgPricePercentChange.toFixed(2)}%)`;
                btcPriceChangePercent.style.color = "red";
            }

            if (result.data[1].current_price >= ethDailyAvgPrice){
                ethereumHead.innerText = `$${result.data[1].current_price}`;
                ethereumHead.style.color = "#2dc28e";
                ethPriceChangePercent.innerText = `(+${ethAvgPricePercentChange.toFixed(2)}%)`;
                ethPriceChangePercent.style.color = "#2dc28e";

            } else {
                ethereumHead.innerText = `$${result.data[1].current_price}`;
                ethereumHead.style.color = "red";
                ethPriceChangePercent.innerText = `(-${ethAvgPricePercentChange.toFixed(2)}%)`;
                ethPriceChangePercent.style.color = "red";
            }
    })
    .catch(err => {console.log(err)
    })
};

getData();


setInterval(()=>{
    quantityTotal.innerText = `$ ${precisionRound((coinPrice.value * quantity.value), 2)}`;
}, 1000);





