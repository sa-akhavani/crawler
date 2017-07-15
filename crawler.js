'use strict';
const request = require('request');
const kaveNegar = require('kavenegar')

const kaveNegarConfigs = {
  "api_key": "XXX",
  "sender_number": "XXX"
};
var api = kaveNegar.KavenegarApi({
  apikey: kaveNegarConfigs.api_key
});

const path = 'https://search.digikala.com/api2/Data/Get?categoryId=0&ip=0';

function sendSms(message, recieverNumber) {
  api.Send({
    message: message,
    sender: kaveNegarConfigs.sender_number,
    receptor: recieverNumber
  }, function (response, status) {
    if (status === 200) {} else {}
  });
}

setInterval(function () {
  console.log('Fetching Data From Digikala Every One Minutes!');
  fetchIncredibleOffers(function (err, results) {
    if (err) {
      console.log(err);
      sendSms('ارور خورد', '09303211374');
    } else {
      results.forEach(function (product) {
        if (product._source.ShowTitle.indexOf('sony') > -1 || product._source.ShowTitle.indexOf('Sony') > -1 || product._source.ShowTitle.indexOf('PlayStation') > -1 || product._source.ShowTitle.indexOf('ps4') > -1 || product._source.ShowTitle.indexOf('Ps4') > -1 || product._source.ShowTitle.indexOf('PS4') > -1 || product._source.ShowTitle.indexOf('slim') > -1 || product._source.ShowTitle.indexOf('پلی استیشن') > -1) {
          console.log('Arrived!!!');
          sendSms('اومد!!', '09303211374');
        } else {
        }
      });
    }
  });
}, 60000);

function fetchIncredibleOffers(callback) {
  let results = [];
  request.get(path, function (err, response, body) {
    if (err) {
      return callback(err);
    } else {
      let result = JSON.parse(body);
      for (let i = 0; i < result.responses.length; i++) {
        for (let j = 0; j < result.responses[i].hits.hits.length; j++) {
          let product = result.responses[i].hits.hits[j];
          if (product._type === 'incredibleoffers') {
            results.push(product);
          }
        }
      }
      return callback(null, results);
    }
  });
}