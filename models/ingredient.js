"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql");
const ingredientHelper  = require('../helpers/ingredientParser')
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");



class Ingredient{

// create a new ingredient
static async create({name, unit, full_amount, available_amount, username}){
console.log('***made it model***')
    const result = await db.query(
        `INSERT INTO ingredients
         (name, unit, full_amount, available_amount, username)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, name, unit, full_amount, available_amount`,
      [
        name,
        unit,
        full_amount,
        available_amount,
        username
      ]);
  const ingredient = result.rows[0];

  console.log({res:ingredient})
return ingredient
    
}
// ###############################################################
// takes an array of ingredients and adds it in
// ###############################################################
static async createAll({username, ingredients}){
    
    console.log([username, ingredients])

    let parsedIngredients = ingredientHelper.parser(ingredients)
    console.log({inModel:parsedIngredients})

    let JSONIngredients = await ingredientHelper.ZestfulApi(parsedIngredients)

    let ingredientsReadyForDB = ingredientHelper.converter(JSONIngredients)

    

    return ingredientsReadyForDB
}

// #################################################
// get all ingredients held by the user
// #################################################
static async getAll(username){
    console.log('model working')
    const result = await db.query(`
    SELECT  id, name, unit, full_amount, available_amount
    From ingredients
    WHERE username = $1 
    `, [username])

    // console.log(result)
    let ingredient = result.rows
    console.log({ingredient:ingredient})

    return ingredient

}

// get a singular ingredient
static async get(iName, username){

    const result = await db.query(
        `SELECT  id, name, unit, full_amount, available_amount
        FROM ingredients
        WHERE name = $1 username = $2`, [iName, username]
    )
    
    let ingredient = result.rows[0]
    console.log(ingredient)

    return ingredient
}


// Update the individual ingredient
static async update({id, available_amount}){
    console.log('model working')
    console.log([id, available_amount])
    const result = await db.query(
        `UPDATE  ingredients
         SET available_amount = $1
         WHERE id = $2         
         RETURNING id, name, unit, full_amount, available_amount`,
      [
        available_amount,
        id
      ]);
  const ingredient = result.rows[0];
      console.log({ingredient:ingredient})

      return ingredient

}

// delete the ingredient
static remove(username, iname){


}





}


module.exports = Ingredient