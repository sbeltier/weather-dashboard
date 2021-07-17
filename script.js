// Global Variables
var apiKey_openWeather = "b0e84d44a46c2683563bd1954e6d5080";
var searchButton = document.querySelector('.search-button');
var weatherToday = document.getElementById('weather-today');
var cityName_Span = document.getElementById('city-name');
var temperature_Span = document.getElementById('temperature');
var windSpeed_Span = document.getElementById('wind-speed');
var humidity_Span = document.getElementById('humidity');
var uv_index_Span = document.getElementById('uv_index');
var date_Span = document.getElementById('date');



// Add Event Listener
// Function getWeather requests city, temperature, wind speed, and humidity from openWeatherMap
searchButton.addEventListener('click', function getWeather () {
    var user_city = document.querySelector('input').value 
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + user_city + "&appid=" + apiKey_openWeather + "&units=imperial"
    console.log(queryURL)
    fetch(queryURL, {
        method: 'GET'
    })
       .then(function (response) {
           return response.json();
       })
       .then(function (data) {
        console.log(data);
        cityName_Span.textContent = " in " + data.name
        temperature_Span.textContent = data.main.temp + "F"
        windSpeed_Span.textContent = data.wind.speed + " mph"
        humidity_Span.textContent = data.main.humidity + "%"
        let lat = data.coord.lat
        let lon = data.coord.lon
        let cityID = data.id

        // Fetch UV Index
        let queryURL_UVindex = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon +"&exclude=hourly,daily&appID=" + apiKey_openWeather
        fetch (queryURL_UVindex, {
            method: 'GET'
        })
            .then (function (uvResponse) {
                return uvResponse.json ();
            })
            .then (function (uvData) {
                console.log(uvData)
                uv_index_Span.textContent = uvData.current.uvi
            })
        
        // Fetch 5 day forecast
        let queryURL_5Day = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + apiKey_openWeather + "&units=imperial"
        fetch (queryURL_5Day, {
            method: 'GET'
        })
        .then (function (FiveDayResponse) {
                return FiveDayResponse.json();
        })
        .then (function (FiveDayResponseData) {
            console.log("5Day Response Data:")
            console.log(FiveDayResponseData)

            for (i = 0; i < 5; i++) {
                var forecast = document.querySelectorAll('.five-day-forecast')[i]
                forecast.innerHTML =
                    "Temperature: " + FiveDayResponseData.list[i+1].main.temp
                    
            }
        })
    })
})
