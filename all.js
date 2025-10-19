const base_URL = "https://opendata.cwa.gov.tw/api";
const key = window.APP_CONFIG?.API_KEY || '';
let obj = {
    params: {
        "Authorization": key,
        "format": "JSON"
    }
}
let weatherData = [];
const getElement = (selector) => document.querySelector(selector);
const getWeather = getElement('.getWeather');
const stationSearch = getElement('#stationSearch');
const datalistOptions = getElement("#datalistOptions");
const showData = getElement(".showData");

// 從中央氣象局公開資料串接氣象資料回來
// 並且將資料存到weatherData中
function init() {
    axios.get(`${base_URL}/v1/rest/datastore/O-A0001-001`, obj)
        .then(res => {
            // console.log(res.data.records.Station);
            weatherData = res.data.records.Station;
            const kind = new Set(weatherData.map(item => item.WeatherElement.Weather))
            console.log(kind);
            
        })
}
init();

// 將輸入的關鍵字與資料庫中的測站名、地區名進行比對，並輸出到datalist，讓使用者選取
stationSearch.addEventListener("input", e => {
    if (e.target.value == "") return;
    let str = "";
    let keywordSearch = weatherData.filter(item => {
        return (item.StationName.includes(e.target.value) || item.GeoInfo.TownName.includes(e.target.value) || item.GeoInfo.CountyName.includes(e.target.value));
    })
    keywordSearch.sort((a, b) => {
        const aMatch = a.StationName.includes(e.target.value) ? 1 : 0;
        const bMatch = b.StationName.includes(e.target.value) ? 1 : 0;
        return bMatch - aMatch;
    });
    keywordSearch.forEach(item => {
        str += `<option value="${item.StationName}">${item.GeoInfo.TownName}, ${item.GeoInfo.CountyName}`
    })
    datalistOptions.innerHTML = str;
})

// 將取出之資料輸出到HTML
function render(){
    let targetData = weatherData.filter(item => item.StationName === stationSearch.value);
    // console.log(targetData[0]);
    const stationName = getElement('.stationName');
    stationName.textContent = targetData[0].StationName;
    showData.innerHTML =
            `<li class="col-6 card weather text-center">
                <img src="./img/sun.svg" class="weather-icon px-5 pt-3 card-img-top" alt="天氣示意圖">
                <div class="card-body display-4">
                    ${targetData[0].WeatherElement.Weather == -99? '測站維護中':targetData[0].WeatherElement.Weather}
                </div>
            </li>
            <li class="col-6 card temperature text-center">
                <img src="./img/temperature.png" class="temperature-icon px-5 pt-3 card-img-top" alt="溫度計圖示">
                <div class="card-body display-4">
                    ${targetData[0].WeatherElement.AirTemperature == -99? '測站維護中':targetData[0].WeatherElement.AirTemperature}℃
                </div>
            </li>
            <li class="col-6 card humidity text-center">
                <img src="./img/humidity.png" class="humidity-icon px-5 pt-3 card-img-top" alt="濕度圖示">
                <div class="card-body display-4">
                    ${targetData[0].WeatherElement.RelativeHumidity == -99? '測站維護中':targetData[0].WeatherElement.RelativeHumidity}%
                </div>
            </li>
            <li class="col-6 card windy  text-center">
                <img src="./img/windy.png" class="windy-icon px-5 pt-3 card-img-top" alt="風速圖示">
                <div class="card-body display-4">
                    ${targetData[0].WeatherElement.WindSpeed == -99? '測站維護中':targetData[0].WeatherElement.WindSpeed}km/hr
                </div>
            </li>`;
    const weather = getElement('.weather-icon');
    if (targetData[0].WeatherElement.Weather === "晴") weather.setAttribute("src","./img/sun.svg");
    else if (targetData[0].WeatherElement.Weather === "多雲") weather.setAttribute("src","./img/cloudy.svg");
    else if (targetData[0].WeatherElement.Weather === "多雲有雷" || targetData[0].WeatherElement.Weather === "陰有雷") weather.setAttribute("src","./img/cloudyThunder.svg");
    else if (targetData[0].WeatherElement.Weather === "陰") weather.setAttribute("src","./img/shadow.svg");
    else if (targetData[0].WeatherElement.Weather === "多雲有雨") weather.setAttribute("src","./img/cloudyRain.svg");
    else if (targetData[0].WeatherElement.Weather === "晴有靄") weather.setAttribute("src","./img/sunMist.svg");
}
// 送出測站名，取出資料庫中的資料
getWeather.addEventListener("click", e => {
    render();
})

