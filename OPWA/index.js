const dropdownMenu = document.getElementById("dropdownMenu");

dropdownMenu.addEventListener("change", () => {
  handleSelection();
});

async function handleSelection() {
  const selectedOption = dropdownMenu.value;
  let fileName = '';
  switch (selectedOption) {
    case 'Diesel':
      console.log("Diesel");
      fileName = 'oil_prices/Diesel.csv';
      break;
    case 'Diesel B7':
      console.log("Diesel B7");
      fileName = 'oil_prices/Diesel B7.csv';
      break;
    case 'Gasohol E85':
      console.log("Gasohol E85");
      fileName = 'oil_prices/Gasohol E85.csv';
      break;
    case 'Gasohol E20':
      console.log("Gasohol E20");
      fileName = 'oil_prices/Gasohol E20.csv';
      break;
    case 'Gasohol 91':
      console.log("Gasohol 91");
      fileName = 'oil_prices/Gasohol 91.csv';
      break;
    case 'Gasohol 95':
      console.log("Gasohol 95");
      fileName = 'oil_prices/Gasohol 95.csv';
      break;
    case 'Gasoline 95':
      console.log("Gasoline 95");
      fileName = 'oil_prices/Gasoline 95.csv';
      break;
    case 'Premium Diesel B7':
      console.log("Premium Diesel B7");
      fileName = 'oil_prices/Premium Diesel B7.csv';
      break;
    case 'Super Power GSH95':
      console.log("Super Power GSH95");
      fileName = 'oil_prices/Super Power GSH95.csv';
      break;
    default:
      console.log("Default");
      fileName = 'oil_prices/Diesel.csv';
      break;
  }
  getDataAndDisplayChart(fileName);
}

const getDataAndDisplayChart = async (fileName) => {
  const data = await getData(fileName);
  displayChart(data);
};

const getData = async (fileName) => {
  console.log("fileName = ",fileName)
  const res = await fetch(fileName);
  const resp = await res.text();
  const cdata = resp
    .split("\n")
    .map((row) => {
      if (!row.trim()) return null;
      const [date, time, open, high, low, close] = row.split(",");
      const datetime = new Date(`${date} ${time}`).getTime() / 1000;
      return {
        time: datetime,
        value: close * 1,
      };
    })
    .filter((row) => row !== null);
  return cdata;
};

let chart;
let lineSeries;

const displayChart = async (data) => {
  console.log("Displaying chart with data:", data);
  const chartProperties = {
    width: 1400,
    height: 600,
    timeScale: {
      timeVisible: true,
      secondsVisible: true,
    },
  };
  console.log("chart = ",chart)
  const domElement = document.getElementById("tvchart");
  if (chart) {
    chart.remove();
  }
  chart = LightweightCharts.createChart(domElement, chartProperties);
  console.log("chart new = ",chart)
  const lineSeries = chart.addLineSeries();
  lineSeries.setData(data);
};

function startDisplay() {
  const fileName = 'oil_prices/Diesel.csv';
  getDataAndDisplayChart(fileName);
}

startDisplay();
