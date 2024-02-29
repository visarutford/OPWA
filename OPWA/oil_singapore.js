fetch('https://www.exchangerates.org.uk/commodities_update.php?1708953275419', {
  method: 'GET',
  headers: {
    'x-requested-with': 'XMLHttpRequest'
  }
})
.then(response => {
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
})
.then(data => {
  console.log(data); // นำข้อมูลไปใช้ต่อตามต้องการ
})
.catch(error => {
  console.error('There was a problem with the fetch operation:', error);
});
