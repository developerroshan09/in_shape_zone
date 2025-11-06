const edamamApis = require('../Edamam/edamamService');
const dataTransformer = require('../Edamam/dataTransformer');
const { raw } = require('body-parser');
const { success } = require('zod');
const { response } = require('express');
const FoodInfo = require('../../models/food/FoodInfo');



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
            text: query,
            hints: rawData
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
            count: rawData.count,
            data: rawData
        });
    } catch(error) {
        console.error('Autocomplete error: ', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get autocomplete suggestions'
        });
    }
}

const saveFood = async (req, res) => {
    try {
        const foodInfoData = req.body;
        
        if (!foodInfoData.foodID) {
            return res.status(400).json({ error: "Missing foodID"});
        }

        const food = new FoodInfo(foodInfoData);
        await food.save();
        res.status(201).json(({ message: "FoodINfo saved succesfully", food }));
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message});
    }
};

//update food by id
const updateFood = (req,res) => {
    if(!req.body) {
        return res
            .status(400)
            .send({message:"Data to update cannot be empty"})
    }

    const id = req.params.id;
    
    FoodInfo.findByIdAndUpdate(id, req.body, { useFindAndModify:false })
        .then(data => {
            if(!data){
                res.status(404).send({ message: "Cannot update food with ${id},Maybe food not found"})
            }
            else{
                res.send({ 'message': "Food updated succesfully", 'data': data });
            }
        })
        .catch(err => {
            res.status(500).send({ message: "Error update Food information"})
        });
};

// retrieve and return all foods/ retrieve and return a single food
const fetchFoods = (req,res) => {
    if(req.query.id){
        const id = req.query.id;
        FoodInfo.findById(id)
            .then(data => {
                if(!data){
                    res.status(404).send({message:"Not found food with id "+id})
                } else {
                    res.send(data)
                }
            })
            .catch(err => {
                res.status(500).send({message:"Error retrieving food with id "+id})
            })
    } else {
        FoodInfo.find()
            .then(food => {
                res.send(food)
            })
            .catch(err => {
                res.status(500).send({message:err.message|| "Error occured while retrieving food information"})
            })
        }
};

// delete user by id
const deleteFood = (req, res) => {
    const id = req.params.id;

    FoodInfo.findByIdAndDelete(id)
        .then( data => {
            if (!data) {
                res.status(404).send({ message: 'Cannot delete food with id ${id), Maybe id is wrong'});
            } else {
                res.send({ message: "Food was deleted succesfully"});
            }
        })
        .catch(err => {
            res.status(500).send({ message: "Could not delete food with id = " + id});
        })
};

module.exports = { 
    getAutoComplete,
    fetchHints,
    fetchNutrition,
    saveFood,
    updateFood,
    fetchFoods,
    deleteFood
}