const paidEndpoint = {
  method: "GET",
  path: "/signals/btc",
  priceAtomic: "1000000",
  token: "USDC",
  description: "BTC signal feed demo",
};

console.log(JSON.stringify({
  listing: paidEndpoint,
  behavior: "Return quote/payment requirements before serving protected content.",
  privateKeysOnServer: false,
}, null, 2));

