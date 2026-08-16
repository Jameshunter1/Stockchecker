# Stock Price Checker

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express_4-000000?style=flat-square&logo=express&logoColor=white)
![Helmet](https://img.shields.io/badge/Helmet-CSP_locked_to_'self'-informational?style=flat-square)
![Mocha](https://img.shields.io/badge/Tests-Mocha_%2B_Chai-8D6748?style=flat-square&logo=mocha&logoColor=white)

A small Express API that fetches live stock prices, lets visitors "like" a stock, and compares the relative popularity of two stocks. Built for the [freeCodeCamp Information Security certification](https://www.freecodecamp.org/learn/information-security/), with the security headers as much a part of the project as the API.

## Security First

The app ships with a restrictive [Helmet](https://helmetjs.github.io/) Content Security Policy: `defaultSrc`, `scriptSrc`, `styleSrc`, `fontSrc`, `imgSrc`, and `connectSrc` are all locked to `'self'`, so the browser refuses to load any script, style, font, or image that doesn't come from the site itself.

## API

### `GET /api/stock-prices`

Prices come live from the freeCodeCamp stock proxy (`stock-price-checker-proxy.freecodecamp.rocks`).

| Query | Example | Returns |
| --- | --- | --- |
| `stock=SYMBOL` | `?stock=GOOG` | `{ "stockData": { "stock", "price", "likes" } }` |
| `stock=A&stock=B` | `?stock=GOOG&stock=MSFT` | Array of two, each with `rel_likes` (difference in likes) instead of a raw comparison |
| `&like=true` | `?stock=GOOG&like=true` | Same shape, with the like recorded |

**Examples:**

```bash
curl "http://localhost:3000/api/stock-prices?stock=GOOG"
# {"stockData":{"stock":"GOOG","price":168.42,"likes":1}}

curl "http://localhost:3000/api/stock-prices?stock=GOOG&stock=MSFT&like=true"
# {"stockData":[{"stock":"GOOG","price":168.42,"likes":2,"rel_likes":1},
#               {"stock":"MSFT","price":417.10,"likes":1,"rel_likes":-1}]}
```

> **Storage note:** likes are kept in an in-memory object for demonstration purposes, so they reset when the server restarts. See the roadmap below.

## Getting Started

**Prerequisites:** Node.js 18+ and npm.

```bash
git clone https://github.com/Jameshunter1/Stockchecker.git
cd Stockchecker
npm install
npm start          # listens on PORT or 3000
```

## Testing

Five functional tests (Mocha + Chai + chai-http) cover the freeCodeCamp user stories:

1. Viewing one stock
2. Viewing one stock and liking it
3. Liking the same stock again (likes shouldn't double-count)
4. Viewing two stocks (`rel_likes` present and summing to zero)
5. Viewing two stocks and liking them

```bash
npm test
# or run the suite on startup:
NODE_ENV=test npm start
```

## Roadmap

* **Per-client like deduplication** — track likers by IP, stored only as a salted hash so no raw addresses are kept (the remaining freeCodeCamp user story).
* **Persistent storage** — move likes from the in-memory object to a database so they survive restarts.

## Project Structure

```
.
├── public/            # Static assets
├── routes/
│   └── api.js         # /api/stock-prices — proxy fetch + likes logic
├── tests/
│   └── 2_functional-tests.js
├── views/             # index.html
└── server.js          # Express app, Helmet CSP, test-runner hook
```

## Credit

Based on the freeCodeCamp [Stock Price Checker boilerplate](https://www.freecodecamp.org/learn/information-security/); implementation is my own.
