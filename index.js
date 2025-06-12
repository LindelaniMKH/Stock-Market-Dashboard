
function fetchData(){
    const apiKey = "J3MLMOFOUP0RAV8S";
    const link = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&apikey=${apiKey}&datatype=json`;

    fetch(link)
        .then(response => {
            console.log(response.json());
        });
}

fetchData();