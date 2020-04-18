var $$ = Dom7;

var app = new Framework7({
  root: '#app', // App root element
  name: 'COVID-19 Tracker', // App name
  routes: routes,
});


fetch('https://pomber.github.io/covid19/timeseries.json').then(res => res.json()).then((covidData) => {
  initUI(covidData);
  initGlobalView(covidData);
}).catch(err => console.error(err));


var searchbar = app.searchbar.create({
  el: '.searchbar',
  searchContainer: '#countries-list',
  searchIn: '.item-title',
  on: {
    search(sb, query, previousQuery) {
      console.log(query, previousQuery);
    }
  }
});

function initUI(covidData) {
  let compressedCovidData = transformDataToArray(covidData);
  let countryList = document.querySelector("#countries-list");
  let orderByInfectionsButton = document.querySelector("#order-by-infections");
  let orderByDeathsButton = document.querySelector("#order-by-deaths");
  let orderByAlphabetButton = document.querySelector("#order-by-alphabet");
  sortDataByInfections(compressedCovidData, countryList, covidData);
  orderByInfectionsButton.addEventListener("click", function() {
    sortDataByInfections(compressedCovidData, countryList, covidData);
  });
  orderByDeathsButton.addEventListener("click", function() {
    sortDataByDeaths(compressedCovidData, countryList, covidData);
  });
  orderByAlphabetButton.addEventListener("click", function() {
    sortDataByAlphabet(compressedCovidData, countryList, covidData);
  });
}

function sortDataByInfections(compressedCovidData, countryList, covidData) {
  countryList.innerHTML = "";
  compressedCovidData.sort(function(a, b) {
    return parseFloat(a[1][a[1].length - 1].confirmed) - parseFloat(b[1][b[1].length - 1].confirmed);
  });
  compressedCovidData.reverse();
  initCountryView(compressedCovidData, countryList, covidData);
}

function sortDataByDeaths(compressedCovidData, countryList, covidData) {
  countryList.innerHTML = "";
  compressedCovidData.sort(function(a, b) {
    return parseFloat(a[1][a[1].length - 1].deaths) - parseFloat(b[1][b[1].length - 1].deaths);
  });
  compressedCovidData.reverse();
  initCountryView(compressedCovidData, countryList, covidData);
}

function sortDataByAlphabet(compressedCovidData, countryList, covidData) {
  countryList.innerHTML = "";
  compressedCovidData.sort(function(a, b) {
    var textA = a[0].toUpperCase();
    var textB = b[0].toUpperCase();
    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
  });
  console.log(compressedCovidData);
  initCountryView(compressedCovidData, countryList, covidData);
}

function initGlobalView(covidData) {
  console.log("enter");
  let globalInfectionsElement = document.querySelector("#global-infections");
  globalInfectionsElement.innerHTML = getAmountOfInfections(covidData);
}

function getAmountOfInfections(covidData) {
  let infections = 0;
  let countries = Object.keys(covidData);
  console.log(covidData, countries);
  for (var i = 0; i < countries.length; i++) {
    console.log(covidData[countries[i]].length);
    console.log(covidData[countries[i]][covidData[countries[i]].length - 1]);
    infections += covidData[countries[i]][covidData[countries[i]].length - 1].confirmed;
  }
  return numberWithCommas(infections);
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}



function initCountryView(compressedCovidData, countryList, covidData) {
  let countries = [];
  for (var i = 0; i < compressedCovidData.length; i++) {
    countries.push(compressedCovidData[i][0]);
  }
  let lastUpdateElement = document.querySelector("#last-update").innerHTML = "Source: WHO" + " " + " " + "Last Update: " + covidData["Germany"][covidData[
      "Germany"].length -
    1
  ].date;
  for (var i = 0; i < countries.length; i++) {
    let numberOfInfections = covidData[countries[i]][covidData[countries[i]].length - 1].confirmed;
    let numberOfDeaths = covidData[countries[i]][covidData[countries[i]].length - 1].deaths;
    createElementForCountryStatistic(countries[i], numberOfDeaths, numberOfInfections, countryList);
  }
}

function transformDataToArray(covidData) {
  var compressedCovidData = [],
    obj;
  for (obj in covidData) {
    compressedCovidData.push([obj, covidData[obj]])
  }
  return compressedCovidData;
}

function createElementForCountryStatistic(country, deaths, infections, countryList) {
  console.log(country, deaths, infections);
  let elementString =
    '<li><a class="item-link item-content"><div class="item-inner"><div class="item-title-row"><div class="item-title"></div></div><div class="item-subtitle"></div><span id="votes" class="badge color-green"></span></div></a></li>';
  let countryElement = createElementFromString(elementString);
  countryElement.querySelector(".item-title").innerHTML = country;
  countryElement.querySelector(".badge").innerHTML = "Deaths: " + deaths;
  countryElement.querySelector(".item-subtitle").innerHTML = "Infections: " + infections;
  countryList.append(countryElement);
}


function createElementFromString(htmlString) {
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();
  return div.firstChild;
}
