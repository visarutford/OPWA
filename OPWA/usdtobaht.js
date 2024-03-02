function convertCurrency() {
    // รับค่าจาก input
    const usdAmount = parseFloat(document.getElementById("usdAmount").value);
    console.log("usdAmount = ",usdAmount)

    // เรียกใช้งาน API เพื่อดึงข้อมูลราคาแลกเปลี่ยนสำหรับ USD ในวันปัจจุบัน
    const today = new Date().toISOString().slice(0, 10);
    console.log("today = ",today)
    // const url = `https://apigw1.bot.or.th/bot/public/Stat-ExchangeRate/v2/DAILY_AVG_EXG_RATE/?currency=USD&start_period=${today}&end_period=${today}`;
    const url = `https://apigw1.bot.or.th/bot/public/Stat-ExchangeRate/v2/DAILY_AVG_EXG_RATE/?currency=USD&start_period=2024-02-28&end_period=2024-02-28`;
    fetch(url, {
        headers: {
            'x-ibm-client-id': '7d561185-b059-42b2-bc99-070f7250f64f',
            'accept': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log("data = ",data)
        const exchangeRate = parseFloat(data.result.data.data_detail[0].mid_rate);
        console.log("exchangeRate = ",exchangeRate)
        const exchangeRateTHB = parseFloat(data.result.data);
        console.log("exchangeRateTHB = ",exchangeRateTHB)
        const thbAmount = usdAmount * exchangeRate;
        console.log("thbAmount = ",thbAmount)
        displayResult(thbAmount);
    })
    .catch(error => console.error('Error:', error));
}

function displayResult(thbAmount) {
    // แสดงผลลัพธ์
    console.log("thbAmount = ",)
    const resultElement = document.getElementById("result")
    resultElement.textContent = `Converted amount: ${thbAmount.toFixed(2)} THB`;
}
