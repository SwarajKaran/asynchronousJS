'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');
///////////////////////////////////////

const renderCountry = function (data, className = '') {
  const html = `
  <article class="country ${className}">
    <img class="country__img" src="${data.flag}" />
    <div class="country__data">
      <h3 class="country__name">${data.name}</h3>
      <h4 class="country__region">${data.region}</h4>
      <p class="country__row"><span>👫</span>${(
        +data.population / 1000000
      ).toFixed(1)} mil people</p>
      <p class="country__row"><span>🗣️</span>${data.languages[0].name}<p>
      <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
    </div>
  </article>
  `;
  countriesContainer.insertAdjacentHTML('beforeend', html);
  console.log(html);
  // countriesContainer.style.opacity = 1; // added in finally
};
const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
  // countriesContainer.style.opacity = 1; // added in finally
};
/*
const getCountryAndNeighbour = function (country) {
  const request = new XMLHttpRequest(); //old school AJAX call
  // AJAX call country 1
  request.open('GET', `https://restcountries.com/v2/name/${country}`);
  request.send();
  request.addEventListener('load', function () {
    // console.log(JSON.parse(this.responseText));
    // For 'india', API return 2 country - British Indian Terretory and India
    const [data] = [...JSON.parse(this.responseText)].slice(-1); //
    console.log(data);
    // Render country 1
    renderCountry(data);
    //get neighbour country
    const neighbour = data.borders?.[0];
    if (!neighbour) return; // countries with no borders
    // AJAX call country 2
    const request2 = new XMLHttpRequest();
    request2.open('GET', `https://restcountries.com/v2/alpha/${neighbour}`);
    request2.send();
    request2.addEventListener('load', function () {
      const data2 = JSON.parse(this.responseText);
      renderCountry(data2, 'neighbour');
    });
  });
};
getCountryAndNeighbour('usa');
*/

// request.open('GET', `https://restcountries.com/v2/name/${country}`);
// request.send();

// PROMISE

// const request = fetch(`https://restcountries.com/v2/name/usa`);
// console.log(request);

// const getCountryData = function (country) {
//   fetch(`https://restcountries.com/v2/name/${country}`)
//     .then(function (response) {
//       console.log(response);
//       return response.json();
//     })
//     .then(function (data) {
//       console.log(data);
//       renderCountry(data[0]);
//     });
// };

const getCountryData = function (country) {
  fetch(`https://restcountries.com/v2/name/${country}`)
    .then(
      response => response.json()
      // ,err => alert(err)
    )
    .then(data => {
      renderCountry(data[0]);
      const neighbour = data[0]?.borders[0];
      if (!neighbour) return;

      //Country 2
      return fetch(`https://restcountries.com/v2/alpha/${neighbour}`);
    })
    .then(
      response => response.json()
      // ,err => alert(err)
    )
    .then(data => renderCountry(data, 'neighbour')) // when promise is fulfilled
    .catch(err => {
      // when promise is rejected
      console.error(`${err}`);
      renderError(`Something went wrong ${err.message}. Try again!`);
    })
    .finally(() => {
      // always be called no matter promise is rejected or fulfilled
      countriesContainer.style.opacity = 1;
    });
};
btn.addEventListener('click', function () {
  getCountryData('indonesia');
});
getCountryData('usfdggf'); // catch will not handle 404 errors
