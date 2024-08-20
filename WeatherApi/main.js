const API_URL = 'https://api.open-meteo.com/v1/forecast?latitude=47.0002&longitude=8.0143&current=temperature_2m,is_day,rain,snowfall,weather_code,cloud_cover&hourly=temperature_2m,rain,snowfall,cloud_cover&timezone=Europe%2FBerlin&models=best_match';

document.addEventListener("DOMContentLoaded", () => {
    fetchWeatherData(1);
});

async function fetchWeatherData(num) {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        if (num === 1) {
            displayCurrentWeather(data.current);
        } else if (num === 2) {
            displayFutureWeather(data.hourly);
        }
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}

function displayCurrentWeather(data) {
    const myWeather = document.getElementById("myWeather");
    const myWeatherData = document.getElementById("myWeatherData");
    const myChart = document.getElementById("myChart");
    const imgCont = document.getElementById("imgCont");
    let imgUrl = "unknown.png";

    myWeather.classList.toggle("hide");
    if (!myChart.classList.contains("hide")) myChart.classList.toggle("hide");

    myWeatherData.innerHTML = `
        <h3>Temperature: ${data.temperature_2m}°C</h3>
        <h3>Rain: ${data.rain}mm</h3>
        <h3>Time: ${formatTimeToday(data.time, 2)}</h3>
        <h3>Date: ${formatTimeToday(data.time, 1)}</h3>
        <h3>Snow: ${data.snowfall}cm</h3>
        <h3>Cloud coverage: ${data.cloud_cover}%</h3>
    `;

    const conclusion = document.getElementById("conclusion");
    if (data.snowfall === 0 && data.rain === 0 && data.temperature_2m > 15) {
        conclusion.innerText = "Go for a ride!!!";
    } else if (data.snowfall === 0 && data.rain === 0 && data.temperature_2m < 15) {
        conclusion.innerText = "Go for a ride but with a Pullover!";
    } else if (data.rain !== 0) {
        conclusion.innerText = "The gym is callingggg~";
    } else {
        conclusion.innerText = "I think your Bike needs a break today";
    }

    imgUrl = `icons/${data.weather_code < 10 ? '0' : ''}${data.weather_code}${data.is_day ? 'd' : 'n'}.png`;
    imgCont.innerHTML = `<img src="${imgUrl}" alt="Icon">`;
}

function displayFutureWeather(data) {
    const xValues = data.time.map(formatTime);
    const yValues = data.temperature_2m;

    new Chart("myChart", {
        type: "line",
        data: {
            labels: xValues,
            datasets: [
                { label: 'Temperature (°C)', data: yValues, borderColor: 'rgb(200, 2, 2)', tension: 0.1 },
                { label: 'Rain (mm)', data: data.rain, borderColor: 'rgb(2,2,200)', tension: 0.1 },
                { label: 'Snow (cm)', data: data.snowfall, borderColor: 'rgb(255,255,255)', tension: 0.1 },
                { label: 'Cloud coverage (%)', data: data.cloud_cover, borderColor: 'rgb(209,134,00)', tension: 0.75 }
            ]
        },
        options: {}
    });

    const myChart = document.getElementById("myChart");
    const myWeather = document.getElementById("myWeather");
    myChart.classList.toggle("hide");
    if (!myWeather.classList.contains("hide")) myWeather.classList.toggle("hide");
}

function formatTime(timeString) {
    const date = new Date(timeString);
    let time = date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });

    if (time === "00:00") {
        return date.toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' });
    } else if (["12:00", "06:00", "18:00"].includes(time)) {
        return time;
    }
    return "";
}

function formatTimeToday(timeString, num) {
    const date = new Date(timeString);
    if (num === 1) {
        return date.toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' });
    } else if (num === 2) {
        return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    }
}
