'use strict';

const apiKey = '7qbplhFxRRU8i1mZr5JTbeaBoQRm2ZcWwZ7mtUBv'; 
const searchURL = 'https://developer.nps.gov/api/v1/parks';


function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function addressFormat(addresses){
    for (let i = 0; i < addresses.length; i++){
        if (addresses[i].type === "Physical"){
            let address =  `${addresses[i].line1}, ${addresses[i].city}, ${addresses[i].stateCode} ${addresses[i].postalCode} `;
            return address;
        }
    }
}

function displayResults(responseJson) {
  console.log(responseJson);
  $('#results-list').empty();
    
    for (let i = 0; i < responseJson.data.length; i++){
    $('#results-list').append(
      `<li><h3>${responseJson.data[i].fullName}</h3>
      <p>${addressFormat(responseJson.data[i].addresses)}</p>
      <p>${responseJson.data[i].description}</p>
      <a href='${responseJson.data[i].url}'>URL</a>
      </li>`
    )};
  //display the results section  
  $('#results').removeClass('hidden');
};

function getNPSInfo(state, maxResults=10) {
  const params = {
    api_key: apiKey,
    stateCode: state,
    limit: maxResults-1,
    start: 1,
    fields: 'addresses'
  };
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;

  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const state = $('#js-search-term').val();
    const results = $('#js-max-results').val();
    let maxResults = parseInt(results);
    getNPSInfo(state, maxResults);
  });
}

$(watchForm);