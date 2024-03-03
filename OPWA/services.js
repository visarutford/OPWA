// Require module
const express = require('express');
const axios = require('axios');
const { XMLParser } = require('fast-xml-parser');

// Endpoint the PTT service
const serviceURL = 'https://orapiweb.pttor.com/oilservice/OilPrice.asmx';

// Set up the server
const app = express();
const port = 3002;
const host = 'localhost';

// For parse data
const parser = new XMLParser();

// All routing
app.get('/getCurrentOilPrice', async (req, res) => {
  try {
    const oilPriceData = await getCurrentOilPrice(req.query.language || 'en');

    // const parsedData = parser.parse(oilPriceData);

    res.json(oilPriceData);
  } catch (error) {
    console.error('Error fetching oil price:', error);
    res.status(500).send('Error fetching oil price');
  }
});
app.get('/getCurrentOilPriceProvincial', async (req, res) => {
  try {
    const oilPriceProvincialData = await getCurrentOilPriceProvincial(
      req.query.language || 'en',
      req.query.provincial || 'bangkok'
    );

    const parsedData = parser.parse(oilPriceProvincialData);

    res.json(parsedData);
  } catch (error) {
    console.error('Error fetching provincial oil price:', error);
    res.status(500).send('Error fetching provincial oil price');
  }
});
app.get('/getOilPrice', async (req, res) => {
  try {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;

    const oilPrice = await getOilPrice(
      req.query.language || 'en',
      req.query.dd || (year - 1),
      req.query.mm || (month),
      req.query.yyyy || (year),
    );

    const parsedData = parser.parse(oilPrice);

    res.json(parsedData);
  } catch (error) {
    console.error('Error fetching oil price:', error);
    res.status(500).send('Error fetching oil price');
  }
});
// Start the server
app.listen(port, host, () => {
  console.log(`Server listening on port ${host}:${port}`);
});
// Functions for service
async function getCurrentOilPrice(language) {
  const methodName = 'CurrentOilPrice';
  const body = `<?xml version="1.0" encoding="utf-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="http://www.pttor.com">
  <soapenv:Header/>
  <soapenv:Body>
    <tns:${methodName}>
      <tns:Language>${language}</tns:Language>
    </tns:${methodName}>
  </soapenv:Body>
</soapenv:Envelope>`;

  const headers = {
    'Content-Type': 'text/xml; charset=utf-8',
    'SOAPAction': `http://www.pttor.com/${methodName}`,
  };

  try {
    const response = await axios.post(serviceURL, body, { headers });
    const data = response.data;

    console.log('Current oil price response...');
    console.log(data);

    return(data);
  } catch (error) {
    console.error('Error fetching oil price:', error);
  }
}
async function getCurrentOilPriceProvincial(language, provincial) {
  const methodName = 'CurrentOilPriceProvincial';
  const body = `<?xml version="1.0" encoding="utf-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="http://www.pttor.com">
 <soapenv:Header/>
  <soapenv:Body>
    <tns:${methodName}>
      <tns:Language>${language}</tns:Language>
      <tns:Province>${provincial}</tns:Province>
    </tns:${methodName}>
  </soapenv:Body>
</soapenv:Envelope>`;

  const headers = {
    'Content-Type': 'text/xml; charset=utf-8',
    'SOAPAction': `http://www.pttor.com/${methodName}`,
  };

  try {
    const response = await axios.post(serviceURL, body, { headers });
    const data = response.data;

    console.log('Current oil price provincial response...');
    console.log(data);

    return data;
  } catch (error) {
    console.error('Error fetching provincial oil price:', error);
  }
}
async function getOilPrice(language, provincial, dd, mm, yyyy) {
  const methodName = 'GetOilPrice';
  const body = `<?xml version="1.0" encoding="utf-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="http://www.pttor.com">
 <soapenv:Header/>
  <soapenv:Body>
    <tns:${methodName}>
      <tns:Language>${language}</tns:Language>
      <tns:DD>${dd}</tns:DD>
      <tns:MM>${mm}</tns:MM>
      <tns:YYYY>${yyyy}</tns:YYYY>
    </tns:${methodName}>
  </soapenv:Body>
</soapenv:Envelope>`;

  const headers = {
    'Content-Type': 'text/xml; charset=utf-8',
    'SOAPAction': `http://www.pttor.com/${methodName}`,
  };

  try {
    const response = await axios.post(serviceURL, body, { headers });
    const data = response.data;

    console.log('Oil price provincial response...');
    console.log(data);

    return data;
  } catch (error) {
    console.error('Error fetching Oil price:', error);
  }
}
