// index.ts
import { DWS, useStatic } from 'https://gitee.com/ccts/dws/raw/master/index.ts';

const app = new DWS();

// 设置中间件
app.use(async (ctx, next) => {
    ctx.body = 'Hello DWS';
    await next();
});

// 字符串方式匹配
app.use('/hallo', async ctx => {
    ctx.body = 'Hello DWS';
});

// 正则方式匹配
app.use(/\w+\/hallo/i, ctx => {
    ctx.redirect('/hallo');
});

// 使用模板引擎
app.use('GET', '/index.html', async ctx => {
    ctx.body = await ctx.renderString('index.html', { username: 'James' });
});

// 设置静态资源路由
app.use(useStatic('public', {
    maxAge: 600
}));

// 监听端口
app.listen(8000);