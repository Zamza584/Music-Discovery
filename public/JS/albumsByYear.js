import { getAlbums } from "./utils.js";

let year;
//this is used in the albums.ejs file.
//does fetching and displays to user.

document.querySelector("#year").addEventListener("change", async (e) => {
  year = e.target.value;

  let url = window.location.href + `albums/${year}`;
  getAlbums(url);
});

let next = document.querySelectorAll(".next");
for (var i = 0; i < next.length; i++) {
  next[i].addEventListener("click", async (e) => {
    let year = document.querySelector("#year").value;
    let url = window.location.href + `albums/${year}/next`;
    getAlbums(url);
  });
}

let back = document.querySelectorAll(".back");
for (i of back) { 
  i.addEventListener("click", async (e) => {
    let year = document.querySelector("#year").value;
    let url = window.location.href + `albums/${year}/null/previous`;
    getAlbums(url);
  });
}

let list = document.querySelectorAll(".favorites");
for (var i = 0; i < list.length; i++) {
  list[i].addEventListener("click", (e) => {
    console.log("working here")
    const parentNode = e.target.parentNode;
    const children = Array.from(parentNode.childNodes);
    //used to get array items that have a name in it, specified in the html file.
    const elements = children.filter(
      (c) => c.className != "btn favorites" && c.nodeName != "#text"
    );

    let items = {};
    console.log(items)

    elements.forEach((element) => {
      items[element.getAttribute("name")] = element.getAttribute("value");
    });

    let url = window.location.href + `albums/saveAlbum`;
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(items)
    });
  });
}
