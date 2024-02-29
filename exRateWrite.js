const https = require('https');
const fs = require('fs');

const options = {
  hostname: 'apigw1.bot.or.th',
  path: '/bot/public/Stat-ExchangeRate/v2/DAILY_AVG_EXG_RATE/?currency=USD&start_period=2024-02-02&end_period=2024-02-29',
  method: 'GET',
  headers: {
    'x-ibm-client-id': '7d561185-b059-42b2-bc99-070f7250f64f',
    'accept': 'application/json'
  }
};

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    const jsonData = JSON.parse(data);
    console.log("jsonData = ",jsonData)
    const rates = jsonData.result.data.data_detail;

    // Convert JSON data to CSV format
    let csvData = '';
    rates.sort((a, b) => {
      return new Date(a.period) - new Date(b.period); // Sort by date
    });
    rates.forEach(rate => {
      const date = new Date(rate.period);
      const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
      const formattedTime = `${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric' })}`;
      csvData += `${formattedDate},${formattedTime},${rate.buying_sight},${rate.buying_transfer},${rate.selling},${rate.mid_rate}\n`;
    });

    // Write CSV data to a file
    fs.writeFile('exchange_rates_sorted.csv', csvData, (err) => {
      if (err) throw err;
      console.log('Exchange rates data has been saved to exchange_rates_sorted.csv');
    });
  });
});

req.on('error', (error) => {
  console.error(error);
});

req.end();
