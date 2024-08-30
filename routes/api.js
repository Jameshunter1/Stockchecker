const fetch = import('node-fetch'); // Ensure node-fetch is installed

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

          // Initialize likes count
          let likes = [0, 0];

          // Update likes if 'like' query is true
          if (like) {
            likes = [1, 1];
          }

          const stockData = data.map((stock, index) => ({
            stock: stock.symbol,
            price: stock.latestPrice,
            likes: likes[index] // Set likes based on the array
          }));

          // Calculate relative likes if two stocks are provided
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
              likes: like ? 1 : 0 // Set likes based on the like query
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
