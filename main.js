var form = document.getElementById("myform");
var search = document.getElementById("search");
var result = document.querySelector(".result");

var API_KEY = //api key from https://www.omdbapi.com/;

var seriesLinks = [
  //add your download links
];

form.addEventListener("submit", function (e) {
  e.preventDefault();
  var searchValue = search.value.trim();
  if (searchValue === "") return;

  var url =
    "https://www.omdbapi.com/?s=" +
    encodeURIComponent(searchValue) +
    "&apikey=" +
    API_KEY;

  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      result.innerHTML = "";
      if (data.Response === "False") {
        result.innerHTML = "<p class='error'>No results found</p>";
        return;
      }

      data.Search.forEach(function (movie) {
        var poster =
          movie.Poster !== "N/A"
            ? movie.Poster
            : "https://via.placeholder.com/100x150";

        var downloadLinks = findLinks(
          movie.Title,
          movie.Type,
          movie.imdbID,
          movie.Year
        );

        var buttonsHTML = "";
        downloadLinks.forEach(function (link, index) {
          buttonsHTML +=
            "<a href='" +
            link +
            "' class='download-btn' target='_blank'>Download " +
            (index + 1) +
            "</a>";
        });

        var html =
          "<div class='movie-card'>" +
          "<img src='" +
          poster +
          "' alt='" +
          movie.Title +
          "'>" +
          "<div class='movie-info'>" +
          "<h3>" +
          movie.Title +
          "</h3>" +
          "<table>" +
          "<tr><td>Year:</td><td>" +
          movie.Year +
          "</td></tr>" +
          "<tr><td>Type:</td><td>" +
          movie.Type +
          "</td></tr>" +
          "<tr><td>IMDb ID:</td><td>" +
          movie.imdbID +
          "</td></tr>" +
          "</table>" +
          buttonsHTML +
          "</div>" +
          "</div>";

        result.innerHTML += html;
      });
    })
    .catch(function (err) {
      result.innerHTML = "<p class='error'>Error fetching data</p>";
      console.error(err);
    });
});

function findLinks(mTitle, mType, mImdb, mYear) {
  if (mType == "series") {
    let firstChar = mTitle.charAt(0).toUpperCase();
    return seriesLinks.map(function (baseLink) {
      return baseLink + "Series/" + firstChar + "/" + mTitle.replace("'","").replace(":","");
    });
  } else {
    return seriesLinks.map(function (baseLink) {
      let imdbNum = mImdb.replace("tt", "");
      return baseLink + "Movies/" + mYear + "/" + imdbNum;
    });
  }
}
