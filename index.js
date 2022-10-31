'use strict';
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');
const fs = require("fs");
const axios = require('axios');
const https = require('https');
let credentials;
if (fs.existsSync('./credentials.json')) {
  credentials = require('./credentials.json');
}
const accountSid = process.env.TWILIO_ACCOUNT_SID ? process.env.TWILIO_ACCOUNT_SID : credentials.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN ? process.env.TWILIO_AUTH_TOKEN : credentials.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const phoneNumFrom = process.env.PHONE_FROM ? process.env.PHONE_FROM : credentials.PHONE_FROM;
const phoneNumTo = process.env.PHONE_TO ? process.env.PHONE_TO : credentials.PHONE_TO;

app.use(cors());

function sendMessage(msg = 'Hello there!') {
  client.messages
  .create({
    body: msg,
    from: phoneNumFrom,
    to: phoneNumTo
  })
  .then(message => console.log('success:', message.sid))
  .catch(err => console.log('error:', err));
}

const agent = new https.Agent({  
  rejectUnauthorized: false
});


  // homepage
app.get('/random-quote', (req, res) => {
  if (res.statusCode === 200){

  const config = {
    method: 'GET',
    url: 'https://zenquotes.io/api/random/',
    // httpsAgent: agent
  };
  axios(config)
    .then((response) => {
      if (response.status === 200) {
        console.log(response.data)
        sendMessage(response.data[0].q + '\n--' + response.data[0].a);
      } else {
        res.sendStatus(404)
      }
    })
    .catch((error) => {
      if (error.response && error.response.data) {
        console.log('ERROR:', error.response.data)
      } else {
        console.log('ERROR:', error)
      }
    });

  } else {
    res.sendStatus(404)
  }
});



// connect to server
app.listen(port, () => console.log(`Listening on port ${port}!`));