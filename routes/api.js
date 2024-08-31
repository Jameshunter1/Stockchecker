// In-memory store for likes (for demonstration purposes only)
const stockLikes = {};

module.exports = function (app) {
  app.route('/api/stock-prices')
    .get(async (req, res) => {
      const stockQuery = req.query.stock;
      const like = req.query.like === 'true';

      if (Array.isArray(stockQuery)) {
        try {
          // Fetch data for all stocks
          const responses = await Promise.all(stockQuery.map(stock => 
            fetch(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock}/quote`)
          ));
          const data = await Promise.all(responses.map(response => response.json()));

          // Handle likes for multiple stocks
          const likes = [];
          if (like) {
            stockQuery.forEach(stock => {
              if (!stockLikes[stock]) stockLikes[stock] = 0;
              stockLikes[stock] += 1;
            });
          }

          const stockData = data.map((stock, index) => ({
            stock: stock.symbol,
            price: stock.latestPrice,
            likes: stockLikes[stock.symbol] || 0,
            rel_likes: stockQuery.length === 2 ? Math.abs((stockLikes[stockQuery[0]] || 0) - (stockLikes[stockQuery[1]] || 0)) : 0
          }));

          res.json({ stockData });
        } catch (error) {
          console.error('Error fetching stock data:', error);
          res.status(500).json({ error: 'Failed to fetch stock data' });
        }
      } else {
        // Handle single stock
        try {
          const response = await fetch(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stockQuery}/quote`);
          const data = await response.json();

          if (data && data.symbol && data.latestPrice) {
            // Handle single stock like
            if (like) {
              if (!stockLikes[data.symbol]) stockLikes[data.symbol] = 0;
              stockLikes[data.symbol] += 1;
            }

            const stockData = {
              stock: data.symbol,
              price: data.latestPrice,
              likes: stockLikes[data.symbol] || 0
            };

            res.json({ stockData });
          } else {
            res.status(404).json({ error: 'Stock data not found' });
          }
        } catch (error) {
          console.error('Error fetching stock data:', error);
          res.status(500).json({ error: 'Failed to fetch stock data' });
        }
      }
    });
};
