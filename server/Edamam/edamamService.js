const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

const app_id = process.env.APP_ID;
const app_key = process.env.APP_KEY;

const fetchAutocomplete =  async (query) => {
    return await axios.get(`https://api.edamam.com/auto-complete?app_id=${app_id}&app_key=${app_key}&q=${query}`)
    .then( response => {
        return response.data;  
    })
    .catch(error => {
        console.log(error)
    })
    .finally(function() {
        console.log("This will always run");
    });
}

const fetchHints =  async (query) => {
    return await axios.get(`https://api.edamam.com/api/food-database/v2/parser?app_id=${process.env.APP_ID}&app_key=${process.env.APP_KEY}&ingr=${query}&nutrition-type=cooking`)
    .then( response => {
        console.log(response.data);
        return response.data;  
    })
    .catch(error => {
        console.log('fetch hints error: ', error);
    })
    .finally(function() {
        console.log("This will always run");
    });
}

const fetchNutrition =  async (ingredients) => {
  const url = `https://api.edamam.com/api/food-database/v2/nutrients?app_id=${process.env.APP_ID}&app_key=${process.env.APP_KEY}`;

  try {
    const response = await axios.post(url, ingredients, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    console.log("Nutrition Data:", response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Nutrition fetch Error:", error.response.status, error.response.data);
    } else {
      console.error("Nutrition fetch Error:", error.message);
    }
  }
}

module.exports = {
    fetchAutocomplete,
    fetchHints,
    fetchNutrition
};