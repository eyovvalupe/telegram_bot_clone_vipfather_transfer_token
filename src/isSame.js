const TronWeb = require('tronweb');
require('dotenv').config()

// Initialize TronWeb (replace with your actual provider)
const tronWeb = new TronWeb({
    fullHost: process.env.TRON_FULL_HOST,
    headers: { "TRON-PRO-API-KEY": process.env.TRONGRID_API_KEY },
})

// Define the recipient address and amount
const toAddress = 'TJvHmkhAGok8qs7ema1rWV6tSk1bLS6KRm';
const amount = 10; // Amount in TRX

async function estimateGasFee() {
    try {
        // Create a transaction
        const transaction = await tronWeb.transactionBuilder.sendTrx(toAddress, amount * 1000000);

        // Estimate the energy required for the transaction
        const estimatedEnergy = await tronWeb.transactionBuilder.estimateEnergy(transaction);
        console.log('Estimated Energy Required:', estimatedEnergy);
    } catch (error) {
        console.error('Error estimating energy:', error);
    }
}

estimateGasFee();