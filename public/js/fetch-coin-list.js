const coinTable = document.querySelector('.coin-table');
const accountBalance = document.querySelector('#accountBalance');

let account = 0;

let data; 

let name = document.querySelectorAll('#coinName');
let price = document.querySelectorAll('#price');
let coin = document.querySelectorAll('#coinName');
let marketCap = document.querySelectorAll('#marketCap');
let volume = document.querySelectorAll('#volume');
let quantity = document.querySelectorAll('#quantity');
let balance = document.querySelectorAll('#balance');
let coinPrice = [];

let searchInput = document.querySelector('#search-input');

let dataByName = [];

const bitcoinHead = document.querySelector('#bitcoin-head-price');
const btcPriceChangePercent = document.querySelector('#btcChangePercent');
const ethereumHead = document.querySelector('#ethereum-head-price');
const ethPriceChangePercent = document.querySelector('#ethChangePercent');

let btcDailyAvgPrice;
let btcAvgPricePercentChange; 
let ethDailyAvgPrice;
let ethAvgPricePercentChange;

const marketCapCheck = (data, i) =>{
    if (data[i].market_cap > 1000000000){
        return String(data[i].market_cap/1000000000).slice(0,6) + "B"
    }
    else {
        return String(data[i].market_cap/100000000).slice(0,6) + "M"
    }
};

const volumeCheck = (data, i) =>{
    if (data[i].total_volume > 1000000000){
        return String(data[i].total_volume/1000000000).slice(0,9) + "B"
    }
    else {
        return String(data[i].total_volume/100000000).slice(0,9) + "M"
    }
};


const getData = ()=> {
    axios.get(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc%2C%20volume_asc%2C%20gecko_desc&per_page=100&page=1&sparkline=false&price_change_percentage='24h%2C7d%2C1y'%20")
        .then(result => {
            data = result.data;

            for (let q = 0; q < data.length; q++){
                dataByName.push(result.data[q].name);
            }

            for (let i = 0; i < name.length; i++) { 
            for (let key in data){
                if (data[key].name === name[i].innerText){
                    price[i].innerText = `$${(data[key].current_price).toFixed(2)}`;
                    marketCap[i].innerText =`$${marketCapCheck(data, i)}`;
                    volume[i].innerText = `$${volumeCheck(data, i)}`;
                    
                }
        }}

        
            btcDailyAvgPrice = (result.data[0].high_24h + result.data[0].low_24h)/2;
            btcAvgPricePercentChange = (1 - (btcDailyAvgPrice / result.data[0].current_price)) * 100;
            ethDailyAvgPrice = (result.data[1].low_24h + result.data[1].high_24h)/2;
            ethAvgPricePercentChange = (1 - (ethDailyAvgPrice / result.data[1].current_price)) * 100;

            if (result.data[0].current_price >= btcDailyAvgPrice) {
                bitcoinHead.innerText = `$${result.data[0].current_price}`;
                bitcoinHead.style.color = "#2dc28e";
                btcPriceChangePercent.innerText = `(+${btcAvgPricePercentChange.toFixed(3)}%)`;
                btcPriceChangePercent.style.color = "#2dc28e";

            } else {
                bitcoinHead.innerText = `$${result.data[0].current_price}`;
                bitcoinHead.style.color = "red";
                btcPriceChangePercent.innerText = `(${btcAvgPricePercentChange.toFixed(3)}%)`;
                btcPriceChangePercent.style.color = "red";
            }

            if (result.data[1].current_price >= ethDailyAvgPrice){
                ethereumHead.innerText = `$${result.data[1].current_price}`;
                ethereumHead.style.color = "#2dc28e";
                ethPriceChangePercent.innerText = `(+${ethAvgPricePercentChange.toFixed(3)}%)`;
                ethPriceChangePercent.style.color = "#2dc28e";

            } else {
                ethereumHead.innerText = `$${result.data[1].current_price}`;
                ethereumHead.style.color = "red";
                ethPriceChangePercent.innerText = `(${ethAvgPricePercentChange.toFixed(3)}%)`;
                ethPriceChangePercent.style.color = "red";
            }

        })
        .catch(err => {
            console.log(err);
        })                     
        
};

getData();



// setInterval(()=> {
//     console.log('price tick');
//     account = 0;
//     getData();
//     },20000);



 
