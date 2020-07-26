const search = document.getElementById("listSearch");
const channelDiv = document.getElementById("channel");
let dataJson = null;

getChannels(false);

search.addEventListener("keyup", e => {
  if (dataJson == null) {
    getClincs(false);
  }
  const searchString = e.target.value;
  const filteredData = dataJson.channels.filter(character => {
    let tempName = character.name;
    return tempName.toLowerCase().indexOf(searchString.toLowerCase()) > -1;
  });
  let tempJson = {
    channels: filteredData
  };
  channelDiv.innerHTML = "";
  displayChannels(tempJson);
});

async function getChannels(dataExist) {
  if (dataExist == false) {
    const url = "/getChannels";
    const fetch_response = await fetch(url);
    const json_response = await fetch_response.json();
    dataJson = json_response;
  }
  displayChannels(dataJson);
}

function displayChannels(json) {
  const channelDiv = document.getElementById("channel");
  let channel = json.channels;
  for (let i = 0; i < channel.length; i++) {
    let attrAr = [];
    attrAr.push(channel[i].name);
    attrAr.push(channel[i].about);
    attrAr.push(channel[i].url);
    channelDiv.innerHTML += ` <div class="card"><div class="card-header">Featured</div><div class="card-body"><h5 class="card-title">${
      attrAr[0]
    }</h5><p class="card-text">${attrAr[1]}</p><a href="${
      attrAr[2]
    }" target="_blank"  class="btn btn-primary">Visit Channel</a></div></div>`;
  }
}
