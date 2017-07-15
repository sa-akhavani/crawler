'use strict';
const request = require('request');
const kaveNegar = require('kavenegar')
const run = require('gen-run');
const fs = require('fs');

const kaveNegarConfigs = {
  "api_key": "XXX",
  "sender_number": "XXX"
};
var api = kaveNegar.KavenegarApi({
  apikey: kaveNegarConfigs.api_key
});


const phoneNumber = '09303211374';
const path = 'https://search.digikala.com/api2/Data/Get?categoryId=0&ip=0';
const path2 = 'https://search.digikala.com/api/SearchApi/?q=shrjd';
var sent = 0;

function sendSms(message, recieverNumber) {
  return function (callback) {
    api.Send({
      message: message,
      sender: kaveNegarConfigs.sender_number,
      receptor: recieverNumber
    }, function (response, status) {
      if (status === 200) {
        sent++;
        callback(null);
      } else {
        callback(status);
      }
    });
  }
}

function fetchDiveSummers() {
  // return function (callback) {
  run(function* () {
    for (let i = 1; i < 10; i++) {
      for (let j = 1; j < 10; j++) {
        let response = yield fetchData(path2 + i.toString() + 't' + j.toString());
        if (response) {
          console.log('i: ' + i + ' j: ' + j);
          for (let z = 0; z < response.hits.hits.length; z++) {
            let product = response.hits.hits[z]
            let enTitle = product._source.EnTitle.toLowerCase();
            let minPriceList = product._source.MinPriceList
            if (sent < 2) {
              if (product._id === 174553) {
                if (minPriceList != 0) {
                console.log('174553: ' + minPriceList);
                yield sendSms('اومد:‌ ' + product._id + ' ال', phoneNumber);
                }
              } else if (enTitle.indexOf('sony') > -1 || enTitle.indexOf('playstation') > -1 || enTitle.indexOf('ps4' || enTitle.indexOf('slim') > -1) > -1) {
                console.log('sony: ' + minPriceList);
                yield sendSms('اومد:‌ ' + product._id + ' ال', phoneNumber);
              }
            } else {
              console.log('SMS OverFlow');
            }
          };
        }
      }
    }
    // callback(null);
  });
  // }
};

function fetchData(path) {
  return function (callback) {
    request.get(path, function (err, response, body) {
      if (err) {
        callback(err);
      } else {
        let result = JSON.parse(body);
        if (parseInt(result.hits.total) > 0) {
          callback(null, result);
        } else {
          callback(null, null);
        }
      }
    });
  }
}

setInterval(function () {
  fetchDiveSummers();
}, 10000);

// setInterval(function () {
//   console.log('Fetching Data From Digikala Every One Minutes!');
//   fetchIncredibleOffers(function (err, results) {
//     let fileOutput = '';
//     if (err) {
//       console.log(err);
//       // sendSms('ارور خورد', '09303211374');
//     } else {
//       results.forEach(function (product) {
//         fileOutput += product._source.ShowTitle + '\n';
//         if (product._source.ShowTitle.indexOf('sony') > -1 || product._source.ShowTitle.indexOf('Sony') > -1 || product._source.ShowTitle.indexOf('PlayStation') > -1 || product._source.ShowTitle.indexOf('ps4') > -1 || product._source.ShowTitle.indexOf('Ps4') > -1 || product._source.ShowTitle.indexOf('PS4') > -1 || product._source.ShowTitle.indexOf('slim') > -1 || product._source.ShowTitle.indexOf('پلی استیشن') > -1) {
//           console.log('Arrived!!!');
//           // sendSms('اومد!!', '09303211374');
//         } else {}
//       });
//       fs.writeFileSync('results.js', fileOutput);
//     }
//   });
// }, 60000);

// function fetchIncredibleOffers(callback) {
//   let results = [];
//   request.get(path, function (err, response, body) {
//     if (err) {
//       return callback(err);
//     } else {
//       let result = JSON.parse(body);
//       for (let i = 0; i < result.responses.length; i++) {
//         for (let j = 0; j < result.responses[i].hits.hits.length; j++) {
//           let product = result.responses[i].hits.hits[j];
//           if (product._type === 'incredibleoffers') {
//             results.push(product);
//           }
//         }
//       }
//       return callback(null, results);
//     }
//   });
// }

// https://www.digikala.com/landing/dive-summer/
// https://search.digikala.com/api/SearchApi/?q=shrjd1t2&_=1500123242482
// https://search.digikala.com/api/SearchApi/?q=shrjd1t3&_=1500125857745