const https = require('https');
const { isEmpty } = require('./utils');
require("dotenv").config();

function setWebhook(botToken, url) {
  return new Promise((resolve, reject) => {
    const webhookUrl = `https://api.telegram.org/bot${botToken}/setWebhook`;
    let finalUrl;
    if (isEmpty(url)) {
      finalUrl = '';
    } else finalUrl = `${url}/${botToken}`
    const data = JSON.stringify({ url: finalUrl });

    const req = https.request(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
      }
    }, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        resolve(JSON.parse(responseData));
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

function getWebhookInfo(botToken) {
  return new Promise((resolve, reject) => {
    const webhookInfoUrl = `https://api.telegram.org/bot${botToken}/getWebhookInfo`;

    https.get(webhookInfoUrl, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        resolve(JSON.parse(responseData));
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

module.exports = async (botToken, newWebhookUrl, botData) => {
  try {
    const currentInfo = await getWebhookInfo(botToken);

    await setWebhook(botToken, ''); // Set to empty to delete the webhook

    const result = await setWebhook(botToken, newWebhookUrl);

    const newInfo = await getWebhookInfo(botToken);
    return new Promise((resolve, reject) => {
      resolve(newInfo);
    })
  } catch (error) {
    console.error('Error resetting webhook:', error.message);
  }
}
