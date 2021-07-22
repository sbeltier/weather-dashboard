/*
*****   KNOWN ISSUES:   *****
********** Issue: When something is searched again, a duplicate button will show up
********** Solution: need to add a condition that acknowledges that
**********
********** Issue:
********** Solution:
*/

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
var searchHistory = [];
var searchHistory_button_arr = [];
var userInput = document.querySelector('input').value

/* Format of previousCity Object
var previousCity = {
    city: (data.name) [{
        primary: {
            temperature1: data.main.temp + " °F",
            windspeed1: data.wind.speed + " mph"
            humidity1: data.main.humidity + "%"
            UVindex1: uvData.current.uvi
        },
        fiveDay: {
            temperature2: "Temp: " + gobblygook.list[i+1].main.temp + " °F"
            windspeed2: "Wind Speed: " + gobblygook.list[i+1].wind.speed + " mph"
            humidity2: "Humidity: " + gobblygook.list[i+1].main.humidity

        }
    }]
}
*/


var previousCity = {
    cityName: "",
    city: [{
        primary: {
            temperature1: null,
            windspeed1: null,
            humidity1: null,
            UVindex1: null
        },
        fiveDay: {
            temperature2: null,
            windspeed2: null,
            humidity2: null,
            UVindex2: null

        }
    }]
}


