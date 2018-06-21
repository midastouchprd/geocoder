//array of addresses
const addresses = require('./data.js');
const axios = require('axios');
const fs = require('fs');
const key = require('./key.js');
let counter = 0;

async function geocode(adresses, i) {
  console.log(i);
  let str = `https://maps.googleapis.com/maps/api/geocode/json?address=${
    adresses[i]
  }&key=${key}`;
  let results = await axios.get(str).catch(err => {
    console.log(err, 'AXIOS ERROR');
  });
  parseData(results.data.results, adresses[i]);
  if (counter < 100 ** counter < adresses.length) {
    counter++;
    geocode(adresses, counter);
  }
}

function parseData(data, string) {
  if (data[0]) {
    let { lng, lat } = data[0].geometry.location;
    let str = `${lng}, ${lat}`;
    fs.appendFileSync('results.json', `\n${str} - (${string})`, err => {
      if (err) {
        console.log(err, 'API ERROR');
        fs.appendFileSync('results.json', `\nerr,err`, err => {
          if (err) {
            console.log(err, 'FILL SPACE ERR');
          }
        });
      }
    });
  } else {
    fs.appendFileSync('results.json', `\nerr,err`, err => {
      if (err) {
        console.log(err, 'NO DATA ERROR');
      }
    });
  }
}

geocode(addresses, counter);

module.exports = geocode;
