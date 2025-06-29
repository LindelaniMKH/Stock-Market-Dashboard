const ticker = document.getElementById("Ticker");
const searchBarForm = document.getElementById("SearchBar");
const points = 99;

searchBarForm.addEventListener("submit", function(event){
    event.preventDefault();
    fetchData();
});

function fetchData(){
    const userInput = document.getElementById("tickerName").value.toUpperCase().trim();
    const apiKey = "J3MLMOFOUP0RAV8S";
    const link = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${userInput}&apikey=${apiKey}&datatype=json&outputsize=compact`;

    fetch(link)
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
            const timeSeries_arr = Object.keys(timeSeries); //returns an array from containing the various daye from the JSO. 
            ticker.textContent = symbol;
            
           // console.log(timeSeries);

            for (let i = 0; i < points; i++){
                console.log(timeSeries_arr[i]);
                var closingPrice = timeSeries[timeSeries_arr[i]]["4. close"];
                //console.log(timeSeries[toString(timeSeries_arr[i])][ "4. close"]);
                console.log(closingPrice);
            }
            //console.log(timeSeries_arr[0]);
        });
}
