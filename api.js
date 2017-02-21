const http = require('http');

const AD_URL = 'http://api.chrisvalleskey.com/fillerama/get.php?count=1&format=json&show=arresteddevelopment';


function fetchData() {
  return new Promise((resolve, reject) => {
    http.get(AD_URL, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error('ERROR: API CALL FAILED'));
      }

      res.setEncoding('utf8');
      let rawData = '';
      res.on('data', (chunk) => rawData += chunk);
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(rawData);
          resolve(parsedData.db);
        } catch (err) {
          reject(new Error(err.message));
        }
      });
    }).on('error', (err) => reject(new Error(err.message)));
  });
}


module.exports = {
  fetchData,
};
