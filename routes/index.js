const express = require('express');
const router = express.Router();
const axios = require('axios');
const SavedRecipe = require('../models/SavedRecipe');

const MEAL_DB = 'https://www.themealdb.com/api/json/v1/1';

router.get('/', async (req, res) => {
  try {
    const response = await axios.get(`${MEAL_DB}/filter.php?c=Dessert`);
    const allMeals = response.data.meals || [];
    const featured = allMeals.sort(() => 0.5 - Math.random()).slice(0, 8);
    res.render('index', { featured, query: '' });
  } catch (err) {
    console.error('Home page error:', err.message);
    res.render('index', { featured: [], query: '' });
  }
});

router.get('/search', async (req, res) => {
  const query = (req.query.q || '').trim();
  if (!query) return res.redirect('/');
  try {
    const response = await axios.get(`${MEAL_DB}/search.php?s=${encodeURIComponent(query)}`);
    const meals = response.data.meals || [];
    res.render('search', { meals, query });
  } catch (err) {
    console.error('Search error:', err.message);
    res.render('search', { meals: [], query });
  }
});

router.get('/recipe/:id', async (req, res) => {
  try {
    const response = await axios.get(`${MEAL_DB}/lookup.php?i=${req.params.id}`);
    const meal = response.data.meals?.[0];
    if (!meal) return res.status(404).render('error', { message: 'Recipe not found' });

    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const name = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (name && name.trim()) {
        ingredients.push({ name: name.trim(), measure: (measure || '').trim() });
      }
    }

    const saved = await SavedRecipe.findOne({ mealId: meal.idMeal });
    res.render('recipe', { meal, ingredients, isSaved: !!saved });
  } catch (err) {
    console.error('Recipe detail error:', err.message);
    res.status(500).render('error', { message: 'Failed to load recipe' });
  }
});

module.exports = router;
