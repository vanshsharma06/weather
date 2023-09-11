const search = document.querySelector('#search-button');
const cityInput = document.querySelector('#input');

const API_KEY = '6041527b44cd52061a1e9cb5594dc69b';

const weatherCardDiv =document.querySelector
('#cards');

const currentWeatherDiv = document.querySelector('#temperature');

const locationButton = document.querySelector('#current-location')

const createWeatherCard = (cityName,weatherItem,index) => {
    if (index === 0) {
        return `<div id="temperature">
        <div class="content">
        <h1>${cityName}</h1>
        <h1>${(weatherItem.main.temp - 273.15).toFixed(1)} °C</h1>
        <i class="ri-sun-cloudy-line"></i>
    </div>
    <div id="wind-humid">
        <div class="wind">
            <i class="ri-windy-line"></i>
            <h2>${weatherItem.wind.speed} M/S</h2>
        </div>
        <div class="humid">
            <i class="ri-water-percent-line"></i>
            <h2>${weatherItem.main.humidity} %</h2>
        </div>
    </div>
        </div>`;
    }else{
        return `<div class="card">
                <h4>${weatherItem.dt_txt.split(" ")[0]}</h4>
                <h2>${(weatherItem.main.temp - 273.15).toFixed(2)} °C</h2>
                <i class="ri-sun-cloudy-line"></i>
            </div>`;
    }
    
}

const getWeatherDetails = (cityName, lat, lon) => {
    const WEATHER_API_URL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {
        const uniqueForecastDays = [];
        const fiveDaysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if (!uniqueForecastDays.includes(forecastDate)) {
                return uniqueForecastDays.push(forecastDate);
            }
        });

        cityInput.value = '';
        currentWeatherDiv.innerHTML = '';
        weatherCardDiv.innerHTML = '';
        
        // console.log(fiveDaysForecast);

        fiveDaysForecast.forEach((weatherItem, index) => {
            if (index === 0) {
                weatherCardDiv.insertAdjacentHTML('beforeend', createWeatherCard(cityName, weatherItem, index));
            } else {
                weatherCardDiv.insertAdjacentHTML('beforeend', createWeatherCard(cityName, weatherItem, index));
            }
        });
        
    }).catch(() => {
        alert('Error occured while fetching')
    });
}
const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if (!cityName) return;
    const GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

    fetch(GEOCODING_API_URL).then(res => res.json()).then(data => {
        if (!data.length) return alert(`no coordinates found for ${cityName}`);
        const { name, lat, lon } = data [0];
        getWeatherDetails(name, lat, lon);
    }).catch(() => {
        alert('Error occured while fetching')
    });
}

const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
        position => {
            const{latitude , longitude} = position.coords;
            const REVERSE_GEOCODING_URL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
            fetch(REVERSE_GEOCODING_URL).then(res => res.json()).then(data => {
                const { name } = data [0];
                getWeatherDetails(name, latitude, longitude);
            }).catch(() => {
                alert('Error occured while fetching')
            });
        },
        error => {
            if (error.code === error.PERMISSION_DENIED) {
                alert('Geolocation request denied. Please reset location permission grant access again.');
            }
        }
    );
}

search.addEventListener("click",getCityCoordinates);
locationButton.addEventListener('click', getUserCoordinates);