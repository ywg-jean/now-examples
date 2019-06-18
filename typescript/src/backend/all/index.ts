import { NowRequest, NowResponse } from "@now/node";

// This could be a DB query.
export const availableTypesOfSushi = ["maki", "temaki", "uramaki", "nigiri", "sashimi"];

export default (_: NowRequest, res: NowResponse) => {
  res.status(200).json({data: availableTypesOfSushi});
};
