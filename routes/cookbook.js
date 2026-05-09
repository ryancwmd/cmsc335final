const express = require('express');
const router = express.Router();
const SavedRecipe = require('../models/SavedRecipe');

router.get('/', async (req, res) => {
  try {
    const recipes = await SavedRecipe.find().sort({ savedAt: -1 });
    res.render('cookbook', { recipes });
  } catch (err) {
    console.error('Cookbook error:', err.message);
    res.status(500).render('error', { message: 'Failed to load cookbook' });
  }
});

router.post('/', async (req, res) => {
  const { mealId, name, category, thumbnail, notes, difficulty } = req.body;
  try {
    await SavedRecipe.findOneAndUpdate(
      { mealId },
      { mealId, name, category, thumbnail, notes, difficulty },
      { upsert: true, new: true }
    );
    res.redirect('/cookbook');
  } catch (err) {
    console.error('Save recipe error:', err.message);
    res.status(500).render('error', { message: 'Failed to save recipe' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await SavedRecipe.findByIdAndDelete(req.params.id);
    res.redirect('/cookbook');
  } catch (err) {
    console.error('Delete recipe error:', err.message);
    res.status(500).render('error', { message: 'Failed to delete recipe' });
  }
});

module.exports = router;
