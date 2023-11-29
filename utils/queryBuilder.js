const buildMongoQueryFromFilters = (filters) => {
  if (!filters) {
    return {};
  }
  const queryConditions = filters.map((filterGroup) => {
    const groupConditions = filterGroup.filters.map((filter) => {
      return { ...filter };
    });

    if (filterGroup.logic === "or") {
      return { $or: groupConditions };
    } else if (filterGroup.logic === "and") {
      return { $and: groupConditions };
    }
  });

  return { $and: queryConditions };
};

module.exports = {
  buildMongoQueryFromFilters,
};
