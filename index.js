// Global variables
const API_KEY = "6097562d-5f91-462b-b5e9-a941856f3fd4";
const button = document.querySelector("#position-button");
const locationlistElem = document.querySelector("#location-list");
const departureTimes = document.querySelector("#departure-times");
const cardOverlay = document.querySelector("#times-overlay");

const API_TOKEN =
  "pk.eyJ1Ijoiam9oYW5raXZpIiwiYSI6ImNrcnl6M25xMDA4aWUyd3BqY3EzYnA1NTEifQ.ve5rEn8ZDwUGKvphMkEdpw";

// Gets my current location
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((pos) => {
      const long = pos.coords.longitude;
      const lat = pos.coords.latitude;

      // Calls getLongLat with my current coordinates
      getLongLat(long, lat);
    });
  }
}

// Fetching for nearby bus-stops
const getLongLat = async (long, lat) => {
  const res = await fetch(
    `https://api.resrobot.se/v2.1/location.nearbystops?format=json&accessId=${API_KEY}&originCoordLat=${lat}&originCoordLong=${long}`
  );
  const data = await res.json();

  // Getting just the id and name of the stop
  const locationList = data.stopLocationOrCoordLocation.map((item) => {
    return { name: item.StopLocation.name, id: item.StopLocation.extId };
  });

  console.log(locationList);

  // Calls to print out the locations
  printLocations(locationList);
};

function printLocations(locationList) {
  locationlistElem.innerHTML = locationList
    .map((item) => {
      return `<li onClick="getTimeTable(${item.id})">${item.name.replace(
        " (Göteborg kn)",
        ""
      )}</li>`;
    })
    .join("");
}

// Fetching the times and stop location from API
async function getTimeTable(id) {
  // Fetching with specific ID
  const res = await fetch(
    `https://api.resrobot.se/v2.1/departureBoard?id=${id}&format=json&accessId=${API_KEY}`
  );
  const data = await res.json();

  // Opens time-modal
  cardOverlay.style.display = "flex";

  let newList = [];

  // Only getting the first 10 times from bus-stop
  for (let i = 0; i < 10; i++) {
    newList.push({
      time: data.Departure[i].time.substring(0, 5),
      name: data.Departure[i].name.replace("Länstrafik - ", ""),
      direction: data.Departure[i].direction.replace(" (Göteborg kn)", ""),
    });
  }

  console.log(newList);

  // Writes out the Bus, last stop and departure time
  departureTimes.innerHTML = newList
    .map((item) => {
      return `<li>${item.name} mot ${item.direction}, ${item.time}</li>`;
    })
    .join("");
}

// Closes the modal when "gray-area" is clicked
function closeModal(e) {
  if (e.target == e.currentTarget) {
    cardOverlay.style.display = "none";
  }
}

// Makes sure website is fully loaded before any events happens
window.addEventListener("load", () => {
  // gets your current location
  button.addEventListener("click", getLocation);
  // closes the time-modal
  cardOverlay.addEventListener("click", closeModal);
});
