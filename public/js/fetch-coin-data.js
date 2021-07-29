// let coin = document.querySelector('#coinName');
// let symbol = document.querySelector('#symbol');
// let price = document.querySelector('#price');
// let marketCap = document.querySelector('#marketCap');
// let volume = document.querySelector('#volume');

const coinTable = document.querySelector('.coin-table');
console.log(coinTable);

const bitcoinHead = document.querySelector('#bitcoin-head-price');
const btcPriceChangePercent = document.querySelector('#btcChangePercent');
const ethereumHead = document.querySelector('#ethereum-head-price');
const ethPriceChangePercent = document.querySelector('#ethChangePercent');

let btcDailyAvgPrice;
let btcAvgPricePercentChange; 
let ethDailyAvgPrice;
let ethAvgPricePercentChange;

let searchInput = document.querySelector('#search-input');

let data; 
let dataByName = [];

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


// <td>$<tag id="marketCap">${String(data[i].market_cap/1,000,000,000).slice(0,6)}B</tag></td>
//* <td id="volume">$${String(result.data[i].total_volume/10000000).slice(0,9)}M</td> */

const getData = ()=> {
    axios.get(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc%2C%20volume_asc%2C%20gecko_desc&per_page=100&page=1&sparkline=false&price_change_percentage='24h%2C7d%2C1y'%20")
        .then(result => {
            data = result.data;
            for (let i=0; i < 76; i++){
                dataByName.push(result.data[i].name); 
                let marketCap;
                let newRow = coinTable.insertRow(-1);
                let rowData = `
    
                <tr class=>
                    <td id="coin-name">
                    <a href="https://www.tradingview.com/symbols/${(result.data[i].symbol).toUpperCase()}USD" target="_blank">
                        <div class="table-logo-container">
                            <div class="table-img">
                            <img id="coin-image" src="${data[i].image}">
                            </div>
                            <div class="inner-logo">
                            <h3 id="symbol">${result.data[i].symbol.toUpperCase()}</h3>
                            <h4 id="coinName">${result.data[i].name}</h4>
                            </div>
                        </div>
                        </a>
                        </td>
                    <td><a href="https://www.tradingview.com/symbols/${(result.data[i].symbol).toUpperCase()}USD" target="_blank">$<tag id="price">${result.data[i].current_price}</a></td>
                    <td><a href="https://www.tradingview.com/symbols/${(result.data[i].symbol).toUpperCase()}USD" target="_blank">$<tag id="marketCap">${marketCapCheck(data, i)}</tag></a></td>
                    <td><a href="https://www.tradingview.com/symbols/${(result.data[i].symbol).toUpperCase()}USD" target="_blank">$<tag id="ATH">${result.data[i].ath}</a></td>
                    <td><a href="https://www.tradingview.com/symbols/${(result.data[i].symbol).toUpperCase()}USD" target="_blank">$<tag id="high_24h">${result.data[i].high_24h}</a></td>
                    <td><a href="https://www.tradingview.com/symbols/${(result.data[i].symbol).toUpperCase()}USD" target="_blank">$<tag id="low_24h">${result.data[i].low_24h}</a></td>
                    <td id="volume"><a href="https://www.tradingview.com/symbols/${(result.data[i].symbol).toUpperCase()}USD" target="_blank">$${volumeCheck(data, i)}</a></td>
                    
                </tr>`
                ;
                
                newRow.innerHTML = rowData;

                
            }

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
        .catch(err => {
            console.log(err);
        })                     
        
};

getData();

let searchInputValue;

searchInput.addEventListener('keypress', ()=>{
    searchInputValue = searchInput.value.toLowerCase(); 
    var search = searchTable(searchInputValue, dataByName);
    // console.log(search);

    buildTable(data, search);

});


function searchTable(searchInputValue, dataByName){
    var searchData = [];
    //searchData.push(searchInputValue);

    for(var i=0; i < dataByName.length; i++){
        searchInputValue.toLowerCase();
        var name = dataByName[i].toLowerCase();
        
        if (name.includes(searchInputValue)){
            searchData.push(dataByName[i])
        }
    }

    return searchData;
}



function buildTable(data, search){
    coinTable.innerHTML = `
    <th id="coin-name">Coins</th>
    <th>Price</th>
    <th>Market Cap</th>
    <th>All Time High</th>
    <th>24hr High</th>
    <th>24hr Low</th>
    <th id="volume">Volume (24hr)</th>
    </tr>
    
    `;


    for (let i=0; i < data.length; i++){

        for(let e=0; e < search.length; e++) {

        if(data[i].name == search[e]){

        let newRow = coinTable.insertRow(-1);
        let rowData = `

        <tr class=>
            <td id="coin-name">
            <a href="https://www.tradingview.com/symbols/${(data[i].symbol).toUpperCase()}USD" target="_blank">
                <div class="table-logo-container">
                    <div class="table-img">
                    <img id="coin-image" src="${data[i].image}">
                    </div>
                    <div class="inner-logo">
                    <h3 id="symbol">${data[i].symbol.toUpperCase()}</h3>
                    <h4 id="coinName">${data[i].name}</h4>
                    </div>
                </div>
                </a>
                </td>
            <td><a href="https://www.tradingview.com/symbols/${(data[i].symbol).toUpperCase()}USD" target="_blank">$<tag id="price">${data[i].current_price}</a></td>
            <td><a href="https://www.tradingview.com/symbols/${(data[i].symbol).toUpperCase()}USD" target="_blank">$<tag id="marketCap">${marketCapCheck(data, i)}</tag></a></td>
            <td><a href="https://www.tradingview.com/symbols/${(data[i].symbol).toUpperCase()}USD" target="_blank">$<tag id="ATH">${data[i].ath}</a></td>
            <td><a href="https://www.tradingview.com/symbols/${(data[i].symbol).toUpperCase()}USD" target="_blank">$<tag id="high_24h">${data[i].high_24h}</a></td>
            <td><a href="https://www.tradingview.com/symbols/${(data[i].symbol).toUpperCase()}USD" target="_blank">$<tag id="low_24h">${data[i].low_24h}</a></td>
            <td id="volume"><a href="https://www.tradingview.com/symbols/${(data[i].symbol).toUpperCase()}USD" target="_blank">$${volumeCheck(data, i)}</a></td>
            
        </tr>`
        ;
        
        newRow.innerHTML = rowData;
        }
        }
    }

};

