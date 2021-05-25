export const createListMarkup = (parent = document.querySelector('.data')) => {
  const list = document.createElement("div"),
    listSearch = document.createElement("input"),
    listHeader = document.createElement("div"),
    listSettings = document.createElement("button"),
    listUl = document.createElement("ul");

  list.className = "list";
  listSearch.className = "list__search";
  listHeader.className = "list__header";
  listSettings.className = "list__settings";
  listUl.className = "list__ul";

  listSearch.setAttribute("type", "text");

  listHeader.append(listSearch);
  listHeader.append(listSettings);
  list.append(listHeader);
  list.append(listUl);
  parent.append(list);

  createSettings();
};

const createULElement = (countryName, countryFlag, stats) => {
  const listUl = document.querySelector(".list__ul");

  const liElement = document.createElement("li"),
    liImage = document.createElement("img"),
    liName = document.createElement("div"),
    liStats = document.createElement("div");

  liElement.className = "list__li";
  liImage.className = "list__li-image";
  liName.className = "list__li-name";
  liStats.className = "list__li-stats";
  liElement.setAttribute('country',countryName);

  liName.innerText = countryName;
  liStats.innerText = stats;
  liImage.setAttribute("src", countryFlag);

  liElement.append(liImage);
  liElement.append(liName);
  liElement.append(liStats);
  listUl.append(liElement);
};

const createSettings = () => {
  const list = document.querySelector(".list");
  const settings = document.createElement("div"),
    radios = document.createElement("div"),
    radioTotal = document.createElement("input"),
    radioDeaths = document.createElement("input"),
    radioRecovered = document.createElement("input"),
    radioTextTotal = document.createElement("label"),
    radioTextDeaths = document.createElement("label"),
    radioTextRecovered = document.createElement("label");

  settings.className = "list-settings --hide";
  radios.className = "list-settings__radios";
  radioTotal.className = "list-settings__radios-total";
  radioDeaths.className = "list-settings__radios-deaths";
  radioRecovered.className = "list-settings__radios-recovered";

  radioTotal.setAttribute("type", "radio");
  radioDeaths.setAttribute("type", "radio");
  radioRecovered.setAttribute("type", "radio");

  radioTotal.setAttribute("name", "list-radio");
  radioDeaths.setAttribute("name", "list-radio");
  radioRecovered.setAttribute("name", "list-radio");

  radioTotal.setAttribute("value", "TotalConfirmed");
  radioDeaths.setAttribute("value", "TotalDeaths");
  radioRecovered.setAttribute("value", "TotalRecovered");
  radioTotal.checked = true;

  // radioTotal.innerHTML = "Total confirmed<br>"
  // radioDeaths.innerHTML = "Total deaths<br>"
  // radioRecovered.innerHTML = "Total recovered<br>"

  radios.append(radioTotal);
  radioTextTotal.innerHTML = "Total confirmed<br>";
  radios.append(radioTextTotal);

  radios.append(radioDeaths);
  radioTextDeaths.innerHTML = "Total deaths<br>";
  radios.append(radioTextDeaths);

  radios.append(radioRecovered);
  radioTextRecovered.innerHTML = "Total recovered<br>";
  radios.append(radioTextRecovered);

  settings.append(radios);
  list.append(settings);
};

export const putUlElements = (flags, countries, stat) => {
  countries.forEach((el) => {
    let flagOfCountry = flags.find(
      (flag) => flag.alpha2Code === el.CountryCode
    );
    if (flagOfCountry !== undefined) {
      createULElement(el.Country, flagOfCountry.flag, el[stat]);
    } else {
      createULElement(
        el.Country,
        "https://img.icons8.com/flat_round/2x/error.png",
        el[stat]
      );
    }
  });
};

export const inputEvent = (func) => {
  const listInput = document.querySelector(".list__search");
  listInput.addEventListener("input", func);
};

export const radioChangeEvent = (func) => {
  const radios = document.querySelectorAll('[name="list-radio"]');
  radios.forEach((radio) => radio.addEventListener("change", func));
};

export const sortByStats = (countries, stat) => {
  return countries.sort((a, b) => b[stat] - a[stat]);
};

export const getSelectedStat = () => {
  const radios = document.querySelectorAll('[name="list-radio"]');
  return Array.from(radios).find((el) => el.checked).value;
};

export const reloadSortedList = (flags, countries) => {
  const reg = new RegExp(
    `^${document.querySelector(".list__search").value.toLowerCase()}`
  );
  document.querySelector(".list__ul").innerHTML = "";
  putUlElements(
    flags,
    sortByStats(
      countries.Countries.filter((country) =>
        reg.test(country.Country.toLowerCase())
      ),
      getSelectedStat()
    ),
    getSelectedStat()
  );
};



export const settingsClickEvent = () => {
  const settings = document.querySelector(".list__settings");
  const settingsWindow = document.querySelector(".list-settings");
  settings.addEventListener("click", () => {
    settingsWindow.classList.toggle("--hide");
  });
};

