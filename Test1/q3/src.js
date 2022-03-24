const url = 'https://api.coindesk.com/v1/bpi/currentprice.json';

//Execute function
function start() {
    buttonHandler(trigger);
}

// A function to debounce button
function debounce(fn, delay) {
    let timer;
    return (() => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(), delay);
    })();
}

//After button is triggered
function trigger() {
    let a = document.querySelector("#currencySelectorTo");
    let b = document.querySelector("#currencySelectorFrom");
    let currency = {
        to: a.value,
        from: b.value,
        value: inputHandler()
    }
    apiCall(url, renderValue, currency);
}

// Handle button action
function buttonHandler(callback) {
    let btn = document.querySelector(".btn");
    btn.addEventListener('click', () => {
        debounce(callback, 500);
    })
}

// Accept only number in float format
function inputHandler() {
    let input = document.querySelector("#currency").value;
    let floatValues = /[+-]?([0-9]*[.])?[0-9]+/;
    if (input.match(floatValues) && !isNaN(input)) {
        return parseFloat(input);
    } else {
        if(!alert("Please enter only a number")){
            window.location.reload();
        }
    }
}

//Call api
function apiCall(url, callback, currency) {
    let value = 0;
    let a = fetch(url)
        .then((response) => {
            return response.json();
        })
        .then((response) => {
            return value = converter(currency, response.bpi);
        }).then(
            (response) => {
                callback(currency, response)
            }
        ).catch((err) => {
            console.log(err);
        })
}

//Doing the conversion
function converter(currency, response) {
    let fromValue = currencyHelper(currency.from, response);
    let toValue = currencyHelper(currency.to, response);
    let res = 0;
    let flag = false;

    //Make sure that either oneside have select BTC
    if (currency.from === 'BTC' && currency.to !== 'BTC') {
        flag = true;
    } else if (currency.from !== 'BTC' && currency.to === 'BTC') {
        flag = true;
    }

    if (!flag) {
        if(!alert('You have to choose BTC for conversion either in the from list or to list')){window.location.reload();}
    }

    if (currency.value != null && currency.value >= 0 && flag) {
        res = currency.value * toValue / fromValue;
        return res;
    }
}

//Switching different currency class
function currencyHelper(input, response) {
    let fromValue;
    switch (input) {
        case 'USD':
            fromValue = response.USD.rate_float;
            break;
        case 'GBP':
            fromValue = response.GBP.rate_float;
            break;
        case 'EUR':
            fromValue = response.EUR.rate_float;
            break;
        case 'BTC':
            fromValue = 1;
            break;
    }
    return fromValue;
}

//Rendering function
function renderValue(currency, response) {
    console.log(response);
    if (currency.value !== null && currency.from !== undefined && currency.to !== undefined && response !== undefined) {
        let doc = document.querySelector('.result-group');
        doc.innerHTML = `
            <span class="result-element text">${currency.value} ${currency.from} is equal to ${response} ${currency.to}</span>
        `;
    }

}
//Execute function
start();