const mongoose = require('mongoose');

const savedRecipeSchema = new mongoose.Schema({
  mealId:     { type: String, required: true, unique: true },
  name:       { type: String, required: true },
  category:   { type: String, default: '' },
  thumbnail:  { type: String, default: '' },
  notes:      { type: String, default: '' },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  savedAt:    { type: Date, default: Date.now }
});

module.exports = mongoose.model('SavedRecipe', savedRecipeSchema);
