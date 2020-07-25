/**
 * This javascript file will constitute the entry point of your solution.
 *
 * Edit it as you need.  It currently contains things that you might find helpful to get started.
 */

// This is not really required, but means that changes to index.html will cause a reload.
require("./site/index.html");
// Apply the styles in style.css to the page.
require("./site/style.css");

// if you want to use es6, you can do something like
//     require('./es6/myEs6code')
// here to load the myEs6code.js file, and it will be automatically transpiled.

// Change this to get detailed logging from the stomp library
global.DEBUG = false;


//Variable declaration
var table, row, cell1, cell2, cell3, cell4, cell5;
var counter = 0;
var currenyData = [];
var sortedData = [];
var sparkData = [];
var midPrice;

const url = "ws://localhost:8011/stomp";

const client = Stomp.client(url);

client.debug = function (msg) {
  if (global.DEBUG) {
    console.info(msg);
  }
};

function connectCallback() {
  document.getElementById("stomp-status").innerHTML =
    "It has now successfully connected to a stomp server serving price updates for some foreign exchange currency pairs.";
  console.log("Connected");

  //Subscribe for the prices
  client.subscribe("/fx/prices", function (data) {
    //Increase the row counter for table to crate new row
    counter++;

    //Call the function to append the data to table
    getData(JSON.parse(data.body));
  });
}

//Call drawSpar function every 3 seconds to update the sparkline
setInterval(() => {
  drawSpark();
}, 3000);

//This function is used to get the data from the /fx/prices and update the table 
function getData(data) {

  //Push data to currency array
  currenyData.push(data);

  //Sort the data
  sortedData = currenyData.sort(function (a, b) {
    return b.lastChangeBid - a.lastChangeBid;
  });

  table = document.getElementById("currencyPrices");
  row = table.insertRow(counter);

  cell1 = row.insertCell(0);
  cell2 = row.insertCell(1);
  cell3 = row.insertCell(2);
  cell4 = row.insertCell(3);
  cell5 = row.insertCell(4);

  for (let i = 0; i < sortedData.length; i++) {
    cell1.innerHTML = sortedData[i].name;
    cell2.innerHTML = sortedData[i].bestBid;
    cell3.innerHTML = sortedData[i].bestAsk;
    cell4.innerHTML = sortedData[i].lastChangeBid;
    cell5.innerHTML = sortedData[i].lastChangeAsk;

    midPrice = (sortedData[i].bestBid + sortedData[i].bestAsk) / 2;
  }
}

//This function is used to update the sparkline
function drawSpark() {
  sparkData.push(midPrice);
  const sparkElement = document.getElementById("sparks");
  const sparkline = new Sparkline(sparkElement);
  sparkline.draw(sparkData);
}

client.connect({}, connectCallback, function (error) {
  alert(error.headers.message);
});

const exampleSparkline = document.getElementById("example-sparkline");
Sparkline.draw(exampleSparkline, [1, 2, 3, 6, 8, 20, 2, 2, 4, 2, 3]);
