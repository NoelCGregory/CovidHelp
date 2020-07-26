const newsDiv = document.getElementById("news");
const statsDiv = document.getElementById("statsDiv");
const subStatsDiv = document.getElementById("stats");
const search = document.getElementById("listSearchSm");
const newsMenu = document.getElementById("placesNews");
const mapDiv = document.getElementById("mapDiv");
const label = document.getElementById("label");
const mymap = L.map("mapidStats").setView([0, 0], 1);
let newsOrStats = false;

let newsJson = null;
let statsJson = null;

getNews("CA-ON");

newsMenu.addEventListener("change", val => {
  const selected = val.target.value;
  getNews(selected);
});

search.addEventListener("keyup", e => {
  if (newsOrStats == true) {
    if (statsJson == null) {
      getStats();
    }
    const searchString = e.target.value;
    const filteredData = statsJson.content.filter(character => {
      let tempName = character[0];
      return tempName.toLowerCase().indexOf(searchString.toLowerCase()) > -1;
    });
    let data = {
      content: filteredData
    };
    subStatsDiv.innerHTML = "";
    displayStats(data);
  } else {
    if (newsJson == null) {
      getNews("CA-ON");
    }
    const searchString = e.target.value;
    const filteredData = newsJson.content.filter(character => {
      let tempName = character[1];
      return tempName.toLowerCase().indexOf(searchString.toLowerCase()) > -1;
    });
    let data = {
      content: filteredData
    };
    newsDiv.innerHTML = "";
    displayNews(data);
  }
});

newsDiv.style.display = "block";
statsDiv.style.display = "none";

function toggleSwitch() {
  const checkbox = document.getElementById("customSwitches");
  if (checkbox.checked == true) {
    newsDiv.style.display = "none";
    statsDiv.style.display = "block";
    subStatsDiv.style.display = "block";
    mapDiv.style.display = "none";
    newsMenu.style.display = "none";
    label.style.display = "none";
    newsOrStats = true;
    getStats();
  } else {
    newsDiv.style.display = "block";
    statsDiv.style.display = "none";
    newsMenu.style.display = "block";
    label.style.display = "block";
    newsOrStats = false;
  }
}
function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
}
function toggleSwitchToMap() {
  const checkbox = document.getElementById("customSwitchesMap");
  if (checkbox.checked == true) {
    subStatsDiv.style.display = "none";
    mapDiv.style.display = "block";
    createMap();
  } else {
    mapDiv.style.display = "none";
    subStatsDiv.style.display = "block";
  }
}

async function getNews(param) {
  let url = "/getNews/" + param;
  const fetch_response = await fetch(url);
  const json_response = await fetch_response.json();
  newsJson = json_response;
  newsDiv.innerHTML = "";
  displayNews(newsJson);
}

async function getStats() {
  let url = "/getStats/";
  const fetch_response = await fetch(url);
  const json_response = await fetch_response.json();
  statsJson = json_response;
  subStatsDiv.innerHTML = "";
  displayStats(statsJson);
}
function createMap() {
  L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: "mapbox/streets-v11",
      tileSize: 512,
      zoomOffset: -1,
      accessToken:
        "pk.eyJ1IjoiYWFyb24xMjE3IiwiYSI6ImNrZDBnemg5eDAwNWwzMHA4cHJtODJtZTgifQ.FRfGVLXGiGXp_MV9z0jLTA"
    }
  ).addTo(mymap);
  if (statsJson != null) {
    setMarkers();
  } else {
    getStats();
    setMarkers();
  }
}

function setMarkers() {
  let tempJson = statsJson.content;
  for (let i = 0; i < tempJson.length; i++) {
    let geometry = tempJson[i][4];
    if (geometry.length > 0) {
      const country = tempJson[i][0];
      const cases = tempJson[i][1];
      const deaths = tempJson[i][2];
      const recoverd = tempJson[i][3];
      const x = geometry[0];
      const y = geometry[1];
      const marker = L.marker([x, y]).addTo(mymap);
      marker
        .bindPopup(
          `<p>${country}</p><p>Case:${cases}</p><p>Deaths:${deaths}</p><p>Recovered:${recoverd}</p>`
        )
        .openPopup();
    }
  }
}

function displayStats(json) {
  let info = json.content;
  for (let i = 0; i < info.length; i++) {
    const country = info[i][0];
    const cases = formatNumber(info[i][1]);
    const deaths = formatNumber(info[i][2]);
    const recoverd = formatNumber(info[i][3]);
    subStatsDiv.innerHTML += `<div class="jumbotron text-center"><h3>${country}<h3>
          <table class="table table-borderless text-center">
            <thead>
              <tr>
                <th scope="col" class="num" style="color:black">Cases</th>
                <th scope="col" class="num" style="color: green">Recoverd</th>
                <th scope="col" class="num" style="color:red">Deaths</th>
              </tr>
            </thead>
            <tbody>
              <tr id="textTr">
                <td class="num" id ="casesTxt">${cases}</td>
                <td class="num" id="recoveredTxt" >${deaths}</td>
                <td class="num" id="deathTxt">${recoverd}</td>
              </tr>
            </tbody>
          </table>
      </div>`;
  }
}

function displayNews(json) {
  let content = json.content;
  for (let i = 0; i < content.length; i++) {
    const url = content[i][0];
    const title = content[i][1];
    const desc = content[i][2];
    const imageUrl = content[i][3];
    var options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    };
    const tempDate = new Date(content[i][4]);
    const date = tempDate.toLocaleDateString("en-US", options);
    const provider = content[i][5];
    newsDiv.innerHTML += `<div class="container my-5 py-5 z-depth-1">
        <!--Section: Content-->
        <section class="px-md-5 mx-md-5 dark-grey-text text-center text-lg-left">
          <!--Grid row-->
          <div class="row">
            <!--Grid column-->
            <div class="col-lg-6 mb-4 mb-lg-0 d-flex align-items-center justify-content-center">
              <img src="${imageUrl}" class="img-fluid" alt="">
            </div>
            <!--Grid column-->
            <!--Grid column-->
            <div class="col-lg-6 mb-4 mb-lg-0">
              <h3 class="font-weight-bold">${title}</h3>
              <p class="font-weight-bold">Provider: ${provider}</p>
              <p class="text-muted">${desc}</p>
              <p class="text-muted">${date}</p>
              <a class="font-weight-bold"  target="_blank"  href="${url}" >Learn more<i class="fas fa-angle-right ml-2"></i></a>
            </div>
            <!--Grid column-->
          </div>
          <!--Grid row-->
        </section>
        <!--Section: Content-->
      </div>`;
  }
}
