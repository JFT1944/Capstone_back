const { default: axios } = require("axios")
const { response } = require("express")
const Ingredient = require('../models/ingredient.js')


let sizeLibrary = {
    US:{
        teaSpoon:{
            dash:.125, 
            pinch:.125,
            teaspoon:1, 
            tableSpoon:3,
            tablespoon:3,
            cup:48,
            oz:6,
            pint:96,
            pound:96,
            lbs:96,
            quart:192,
            gallon:768
        }},
    SI:{
        millimeter:1,
        ml:1,
        gram:1,
        kilogram: 1000,
        kg:1000,
        liter: 1000,
        litre:1000,
        l:1000,
        L:1000
    }
}





class ingredientHelper{









    

static parser(ingredients){

    ingredients = ingredients.split(' ')
    let newIngredientIdx = []
    let ingredientParts = []
for(let i=0;i < ingredients.length; i++){
    console.log({ingredients:ingredients[i], idx: i})

    if((parseInt(ingredients[i]))){
        newIngredientIdx.push(i)
        ingredientParts.push([ingredients[i]])
    } else{
        ingredientParts[ingredientParts.length -1].push(ingredients[i].toLowerCase())
    }

}
console.log({newIngredients:newIngredientIdx})
console.log({ingredientParts:ingredientParts})


return ingredientParts.map((x) => x.join(' '))
}


static async ZestfulApi(arr){
    console.log(arr)
    
    
    
    // const options = {
    //     method: 'POST',
    //     url: 'https://zestful.p.rapidapi.com/parseIngredients',
    //     headers: {
    //       'content-type': 'application/json',
    //       'X-RapidAPI-Key': 'e3e3ebfe2bmsh32fc83cb6ea9cedp192745jsn6804da7e4111',
    //       'X-RapidAPI-Host': 'zestful.p.rapidapi.com'
    //     },
    //     data: {
    //       ingredients: arr
    //     }
    //   };
      
    //   try {
    //       const response = await axios.request(options);
    //       console.log(response.data.results);
    //       return response.data.results
    //   } catch (error) {
    //       console.error(error);
    //   }

    return [
        {
          confidence: 0.9962479,
          error: null,
          ingredientParsed: {
            preparationNotes: null,
            product: 'olive oil',
            productSizeModifier: null,
            quantity: 1,
            unit: 'tablespoon',
            usdaInfo: [Object]
          },
          ingredientRaw: '1 tablespoon olive oil'
        },
        {
          confidence: 0.378027,
          error: null,
          ingredientParsed: {
            preparationNotes: null,
            product: 'extra lean ground turkey',
            productSizeModifier: null,
            quantity: 1,
            unit: 'pound',
            usdaInfo: null
          },
          ingredientRaw: '1 pound extra lean ground turkey'
        }
      ]

}

static async converter(arr){
// ************************************
// ************************************
// Take arr, convert unit to minimum, add converted unit to object. 
// ************************************
// ************************************
    // if(arr.)
    for(let ing of arr){
        console.log('************')
        console.log('************')
        console.log(ing.ingredientParsed)
        console.log(sizeLibrary.US.teaSpoon[ing.ingredientParsed.unit])
        ing.ingredientParsed.convertedAmt = sizeLibrary.US.teaSpoon[ing.ingredientParsed.unit]
        console.log(ing.ingredientParsed)
        console.log('************')
        console.log('************')

        try{
            let checkedIngredient = await Ingredient.get()
        } catch(e){
            console.log(e)
        }
    }



}


    
}


module.exports = ingredientHelper