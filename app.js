const Koa = require("koa");
const app = new Koa();
const fetch = require("node-fetch");
const _ = require("lodash");

async function moexTickerLast(ticker) {
  const json = await fetch(
    "https://iss.moex.com/iss/engines/stock/markets/shares/securities/" +
    ticker +
    ".json"
  ).then(function (res) {
    return res.json();
  });
  return json.marketdata.data.filter(function (d) {
    return ["TQBR", "TQTF"].indexOf(d[1]) !== -1;
  })[0][12];
}

function consoleLogStock(ticker) {
  setInterval(() => moexTickerLast(ticker).then(console.log), 5000);
}

async function showMoexStockList() {
  const json = await fetch("https://iss.moex.com/iss/securities.json")
    .then((res) => res.json());

  const sortedData = json.securities.data
    .filter(it => ["TQBR", "TQTF", "EQRD"].indexOf(it[14]) !== -1)
    .map(it => it[1])

  console.log(sortedData);
}

async function showMoexStockListWithNext() {
  let stocks = [];

  for (let i = 0; i <= 1000; i += 100) {
    const json = await fetch(`https://iss.moex.com/iss/securities.json?start=${i}`)
      .then((res) => res.json());

    if (_.isEmpty(json)) {
      break;
    };

    const sortedData = json.securities.data
      .filter(it => ["TQBR", "TQTF", "EQRD"].indexOf(it[14]) !== -1)
      .map(it => it[1])

    stocks = [...stocks, ...sortedData];
  }

  console.log(stocks);
}

app.use(async ctx => {
  ctx.body = "Hello World";
});

app.listen(3000, showMoexStockListWithNext());