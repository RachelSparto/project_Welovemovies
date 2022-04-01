const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function reviewExists(req, res, next) {
  const { reviewId } = req.params;

  const foundReview = await service.read(reviewId);

  if (foundReview) {
    res.locals.review = foundReview;
    return next();
  }
  next({ status: 404, message: "Review cannot be found." });
}

async function destroy(req, res) {
  const { reviewId } = req.params;
  await service.delete(reviewId);
  res.sendStatus(204);
}

async function update(req, res) {
  const { reviewId } = req.params;
  const updatedReview = { ...res.locals.review, ...req.body.data };
  await service.update(updatedReview);
  const returnData = await service.getReviewsWithCritic(reviewId);
  res.json({ data: returnData });
}

module.exports = {
  delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
  update: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(update)],
};
