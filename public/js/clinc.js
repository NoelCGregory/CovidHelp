const clincDiv = document.getElementById("clincs");
const mapDiv = document.getElementById("map");
const search = document.getElementById("listSearch");
let dataJson = null;

search.addEventListener("keyup", e => {
  if (dataJson == null) {
    getClincs(false);
  }
  const searchString = e.target.value;
  const filteredData = dataJson.filter(character => {
    let tempName = character.attributes.USER_Name;
    if (tempName == null){
            let  tempNotes =character.attributes.USER_Notes;
            return tempNotes.toLowerCase().indexOf(searchString.toLowerCase()) > -1;
        }else{
            return tempName.toLowerCase().indexOf(searchString.toLowerCase()) > -1;
        }
    });
    clincDiv.innerHTML = '';
    displayClincs(filteredData);
})

clincDiv.style.display = 'block';
mapDiv.style.display = 'none';

getClincs(false);

function toggleSwitch(){
    const checkbox = document.getElementById('customSwitches');
    if(checkbox.checked == true){
        clincDiv.style.display = 'none';
        mapDiv.style.display = 'block';
        getPos();
    }else{
        clincDiv.style.display = 'block';
        mapDiv.style.display = 'none';
        if(dataJson !=null){
            displayClincs();
        }else{
            getClincs(false);
        }
    }
}
function createMap(pos){
    if(pos != null){
        const mymap = L.map('mapid').setView([pos.coords.latitude,pos.coords.longitude], 15);
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: 'pk.eyJ1IjoiYWFyb24xMjE3IiwiYSI6ImNrZDBnemg5eDAwNWwzMHA4cHJtODJtZTgifQ.FRfGVLXGiGXp_MV9z0jLTA'
        }).addTo(mymap);
        if(dataJson !=null){
            for(let i = 0; i< dataJson.length;i++){
                const geometry = dataJson[i].geometry
                const attributes = dataJson[i].attributes;
                let link = attributes.USER_Link;
                if(link == null){
                    link = "Unavailable";
                }
                const x = geometry.x;
                const y = geometry.y;
                const marker = L.marker([y, x]).addTo(mymap);
                marker.bindPopup(`Website: <a href="${link}" target="_blank">Go To Website</a>`).openPopup();
           }
           const circle = L.circle([pos.coords.latitude,pos.coords.longitude], {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5,
            radius: 500
        }).addTo(mymap);
        }else{
            getClincs(true);
        }
    }else{
        alert('Problem getting location, please refresh and give location permissions');
    }
}
function getPos(){
    //checking if geolocation exist
    if('geolocation' in navigator){
        console.log('GeoLocation is available');
        navigator.geolocation.getCurrentPosition(pos =>createMap(pos));
    }else{
        alert('Geolocation is not available')
    }
}

async function getClincs(map){
    const fetch_response = await fetch('/getClincs');
    const json_response = await fetch_response.json();
    const features = json_response.features;
    dataJson = features;
    if(map == false){
        displayClincs(features);
    }
}
function displayClincs(json){
    for(let i = 0; i<json.length; i++){
        let attrAr = [];
        let attributes = json[i].attributes;
        attrAr.push(attributes.USER_Name);
        attrAr.push(attributes.USER_Link);
        attrAr.push(attributes.USER_City);
        attrAr.push(attributes.USER_Prov);
        attrAr.push(attributes.USER_Street);
        attrAr.push(attributes.USER_Phone);
        attrAr.push(attributes.USER_Notes);
        for(let j = 0; j<attrAr.length; j++){
            if(attrAr[j] == null){
                attrAr[j] = "Unavailable";
            }
            if( j == 1){
               if(attrAr[j] == null){
                 attrAr[j] ='404.html';
                }
            }else if(j == 4 || j == 2 || j == 3){
                if(attrAr[j] == "Unavailable"){
                    attrAr[j] =='';
                }
            }
         
        }
        if(attrAr[0] == "Unavailable" && attrAr[1] == "Unavailable" || attrAr[2] == "Unavailable" && attrAr[3] == "Unavailable"){
        }else{
            clincDiv.innerHTML += ` <div class="card"><div class="card-header">Featured</div><div class="card-body"><h5 class="card-title">${attrAr[0]}</h5><p class="card-text">${attrAr[6]}</p><p class="card-text">Address: ${attrAr[4]},${attrAr[2]} ${attrAr[3]} | Phone Number:${attrAr[5]}</p><a href="${attrAr[1]}" target="_blank" class="btn btn-primary">Visit Covid-19 Center</a><a href="map.html?address=${attrAr[4]},${attrAr[2]} ${attrAr[3]}"  class="btn btn-primary">Go To Map Location</a></div></div>`
        }

    }
}