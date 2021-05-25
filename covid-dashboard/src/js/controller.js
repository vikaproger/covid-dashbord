import * as List from "./list.js";
import * as MapLeaflet from "./map.js";

let countriesData, covidData, geoData, map;

const fetchGeoData = async () => {
  geoData = await fetch(
    "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/World_Countries_%28Generalized%29/FeatureServer/0/query?where=1%3D1&outFields=FID,COUNTRY,ISO,COUNTRYAFF,AFF_ISO&outSR=4326&f=json"
  ).then((data) => data.json());
};

const fetchCovidData = async () => {
  covidData = await fetch("https://api.covid19api.com/summary").then((data) =>
    data.json()
  );
};

const fetchCountriesData = async () => {
  countriesData = await fetch(
    "https://restcountries.eu/rest/v2/all?fields=name;latlng;alpha2Code;flag;"
  ).then((data) => data.json());
};

const createCurrentDate = (covid, parent = document.querySelector('.box1')) => {
  const date = document.createElement("div");
  date.className = "date";
  date.innerText = `Date: ${covid.Date.split("T")[0]}`;
  parent.prepend(date);
};

const makeMap = async () => {
  await fetchCovidData();
  await fetchCountriesData();
  map = await MapLeaflet.createMapObj();
  map.addLayer(MapLeaflet.createMapLayer());
  await fetchGeoData();
  MapLeaflet.createBoundariesLayer(geoData, map, covidData);
  let circlesLayer = MapLeaflet.createCirclesLayer(
    covidData,
    countriesData,
    "TotalConfirmed",
    0.1,
    map
  );
  circlesLayer.addTo(map);
  MapLeaflet.radioChangeEventMap(() => {
    map.removeLayer(circlesLayer);
    circlesLayer = MapLeaflet.createCirclesLayer(
      covidData,
      countriesData,
      MapLeaflet.getSelectedStat(),
      0.1,
      map
    );
    circlesLayer.addTo(map);
  });

  List.putUlElements(
    countriesData,
    List.sortByStats(covidData.Countries, List.getSelectedStat()),
    List.getSelectedStat()
  );
  List.inputEvent(() => {
    List.reloadSortedList(countriesData, covidData);
    const list = document.querySelectorAll(".list__li");
    list.forEach((el) => {
      const countryCode = covidData.Countries.find(
        (country) => country.Country === el.getAttribute("country")
      ).CountryCode;
      const latlng = countriesData.find(
        (country) => country.alpha2Code === countryCode
      ).latlng;
      el.addEventListener("click", () => {
        MapLeaflet.focusByCoords(latlng, map);
      });
    });
  });
  List.radioChangeEvent(() => List.reloadSortedList(countriesData, covidData));
  List.settingsClickEvent();

  const list = document.querySelectorAll(".list__li");
  list.forEach((el) => {
    const countryCode = covidData.Countries.find(
      (country) => country.Country === el.getAttribute("country")
    ).CountryCode;
    const latlng = countriesData.find(
      (country) => country.alpha2Code === countryCode
    ).latlng;
    el.addEventListener("click", () => {
      MapLeaflet.focusByCoords(latlng, map);
    });
  });

  createCurrentDate(covidData);
};

List.createListMarkup();
MapLeaflet.createMapMarkup();
makeMap();
