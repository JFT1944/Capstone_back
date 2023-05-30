const { default: axios } = require("axios");
const { response } = require("express");
const Ingredient = require("../models/ingredient.js");
const db = require("../db");

let sizeLibrary = {
  US: {
    teaSpoon: {
      dash: 0.125,
      pinch: 0.125,
      teaspoon: 1,
      tableSpoon: 3,
      tablespoon: 3,
      cup: 48,
      oz: 6,
      pint: 96,
      pound: 96,
      lbs: 96,
      quart: 192,
      gallon: 768,
    },
  },
  SI: {
    millimeter: 1,
    ml: 1,
    gram: 1,
    kilogram: 1000,
    kg: 1000,
    liter: 1000,
    litre: 1000,
    l: 1000,
    L: 1000,
  },
};

class ingredientHelper {
  // Find the best way to remove the \n from the strings.

  static parser(ingredients) {
    console.log({ japs: ingredients });
    ingredients = ingredients.split("\n");
    console.log(ingredients);
    ingredients = ingredients.filter((x) => x);
    console.log({ iii: ingredients });

    return ingredients;
  }

  static async ZestfulApi(arr) {
    console.log(arr);

    const options = {
        method: 'POST',
        url: 'https://zestful.p.rapidapi.com/parseIngredients',
        headers: {
          'content-type': 'application/json',
          'X-RapidAPI-Key': 'e3e3ebfe2bmsh32fc83cb6ea9cedp192745jsn6804da7e4111',
          'X-RapidAPI-Host': 'zestful.p.rapidapi.com'
        },
        data: {
          ingredients: arr
        }
      };

      try {
          const response = await axios.request(options);
          console.log(response.data.results);
          return response.data.results
      } catch (error) {
          console.error(error);
      }
    // *********
    // return [
    //   {
    //     confidence: 0.08906,
    //     error: null,
    //     ingredientParsed: {
    //       preparationNotes: "sparkling white wine",
    //       product: "dry alcohol",
    //       productSizeModifier: null,
    //       quantity: 3,
    //       unit: "cup",
    //       usdaInfo: null,
    //     },
    //     ingredientRaw:
    //       "3 cups dry alcohol of choice, (Vodka, champagne, Prosecco, sparkling white wine)",
    //   },
    //   {
    //     confidence: 0.9169057,
    //     error: null,
    //     ingredientParsed: {
    //       preparationNotes: null,
    //       product: "semisweet chocolate",
    //       productSizeModifier: null,
    //       quantity: 5,
    //       unit: "ounce",
    //       usdaInfo: [Object],
    //     },
    //     ingredientRaw:
    //       "5 ounces (150g) semisweet chocolate, broken into smaller blocks or chopped",
    //   },
    //   {
    //     confidence: 0.613535,
    //     error: null,
    //     ingredientParsed: {
    //       preparationNotes: null,
    //       product: "coconut",
    //       productSizeModifier: null,
    //       quantity: 5,
    //       unit: "ounce",
    //       usdaInfo: null,
    //     },
    //     ingredientRaw:
    //       "5 ounces (150g) milk chocolate, broken into smaller blocks or chopped",
    //   },
    // ];
  }

  static async converter(arr) {
    // ************************************
    // ************************************
    // Take arr, convert unit to minimum, add converted unit to object.
    // ************************************
    // ************************************
    // if(arr.)
    for (let ing of arr) {
      console.log("************");
      console.log("************");
      console.log(ing.ingredientParsed);
      console.log(sizeLibrary.US.teaSpoon[ing.ingredientParsed.unit]);
      ing.ingredientParsed.convertedAmt =
        sizeLibrary.US.teaSpoon[ing.ingredientParsed.unit];
      console.log(ing.ingredientParsed);
      console.log("************");
      console.log("************");

      try {
        // let checkedIngredient = await Ingredient.get()
      } catch (e) {
        console.log(e);
      }
    }
  }

  static async sorter(username, data) {
    let ingredientsToCheck
    let usersIngredients
    try {
        let res = await db.query(
          `SELECT  id, name, unit, full_amount, available_amount
          FROM ingredients
          WHERE username = $1`,
          [username]
        );
        usersIngredients = res.rows
        ingredientsToCheck = res.rows.map(x => x.name)
        // console.log(res.rows);
      } catch (error) {
        console.log(error);
      }
    
    try {
        console.log(usersIngredients)
        console.log(ingredientsToCheck)
      for (let i of data) {
        console.log({ inSorter: i.ingredientParsed.product });
        if(ingredientsToCheck.find(x => x === i.ingredientParsed.product)){
            console.log('true')
            let newu = usersIngredients.filter(x => x.name ===  i.ingredientParsed.product)
            console.log({newu:newu})
            console.log({newu:newu[0].available_amount, quuu:i.ingredientParsed.quantity})
            let subtractedAmount = parseInt(newu[0].available_amount) - i.ingredientParsed.quantity
            console.log(subtractedAmount)
            const result = await db.query(
                `UPDATE  ingredients
                 SET available_amount = $1
                 WHERE id = $2         
                 RETURNING id, name, unit, full_amount, available_amount`,
              [
                subtractedAmount,
                newu[0].id
              ]);
          const ingredient = result.rows[0];
              console.log({ingredient:ingredient})


            
        }else{
            console.log('false')
            let res = await db.query(`
            INSERT INTO ingredients
         (name, unit, full_amount, available_amount, username)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, name, unit, full_amount, available_amount`, 
         [i.ingredientParsed.product,
        i.ingredientParsed.unit ? i.ingredientParsed.unit : 'other', 
        0, 
        -i.ingredientParsed.quantity,
        username])
        let newIng = res.rows[0]
        console.log(newIng)
    }
        
      }
      return 'All should be added'
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = ingredientHelper;
