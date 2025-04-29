const Tag = require('../models/Tag');

exports.getTrendingTags = async (req, res) => {
    try {
        // Trending by usage in last 24 hours
        const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const trending = await Tag.find({ lastActivity: { $gte: since } })
            .sort({ usageCount: -1 })
            .limit(10);

        res.json(trending);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}; 