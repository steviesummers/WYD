document.addEventListener('DOMContentLoaded', function() {
    // Function to show the confirmation modal
    function showConfirmationModal() {
        document.getElementById('confirmationModal').style.display = 'block';
    }

    // Function to hide the confirmation modal
    function hideConfirmationModal() {
        document.getElementById('confirmationModal').style.display = 'none';
    }

    // Function to clear history
    function clearHistory() {
        cities = []; // Clear the cities array
        localStorage.setItem("cities", JSON.stringify(cities)); // Update localStorage
        renderCities(); // Re-render the cities list
        hideConfirmationModal(); // Hide the modal after clearing history
    }

    // Event listeners for the custom modal buttons
    document.getElementById('confirmClear').addEventListener('click', clearHistory);
    document.getElementById('cancelClear').addEventListener('click', hideConfirmationModal);

    // Update the event listener for the clear-history button
    document.getElementById('clear-history').addEventListener('click', showConfirmationModal);
});
// Function to get weather data from OpenWeather API
async function getWeatherData(city) {
  const apiKey = "7ed5d3674b6f7460161c3700116430fe";
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
  );
  if (response.ok) {
    saveCity(city);
    getEvents(city);
    const data = await response.json();
    return data;
  }
}

// Function to display current weather
function displayCurrentWeather(data) {
  const weather = data.list[0]; // Get current weather from the list
  const weatherDetails = document.getElementById("weather-details");
  weatherDetails.innerHTML = `
        <h3>${data.city.name}</h3>
        <p><strong>Date:</strong> ${new Date(
          weather.dt_txt
        ).toLocaleDateString()}</p>
        <p><strong>Temperature:</strong> ${weather.main.temp} °C</p>
        <p><strong>Humidity:</strong> ${weather.main.humidity}%</p>
        <p><strong>Wind Speed:</strong> ${weather.wind.speed} m/s</p>
        <img src="https://openweathermap.org/img/wn/${
          weather.weather[0].icon
        }.png" alt="Weather Icon" />
    `;
}

// Function to display 5-day forecast
function displayForecast(data) {
  const forecastDetails = document.getElementById("forecast-details");
  forecastDetails.innerHTML = ""; // Clear previous content
  // Loop through each forecast day
  for (let i = 0; i < data.list.length; i += 8) {
    // API returns weather every 3 hours, 8 data points make a day
    const forecast = data.list[i];
    const forecastDiv = document.createElement("div");
    forecastDiv.innerHTML = `
            <p><strong>Date:</strong> ${new Date(
              forecast.dt_txt
            ).toLocaleDateString()}</p>
            <img src="https://openweathermap.org/img/wn/${
              forecast.weather[0].icon
            }.png" alt="Weather Icon" />
            <p><strong>Temp:</strong> ${forecast.main.temp} °C</p>
            <p><strong>Humidity:</strong> ${forecast.main.humidity}%</p>
            <p><strong>Wind:</strong> ${forecast.wind.speed} m/s</p>
        `;
    forecastDetails.appendChild(forecastDiv);
  }
}

var cities = JSON.parse(localStorage.getItem("cities")) || [];

function renderCities() {
  var historyContainer = document.getElementById("search-history");
  historyContainer.innerHTML = "";
  // Get the last 10 cities, or fewer if there aren't 10
  var recentCities = cities.slice(-10);
  recentCities.forEach(function(city) {
      var cityButton = document.createElement("button");
      cityButton.classList.add("hover:bg-gray-500"); 
      cityButton.innerText = city;
      cityButton.addEventListener("click", async () => {
          var weatherData = await getWeatherData(city);
          if (weatherData) {
              displayCurrentWeather(weatherData);
              displayForecast(weatherData);
          }
      });
      historyContainer.appendChild(cityButton);
  });
}

renderCities()


function saveCity(city) {
  if (!cities.includes(city) && city !== "") {
      cities.push(city);
      // If the number of cities exceeds 10, remove the oldest one
      if (cities.length > 10) {
          cities.shift();
      }
  }
  localStorage.setItem("cities", JSON.stringify(cities));
}

// Existing code for event listeners and other functionalities


// Function to save city to local storage
function saveCity(city) {
  if (!cities.includes(city)) {
    if (!cities.includes(city) && city !== "") {
    cities.push(city);
  }
  }
  localStorage.setItem("cities", JSON.stringify(cities));
}

document.getElementById("search-button").addEventListener("click", async () => {
  const city = document.getElementById("city-search").value;
  // saveCity(city);
  if (city) {
    const weatherData = await getWeatherData(city);
    if (weatherData) {
      displayCurrentWeather(weatherData);
      displayForecast(weatherData);
      renderCities ()
    }
  }
});

// Call the function on page load for a default city
getWeatherData("New York").then((data) => {
  displayCurrentWeather(data);
  displayForecast(data);
});

let resizer = document.querySelector("#resizer");
let sidebar = document.querySelector("#sidebar");

function initResizerFn(resizer, sidebar) {
  let x, w;

  function rs_mousedownHandler(e) {
    x = e.clientX;

    let sbWidth = window.getComputedStyle(sidebar).width;
    w = parseInt(sbWidth, 10);
    console.log(w);
    document.addEventListener("mousemove", rs_mousemoveHandler);
    document.addEventListener("mouseup", rs_mouseupHandler);
  }

  function rs_mousemoveHandler(e) {
    let dx = e.clientX - x;

    let cw = w + dx; // complete width

    if (cw < 700) {
      sidebar.style.width = `${cw}px`;
    }
    if (cw < 100) {
      sidebar.style.padding = "2px";
    }
  }

  function rs_mouseupHandler() {
    document.removeEventListener("mouseup", rs_mouseupHandler);
    document.removeEventListener("mousemove", rs_mousemoveHandler);
  }

  resizer.addEventListener("mousedown", rs_mousedownHandler);
}

initResizerFn(resizer, sidebar);
var eventsContainer = document.querySelector("#city-events")
function getEvents(city) {
  eventsContainer.innerHTML = "";


fetch(`https://app.ticketmaster.com/discovery/v2/events.json?apikey=DUbE0pWu87RRFKOlSwvlBBXJGN6tYQDU&city=${city}`)

.then(function(res){
  return res.json()
})

.then(function(data) {
  console.log(data)
  data._embedded.events.forEach(function(event){
    var dateTimeString = event.dates.start.dateTime
    const dateTime = new Date(dateTimeString);


const formattedDate = new Intl.DateTimeFormat('en-US', {
year: 'numeric',
month: 'long',
day: 'numeric',
timeZone: 'America/New_York' 
}).format(dateTime);
    eventsContainer.innerHTML += `
    <div class="bg-white p-6 rounded-lg shadow-md">
<a href="${event.url}" " class="no-underline text-black flex flex-col justify-between h-full">
<h3 class="text-lg font-semibold mb-4">${
event.name

}</h3>
<p> 
${formattedDate}
</p>
<img src="${event.images[0].url}" alt="${
event.name

}" class="w-full rounded-md">
</a>
</div>
    `
  }) 
})
}
function clearHistory() {
  cities = []; // Clear the cities array
  localStorage.setItem("cities", JSON.stringify(cities)); // Update localStorage
  renderCities(); // Re-render the cities list
}