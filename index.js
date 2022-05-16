const API_KEY = "6097562d-5f91-462b-b5e9-a941856f3fd4";
const button = document.querySelector("#position-button");
const locationlistElem = document.querySelector("#location-list");
const departureTimes = document.querySelector("#departure-times");

const API_TOKEN =
  "pk.eyJ1Ijoiam9oYW5raXZpIiwiYSI6ImNrcnl6M25xMDA4aWUyd3BqY3EzYnA1NTEifQ.ve5rEn8ZDwUGKvphMkEdpw";

const getLongLat = async (long, lat) => {
  const res = await fetch(
    `https://api.resrobot.se/v2.1/location.nearbystops?format=json&accessId=${API_KEY}&originCoordLat=${lat}&originCoordLong=${long}`
  );
  const data = await res.json();

  const locationList = data.stopLocationOrCoordLocation.map((item) => {
    return { name: item.StopLocation.name, id: item.StopLocation.extId };
  });

  console.log(locationList);

  printLocations(locationList);
};

function printLocations(locationList) {
  locationlistElem.innerHTML = locationList
    .map((item) => {
      return `<li onClick="getTimeTable(${item.id})">${item.name}</li>`;
    })
    .join("");
}

async function getTimeTable(id) {
  const res = await fetch(
    `https://api.resrobot.se/v2.1/departureBoard?id=${id}&format=json&accessId=${API_KEY}`
  );
  const data = await res.json();

  let newList = [];

  for (let i = 0; i < 10; i++) {
    newList.push(data.Departure[i].time);
  }

  departureTimes.innerHTML = newList
    .map((item) => {
      return `<li>${item}</li>`;
    })
    .join("");
}

button.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((pos) => {
      const long = pos.coords.longitude;
      const lat = pos.coords.latitude;

      getLongLat(long, lat);
    });
  }
});
