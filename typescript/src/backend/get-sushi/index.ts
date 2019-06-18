import { NowRequest, NowResponse } from "@now/node";

import { ParsedUrlQuery } from "querystring";
import { Sushi } from "../../../types";
import { availableTypesOfSushi } from "../all";
import { getSushi } from "./getSushi";

const validateQuery = (query: ParsedUrlQuery): Pick<Sushi, "type"> => {
  if (!query.type || Array.isArray(query.type)) {
    throw new Error("Invalid query string");
  }

  if (availableTypesOfSushi.indexOf(query.type) === -1) {
    throw new Error("Sushi not found 🤔");
  }

  return query as Pick<Sushi, "type">;
};

export default (req: NowRequest, res: NowResponse) => {
  try {
    const { type } = validateQuery(req.query);
    res.status(200).json(getSushi(type));
  } catch (error) {
    res.status(200).json({ error: error.message });
  }
};
