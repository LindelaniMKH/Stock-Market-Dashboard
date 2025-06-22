
//const ctx = document.getElementById("Chart").getContext('2d');


function fetchData(){
    const apiKey = "J3MLMOFOUP0RAV8S";
    const link = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&apikey=${apiKey}&datatype=json&outputsize=compact`;

    fetch(link)
        .then(response => {
            if(!response.ok){
                throw new Error ("HTTPS error, unable to fetch data");
            }
            return response.json();
        })
        .then(data => {
            const meta  = data["Meta Data"];
            const timeSeries = data["Time Series (Daily)"];
            const timeSeries_arr = Object.keys(timeSeries); //returns an array from containing the various daye from the JSO. 
            console.log(meta["2. Symbol"]);
            console.log(timeSeries_arr[0]);
        });
}

fetchData();