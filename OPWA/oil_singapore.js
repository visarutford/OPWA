function testApi() {
  var url = "https://www.exchangerates.org.uk/commodities_update.php?1708953275419";
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.setRequestHeader("x-requested-with", "XMLHttpRequest");

  xhr.onload = function () {
      if (xhr.status == 200) {
          console.log("Request successful!");
          console.log("Response content:");
          var data = JSON.parse(xhr.responseText);
          var oilSgdData = data["OILSGD"];
          if (oilSgdData) {
              console.log("OILSGD data as JSON:");
              console.log(JSON.stringify({"OILSGD": oilSgdData}, null, 4));
          } else {
              console.log("OILSGD data not found in response.");
          }
      } else {
          console.log("Request failed with status code " + xhr.status);
      }
  };

  xhr.onerror = function () {
      console.log("An error occurred");
  };

  xhr.send();
}

testApi();
