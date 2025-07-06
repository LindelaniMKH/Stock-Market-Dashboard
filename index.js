const ticker = document.getElementById("Ticker");
const searchBarForm = document.getElementById("SearchBar");
const priceChart = document.getElementById("PriceChart").getContext("2d");
const volumeChart = document.getElementById("VolumeChart").getContext("2d");
const description = document.getElementById("Description")
const points = 99;

let prices = [];//An array that a given stocks prices
let dates = [];//An array that holds a given stocks date
let volume = [];//An array that holds a given stocks volume

searchBarForm.addEventListener("submit", function(event){
    event.preventDefault();
    fetchData();
    displayChartData();
});

function fetchData(){
    const userInput = document.getElementById("tickerName").value.toUpperCase().trim();
    const apiKey = "J3MLMOFOUP0RAV8S";
    const apiKey_nd = "V4MR2GV2O6G4KI7T";
    const timeSerieslink = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${userInput}&apikey=${apiKey}&datatype=json&outputsize=compact`;
    const overview_link = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${userInput}&apikey=${apiKey_nd}`;

    fetch(timeSerieslink)
        .then(response => {
            if(!response.ok){
                throw new Error ("HTTPS error, unable to fetch data");
            }
            return response.json();
        })
        .then(data => {
            const meta  = data["Meta Data"];
            const symbol = meta["2. Symbol"];
            const timeSeries = data["Time Series (Daily)"];
            const timeSeries_arr = Object.keys(timeSeries); //returns an array from containing the various dates from the JSO. 
            ticker.textContent = symbol;
            
           // console.log(timeSeries);

            for (let i = 0; i < points; i++){
                dates[i] = timeSeries_arr[i];
                prices[i] = parseFloat(timeSeries[timeSeries_arr[i]]["4. close"]);
                volume[i] = parseInt(timeSeries[timeSeries_arr[i]]["5. volume"]);
                //var closingPrice = timeSeries[timeSeries_arr[i]]["4. close"];
                //console.log(timeSeries[toString(timeSeries_arr[i])][ "4. close"]);
                //console.log(closingPrice);
            }
            //console.log(timeSeries_arr[0]);
        });

        fetch(overview_link)
            .then(request => {
                if(!request.ok){
                    throw new Error ("HTTPS error, unable to fetch data");
                }
                return request.json();
            })
            .then(overview_data => {
                description.textContent = overview_data["Description"];
            })
}

function displayChartData(){
    const chart_price = new Chart(priceChart, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: "Price",
                data: prices,
         }]
        }
    });

    const chart_volume = new Chart(volumeChart, {
        type: 'bar',
        data: {
            labels: dates,
            datasets: [{
                label: "Volume",
                data: volume,
            }]
        }
    });
}
