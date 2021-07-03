const axios = require('axios'),
  fs = require('fs'),
  async = require('async');

const fileNameTest1 = 'test1.html';
const fileNameTest2 = 'test2.html';
const fileNameTest3 = 'test3.html';

const fileTest1 = fs.readFileSync(`./${fileNameTest1}`, { encoding: 'base64' });
const fileTest2 = fs.readFileSync(`./${fileNameTest2}`, { encoding: 'base64' });
const fileTest3 = fs.readFileSync(`./${fileNameTest3}`, { encoding: 'base64' });
const fileArray = [
  { fileName: fileNameTest1, data: fileTest1 },
  { fileName: fileNameTest2, data: fileTest2 },
  { fileName: fileNameTest3, data: fileTest3 },
];

async.timesLimit(
  100,
  10,
  function (i, callback) {
    console.log('next file group');

    axios
      .post('http://localhost:3005/files/convert/pdftohtml/base64', fileArray, {
        headers: {
          ['Content-Type']: 'application/json',
          ['Accept']: 'application/json',
        },
      })
      .then(function (response) {
        console.log(`${response.data.length} files processed`);
        for (let i = 0; i < response.data.length; i++) {
          const file = response.data[i];
          //fs.writeFileSync(
          //  `./${file.fileName}`,
          //  Buffer.from(response.data[i].data, 'base64')
          //);
          console.log(`${file.fileName} saved locally to pdf file format`);
        }
      })
      .catch(function (error) {
        console.error(error.response?.statusText || error);
        //callback(error.response?.statusText || error);
      })
      .then(function () {
        console.log('Finished');
        callback();
      });
  },
  function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log('Job complete');
    }
  }
);
