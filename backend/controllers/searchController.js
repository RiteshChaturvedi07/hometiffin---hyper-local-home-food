
const CookProfile = require('../models/CookProfile');

exports.findNearestCooks = async (req, res) => {
  const { lat, lng, radius = 5, category } = req.query;

  try {
    const query = {
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: radius * 1000 // converts km to meters
        }
      }
    };

    if (category) {
      query.categories = category;
    }

    const cooks = await CookProfile.find(query).limit(20);
    res.json(cooks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch nearby cooks", details: err.message });
  }
};
