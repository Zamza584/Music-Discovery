const router = require("express").Router();

router.get("/", async (req, res) => {
  let albumList = [];

  try {
    let albums = await getAlbums();

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
  } catch (err) {
    console.log(err);
  }

  res.render("index", { albumList });
});

async function getAlbums() {
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

  let year = 2023;

  //access albums through spotify api
  let albumsData = await fetch(
    `https://api.spotify.com/v1/search?q=year%3A${year}&type=album&limit=10`,
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token
      }
    }
  );
  let albums = await albumsData.json();
  return albums;
}
module.exports = router;
