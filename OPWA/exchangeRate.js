const getData = async () => {
  const res = await fetch("exchange_rates_sorted.csv");
  const resp = await res.text();
  const cdata = resp.split("\n").map((row) => {
    const [time1, time2, open, high, low, close] = row.split(",");
    // console.log("time1 = ", time1);
    // console.log("time2 = ", time2);
    // console.log("time = ", new Date(`${time1}, ${time2}`).getTime());
    // console.log("time test = ", new Date(`${time1} ${time2}`).getTime() / 1000);
    const datetime = new Date(`${time1} ${time2}`).getTime() / 1000;
    return {
      time: datetime,
      value: close * 1, // ใช้ราคาปิดเป็นค่าของเส้นกราฟ
    };
  });
  return cdata;
};

const displayChart = async () => {
  const chartProperties = {
    width: 1400,
    height: 600,
    timeScale: {
      timeVisible: true,
      secondsVisible: true,
    },
  };

  const domElement = document.getElementById("tvchartExchange");
  const chart = LightweightCharts.createChart(domElement, chartProperties);
  const lineSeries = chart.addLineSeries();
  const linedata = await getData();
  lineSeries.setData(linedata);

  // กำหนดสีของเส้นกราฟ
//   lineSeries.applyOptions({
//     color: "blue", // เปลี่ยนสีเป็นสีฟ้า
//     lineWidth: 2, // กำหนดความหนาของเส้นกราฟ
//   });
};

displayChart();
