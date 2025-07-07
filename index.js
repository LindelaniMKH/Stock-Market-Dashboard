const ticker = document.getElementById("Ticker");
const searchBarForm = document.getElementById("SearchBar");
const priceChart = document.getElementById("PriceChart").getContext("2d");
const volumeChart = document.getElementById("VolumeChart").getContext("2d");
const description = document.getElementById("Description");
const divendendPerShare = document.getElementById("DivendendPerShare");
const openPrice = document.getElementById("Open");
const profitMargin = document.getElementById("ProfitMargin");
const divendendYield = document.getElementById("DivendendYield");
const points = 99;

let prices = [];//An array that a given stocks prices
let dates = [];//An array that holds a given stocks date
let volume = [];//An array that holds a given stocks volume
let chart_price = null;
let chart_volume = null;

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

            if(!meta){
                console.error("Meta Data not found! Response: ", data);
                ticker.textContent = "Invalid Ticker or API limit reached.";
                return;
            }

            const symbol = meta["2. Symbol"];
            const timeSeries = data["Time Series (Daily)"];

            if(!timeSeries){
                console.error("Time Series datya not found: ",data);
                return;
            }

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
                profitMargin.textContent = `Profit Margin: ${overview_data["ProfitMargin"]}`;
                divendendPerShare.textContent = `Divendend Per Share: ${overview_data["DividendPerShare"]}`;
                divendendYield.textContent = `Divendend Yield: ${overview_data["DividendYield"]}`;

            })
}

function displayChartData(){
    //Destroying the previous charts if they exist
    if(chart_price){
        chart_price.destroy();
    }

    if(chart_volume){
        chart_volume.destroy();
    }

    //Creating new charts
    chart_price = new Chart(priceChart, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: "Price",
                data: prices,
         }]
        }
    });

    chart_volume = new Chart(volumeChart, {
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
