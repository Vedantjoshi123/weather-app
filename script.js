const userTab = document.querySelector(".yourWeatherTab");
const searchTab = document.querySelector(".searchWeaherTab");
const permissionContainer = document.querySelector(".grantLocationContainer");
const searchContainer = document.querySelector(".searchLocationContainer");
const loadingContainer = document.querySelector(".loadingSectionContainer");
const userWeatherContainer = document.querySelector(".yourWeatherContainer");

let currentTab = userTab;
currentTab.classList.add("btn-clicked");
const API_KEY = "f1254130a29fd429599d7892a93dc98b";
getFromSessionStorage();

function renderUserInfo(data){
    const cityName = document.querySelector(".cityName");
    const countryIcon = document.querySelector(".countryImg");
    const description = document.querySelector(".weatherDiscription");
    const weatherIcon = document.querySelector(".weatherIcon");
    const temperature = document.querySelector(".temp");
    const windspeedData = document.querySelector(".windspeedData");
    const humidityData = document.querySelector(".humidityData");
    const cloudData = document.querySelector(".cloudData");

    cityName.innerText = data?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    description.innerText = data?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${data?.weather?.[0].icon}.png`;
    const tempInCelsius = (data?.main?.temp - 273.15).toFixed(2);
    temperature.innerText = `${tempInCelsius} °C`;
    windspeedData.innerText = data?.wind?.speed;
    humidityData.innerText = data?.main?.humidity;
    cloudData.innerText = data?.clouds?.all;
}

async function fetchUserWeatherInfo(coordinates){
    const {lat, lon} = coordinates;
    permissionContainer.classList.remove("active");
    loadingContainer.classList.add("active");
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
        const data = await res.json();

        loadingContainer.classList.remove("active");
        userWeatherContainer.classList.add("active");
        renderUserInfo(data);

    } catch (error) {
        console.log("Error in fetchuserweather info");
        
        loadingContainer.classList.remove("active");
    }

}


function getFromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        permissionContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

function switchTab(clickedTab){
    if(currentTab != clickedTab){
        
        currentTab.classList.remove("btn-clicked");
        currentTab = clickedTab;
        currentTab.classList.add("btn-clicked");

        if(!searchContainer.classList.contains("active")){
            console.log(" search whether wale ko click kiya ");
            userWeatherContainer.classList.remove("active");
            permissionContainer.classList.remove("active");
            searchContainer.classList.add("active");
        }
        else{
            console.log(" your whether wale ko click kiya ");
            searchContainer.classList.remove("active");
            userWeatherContainer.classList.remove("active");
            getFromSessionStorage();
        }
    }
}

searchTab.addEventListener("click", ()=>{
    switchTab(searchTab);
});

userTab.addEventListener("click", ()=>{
    switchTab(userTab);
});

const grantLocationsBtn = document.querySelector(".grantLocationsBtn");

function showPosition(position){
    const coordinates ={
        lat : position.coords.latitude,
        lon : position.coords.longitude,
    } 
    sessionStorage.setItem("user-coordinates", JSON.stringify(coordinates));
    fetchUserWeatherInfo(coordinates);
}

function getLocation(){
    console.log("Generate pe click kiya");
    if(navigator.geolocation)  {
        navigator.geolocation.getCurrentPosition(showPosition);
        console.log("navigator successful");
    }  
    else{
        alert("No geolocation support");
    }

}

grantLocationsBtn.addEventListener("click", getLocation);

const searchInput = document.querySelector(".searchInput");

async function fetchSearchWeatherInfo(cityName) {
   loadingContainer.classList.add("active");
   userWeatherContainer.classList.remove("active");
   permissionContainer.classList.remove("active");
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`);
        const data = await res.json();

        loadingContainer.classList.remove("active");
        userWeatherContainer.classList.add("active");
        renderUserInfo(data);
    } catch (error) {
        console.log("Error in fetchSearchWeather info");
        loadingContainer.classList.remove("active");
    }
}

searchContainer.addEventListener("submit", (e)=>{
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName == ""){
        return;
    }
    else{
        fetchSearchWeatherInfo(cityName);
    }
});