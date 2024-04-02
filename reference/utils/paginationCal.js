function paginationCal({ data, page, perPage, count }) {
  const totalPages = Math.ceil(count / perPage);
  const pag = {
    data,
    per_page: perPage,
    current_page: page,
    last_page: totalPages,
    from: (page - 1) * perPage + 1,
    to: Math.min(page * perPage, count),
  };
  return pag;
}
module.exports = paginationCal;
