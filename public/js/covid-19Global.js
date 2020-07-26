let url;
let casesText = document.getElementById("casesTxt");
let recoveredText = document.getElementById("recoveredTxt");
let deathText = document.getElementById("deathTxt");

globalCases();
//fetching
async function globalCases() {
  url = "/global";
  const response = await fetch(url);
  const json = await response.json();
  casesText.innerHTML = formatNumber(json.result.confirmed);
  recoveredText.innerHTML = formatNumber(json.result.recovered);
  deathText.innerHTML = formatNumber(json.result.deaths);
}

function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}
