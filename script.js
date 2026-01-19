const apiKey = "f87babe29f50029def9ad3c422112b8c";
let map;

if (localStorage.getItem("dark") === "yes") {
    document.body.classList.add("dark");
}

function toggleDarkMode() {
    document.body.classList.toggle("dark");
    localStorage.setItem("dark",
        document.body.classList.contains("dark") ? "yes" : "no"
    );
}

function getWeather() {
    const city = document.getElementById("cityInput").value.trim();
    if (!city) return alert("Enter city name");

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`)
        .then(res => res.json())
        .then(data => {
            if (data.cod !== 200) {
                alert(data.message);
                return;
            }

            document.getElementById("weatherCard").classList.remove("hidden");

            document.getElementById("cityName").innerText = data.name + ", " + data.sys.country;
            document.getElementById("temperature").innerText = data.main.temp + " °C";
            document.getElementById("description").innerText = data.weather[0].description;
            document.getElementById("humidity").innerText = data.main.humidity + "%";
            document.getElementById("wind").innerText = data.wind.speed + " km/h";
            document.getElementById("feels").innerText = data.main.feels_like + " °C";
            document.getElementById("clouds").innerText = data.clouds.all + "%";

            document.getElementById("weatherIcon").src =
                `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

            loadMap(data.coord.lat, data.coord.lon, data.name);
        });
}

function loadMap(lat, lon, city) {
    if (map) map.remove();

    map = L.map("map").setView([lat, lon], 10);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap"
    }).addTo(map);

    L.marker([lat, lon]).addTo(map)
        .bindPopup(city)
        .openPopup();
}

