const button = document.querySelector("#search-button");
const card = document.querySelector("#card");
const input = document.querySelector("#search-bar");
const icon = document.querySelector("#weather_icon");
const weath = document.querySelector("#weath");
const area = document.querySelector("#area");
const theme = document.querySelector("#theme");
const body = document.querySelector("body");



const themeClasses = ["morning", "afternoon", "evening", "night"];

function setTimeBasedTheme(hour) {
  let currentTheme;

  if (hour >= 5 && hour < 10) {
    currentTheme = "morning";
    body.classList.add("lighttheme");
    theme.innerHTML = '<i class="fa-solid fa-moon"></i>';
    theme.style.color = "black";
    theme.style.backgroundColor = "white";
     theme.style.padding = "15px 20.5px";
   } else if (hour >= 10 && hour < 16) {
    currentTheme = "afternoon";
     body.classList.add("lighttheme");
    theme.innerHTML = '<i class="fa-solid fa-moon"></i>';
    theme.style.color = "black";
    theme.style.backgroundColor = "white";
     theme.style.padding = "15px 20.5px"; 
  } else if (hour >= 16 && hour < 20) {
    currentTheme = "evening";
    body.classList.remove ("lighttheme"); 
    theme.innerHTML = '<i class="fa-solid fa-sun"></i>';
    theme.style.color = "white";
    theme.style.backgroundColor = "black"; 
    theme.style.padding = "15px 16.5px"  
  } else {
    currentTheme = "night";
    body.classList.remove("lighttheme"); 
    theme.innerHTML = '<i class="fa-solid fa-sun"></i>';
    theme.style.color = "white";
    theme.style.backgroundColor = "black"; 
    theme.style.padding = "15px 16.5px"
  }

  card.classList.remove(...themeClasses);
  card.classList.add(currentTheme);
}


const now = new Date();
const currentHour = now.getHours();
setTimeBasedTheme(currentHour);

async function getData(cityName) {
  const promise = await fetch(
    `http://api.weatherapi.com/v1/current.json?key=bc3dee1022b949b2a5f121559252105&q=${cityName}&aqi=yes`
  );
  return await promise.json();
}

async function fetchWeather() {
  const value = input.value;
  if (!value) return;

  const result = await getData(value);
  console.log(result);
  area.innerText = `${result.location.name}, ${result.location.region}, ${result.location.country}`;
  area.style.textTransform = "capitalize";
  area.style.opacity = "0.75";

  const cloud = result.current.cloud;
  const precip = result.current.precip_mm;
  const humid = result.current.humidity;
  const visib = result.current.vis_km;
  const wind = result.current.wind_kph;
  const gust = result.current.gust_kph;
  const phase = result.current.is_day;
  const temp = result.current.temp_c;
  const uv = result.current.uv;

  if (cloud < 20 && precip === 0 && phase === 1) {
    icon.innerHTML = `<img src="weather_icons/morning/sunny.png">`;
    weath.innerText = `Sunny || ${temp}°C`;
    card.classList.remove(...themeClasses);
    card.classList.add("morning");
  } else if (cloud < 20 && precip === 0 && phase === 0) {
    icon.innerHTML = `<img src="weather_icons/night/nightmoon.png">`;
    weath.innerText = `Clear || ${temp}°C`;
    card.classList.remove(...themeClasses);
    card.classList.add("night");
  } else if (cloud >= 20 && cloud <= 60 && precip === 0 && phase === 1 && uv >= 3 && uv <= 6) {
    icon.innerHTML = `<img src="weather_icons/morning/partialy.png">`;
    weath.innerText = `Partly Cloudy || ${temp}°C`;
    card.classList.remove(...themeClasses);
    card.classList.add("afternoon");
  } else if (cloud >= 20 && cloud <= 60 && precip === 0 && phase === 0) {
    icon.innerHTML = `<img src="weather_icons/night/cloudymoon.png">`;
    weath.innerText = `Partly Cloudy || ${temp}°C`;
    card.classList.remove(...themeClasses);
    card.classList.add("night");
  } else if (cloud > 60 && precip === 0 && visib > 5) {
    icon.innerHTML = `<img src="weather_icons/cloudy.png">`;
    weath.innerText = `Cloudy || ${temp}°C`;
    card.classList.remove(...themeClasses);
    card.classList.add(phase == 1 ? "afternoon" : "night");
  } else if (precip > 0.1 && cloud > 50) {
    icon.innerHTML = `<img src="weather_icons/rainy.png">`;
    weath.innerText = `Raining || ${temp}°C`;
    card.classList.remove(...themeClasses);
    card.classList.add(phase == 1 ? "afternoon" : "night");
  } else if (precip > 2 && cloud > 70 && wind > 30 && humid > 80) {
    icon.innerHTML = `<img src="weather_icons/stormy.png">`;
    weath.innerText = `Stormy || ${temp}°C`;
    card.classList.remove(...themeClasses);
    card.classList.add(phase == 1 ? "afternoon" : "night");
  } else if (cloud >= 20 && visib < 6 && humid > 30) {
    icon.innerHTML = `<img src="weather_icons/foggymist.png">`;
    weath.innerText = `Mist || ${temp}°C`;
    card.classList.remove(...themeClasses);
    card.classList.add(phase == 1 ? "afternoon" : "night");
  } else if (wind > 30 && gust > 40) {
    icon.innerHTML = `<img src="weather_icons/windy.png">`;
    weath.innerText = `Windy || ${temp}°C`;
    card.classList.remove(...themeClasses);
    card.classList.add(phase == 1 ? "afternoon" : "night");
  }
}

button.addEventListener("click", fetchWeather);

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    fetchWeather();
  }
});

window.addEventListener("load", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      try {
     
        const result = await getData(`${lat},${lon}`);
        console.log("Auto-fetched weather data:", result);

        input.value = `${result.location.name}, ${result.location.region}`;
        
        fetchWeather();
      } catch (error) {
        console.error("Failed to fetch weather for current location:", error);
        
      }
    });
  } else {
    console.warn("Geolocation is not supported by this browser.");
  }
});

function themecha(){
  body.classList.toggle("lighttheme");
  if(theme.innerHTML === '<i class="fa-solid fa-moon"></i>') {
    theme.innerHTML = '<i class="fa-solid fa-sun"></i>';
    theme.style.color = "white";
    theme.style.backgroundColor = "black";
    theme.style.padding = "15px 16.5px"
  }else{
    theme.innerHTML = '<i class="fa-solid fa-moon"></i>'
    theme.style.color = "black";
    theme.style.backgroundColor = "white";
    theme.style.padding = "15px 20.5px"; 
  }
}