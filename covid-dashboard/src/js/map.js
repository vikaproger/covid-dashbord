import L from './leaflet.js'
export const createMapMarkup = (parent = document.querySelector('.graphics_map')) => {
  const mapContainer = document.createElement("div"),
    mapPopup = document.createElement("div"),
    popupCountry = document.createElement("h3"),
    popupTotal = document.createElement("h3"),
    popupDeaths = document.createElement("h3"),
    popupRecovered = document.createElement("h3"),
    mapBar = document.createElement("div");

  mapContainer.id = "map";
  mapBar.classList = "map__bar";
  mapPopup.className = "map__popup --hide";
  popupCountry.className = "popup__country";
  popupTotal.className = "popup__total";
  popupDeaths.className = "popup__deaths";
  popupRecovered.className = "popup__recovered";

  mapPopup.append(popupCountry);
  mapPopup.append(popupTotal);
  mapPopup.append(popupDeaths);
  mapPopup.append(popupRecovered);
  mapBar.append(mapPopup);
  mapContainer.prepend(mapBar);
  parent.append(mapContainer);
createMapLegend();
  createSettings();
};

const createSettings = () => {
  const map = document.querySelector(".map__bar");
  const settings = document.createElement("div"),
    radios = document.createElement("div"),
    radioTotal = document.createElement("input"),
    radioDeaths = document.createElement("input"),
    radioRecovered = document.createElement("input"),
    radioTextTotal = document.createElement("label"),
    radioTextDeaths = document.createElement("label"),
    radioTextRecovered = document.createElement("label");

  radios.className = "map-settings__radios";
  radioTotal.className = "map-settings__radios-total";
  radioDeaths.className = "map-settings__radios-deaths";
  radioRecovered.className = "map-settings__radios-recovered";

  radioTotal.setAttribute("type", "radio");
  radioDeaths.setAttribute("type", "radio");
  radioRecovered.setAttribute("type", "radio");

  radioTotal.setAttribute("name", "map-radio");
  radioDeaths.setAttribute("name", "map-radio");
  radioRecovered.setAttribute("name", "map-radio");

  radioTotal.setAttribute("value", "TotalConfirmed");
  radioDeaths.setAttribute("value", "TotalDeaths");
  radioRecovered.setAttribute("value", "TotalRecovered");
  radioTotal.checked = true;

  radios.append(radioTotal);
  radioTextTotal.innerHTML = "Total confirmed<br>";
  radios.append(radioTextTotal);

  radios.append(radioDeaths);
  radioTextDeaths.innerHTML = "Total deaths<br>";
  radios.append(radioTextDeaths);

  radios.append(radioRecovered);
  radioTextRecovered.innerHTML = "Total recovered<br>";
  radios.append(radioTextRecovered);

  map.append(radios);
};

const createMapLegend = ()=>{
  const map = document.querySelector(".map__bar");
  const legend =  document.createElement("div")
  legend.className = 'map__legend'
  for(let i =0;i<5;i++){
    const container =  document.createElement("div");
    const point =  document.createElement("div");
    const text =  document.createElement("div");

    container.className = `legend__container`;
    point.className = `legend__point${i}`;
    text.className = `legend__text${i}`;

    container.append(point);
    container.append(text);
    legend.append(container)
  }
  map.append(legend);
  document.querySelector(".legend__text0").innerText = '-Country boundaries';
  document.querySelector(".legend__text1").innerText = '-Country stats range';
  document.querySelector(".legend__text2").innerText = '-Country selected';
  document.querySelector(".legend__text3").innerText = '-Terrain';
  document.querySelector(".legend__text4").innerText = '-Water';
}

export const radioChangeEventMap = (func) => {
  const radios = document.querySelectorAll('[name="map-radio"]');
  radios.forEach((radio) => radio.addEventListener("change", func));
};

export const getSelectedStat = () => {
  const radios = document.querySelectorAll('[name="map-radio"]');
  return Array.from(radios).find((el) => el.checked).value;
};

const createMapOptions = () => {
  return {
    center: [27, 30],
    zoom: 2,
  };
};

export const createMapObj = () => {
  return new L.map("map", createMapOptions());
};

export const createMapLayer = () => {
  return new L.TileLayer(
    "https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
  );
};

export const focusByCoords = (coords,map)=>{
  map.setView(coords,5);
}

const createCircle = (coordinates, rad) => {
  const circleOptions = {
    color: "red",
    fillColor: "#f03",
    fillOpacity: 0.6,
  };
  return L.circle(coordinates, rad, circleOptions);
};

export const createCirclesLayer = (countries,coordinatesOfCountries, stats, scale,map) => {
  const circles = [];
  countries.Countries.forEach((country) => {
   const coordinates = coordinatesOfCountries.find(
      (coords) => coords.alpha2Code === country.CountryCode
    );
    if (coordinates !== undefined) {
      if (country.TotalConfirmed > 10) {
        const circle = createCircle(coordinates.latlng, country[stats] * scale);
        circle.bindPopup(
          "Country: " +
            country.Country +
            "<br>" +
            "Statistics: " +
            country[stats]
        );
        circles.push(circle);
      }
    }
  });
  return L.layerGroup(circles);
};

const createBoundary = (latlng) => {
  return L.multiPolygon(latlng, {
    color: "red",
    fillColor: "black",
    fillOpacity: 0,
    weight: 1,
  });
};

export const createBoundariesLayer = (geo, parent, stats) => {
  const popup = document.querySelector(".map__popup");
  geo.features.forEach((coordinates) => {
    const name = getCountryName(coordinates);
    const statsOfCountry = stats.Countries.find(el=>el.CountryCode===name);
    const currentBoundary = createBoundary(fixCoordinates(coordinates));
    currentBoundary.on("mouseover", () => {
      currentBoundary.setStyle({
        color: "white",
        fillColor: "white",
        fillOpacity: 0.2,
        weight: 1,
      });
      popup.classList.toggle("--hide");
      addStatsToPopup(statsOfCountry);
    });
    currentBoundary.on("mouseout", () => {
      currentBoundary.setStyle({
        color: "red",
        fillColor: "black",
        fillOpacity: 0,
        weight: 1,
      });
      clearStatsOfPopup();
      popup.classList.toggle("--hide");
    });
    currentBoundary.addTo(parent);
  });
};

const addStatsToPopup = (stats) => {
  console.log(stats);
  document.querySelector(
    ".popup__country"
  ).innerText = `Country: ${stats.Country}`;
  document.querySelector(
    ".popup__total"
  ).innerText = `Total confirmed: ${stats.TotalConfirmed}`;
  document.querySelector(
    ".popup__deaths"
  ).innerText = `Total deaths: ${stats.TotalDeaths}`;
  document.querySelector(
    ".popup__recovered"
  ).innerText = `Total recovered: ${stats.TotalRecovered}`;
};

const clearStatsOfPopup = () => {
  document.querySelector(".popup__country").innerText = "";
  document.querySelector(".popup__total").innerText = "";
  document.querySelector(".popup__deaths").innerText = "";
  document.querySelector(".popup__recovered").innerText = "";
};

const fixCoordinates = (coords) => {
  return coords.geometry.rings.map((el) => el.map((alt) => alt.reverse()));
};

const getCountryName = (coords)=>{
  return coords.attributes.ISO;
}




