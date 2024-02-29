const axios = require("axios");
const convert = require("xml-js");
const fs = require("fs");

const url = "https://orapiweb.pttor.com/oilservice/OilPrice.asmx";

// เพิ่มตัวแปร global เพื่อเก็บข้อมูลที่ดึงมาแล้ว
const fetchedData = {};

async function getOilPrice(date, oilName) {
  const dx = date.split("-");
  const data = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:www="http://www.pttor.com">
       <soapenv:Header/>
       <soapenv:Body>
          <www:GetOilPrice>
             <www:Language>en</www:Language>
             <www:DD>${dx[2]}</www:DD>
             <www:MM>${dx[1]}</www:MM>
             <www:YYYY>${dx[0]}</www:YYYY>
          </www:GetOilPrice>
       </soapenv:Body>
    </soapenv:Envelope>
    `;

  try {
    const response = await axios.post(url, data, {
      headers: {
        "Content-Type": "text/xml",
        SOAPAction: "http://www.pttor.com/GetOilPrice",
      },
    });

    const jsonData = convert.xml2json(response.data, {
      compact: true,
      spaces: 4,
    });
    const jsonResult = JSON.parse(jsonData);

    const dataAccess =
      jsonResult["soap:Envelope"]["soap:Body"]["GetOilPriceResponse"][
        "GetOilPriceResult"
      ];

    if (dataAccess) {
      const jsonData = convert.xml2json(dataAccess._text, {
        compact: true,
        spaces: 4,
      });
      const jsonResult = JSON.parse(jsonData);

      const oilNameValue = jsonResult.PTTOR_DS.FUEL.find(
        (fuel) => fuel.PRODUCT._text === oilName
      );
      if (oilNameValue) {
        const { PRICE_DATE, PRODUCT, PRICE } = oilNameValue;
        const formattedDate = new Date(PRICE_DATE._text).toLocaleString('en-US');
        const currentDate = new Date(PRICE_DATE._text).toISOString().split("T")[0];
        const newClose = parseFloat(PRICE._text);
        // เพิ่มเงื่อนไขเพื่อตรวจสอบว่าข้อมูลในวันนั้นถูกดึงมาแล้วหรือไม่

        if (!fetchedData[currentDate]) {
          fetchedData[currentDate] = true;
          const candlestickData = `${formattedDate}, ${PRICE._text}, ${PRICE._text}, ${PRICE._text}, ${newClose}\n`;
          fs.appendFileSync("oil_prices/Super Power GSH95.csv", candlestickData);
          console.log("Data written to oil_prices.csv");
          return { date: new Date(PRICE_DATE._text), price: parseFloat(PRICE._text) };
        } else {
          console.log("Data for", currentDate, "already fetched.");
          return null;
        }
      } else {
        console.error("Product not found:", oilName);
        return null;
      }
    } else {
      console.error("No data found");
      return null;
    }
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

fs.writeFileSync("oil_prices/Super Power GSH95.csv", "");

const startDate = new Date("2022-01-01");
const endDate = new Date("2023-01-01");

async function fetchDataAndWriteToFile(date, oilName) {
  try {
    const price = await getOilPrice(date, oilName);
  } catch (error) {
    console.error("Error getting price for", date, ":", error);
  }
}

async function fetchAndWriteDataInRange(startDate, endDate, oilName) {
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const formattedDate = currentDate.toISOString().split("T")[0];
    await fetchDataAndWriteToFile(formattedDate, oilName);
    currentDate.setDate(currentDate.getDate() + 1);
  }
}

fetchAndWriteDataInRange(startDate, endDate, "Super Power GSH95")
  .then(() => console.log("Data fetching and writing completed."))
  .catch((error) => console.error("Error:", error));
