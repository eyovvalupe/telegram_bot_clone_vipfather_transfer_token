const https = require('https');
require("dotenv").config();

function setWebhook(botToken, url) {
  return new Promise((resolve, reject) => {
    const webhookUrl = `https://api.telegram.org/bot${botToken}/setWebhook`;
    
    const data = JSON.stringify({ url });

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

module.exports = async (botToken, newWebhookUrl) => {
  try {
    // Step 1: Get current webhook info
    const currentInfo = await getWebhookInfo(botToken);
    console.log('Current webhook info:', currentInfo);

    // Step 2: Delete the existing webhook
    await setWebhook(botToken, ''); // Set to empty to delete the webhook
    console.log('Existing webhook deleted.');

    // Step 3: Set the new webhook
    const result = await setWebhook(botToken, newWebhookUrl);
    console.log('New webhook set:', result);

    // Step 4: Verify the new webhook info
    const newInfo = await getWebhookInfo(botToken);
    console.log('Updated webhook info:', newInfo);
    return new Promise((resolve, reject) => {
      resolve(newInfo);
    })
  } catch (error) {
    console.error('Error resetting webhook:', error.message);
  }
}

// const botToken = '7307700056:AAFS_khk783917vQl5B2YPSgUBjQRnnOWW8';
// const newWebhookUrl = process.env.SERVER_URL;

// resetWebhook(botToken, newWebhookUrl);
