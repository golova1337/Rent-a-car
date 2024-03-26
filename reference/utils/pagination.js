function pagination(page, perPage, result) {
  const startIndex = (page - 1) * perPage;
  const endIndex = page * perPage;
  const paginatedResult = result.slice(startIndex, endIndex);
  const totalPages = Math.ceil(result.length / perPage);
  return {
    paginatedResult,
    totalPages,
  };
}
module.exports = pagination;
