// const optionMenu = document.querySelector(".select-menu"),
//        selectBtn = optionMenu.querySelector(".select-btn"),
//        options = optionMenu.querySelectorAll(".option"),
//        sBtn_text = optionMenu.querySelector(".sBtn-text");
// selectBtn.addEventListener("click", () => optionMenu.classList.toggle("active"));
// options.forEach(option =>{
//     option.addEventListener("click", ()=>{
//         let selectedOption = option.querySelector(".option-text").innerText;
//         sBtn_text.innerText = selectedOption;
//         optionMenu.classList.remove("active");
//     });
// });

const selectElement = document.getElementById("dropdownMenu");
  
  selectElement.addEventListener("change", function() {
    // เมื่อมีการเลือก option
    const selectedOption = this.options[this.selectedIndex];
    
    // ลบ class "selected" จากทุก option ก่อน
    const allOptions = document.querySelectorAll("option");
    allOptions.forEach(option => option.classList.remove("selected"));
    
    // เพิ่ม class "selected" ให้กับ option ที่ถูกเลือก
    selectedOption.classList.add("selected");
  });

// รับ Element ที่ต้องการแสดงข้อความลงใน HTML
const paragraphElement = document.getElementById("titleGraph");
const dropdownMenu = document.getElementById("dropdownMenu");

dropdownMenu.addEventListener("change", () => {
  handleSelection();
});

async function handleSelection() {
  const selectedOption = dropdownMenu.value;
  let fileName = "";
  switch (selectedOption) {
    case "Diesel":
      message = "Diesel";
      paragraphElement.textContent = message;
      console.log("Diesel");
      fileName = "oil_prices/Diesel.csv";
      break;
    case "Diesel B7":
      message = "Diesel B7";
      paragraphElement.textContent = message;
      console.log("Diesel B7");
      fileName = "oil_prices/Diesel B7.csv";
      break;
    case "Gasohol E85":
      message = "Gasohol E85";
      paragraphElement.textContent = message;
      console.log("Gasohol E85");
      fileName = "oil_prices/Gasohol E85.csv";
      break;
    case "Gasohol E20":
      message = "Gasohol E20";
      paragraphElement.textContent = message;
      console.log("Gasohol E20");
      fileName = "oil_prices/Gasohol E20.csv";
      break;
    case "Gasohol 91":
      message = "Gasohol 91";
      paragraphElement.textContent = message;
      console.log("Gasohol 91");
      fileName = "oil_prices/Gasohol 91.csv";
      break;
    case "Gasohol 95":
      message = "Gasohol 95";
      paragraphElement.textContent = message;
      console.log("Gasohol 95");
      fileName = "oil_prices/Gasohol 95.csv";
      break;
    case "Gasoline 95":
      message = "Gasoline 95";
      paragraphElement.textContent = message;
      console.log("Gasoline 95");
      fileName = "oil_prices/Gasoline 95.csv";
      break;
    case "Premium Diesel B7":
      message = "Premium Diesel B7";
      paragraphElement.textContent = message;
      console.log("Premium Diesel B7");
      fileName = "oil_prices/Premium Diesel B7.csv";
      break;
    case "Super Power GSH95":
      message = "Super Power GSH95";
      paragraphElement.textContent = message;
      console.log("Super Power GSH95");
      fileName = "oil_prices/Super Power GSH95.csv";
      break;
    default:
      console.log("Default");
      fileName = "oil_prices/Diesel.csv";
      break;
  }
  getDataAndDisplayChart(fileName);
}

const getDataAndDisplayChart = async (fileName) => {
  const data = await getData(fileName);
  displayChart(data);
};

const getData = async (fileName) => {
  console.log("fileName = ", fileName);
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
  //   layout: {
  //     background: { color: '#222' },
  //     textColor: '#DDD',
  // },
  // grid: {
  //     vertLines: { color: '#444' },
  //     horzLines: { color: '#444' },
  // },
  };
  console.log("chart = ", chart);
  const domElement = document.getElementById("tvchart");
  if (chart) {
    chart.remove();
  }
  chart = LightweightCharts.createChart(domElement, chartProperties);
  console.log("chart new = ", chart);
  const lineSeries = chart.addLineSeries();
  lineSeries.setData(data);
};

function startDisplay() {
  const fileName = "oil_prices/Diesel.csv";
  getDataAndDisplayChart(fileName);
}

startDisplay();
