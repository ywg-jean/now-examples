import * as fetch from "node-fetch";
import { NowRequest, NowResponse } from '@now/node'

import { Sushi } from "../../types";
import layout from "./layout";

export default async (_: NowRequest, res: NowResponse) => {
  const sushiResponse = await fetch.default("https://typescript-sushi.now.sh/api/all");
  const sushiList: { data: Array<Sushi["type"]> } = await sushiResponse.json();

  res.setHeader("Content-Type", "text/html");
  res.status(200).send(
    layout(`<h1>TypeScript Sushi API</h1>
  <div class="sushi-machine">
      <div class="neta"></div>
      <div class="rice"></div>
      <div class="sushi"></div>
      <div class="table"></div>
  </div>
  <h2>Learn more about...</h2>
  <ul>
      ${sushiList.data.map(name => `<li><a class="button" href="/sushi/${name}">${name}</a></li>`).join("\n")}
  </ul><br>
  <br>
  <small>Sushi animation by <a target="_blank" href="https://codepen.io/yumeeeei/">yumeeeei</a>.</small>`),
  );
};