// Five Day Forecast:
function getFiveDayForecast (gobblygook) {
    for (i = 0; i < 5 ; i++) {
        // First Click
        if (!hasBeenClicked) {

            // Create Container
            var fiveDayContainer = document.createElement("div")
            fiveDayContainer.classList.add('five-day-forecast-description', 'col-3', 'mx-2', 'bg-secondary', 'bg-gradient', 'px-3', 'py-3', 'text-light')
            document.getElementById('five-day-forecast').appendChild(fiveDayContainer)

            // Set Icons
            var setIcon = document.createElement('img')
            setIcon.classList.add('iconImg')
            setIcon.setAttribute('src', ("https://openweathermap.org/img/w/" + gobblygook.list[i+1].weather[0].icon + ".png"))
            fiveDayContainer.appendChild(setIcon)

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

            // Update Icons
            appendedIconImg = document.getElementsByClassName('iconImg')
            appendedIconImg[i].setAttribute('src', ("https://openweathermap.org/img/w/" + gobblygook.list[i+1].weather[0].icon + ".png"))

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




// Add Event Listener to Search for a City button
// Function getWeather requests city, temperature, wind speed, and humidity from openWeatherMap
searchButton.addEventListener('click', function getWeather () {
    console.log(hasBeenClicked)
    if (!hasBeenClicked) {
    console.log(hasBeenClicked)
    var user_city = document.querySelector('input').value.toUpperCase() 
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + user_city + "&appid=" + apiKey_openWeather + "&units=imperial"
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
                
                // Style UV Index 
                console.log("style UV Index")

                if (uvData.current.uvi < 3) {
                    // UV Index is low
                    uv_index_Span.setAttribute("style", "background-color: green; color: white; padding: 4px 4px 4px 4px;")
                }
                    // UV Index is moderate
                if ((uvData.current.uvi >= 3)
                    &&
                    (uvData.current.uvi < 6)
                    ){
                        uv_index_Span.setAttribute("style", "background-color: yellow")
                }
                // UV Index is high
                if ((uvData.current.uvi >= 6)
                    &&
                    (uvData.current.uvi < 8)
                    ){
                        uv_index_Span.setAttribute("style", "background-color: orange")
                }
                // UV Index is very high
                if ((uvData.current.uvi >= 8)
                    &&
                    (uvData.current.uvi < 10)
                    ){
                        uv_index_Span.setAttribute("style", "background-color: red; color: white")
                }
                // UV Index is Extreme
                if (uvData.current.uvi >= 11){
                    uv_index_Span.setAttribute("style", "background-color: purple; color: white")
                }



                // Add Icon to Primary Weather
                var primaryIcon = document.getElementById('primary-weather-icon')
                primaryIcon.setAttribute("src", ("https://openweathermap.org/img/w/" + data.weather[0].icon + ".png"))
                console.log("this is the icon array initializer")


                    
                // Fetch 5 day forecast
                let queryURL_5Day = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + apiKey_openWeather + "&units=imperial"
                fetch (queryURL_5Day, {
                    method: 'GET'
                })
               .then (function (FiveDayResponse) {
                    return FiveDayResponse.json();
                })
               .then (function (FiveDayResponseData) {
                    console.log("ALL AVAILABLE Data:")
                    console.log(FiveDayResponseData)
                    console.log(data);
                    console.log(uvData)
                    getFiveDayForecast(FiveDayResponseData);
                    
                    // Push into Search History
                    var previousCity = {
                        cityName: (data.name),
                        city: [{
                            primary: {
                                temperature1: data.main.temp + " °F",
                                windspeed1: data.wind.speed + " mph",
                                humidity1: data.main.humidity + "%",
                                UVindex1: uvData.current.uvi,
                                icon: data.weather[0].icon + ".png"
                            },
                            fiveDay: [
                                {
                                    temperature2: FiveDayResponseData.list[0].main.temp + " °F",
                                    windspeed2: FiveDayResponseData.list[0].wind.speed + " mph",
                                    humidity2: FiveDayResponseData.list[0].main.humidity,
                                    icon2: FiveDayResponseData.list[0].weather.icon + ".png"
                                },
                                {
                                    temperature2: FiveDayResponseData.list[1].main.temp + " °F",
                                    windspeed2: FiveDayResponseData.list[1].wind.speed + " mph",
                                    humidity2: FiveDayResponseData.list[1].main.humidity,
                                    icon2: FiveDayResponseData.list[1].weather.icon + ".png"

                                },       
                                {
                                    temperature2: FiveDayResponseData.list[2].main.temp + " °F",
                                    windspeed2: FiveDayResponseData.list[2].wind.speed + " mph",
                                    humidity2: FiveDayResponseData.list[2].main.humidity,
                                    icon2: FiveDayResponseData.list[2].weather.icon + ".png"

                                },     
                                {
                                    temperature2: FiveDayResponseData.list[3].main.temp + " °F",
                                    windspeed2: FiveDayResponseData.list[3].wind.speed + " mph",
                                    humidity2: FiveDayResponseData.list[3].main.humidity,
                                    icon2: FiveDayResponseData.list[3].weather.icon + ".png"

                                },     
                                {
                                    temperature2: FiveDayResponseData.list[4].main.temp + " °F",
                                    windspeed2: FiveDayResponseData.list[4].wind.speed + " mph",
                                    humidity2: FiveDayResponseData.list[4].main.humidity,
                                    icon2: FiveDayResponseData.list[0].weather.icon + ".png"

                                }                                                                                              
                                
                            ]
                        }]
                    }
                    searchHistory.push(previousCity)
                    console.log('first click saved: ')
                    console.log (searchHistory)
                 
                        
                    // Create First Search History Button
                    var searchCol = document.getElementById('search')
                    var pastSearchesContainer = document.createElement('div')
                    pastSearchesContainer.classList.add('d-grid', 'gap-2') 
                    searchCol.appendChild(pastSearchesContainer)
                    var searchHistory_button = document.createElement('button')
                    searchHistory_button_arr.push(data.name.toUpperCase())
                    console.log(searchHistory_button_arr)
                    console.log("Search history button array")
                    searchHistory_button.classList.add('btn', 'btn-secondary', 'my-1', 'search-history-button')
                    
                    searchHistory_button.innerHTML = data.name
                    pastSearchesContainer.appendChild(searchHistory_button)

                    // Store in Local Storage
                    localStorage.setItem("Weather Forecast", JSON.stringify(searchHistory))

                    // Add Event Listener to Search History Button to refresh weather dashboard
                    searchHistory_button.addEventListener('click', function (event){
                        var searchHistory_arr = JSON.parse(localStorage.getItem("Weather Forecast"))
                        JSON.stringify(searchHistory_arr)

                        // Update Primary Forecast
                        for (k = 0; k < searchHistory_arr.length; k++){
                            if (searchHistory_button.innerHTML == searchHistory_arr[k].cityName) {
                                console.log(searchHistory_arr.length)
                                console.log("searchHistory_arr.length^")
                                cityName_Span.innerHTML = searchHistory_arr[k].cityName
                                temperature_Span.innerHTML = searchHistory_arr[k].city[0].primary.temperature1
                                windSpeed_Span.innerHTML = searchHistory_arr[k].city[0].primary.windspeed1
                                humidity_Span.innerHTML = searchHistory_arr[k].city[0].primary.humidity1
                                uv_index_Span.innerHTML = searchHistory_arr[k].city[0].primary.UVindex1
                                

                            // Add Icon to Primary Weather
                            var primaryIcon = document.getElementById('primary-weather-icon')
                            primaryIcon.setAttribute("src", ("https://openweathermap.org/img/w/" + searchHistory_arr[k].city[0].primary.icon))
                            console.log("Icon Number for the main dashboard is:" + searchHistory_arr[k].city[0].primary.icon)


                                // Style UV Index 
                                console.log("style UV Index")

                                if (searchHistory_arr[k].city[0].primary.UVindex1 < 3) {
                                    // UV Index is low
                                    uv_index_Span.setAttribute("style", "background-color: green; color: white; padding: 4px 4px 4px 4px;")
                                }
                                    // UV Index is moderate
                                if ((searchHistory_arr[k].city[0].primary.UVindex1 >= 3)
                                    &&
                                    (searchHistory_arr[k].city[0].primary.UVindex1< 6)
                                    ){
                                        uv_index_Span.setAttribute("style", "background-color: yellow; padding: 4px 4px 4px 4px;")
                                }
                                // UV Index is high
                                if ((searchHistory_arr[k].city[0].primary.UVindex1 >= 6)
                                    &&
                                    (searchHistory_arr[k].city[0].primary.UVindex1 < 8)
                                    ){
                                        uv_index_Span.setAttribute("style", "background-color: orange; padding: 4px 4px 4px 4px;")
                                }
                                // UV Index is very high
                                if ((searchHistory_arr[k].city[0].primary.UVindex1 >= 8)
                                    &&
                                    (searchHistory_arr[k].city[0].primary.UVindex1 < 10)
                                    ){
                                        uv_index_Span.setAttribute("style", "background-color: red; color: white; padding: 4px 4px 4px 4px;")
                                }
                                // UV Index is Extreme
                                if (searchHistory_arr[k].city[0].primary.UVindex1 >= 11){
                                    uv_index_Span.setAttribute("style", "background-color: purple; color: white; padding: 4px 4px 4px 4px;")
                                }
                               
                            }
                        }

                        
                        // Update FiveDay Forecast
                        for (l = 0; l < searchHistory_arr.length; l++) {
                            if (event.target.innerHTML == searchHistory_arr[l].cityName) {
                                for (m = 0; m < 5; m++){
                            document.getElementsByClassName('tempP')[m].innerHTML = "Temp: " + searchHistory_arr[l].city[0].fiveDay[m].temperature2
                            document.getElementsByClassName('windP')[m].innerHTML = "Wind Speed: " + searchHistory_arr[l].city[0].fiveDay[m].windspeed2
                            document.getElementsByClassName('humidityP')[m].innerHTML = "Humidity: " + searchHistory_arr[l].city[0].fiveDay[m].humidity2
                                }
                            }
                        }
                        
                    })

                    // Update First Click
                    if (!hasBeenClicked)
                        hasBeenClicked = true;                
                    return hasBeenClicked
                })
            })
        })

    }
    
    else {
        console.log('Initiate Update to Primary Weather Dashboard')
        var user_city = document.querySelector('input').value 
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + user_city + "&appid=" + apiKey_openWeather + "&units=imperial"
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
                    // Style UV Index 
                    console.log("style UV Index")

                    if (uvData.current.uvi < 3) {
                        // UV Index is low
                        uv_index_Span.setAttribute("style", "background-color: green; color: white; padding: 4px 4px 4px 4px;")
                    }
                        // UV Index is moderate
                    if ((uvData.current.uvi >= 3)
                        &&
                        (uvData.current.uvi< 6)
                        ){
                            uv_index_Span.setAttribute("style", "background-color: yellow; padding: 4px 4px 4px 4px;")
                    }
                    // UV Index is high
                    if ((uvData.current.uvi >= 6)
                        &&
                        (uvData.current.uvi < 8)
                        ){
                            uv_index_Span.setAttribute("style", "background-color: orange; padding: 4px 4px 4px 4px;")
                    }
                    // UV Index is very high
                    if ((uvData.current.uvi >= 8)
                        &&
                        (uvData.current.uvi < 10)
                        ){
                            uv_index_Span.setAttribute("style", "background-color: red; color: white; padding: 4px 4px 4px 4px;")
                    }
                    // UV Index is Extreme
                    if (uvData.current.uvi >= 11){
                        uv_index_Span.setAttribute("style", "background-color: purple; color: white; padding: 4px 4px 4px 4px;")
                    }                    
                    
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

                        // Push into Search History
                        var previousCity = {
                            cityName: (data.name),
                            city: [{
                                primary: {
                                    temperature1: data.main.temp + " °F",
                                    windspeed1: data.wind.speed + " mph",
                                    humidity1: data.main.humidity + "%",
                                    UVindex1: uvData.current.uvi,
                                },
                                fiveDay: [
                                    {
                                        temperature2: FiveDayResponseData.list[0].main.temp + " °F",
                                        windspeed2: FiveDayResponseData.list[0].wind.speed + " mph",
                                        humidity2: FiveDayResponseData.list[0].main.humidity,
                                    },
                                    {
                                        temperature2: FiveDayResponseData.list[1].main.temp + " °F",
                                        windspeed2: FiveDayResponseData.list[1].wind.speed + " mph",
                                        humidity2: FiveDayResponseData.list[1].main.humidity,
                                    },       
                                    {
                                        temperature2: FiveDayResponseData.list[2].main.temp + " °F",
                                        windspeed2: FiveDayResponseData.list[2].wind.speed + " mph",
                                        humidity2: FiveDayResponseData.list[2].main.humidity,
                                    },     
                                    {
                                        temperature2: FiveDayResponseData.list[3].main.temp + " °F",
                                        windspeed2: FiveDayResponseData.list[3].wind.speed + " mph",
                                        humidity2: FiveDayResponseData.list[3].main.humidity,
                                    },     
                                    {
                                        temperature2: FiveDayResponseData.list[4].main.temp + " °F",
                                        windspeed2: FiveDayResponseData.list[4].wind.speed + " mph",
                                        humidity2: FiveDayResponseData.list[4].main.humidity,
                                    }                                                                                              
                                    
                                ]
                            }]
                        }
                        searchHistory.push(previousCity)
                        console.log('array updated with: ')
                        console.log(previousCity)
                        console.log("check array: ")
                        console.log(document.querySelector('input').value)
                        console.log("searchHistory_button_arr is:")
                        console.log(searchHistory_button_arr)
                        userInput = document.querySelector('input').value
                        // Create Search History Button **** NEED TO CHECK AGAIN
                        if (!searchHistory_button_arr.includes(userInput.toUpperCase())) {
                            console.log("HELLO")
                            console.log(userInput)
                            var searchCol = document.getElementById('search')
                            var pastSearchesContainer = document.createElement('div')
                            pastSearchesContainer.classList.add('d-grid', 'gap-2') 
                            searchCol.appendChild(pastSearchesContainer)
                            var searchHistory_button = document.createElement('button')
                            searchHistory_button.classList.add('btn', 'btn-secondary', 'my-1', 'search-history-button')
                            searchHistory_button.innerHTML = data.name
                            searchHistory_button_arr.push(data.name.toUpperCase())
                            console.log("searchHistory_button_arr")
                            console.log(searchHistory_button_arr)
                            pastSearchesContainer.appendChild(searchHistory_button)
                            
                            }
                        else {
                            alert("Click on the gray " + data.name.toUpperCase() + " button to see the forecast again!")
                        }
                                                
                        
                        // Store in Local Storage
                        localStorage.setItem("Weather Forecast", JSON.stringify(searchHistory))

                        // Additional Searches after first - add Event Listener to Search History Button
                        searchHistory_button.addEventListener('click', function (event){
                            console.log("this is for the second search history button")
                            var searchHistory_arr = JSON.parse(localStorage.getItem("Weather Forecast"))
                            JSON.stringify(searchHistory_arr)

                            
                            // Update Primary Forecast
                            for (k = 0; k < searchHistory_arr.length; k++){
                                if (event.target.innerHTML == searchHistory_arr[k].cityName) {
                                    cityName_Span.innerHTML = searchHistory_arr[k].cityName
                                    temperature_Span.innerHTML = searchHistory_arr[k].city[0].primary.temperature1
                                    windSpeed_Span.innerHTML = searchHistory_arr[k].city[0].primary.windspeed1
                                    humidity_Span.innerHTML = searchHistory_arr[k].city[0].primary.humidity1
                                    uv_index_Span.innerHTML = searchHistory_arr[k].city[0].primary.UVindex1

                                    // Style UV Index 
                                    console.log("style UV Index")

                                    if (searchHistory_arr[k].city[0].primary.UVindex1 < 3) {
                                        // UV Index is low
                                        uv_index_Span.setAttribute("style", "background-color: green; color: white; padding: 4px 4px 4px 4px;")
                                    }
                                        // UV Index is moderate
                                    if ((searchHistory_arr[k].city[0].primary.UVindex1 >= 3)
                                        &&
                                        (searchHistory_arr[k].city[0].primary.UVindex1< 6)
                                        ){
                                            uv_index_Span.setAttribute("style", "background-color: yellow; padding: 4px 4px 4px 4px;")
                                    }
                                    // UV Index is high
                                    if ((searchHistory_arr[k].city[0].primary.UVindex1 >= 6)
                                        &&
                                        (searchHistory_arr[k].city[0].primary.UVindex1 < 8)
                                        ){
                                            uv_index_Span.setAttribute("style", "background-color: orange; padding: 4px 4px 4px 4px;")
                                    }
                                    // UV Index is very high
                                    if ((searchHistory_arr[k].city[0].primary.UVindex1 >= 8)
                                        &&
                                        (searchHistory_arr[k].city[0].primary.UVindex1 < 10)
                                        ){
                                            uv_index_Span.setAttribute("style", "background-color: red; color: white; padding: 4px 4px 4px 4px;")
                                    }
                                    // UV Index is Extreme
                                    if (searchHistory_arr[k].city[0].primary.UVindex1 >= 11){
                                        uv_index_Span.setAttribute("style", "background-color: purple; color: white; padding: 4px 4px 4px 4px;")
                                    }
                                    
                                    // Add Icon to Primary Weather
                                    var primaryIcon = document.getElementById('primary-weather-icon')
                                    primaryIcon.setAttribute("src", ("https://openweathermap.org/img/w/" + searchHistory_arr[k].city[0].primary.icon))
                                    console.log("Icon Number for day " + k + " is:" + searchHistory_arr[k].city[0].primary.icon)

                                }
                            }
                            

                            // Update FiveDay Forecast
                            for (l = 0; l < searchHistory_arr.length; l++) {
                                if (event.target.innerHTML == searchHistory_arr[l].cityName) {
                                    for (m = 0; m < 5; m++){
                                document.getElementsByClassName('tempP')[m].innerHTML = "Temp: " + searchHistory_arr[l].city[0].fiveDay[m].temperature2
                                document.getElementsByClassName('windP')[m].innerHTML = "Wind Speed: " + searchHistory_arr[l].city[0].fiveDay[m].windspeed2
                                document.getElementsByClassName('humidityP')[m].innerHTML = "Humidity: " + searchHistory_arr[l].city[0].fiveDay[m].humidity2
                                    }
                                }
                            }
                            
                        })                        


                    
                    })
                })
            })
                
    console.log("has been clicked end: " + hasBeenClicked)
        }
})

