"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectUserOrAdmin, ensureAdmin } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
// const UInser = require("../models/user");
const Ingredient = require("../models/ingredient");
const { createToken } = require("../helpers/tokens");
const db = require("../db");
// const userNewSchema = require("../schemas/userNew.json");
// const userUpdateSchema = require("../schemas/userUpdate.json");

const router = express.Router();

// #################################################################
// Adding an Ingredient
// #################################################################

router.post('/', async function (req, res, next){

console.log('route working')
console.log(req.body)
const ingredient = await Ingredient.create(req.body)
console.log(ingredient)



    return res.send(ingredient)
})

// #################################################################
// Adding all Ingredients
// #################################################################

router.post('/full-recipe', async function (req, res, next){

console.log('route working')
console.log(req.body)
const ingredient = await Ingredient.createAll(req.body)
console.log(ingredient)



    return res.send(ingredient)
})

router.get('/:username', async function(req, res, next){
    let {username} = req.params
    console.log('route working')
    console.log(username)

    const result = await Ingredient.getAll(username)


    console.log(result)
    res.send(result)


})




// #################################################################
// Getting the single ingredient
// #################################################################
router.get('/:username/:iname', async function(req, res, next){
let {username, iname} = req.params

const result = await Ingredient.get(iname, username)
console.log(result)

return res.send(result)


})

// #################################################################
//updating the ingredient - specifically the amount
// #################################################################
router.patch('/', async function (req, res, next){

console.log('route working')
console.log(req.body)
const ingredient = await Ingredient.update(req.body)
console.log(ingredient)



    return res.send(ingredient)
})

// #################################################################
// #################################################################

// get all ingredients for a user
// router.get('/:username', async function (req, res, next){
//     let {username} = req.params

//     const ingredients = await Ingredient.getAll(username)


//     return res.send('')
// })


module.exports = router