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
/*
const getJSON = function (url, errorMsg = `Something went wrong`) {
  return fetch(url).then(
    response => {
      if (!response.ok) throw new Error(`${errorMsg}(${response.status})`);
      return response.json();
    }
    // ,err => alert(err)
  );
};
// const getCountryData = function (country) {
//   fetch(`https://restcountries.com/v2/name/${country}`)
//     .then(
//       response => {
//         console.log(response);
//         if (!response.ok)
//           throw new Error(`Country not found(${response.status})`);
//         return response.json();
//       }
//       // ,err => alert(err)
//     )
//     .then(data => {
//       renderCountry(data[0]);

//       const neighbour = 'wrrf'; //data[0]?.borders[0];
//       if (!neighbour) return;

//       //Country 2
//       return fetch(`https://restcountries.com/v2/alpha/${neighbour}`);
//     })
//     .then(
//       response => {
//         if (!response.ok)
//           throw new Error(`Country not found(${response.status})`);
//         return response.json();
//       }
//       // ,err => alert(err)
//     )
//     .then(data => renderCountry(data, 'neighbour')) // when promise is fulfilled
//     .catch(err => {
//       // when promise is rejected
//       console.error(`${err}`);
//       renderError(`Something went wrong ${err.message}. Try again!`);
//     })
//     .finally(() => {
//       // always be called no matter promise is rejected or fulfilled
//       countriesContainer.style.opacity = 1;
//     });
// };

const getCountryData = function (country) {
  getJSON(`https://restcountries.com/v2/name/${country}`, 'Country not found')
    .then(data => {
      renderCountry(data[0]);
      if (!data[0]?.borders) throw new Error('No neighbour found');
      const neighbour = data[0]?.borders[0];
      console.log(neighbour);

      //Country 2
      return getJSON(
        `https://restcountries.com/v2/alpha/${neighbour}`,
        'Country not found'
      );
    })
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
getCountryData('australia'); // catch will not handle 404 errors
*/

///////////////////////////////////////
// Coding Challenge #1

/* 
In this challenge you will build a function 'whereAmI' which renders a country ONLY based on GPS coordinates. For that, you will use a second API to geocode coordinates.

Here are your tasks:

PART 1
1. Create a function 'whereAmI' which takes as inputs a latitude value (lat) and a longitude value (lng) (these are GPS coordinates, examples are below).
2. Do 'reverse geocoding' of the provided coordinates. Reverse geocoding means to convert coordinates to a meaningful location, like a city and country name. Use this API to do reverse geocoding: https://geocode.xyz/api.
The AJAX call will be done to a URL with this format: https://geocode.xyz/52.508,13.381?geoit=json. Use the fetch API and promises to get the data. Do NOT use the getJSON function we created, that is cheating 😉
3. Once you have the data, take a look at it in the console to see all the attributes that you recieved about the provided location. Then, using this data, log a messsage like this to the console: 'You are in Berlin, Germany'
4. Chain a .catch method to the end of the promise chain and log errors to the console
5. This API allows you to make only 3 requests per second. If you reload fast, you will get this error with code 403. This is an error with the request. Remember, fetch() does NOT reject the promise in this case. So create an error to reject the promise yourself, with a meaningful error message.

PART 2
6. Now it's time to use the received data to render a country. So take the relevant attribute from the geocoding API result, and plug it into the countries API that we have been using.
7. Render the country and catch any errors, just like we have done in the last lecture (you can even copy this code, no need to type the same code)

TEST COORDINATES 1: 52.508, 13.381 (Latitude, Longitude)
TEST COORDINATES 2: 19.037, 72.873
TEST COORDINATES 2: -33.933, 18.474

GOOD LUCK 😀


const whereAmI = function (lat, lng) {
  const url = `https://geocode.xyz/${lat},${lng}?json=1`;
  fetch(url)
    .then(response => {
      // console.log(response);
      return response.json();
    })
    .then(data => {
      console.log(data);
      if (data.error)
        throw new Error(`${data.error.description}(${data.error.code})`);
      console.log(`You are in ${data.city}, ${data.country}`);
      return fetch(`https://restcountries.com/v2/name/${data.country}`);
    })
    .then(response => response.json())
    .then(responseJSON => {
      const data = [...responseJSON.slice(-1)];
      console.log(data[0]);
      renderCountry(data[0]);
    })
    .catch(err => {
      console.error(err);
    })
    .finally(() => (countriesContainer.style.opacity = 1));
};
// whereAmI(17.4549679, 78.3500869);
whereAmI(52.508, 13.381);
whereAmI(19.037, 72.873);
whereAmI(-33.933, 18.474);


// Event Loop
console.log('Test start');
setTimeout(() => console.log('0 sec timer'), 0);
Promise.resolve('Result promise 1').then(res => console.log(res));

Promise.resolve('Resolve promise 2').then(res => {
  for (let i = 0; i < 2000000000; i++) {}
  console.log(res);
});
console.log('Test end');
*/

const lotteryPromise = new Promise(function (resolve, reject) {
  console.log('Lottery draw is happening');
  setTimeout(function () {
    if (Math.random() >= 0.5) {
      resolve('You WIN!!');
    } else {
      reject(new Error('You lost'));
    }
  }, 2000);
});
lotteryPromise.then(res => console.log(res)).catch(err => console.log(err));

// Promisifying setTimeout

const wait = function (seconds) {
  return new Promise(function (resolve) {
    setTimeout(resolve, seconds * 1000);
  });
};

wait(2)
  .then(() => {
    console.log('I waited for 2 seconds');
    return wait(1);
  })
  .then(() => console.log('I waited for 1 seconds'));

Promise.resolve('You win').then(x => console.log(x));
Promise.reject(new Error('You loose')).catch(err => console.log(err));

wait(1)
  .then(() => {
    console.log('1 sec passed');
    return wait(1);
  })
  .then(() => {
    console.log('2 sec passed');
    return wait(1);
  })
  .then(() => {
    console.log('3 sec passed');
    return wait(1);
  })
  .then(() => {
    return console.log('4 sec passed');
  });
