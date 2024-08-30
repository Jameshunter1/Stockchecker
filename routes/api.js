// In-memory store for likes (for demonstration purposes only)
const stockLikes = {};

module.exports = function (app) {
  app.route('/api/stock-prices')
    .get(async (req, res) => {
      const stockQuery = req.query.stock;
      const like = req.query.like === 'true';

      // Handle case for multiple stocks
      if (Array.isArray(stockQuery)) {
        try {
          const responses = await Promise.all(stockQuery.map(stock => 
            fetch(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock}/quote`)
          ));
          const data = await Promise.all(responses.map(response => response.json()));

          let likes = [0, 0];

          if (like) {
            likes = [1, 1];
            stockQuery.forEach((stock, index) => {
              stockLikes[stock] = (stockLikes[stock] || 0) + likes[index];
            });
          }

          const stockData = data.map((stock, index) => ({
            stock: stock.symbol,
            price: stock.latestPrice,
            likes: stockLikes[stock.symbol] || 0
          }));

          if (stockQuery.length === 2) {
            const rel_likes = Math.abs(stockData[0].likes - stockData[1].likes);
            stockData.forEach(stock => stock.rel_likes = rel_likes);
          }

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
            const stockData = {
              stock: data.symbol,
              price: data.latestPrice,
              likes: like ? (stockLikes[data.symbol] = (stockLikes[data.symbol] || 0) + 1) : (stockLikes[data.symbol] || 0)
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
