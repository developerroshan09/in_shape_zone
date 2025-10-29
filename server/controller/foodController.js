const edamamApis = require('../Edamam/edamamService');
const dataTransformer = require('../Edamam/dataTransformer');
const { raw } = require('body-parser');
const { success } = require('zod');
const { response } = require('express');



const fetchNutrition = async (req, res) => {
    try { 
        const ingredients = req.body;
        console.log('ingredients: ', ingredients);

        if(!ingredients) {
            return res.status(400).json({
                success: false,
                error: 'Query parameter is required'
            })
        }

        // fetch hints from Edamam api for specified term
        const rawData = await edamamApis.fetchNutrition(ingredients);
        console.log(rawData);

        //send refined response
        res.json({
            success: true,
            data: rawData
        });

    } catch(error) {
        console.error('Fetch Nutrition error: ', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get nutrition details'
        });
    }
}

const fetchHints = async (req, res) => {
    try { 
        const { query } = req.query;

        if(!query) {
            return res.status(400).json({
                success: false,
                error: 'Query parameter is required'
            })
        }

        // fetch hints from Edamam api for specified term
        const rawData = await edamamApis.fetchHints(query);
        console.log(rawData);

        //send refined response
        res.json({
            success: true,
            query: query,
            data: rawData
        });

    } catch(error) {
        console.error('Fetch Hints error: ', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get hints'
        });
    }
}

const getAutoComplete = async (req, res) => {
    try {
        const { query } = req.query;

        if(!query) {
            return res.status(400).json({
                success: false,
                error: 'Query parameter is required'
            })
        }

        // fetch raw data from Edamam
        const rawData = await edamamApis.fetchAutocomplete(query);
        // Transform to clean format
        const suggestions = dataTransformer.transformAutocomplete(rawData);
        console.log(suggestions);

        // send refined response
        res.json({
            success: true,
            query: query,
            count: suggestions.count,
            data: suggestions
        });
    } catch(error) {
        console.error('Autocomplete error: ', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get autocomplete suggestions'
        });
    }
}

module.exports = { 
    getAutoComplete,
    fetchHints,
    fetchNutrition
}