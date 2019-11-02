const Koa = require("koa");
const app = new Koa();
const fetch = require("node-fetch");

async function moexTickerLast(ticker) {
  const json = await fetch(
    "https://iss.moex.com/iss/engines/stock/markets/shares/securities/" +
      ticker +
      ".json"
  ).then(function(res) {
    return res.json();
  });
  return json.marketdata.data.filter(function(d) {
    return ["TQBR", "TQTF"].indexOf(d[1]) !== -1;
  })[0][12];
}

function consoleLogStock(ticker) {
  setInterval(() => moexTickerLast(ticker).then(console.log), 5000);
}

app.use(async ctx => {
  ctx.body = "Hello World";
});

app.listen(3000, () => consoleLogStock("GAZP"));
