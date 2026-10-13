export const paginatedResponse = (
  data,
  total,
  { page, limit }
) => {
  const totalPages = Math.ceil(total / limit);

  return {
    data,

    meta: {
      total,
      page,
      limit,
      totalPages,

      hasNext: page < totalPages,

      hasPrev: page > 1,
    },
  };
};