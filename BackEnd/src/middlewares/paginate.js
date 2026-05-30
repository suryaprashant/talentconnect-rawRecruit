const paginate = (req, res, next) => {
  let page = parseInt(req.query.page, 10) || 1;
  let limit = parseInt(req.query.limit, 10) || 10;

  // Prevent invalid values
  if (page < 1) page = 1;
  if (limit < 1) limit = 10;

  // Max cap
  if (limit > 100) limit = 100;

  const skip = (page - 1) * limit;

  req.pagination = {
    page,
    limit,
    skip,
  };

  next();
};

export default paginate;