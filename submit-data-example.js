const axios = require("axios");
const API_KEY_COM = "YOUR_API_KEY";
const SUBMISSION_ENDPOINT = "https://vrzrc8ucp5.execute-api.ap-southeast-2.amazonaws.com/dev/ftso/submit"
const LATEST_EPOCH_ENDPOINT = "https://vrzrc8ucp5.execute-api.ap-southeast-2.amazonaws.com/dev/ftso/latest"

main();

async function main() {
  var YOUR_DATA = [];
  
  // Get your price data taht you source privately
  var data = await getData();
  
  // Fetch the latest Community epoch     
  var latestEpoch = await getLatestEpoch();

  // Get current Unix Epoch time for referrence in seconds
  let timeNow = Math.round(new Date() / 1000);
   
  // If missed submission deadline, wait for next round
  if (timeNow > latestEpoch.submitEndTime) {
    let sleeptime = latestEpoch.revealEndTime - timeNow + 5;
    console.log(`Missed submit time, sleep for ${sleeptime}`);
    await sleep(sleeptime * 1000).then(() => {
      main();
    });
    return;
  }
  
  // Create submission object for each pair
  let keys = Object.keys(data);
  keys.forEach((pair) => {
    YOUR_DATA.push({ pair: pair, price: data[pair].price });
  });

  let params = {
    epochId: parseInt(latestEpoch.epochId),
    provider: "YOUR_CODE_NAME",
    submissions: YOUR_DATA,
  };

  axios
    .post(
      SUBMISSION_ENDPOINT,
      params,
      {
        headers: { "X-API-KEY": API_KEY_COM },
      }
    )
    .then(async (response) => {
      console.log(response.data);
      let sleeptime = latestEpoch.revealEndTime - timeNow + 5;
      console.log("Waiting for next round");
      await sleep(sleeptime * 1000).then(() => {
        main();
      });
    })
    .catch(function (error) {
      console.log(error.response.data);
    });
}

async function getLatestEpoch() {
  var latestEpoch;
  await axios
    .get(
      LATEST_EPOCH_ENDPOINT,
      {
        headers: { "X-API-KEY": API_KEY_COM },
      }
    )
    .then((response) => {
      latestEpoch = response.data;
    })
    .catch((error) => {
      // handle error
      console.log(error);
    });
  return latestEpoch;
}

function sleep(millis) {
  return new Promise((resolve) => setTimeout(resolve, millis));
}

async function getData() {
  // Function that retrieves your price data  
  var price_data = {
        "ALGO/USD": {
            "price": 0.77303,
        },
        "XLM/USD": {
            "price": 0.22805,
        },
        "BCH/USD": {
            "price": 435.90112,
        },
        "LTC/USD": {
            "price": 116.85403,
        },
        "BTC/USD": {
            "price": 31593.51091,
        },
        "XRP/USD": {
            "price": 0.57282,
        },
        "DOGE/USD": {
            "price": 0.17652,
        },
        "ADA/USD": {
            "price": 1.11368,
        },
        "DGB/USD": {
            "price": 0.03704,

        }
  return price_data;
}
