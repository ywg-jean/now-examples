import * as Koa from "koa";
import { Context } from "koa";

import { createApp } from "../common";

async function main(ctx: Context, next: Function) {
  const { host } = ctx.headers;
  const proto = ctx.headers['x-forwarded-proto'];

  ctx.status = 200;
  ctx.body = {
    description: 'Hello! This server supports multiple routes.',
    first: `${proto}://${host}/first`,
    second: `${proto}://${host}/second`
  }
}

export default createApp((app: Koa) => {
  app.use(main);
});
