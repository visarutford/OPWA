import('node-fetch').then(fetch => {
  const fs = require('fs');
  const createCsvWriter = require('csv-writer').createObjectCsvWriter;

  async function fetchDataForSingleDay(date) {
      try {
          const url = `https://www.exchangerates.org.uk/commodities_update.php?${Date.parse(date)}`;
          const headers = {
              "x-requested-with": "XMLHttpRequest"
          };
          const response = await fetch.default(url, {
              method: 'GET',
              headers: headers
          });
          if (response.ok) {
              const data = await response.json();
              const oilSgdData = data["OILSGD"];
              const record = {
                  date: date,
                  time: oilSgdData.time,
                  value: oilSgdData.value,
                  hi: oilSgdData.hi,
                  lo: oilSgdData.lo,
                  lastdaily: oilSgdData.lastdaily
              };
              return record;
          } else {
              console.log(`Failed to fetch data for ${date}. Status code: ${response.status}`);
              return null;
          }
      } catch (error) {
          console.error(`An error occurred while fetching data for ${date}:`, error);
          return null;
      }
  }

  const csvWriter = createCsvWriter({
      path: 'oil_singapore_single_day.csv',
      header: [
          { id: 'date', title: 'Date' },
          { id: 'time', title: 'Time' },
          { id: 'value', title: 'Value' },
          { id: 'hi', title: 'High' },
          { id: 'lo', title: 'Low' },
          { id: 'lastdaily', title: 'Last Daily' }
      ]
  });

  const targetDate = '2024-02-27'; // วันที่ต้องการดึงข้อมูล

  fetchDataForSingleDay(targetDate)
      .then(record => {
          if (record !== null) {
              csvWriter.writeRecords([record])
                  .then(() => console.log('CSV file has been written successfully'))
                  .catch(error => console.error('Error writing CSV file:', error));
          } else {
              console.log(`No data available for ${targetDate}`);
          }
      })
      .catch(err => {
          console.error('Error occurred while fetching data:', err);
      });
}).catch(err => {
  console.error('Error occurred while importing node-fetch:', err);
});
