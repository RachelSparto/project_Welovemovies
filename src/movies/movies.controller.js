const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function movieExists(req, res, next) {
  const { movieId } = req.params;
  const foundMovie = await service.read(movieId);
  if (foundMovie) {
    res.locals.movie = foundMovie;
    return next();
  }
  return next({ status: 404, message: "Movie cannot be found." });
}

async function list(req, res) {
  if (req.query.is_showing) {
    res.send({ data: await service.inTheatersNow() });
  } else {
    res.send({ data: await service.list() });
  }
}

function read(req, res) {
  res.send({ data: res.locals.movie });
}

async function listTheatersForMovie(req, res) {
  const { movieId } = req.params;
  const data = await service.listTheatersForMovie(movieId);
  res.send({ data });
}

async function listReviews(req, res) {
  const { movieId } = req.params;
  const data = await service.listReviews(movieId);
  res.send({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(movieExists), read],
  listTheatersForMovie: [
    asyncErrorBoundary(movieExists),
    asyncErrorBoundary(listTheatersForMovie),
  ],
  listReviews: [
    asyncErrorBoundary(movieExists),
    asyncErrorBoundary(listReviews),
  ],
};
