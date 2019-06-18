const Vue = require("vue/dist/vue");
const renderer = require("vue-server-renderer").createRenderer();

module.exports = async (req, res) => {
  const app = new Vue({
    data: () => ({ date: Date.now() }),
    template: `<div>Hello World {{ date }}</div>`
  });

  const html = await renderer.renderToString(app);
  res.setHeader("Content-Type", "text/html; charset=utf-8")
  res.status(200).send(html)
};
