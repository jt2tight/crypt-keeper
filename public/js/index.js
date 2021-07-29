const coinTable = document.querySelector('.coin-table');
const accountBalance = document.querySelector('#accountBalance');
const signup = document.querySelector('#sign-up');
const landingInfo = document.querySelector('.landing-info');
const signUpForm = document.querySelector('.sign-up-form-hidden');
const main = document.querySelector('.landing');
const nav = document.querySelector('.nav');

let data; 

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
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc%2C%20volume_asc%2C%20gecko_desc&per_page=76&page=1&sparkline=false&price_change_percentage='24h%2C7d%2C1y'%20")
        .then(result => {
            data = result.data;
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
    getData();
},
20000);

signup.addEventListener('click', ()=> {
    landingInfo.classList.toggle('landing-info-up');
    signUpForm.classList.toggle('sign-up-form-display');
});

window.addEventListener('load', () => {
    $('.nav').css('background','transparent');
  });

$(window).scroll(function () {
    if ($(window).scrollTop() >= 100) {
    $('.nav').css('background','black');
    } else {
    $('.nav').css('background','transparent');
    }
    });


//All Card Variables
const card1Text = document.querySelector('.card1-text');
const card1Img = document.querySelector('.card1-img');
const card2Text = document.querySelector('.card2-text');
const card2Img = document.querySelector('.card2-img');
const card3Text = document.querySelector('.card-info');
const card3Img = document.querySelector('.card-img');


const card1Appear = () => {
    
    let card1IntroPosition = card1Text.getBoundingClientRect().top;
    let screenPosition = window.innerHeight / 1.15;

    if (card1IntroPosition < screenPosition){
        card1Text.classList.add('card1-text-appear');
        card1Img.classList.add('card1-img-appear');
    }

};

const card2Appear = () => {
    
    let card2IntroPosition = card2Text.getBoundingClientRect().top;
    let screenPosition = window.innerHeight / 1.2;

    if (card2IntroPosition < screenPosition){
        card2Text.classList.add('card2-text-appear');
        card2Img.classList.add('card2-img-appear');
    }

};

const card3Appear = () => {
    
    let card3IntroPosition = card3Text.getBoundingClientRect().top;
    let screenPosition = window.innerHeight / 1.5;

    if (card3IntroPosition < screenPosition){
        card3Text.classList.add('card-info-appear');
        card3Img.classList.add('card-img-appear');
    }

};

const removeCardClasses = () => {
    card1Text.classList.remove('card1-text-appear');
    card2Text.classList.remove('card2-text-appear');
    card3Text.classList.remove('card-info-appear');

    card1Img.classList.remove('card1-img-appear');
    card2Img.classList.remove('card2-img-appear');
    card3Img.classList.remove('card-img-appear');

};

window.addEventListener('scroll', ()=> {
    card1Appear();
    card2Appear();
    card3Appear();  

    if (window.scrollY === 0) {
        removeCardClasses();
        
    }
})

