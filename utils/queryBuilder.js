const buildMongoQueryFromFilters = (filters) => {
  if (!filters) {
    return {};
  }

  const convertOperator = (operator, value) => {
    switch (operator) {
      case "eq":
        return { $eq: value };
      case "neq":
        return { $ne: value };
      case "lt":
        return { $lt: value };
      case "lte":
        return { $lte: value };
      case "gt":
        return { $gt: value };
      case "gte":
        return { $gte: value };
      case "startswith":
        return { $regex: `^${value}`, $options: "i" };
      case "endswith":
        return { $regex: `${value}$`, $options: "i" };
      case "contains":
        return { $regex: value, $options: "i" };
      default:
        return {};
    }
  };

  const queryConditions = filters.map((filterGroup) => {
    const groupConditions = filterGroup.filters.map((filter) => {
      const fieldCondition = {};
      fieldCondition[filter.field] = convertOperator(
        filter.operator,
        filter.value
      );
      return fieldCondition;
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
