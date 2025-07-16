const ticker = document.getElementById("Ticker");
const searchBarForm = document.getElementById("SearchBar");
const priceChart = document.getElementById("PriceChart").getContext("2d");
const volumeChart = document.getElementById("VolumeChart").getContext("2d");
const description = document.getElementById("Description");
const divendendPerShare = document.getElementById("DivendendPerShare");
const openPrice = document.getElementById("Open");
const profitMargin = document.getElementById("ProfitMargin");
const divendendYield = document.getElementById("DivendendYield");
const eps = document.getElementById("EPS");
const peRatio = document.getElementById("PERatio");
const divendendDate = document.getElementById("DivendendDate");
const exDivendDate = document.getElementById("exDivendendDate");
const chartSection = document.getElementsByClassName("ChartDiv");
const infoSection = document.getElementsByClassName("InfoSection");
const landingPage = document.getElementById("LandingPage");
const aboutSection = document.getElementById("AboutSection");
const points = 99;

let prices = [];//An array that a given stocks prices
let dates = [];//An array that holds a given stocks date
let volume = [];//An array that holds a given stocks volume
let chart_price = null;
let chart_volume = null;
let companyName = null;

searchBarForm.addEventListener("submit", function(event){
    event.preventDefault();
    fetchData().then(() => {
        displayChartData();
        showElements();
    });
});

function fetchData(){
    const userInput = document.getElementById("tickerName").value.toUpperCase().trim();
    const apiKey = "J3MLMOFOUP0RAV8S";
    const apiKey_nd = "V4MR2GV2O6G4KI7T";
    const timeSerieslink = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${userInput}&apikey=${apiKey}&datatype=json&outputsize=compact`;
    const overview_link = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${userInput}&apikey=${apiKey_nd}`;

    return Promise.all([
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
        }),

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
                eps.textContent = `EPS: ${overview_data["EPS"]}`;
                peRatio.textContent = `PERatio: ${overview_data["PERatio"]}`;
                divendendDate.textContent = `Divendend Date: ${overview_data["DivendendDate"]}`;
                exDivendDate.textContent = `ExDivendend Date: ${overview_data["ExDivendendDate"]}`;
                companyName = toString(overview_data["Name"]).replace(/,?\s*Inc\.?/i, "").trim();
            })
    ])

    
}

function displayChartData(){
     Chart.defaults.elements.point.pointStyle = false;
     Chart.defaults.elements.line.fill = true;

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

function showElements(){
    if(prices.length === 0 && volume.length === 0 && dates.length === 0){
        for (let el of chartSection){
            el.style.display = 'none';
        }

        landingPage.style.display = 'block';
        aboutSection.style.display = 'block';

        for (let el of infoSection){
            el.style.display = 'none';
        }
    }
    else{
        for (let el of chartSection){
            el.style.display = "block";
        }

        landingPage.style.display = 'none';
        aboutSection.style.display = 'none';

        for (let el of infoSection){
            el.style.display = 'block';
        }
    }
}

showElements();