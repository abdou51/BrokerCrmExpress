const buildMongoQueryFromFilters = (filters) => {
  if (!filters || filters.length === 0) {
    return {};
  }

  const operatorMap = {
    eq: "$eq",
    neq: "$ne",
    lt: "$lt",
    lte: "$lte",
    gt: "$gt",
    gte: "$gte",
    startswith: (value) => ({ $regex: `^${value}`, $options: "i" }),
    endswith: (value) => ({ $regex: `${value}$`, $options: "i" }),
    contains: (value) => ({ $regex: value, $options: "i" }),
  };

  const convertOperator = (operator, value) => {
    const opFunc = operatorMap[operator];
    return typeof opFunc === "function" ? opFunc(value) : { [opFunc]: value };
  };

  const queryConditions = filters.map((filterGroup) => {
    const groupConditions = filterGroup.filters.map((filter) => ({
      [filter.field]: convertOperator(filter.operator, filter.value),
    }));

    return filterGroup.logic === "or"
      ? { $or: groupConditions }
      : { $and: groupConditions };
  });

  return { $and: queryConditions };
};

module.exports = {
  buildMongoQueryFromFilters,
};
