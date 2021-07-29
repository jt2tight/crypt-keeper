//AXIOS API CALL TO SERVER -- INITIALIZE ONLY ONCE
//COINS ALREADY ADDED IF COMMENTED OUT 11/18/2020

// insert one coin function
// let insertOne = (name, abbreviation) => {
//     let newCoin = new Coin();
//     newCoin.name = name;
//     newCoin.abbreviation = abbreviation;

//     newCoin.save();

// }

// //Get Data Function
// const getData = ()=> {
//     axios.get(
//         "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc%2C%20volume_asc%2C%20gecko_desc&per_page=76&page=1&sparkline=false&price_change_percentage='24h%2C7d%2C1y'%20")
//         .then(result => {
//             data = result.data;
//             for (let i=0; i < 76; i++){
//                 let name = data[i].name;
//                 let abbreviation = data[i].symbol.toUpperCase();
                
//                 insertOne(name, abbreviation);
                
//             }

//         })
//         .catch(err => {
//             console.log(err);
//         })                     
        
// };

// getData();