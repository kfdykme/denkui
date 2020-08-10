/*
 * @Author: kfdykme
 */
const Koa = require('koa');
const app = new Koa();
const koaBody = require('koa-body')

app.use(new koaBody())
// logger

app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get('X-Response-Time');
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
  console.info(ctx.request)
  console.info(ctx.request.body)
});

// x-response-time

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

// response

app.use(async ctx => {
  ctx.body = 'Hello World';
//   console.info(ctx)
  // return ctx
});

app.listen(3000);