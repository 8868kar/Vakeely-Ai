const express = require('express');
const LegalAct = require('../models/LegalAct');

const router = express.Router();

// Get all acts (with optional category filter)
router.get('/acts', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = {};
    if (category) filter.category = category;

    const acts = await LegalAct.find(filter).select('title shortTitle category year description keywords');
    res.json(acts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch acts', error: error.message });
  }
});

// Get act by ID with full sections
router.get('/acts/:id', async (req, res) => {
  try {
    const act = await LegalAct.findById(req.params.id);
    if (!act) return res.status(404).json({ message: 'Act not found' });
    res.json(act);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch act', error: error.message });
  }
});

// Search legal database by keywords
router.post('/search', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ message: 'Search query is required' });

    const searchTerms = query.toLowerCase().split(' ');

    const acts = await LegalAct.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { keywords: { $in: searchTerms } },
        { 'sections.keywords': { $in: searchTerms } },
        { 'sections.title': { $regex: query, $options: 'i' } },
        { 'sections.description': { $regex: query, $options: 'i' } }
      ]
    });

    // Also find matching sections within the acts
    const results = [];
    acts.forEach(act => {
      const matchingSections = act.sections.filter(section => {
        const sectionText = `${section.title} ${section.description} ${section.keywords.join(' ')}`.toLowerCase();
        return searchTerms.some(term => sectionText.includes(term));
      });

      results.push({
        act: { title: act.title, shortTitle: act.shortTitle, category: act.category, id: act._id },
        matchingSections: matchingSections.length > 0 ? matchingSections : act.sections.slice(0, 2)
      });
    });

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Search failed', error: error.message });
  }
});

// Get categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await LegalAct.distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch categories', error: error.message });
  }
});

module.exports = router;
