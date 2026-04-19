module.exports = function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({
    mapboxToken: process.env.MAPBOX_TOKEN || '',
  });
};
