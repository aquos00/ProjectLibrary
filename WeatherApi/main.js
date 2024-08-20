const API_URL = 'https://api.open-meteo.com/v1/forecast?latitude=47.0002&longitude=8.0143&current=temperature_2m,is_day,rain,snowfall,weather_code,cloud_cover&hourly=temperature_2m,rain,snowfall,cloud_cover&timezone=Europe%2FBerlin';

async function fetchWeatherData(num) {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        switch (num) {
            case 1: displayCurrentWeather(data.current);
                break;
            case 2: displayFutureWeather(data.hourly);
                break;
            default:
                break;
        }
    } catch (error) {
        console.error("Error fetching weather data: ", error);
    }
}
function displayCurrentWeather(data) {
    let myWeather = document.getElementById("myWeather");
    let myWeatherData = document.getElementById("myWeatherData");
    let myChart = document.getElementById("myChart");
    let imgCont = document.getElementById("imgCont");
    let imgUrl = "unknown.png";
    myWeather.classList.toggle("hide");
    (myChart.classList.contains("hide")) ? "" : myChart.classList.toggle("hide");
    myWeatherData.innerHTML =
        `
    <h3>Temperatur: ${data.temperature_2m}°C</h3>
    <h3>Rain: ${data.rain}mm</h3>
    <h3>Time: ${formatTimeToday(data.time,2)}</h3>
    <h3>Date: ${formatTimeToday(data.time,1)}</h3>
    <h3>Snow: ${data.snowfall}cm</h3>
    <h3>Cloud coverage: ${data.cloud_cover}%</h3>
    `;
    let conclusion = document.getElementById("conclusion");
    if(data.snowfall == 0 && data.rain == 0 && data.temperature_2m > 15){
        conclusion.innerText = "Go for a ride!!!"
    }
    else if (data.snowfall == 0 && data.rain == 0 && data.temperature_2m < 15) {
        conclusion.innerText = "Go for a ride but with a Pullover!"
    }
    else if (data.rain != 0){
        conclusion.innerText = "The gym is callingggg~"
    }
    else {
        conclusion.innerText = "I think your Bike needs a break today"
    }
    if (data.weather_code < 10) {
        if (data.is_day == 1) {
            imgUrl = "icons/" + "0" + data.weather_code.toString() + "d.png"
        }
        else {
            imgUrl = "icons/" + "0" + data.weather_code.toString() + "n.png"
        }
    }
    else {
        if (data.is_day == 1) {
            imgUrl = "icons/" + data.weather_code.toString() + "d.png"
        }
        else {
            imgUrl = "icons/" + data.weather_code.toString() + "n.png"
        }
    }
    imgCont.innerHTML = `<img src="${imgUrl}" alt="Icon">`;
    console.log(`<img src="${imgUrl}" alt="Icon">`)
}
function displayFutureWeather(data) {
    const xValues = data.time.map(formatTime);
    const yValues = data.temperature_2m;
    const barColors = ["red", "green", "blue", "orange", "brown"];

    new Chart("myChart", {
        type: "line",
        data: {
            labels: xValues,
            datasets: [{
                label: 'Temperature (°C)',
                data: yValues,
                borderColor: 'rgb(200, 2, 2)',
                tension: 0.1
            },
            {
                label: 'Rain (mm)',
                data: data.rain,
                borderColor: 'rgb(2,2,200)',
                tension: 0.1
            },
            {
                label: 'Snow (cm)',
                data: data.snowfall ,
                borderColor: 'rgb(255,255,255)',
                tension: 0.1
            },
            {
                label: 'Cloud coverage (%)',
                data: data.cloud_cover,
                borderColor: 'rgb(209,134,00)',
                tension: 0.1
            }
            ]
        },
        options: {}
    });
    let myChart = document.getElementById("myChart");
    let myWeather = document.getElementById("myWeather");
    myChart.classList.toggle("hide");
    (myWeather.classList.contains("hide")) ? "" : myWeather.classList.toggle("hide");
}
function formatTime(timeString) {
    const date = new Date(timeString);
    let time = date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    if (time != "00:00") {
        if (time == "12:00" || time == "06:00" || time == "18:00") {
            return time;
        }
        else {
            return "";
        }
    }
    else {
        return date.toLocaleTimeString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' }).replace("um 00:00:00", "");
    }
}
function formatTimeToday(timeString, num) {
    const date = new Date(timeString);
    switch (num) {
        case 1:
            //Date
            return date.toLocaleTimeString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' }).split("um")[0];
        case 2: 
            //time
            return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
        default:
            break;
    }

}
fetchWeatherData(1);