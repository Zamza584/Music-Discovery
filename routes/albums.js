const { body } = require("express-validator");
const { cookieJWTAuth } = require("../public/middlewares/cookieJWTAuth");
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const albumSchema = require("../models/albumSchema");
let offset = 0;

router.get("/:year{.:next}{.:previous}", async (req, res) => {
  /*#swagger.tags = ['Albums']
    #swagger.summary = "get album list by year" */
  let selectedYear = req.params.year;
  if (!selectedYear) {
    throw new Error("no selected year");
  }

  let p = req.params;

  //to get token
  var clientId = process.env.CLIENT_ID; // Your client id
  var clientSecret = process.env.CLIENT_SECRET; // Your secret
  const tokenEndpoint = "https://accounts.spotify.com/api/token";

  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");
  params.append("client_id", clientId);
  params.append("client_secret", clientSecret);

  const dataToken = await fetch(tokenEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: params
  });

  const data = await dataToken.json();
  var token = data.access_token;
  let year = selectedYear;
  let url;

  if (req.params.next === "next") {
    offset += 10;
    url = `https://api.spotify.com/v1/search?q=year%3A${year}&type=album&offset=${offset}&limit=10`;
  } else if (req.params.previous === "previous") {
    offset -= 10;
    if (offset < 0) {
      offset = 0;
    }
    url = `https://api.spotify.com/v1/search?q=year%3A${year}&type=album&offset=${offset}&limit=10`;
  } else {
    url = `https://api.spotify.com/v1/search?q=year%3A${year}&type=album&offset=0&limit=10`;
    offset = 0;
  }

  //access albums through spotify api
  let albumsData = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token
    }
  });

  let albums = await albumsData.json();
  let albumList = [];

  albumObj = albums.albums.items;
  for (let obj of albumObj) {
    albumList.push({
      name: obj.name,
      type: obj.album_type,
      artist: obj.artists[0].name,
      release_date: obj.release_date,
      image: obj.images[0].url,
      spotify_link: obj.external_urls.spotify,
      total_tracks: obj.total_tracks
    });
  }
  res.send(albumList);
});

router.post("/saveAlbum", async (req, res) => {
  /*#swagger.tags = ['Albums']
    #swagger.summary = "saves album"
    #swagger.description = "Grabs data from an album and then saves that into mongodb. Also the user id is saved into this collection"
    #swagger.requestBody = {
       description: "Data needed to save data into db",
       required: true,
       schema: { $ref: "#/definitions/albumData" } 

  } */

  const token = req.cookies.token;
  console.log(token);
  const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  res.send(user.id);

  let albumData = {
    ...req.body,
    user_id: user.id
  };

  let data = albumSchema(albumData);
  let resp = await data.save();
  console.log(resp);
});

//used in index and the starting route to get all the albums
router.get("/", async (req, res) => {});

module.exports = router;
