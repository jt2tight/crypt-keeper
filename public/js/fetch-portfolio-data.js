
const coinTable = document.querySelector('.coin-table');
const accountBalance = document.querySelector('#accountBalance');

let account = 0;

let data; 

let name = document.querySelectorAll('#coinName');
let price = document.querySelectorAll('#price');
let coin = document.querySelectorAll('#coinName');
let quantity = document.querySelectorAll('#quantity');
let balance = document.querySelectorAll('#balance');
let coinPrice = [];

const bitcoinHead = document.querySelector('#bitcoin-head-price');
const btcPriceChangePercent = document.querySelector('#btcChangePercent');
const ethereumHead = document.querySelector('#ethereum-head-price');
const ethPriceChangePercent = document.querySelector('#ethChangePercent');

let btcDailyAvgPrice;
let btcAvgPricePercentChange; 
let ethDailyAvgPrice;
let ethAvgPricePercentChange;

const getData = ()=> {
    

    axios.get(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc%2C%20volume_asc%2C%20gecko_desc&per_page=150&page=1&sparkline=false&price_change_percentage='24h%2C7d%2C1y'%20")
        .then(result => {
            data = result.data;

            for (let i = 0; i < name.length; i++) {
            for (let key in data){
                if (data[key].name === name[i].innerText){
                    if (data[key].current_price < 1){
                        price[i].innerText = `$${(data[key].current_price).toFixed(4)}`;

                    } else {
                        price[i].innerText = `$${(data[key].current_price).toFixed(2)}`;
                    }
                    
                    balance[i].innerText = `$${(parseFloat(quantity[i].innerText) * data[key].current_price).toFixed(2)}`;
                    account += parseFloat(quantity[i].innerText) * data[key].current_price;
                }
        }}
            btcDailyAvgPrice = (result.data[0].high_24h + result.data[0].low_24h)/2;
            btcAvgPricePercentChange = (1 - (btcDailyAvgPrice / result.data[0].current_price)) * 100;
            ethDailyAvgPrice = (result.data[1].low_24h + result.data[1].high_24h)/2;
            ethAvgPricePercentChange = (1 - (ethDailyAvgPrice / result.data[1].current_price)) * 100;

            accountBalance.innerText = `$${account.toFixed(2)}`;
            if (result.data[0].current_price >= btcDailyAvgPrice) {
                bitcoinHead.innerText = `$${result.data[0].current_price}`;
                bitcoinHead.style.color = "#2dc28e";
                btcPriceChangePercent.innerText = `(+${btcAvgPricePercentChange.toFixed(2)}%)`;
                btcPriceChangePercent.style.color = "#2dc28e";

            } else {
                bitcoinHead.innerText = `$${result.data[0].current_price}`;
                bitcoinHead.style.color = "red";
                btcPriceChangePercent.innerText = `(${btcAvgPricePercentChange.toFixed(2)}%)`;
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
                ethPriceChangePercent.innerText = `(${ethAvgPricePercentChange.toFixed(2)}%)`;
                ethPriceChangePercent.style.color = "red";
            }

        })
        .catch(err => {
            console.log(err);
        })                     
        
};

getData();

setInterval(()=> {
    account = 0;
    getData();
    },20000);

let historicalData;
let btcPriceHistory = [];


const getHistoricalData = () => {
    axios.get('https://min-api.cryptocompare.com/data/v2/histoday?fsym=BTC&tsym=USD&limit=365&api_key={fbe53b8ce657d0b90d6b94e569bd3d2dda270f4f27d5efbfb29e5459f35c8112}')
    .then(result => {
        historicalData = result.data.Data.Data.reverse()[0];
        // console.log(historicalData);

        for (let i = 0; i < historicalData.length; i++) {
            btcPriceHistory.push(historicalData[i].close); 
        }

    })
};

// getHistoricalData();

