const fetch = require('node-fetch');

async function testApi() {
    const url = "https://www.exchangerates.org.uk/commodities_update.php?1708953275419";
    const headers = {
        "x-requested-with": "XMLHttpRequest"
    };

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: headers
        });

        if (response.ok) {
            console.log("Request successful!");
            console.log("Response content:");
            const data = await response.json();
            const oilSgdData = data["OILSGD"];
            if (oilSgdData) {
                console.log("OILSGD data as JSON:");
                console.log(JSON.stringify({"OILSGD": oilSgdData}, null, 4));
            } else {
                console.log("OILSGD data not found in response.");
            }
        } else {
            console.error(`Request failed with status code ${response.status}`);
        }
    } catch (error) {
        console.error("An error occurred:", error);
    }
}

testApi();
