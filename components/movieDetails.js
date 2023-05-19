const e = require("express");
const { userCollection } = require("../config");

async function movieDetails(req, res) {
  const movieId = req.params.id;
  const filter = { _id: movieId };
  const projection = { randomMovies: 5 };

  try {
    const result = await userCollection.findOne({
      username: req.session.username,
    });
    console.log(result);
    if (result) {
      const randomMovies = result.randomMovies;
      const curatedMovies = result.curatedMovies;
      const searchedMovies = result.searchedMovies;
      let movieCurated;
      let movieRandom;
      let movieSearched;
      console.log(randomMovies);
      if (curatedMovies) {
        movieCurated = curatedMovies.find((movie) => movie._id == movieId);
      }
      if (randomMovies) {
        movieRandom = randomMovies.find((movie) => movie._id == movieId);
      }
      if (searchedMovies) {
        movieSearched = searchedMovies.find((movie) => movie._id == movieId);
      }

      let movie;
      if (movieRandom) {
        movie = movieRandom;
      } else if (movieCurated) {
        movie = movieCurated;
      } else if (movieSearched) {
        movie = movieSearched;
      } 

      let showAlert = false; // Flag to determine if the alert should be shown

      // Check if the watchlist has already reached the limit of 4 movies
      if (
        result.watchlist &&
        result.watchlist.length >= 4 &&
        !result.watchlist.find((m) => m._id == movieId)
      ) {
        // Set the showAlert flag to true
        showAlert = true;
      }

      res.render("moviedetails", { movie: movie, showAlert: showAlert });
    } else {
      console.log("Document not found");
      return res.status(404).send("Movie not found");
    }
  } catch (error) {
    console.error("Error retrieving document:", error);
    return res.status(500).send("Internal Server Error");
  }
}

module.exports = { movieDetails };
