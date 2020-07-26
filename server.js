const express = require('express'); //require express
const { response } = require('express');
const fs = require('fs');
let data = JSON.parse(fs.readFileSync('./data/youtubeChannels.json'));
let countrydata = JSON.parse(fs.readFileSync('./data/country.json'));
let countryInput = countrydata.ref_country_codes;
const app = express(); //creating application
let port = process.env.PORT || 3000;
const server = app.listen(port,() => console.log('Listening')); //listenign to port 3000
app.use(express.static('public')); //setting to public folder
const fetch = require('node-fetch');
const countries = require("i18n-iso-countries");


app.get('/global', async(req,resp) =>{
    const global_api_url = 'https://covidapi.info/api/v1/global';
    const fetch_response = await fetch(global_api_url);
    const json_response = await fetch_response.json();
    resp.json(json_response);
})

function countryToLatLong(countryGiven){
    let pos = [];
    for(let i = 0; i< countryInput.length;i++){
        if(countryInput[i].country == countryGiven){
            pos.push(countryInput[i].latitude);
            pos.push(countryInput[i].longitude);
            return pos;
        }
    }
    return pos;
}

app.get('/getStats/',async(req,resp) =>{
    const url = `https://coronavirus-19-api.herokuapp.com/countries`;
    let stats;
    const fetch_response = await fetch(url);
    const json_response = await fetch_response.json();
    const stats_response = json_response;
    if(stats_response == null){
        stats = {
            status:"Unsucceful"
        }
    }else{
        stats = {
            status:"succefull",
            content : []
        }
        for(let i = 0; i < stats_response.length; i++){
            let temp =  [];
            temp.push(stats_response[i].country);
            let pos  = countryToLatLong(stats_response[i].country);
            temp.push(formatNumber(stats_response[i].cases));
            temp.push(formatNumber(stats_response[i].deaths));
            temp.push(formatNumber(stats_response[i].recovered));
            temp.push(pos);
            stats.content.push(temp);
        }
    }
    resp.json(stats);
});

function formatNumber (num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
}


app.get('/getNews/:place',async(req,resp) =>{
    let param = req.params.place;
    let url = `https://api.smartable.ai/coronavirus/news/${param}`;

    const requestOptions = {
    method: 'GET',
    headers: {
        "Subscription-Key":"6e430232a4cf42a49b3d40c2c4e37297"
    },
    redirect: 'follow'
    };    
    let news;
    const fetch_response = await fetch(url, requestOptions);
    const json_response = await fetch_response.json();
    const news_response = json_response.news;
    if(news_response == null){
        news = {
            status:"Unsucceful"
        }
    }else{
        news = {
            status:"succefull",
            content : []
        }
        //console.log(news_response);
        for(let i = 0; i < news_response.length; i++){
            let temp =  [];
            temp.push(news_response[i].webUrl);
            temp.push(news_response[i].title);
            temp.push(news_response[i].excerpt);
            let image = news_response[i].images;
            console.log(image);
            if(image == null){
                image = 'https://sciences.ucf.edu/psychology/wp-content/uploads/sites/63/2019/09/No-Image-Available.png';
            }else{
                image = news_response[i].images[0].url;

            }
            temp.push(image);
            temp.push(news_response[i].publishedDateTime);
            temp.push(news_response[i].provider.name)
            news.content.push(temp);
        }
    }
    resp.json(news);
})

app.get('/getClincs',async(req,resp) =>{
    const url ='https://services1.arcgis.com/B6yKvIZqzuOr0jBR/arcgis/rest/services/COVID19_Testing_Centres_in_Canada/FeatureServer/0/query?where=1%3D1&outFields=USER_Name,USER_Link,USER_City,USER_Prov,USER_Phone,USER_Notes,USER_Street&outSR=4326&f=json';

    const fetch_response = await fetch(url);
    const json_response = await fetch_response.json();
    resp.json(json_response);
})

app.get('/getChannels',(req,resp) =>{
    resp.json(data);
})

