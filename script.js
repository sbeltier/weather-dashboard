// Global Variables
var apiKey_openWeather = "b0e84d44a46c2683563bd1954e6d5080";
var searchButton = document.querySelector('.search-button');
var weatherToday = document.getElementById('weather-today');
var cityName_Span = document.getElementById('city-name');
var temperature_Span = document.getElementById('temperature');
var windSpeed_Span = document.getElementById('wind-speed');
var humidity_Span = document.getElementById('humidity');
var uv_index_Span = document.getElementById('uv_index');
var todayDate_Span = document.getElementById('today-date');
var hasBeenClicked = false;


// Five Day Forecast:
function getFiveDayForecast (gobblygook) {
    for (i = 0; i < 5 ; i++) {
        // First Click
        if (!hasBeenClicked) {
            // Create Container
            var fiveDayContainer = document.createElement("div")
            fiveDayContainer.classList.add('five-day-forecast-description', 'col-3', 'mx-2', 'bg-secondary', 'bg-gradient', 'px-3', 'py-3', 'text-light')
            document.getElementById('five-day-forecast').appendChild(fiveDayContainer)

            // Set Dates
            var todaysDate = moment();
            var tomorrow = moment(todaysDate).add((i+1), 'days')
            var newDate = moment(tomorrow).format('dddd, MMM Do')
            console.log(newDate)
            var dateP = document.createElement('p')
            dateP.classList.add('dateP')
            dateP.innerHTML = newDate
            fiveDayContainer.appendChild(dateP)

            // Set Temperature
            var tempP = document.createElement('p')
            tempP.classList.add('tempP')
            tempP.innerHTML = "Temp: " + gobblygook.list[i+1].main.temp + " °F"
            fiveDayContainer.appendChild(tempP) 

            // Set Wind Speed
            var windP = document.createElement('p')
            windP.classList.add('windP')
            windP.innerHTML = "Wind Speed: " + gobblygook.list[i+1].wind.speed + " mph"
            fiveDayContainer.appendChild(windP) 

            
            // Set Humidity
            var humidityP = document.createElement('p')
            humidityP.classList.add('humidityP')
            humidityP.innerHTML = "Humidity: " + gobblygook.list[i+1].main.humidity
            fiveDayContainer.appendChild(humidityP) 
            }

        // Update Existing Forecast
        else {
            var appendedFiveDayContainer = document.getElementsByClassName('five-day-forecast-description')
            // Update Dates
            var appendedDateP = document.getElementsByClassName('dateP')
            var todaysDate_update = moment();
            var tomorrow_update = moment(todaysDate_update).add((1+i), 'days')
            var newDate_update = moment(tomorrow_update).format('dddd, MMM Do')
            appendedDateP[i].innerHTML = newDate_update

            // Update Temperature
            var appendedTempP = document.getElementsByClassName('tempP')
            appendedTempP[i].innerHTML = "Temp: " + gobblygook.list[i+1].main.temp + " °F"

            // Update Wind Speed
            var appendedWindP = document.getElementsByClassName('windP')
            appendedWindP[i].innerHTML = "Wind Speed: " + gobblygook.list[i+1].wind.speed + " mph"

            // Update Humidity
            var appendedHumidityP = document.getElementsByClassName('humidityP')
            appendedHumidityP[i].innerHTML = "Humidity: " + gobblygook.list[i+1].main.humidity



            
        }
    }
}




// Add Event Listener
// Function getWeather requests city, temperature, wind speed, and humidity from openWeatherMap
searchButton.addEventListener('click', function getWeather () {
    console.log(hasBeenClicked)
    if (!hasBeenClicked) {
    console.log(hasBeenClicked)
    var user_city = document.querySelector('input').value 
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + user_city + "&appid=" + apiKey_openWeather + "&units=imperial"
        fetch(queryURL, {
            method: 'GET'
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            todayDate_Span.innerHTML = moment().format("dddd, MMMM Do YYYY")
            cityName_Span.textContent = " in " + data.name
            temperature_Span.textContent = data.main.temp + " °F"
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
                    var removeHide = document.getElementById('weather-today')
                    removeHide.classList.remove('hide')
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
                getFiveDayForecast(FiveDayResponseData);
                if (!hasBeenClicked)
                    hasBeenClicked = true;
                // for (i = 0; i < 5; i++) {
                //     var forecast = document.querySelectorAll('.five-day-forecast')[i]
                //     forecast.innerHTML =
                //         "Temperature: " + FiveDayResponseData.list[i+1].main.temp
                        
                // }
                return hasBeenClicked
            })
        })

    }
    else {
        console.log('Initiate Update to Primary Weather Dashboard')
        var user_city = document.querySelector('input').value 
        var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + user_city + "&appid=" + apiKey_openWeather + "&units=imperial"
            fetch(queryURL, {
                method: 'GET'
            })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data);
                todayDate_Span.innerHTML = moment().format("dddd, MMMM Do YYYY")
                cityName_Span.textContent = " in " + data.name
                temperature_Span.textContent = data.main.temp + " °F"
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
                        getFiveDayForecast(FiveDayResponseData);
                    })
            })
                
    console.log("has been clicked end: " + hasBeenClicked)
        }
})


// Create text field for a single forecast
function createForecast () {


}

/*             <p>
                Temperature: <span id="temperature"></span>
            </p>
            <p>
                Wind Speed: <span id="wind-speed"></span>    
            </p>
            <p>
                Humidity: <span id="humidity"></span>
            </p>
            <p>
                UV Index: <span id="uv_index"></span>
            </p>
*/