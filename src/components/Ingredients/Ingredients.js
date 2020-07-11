import React, { useState } from 'react';
import consumeAPI from '../../fetch'

import IngredientForm from './IngredientForm';
import IngredientsList from './IngredientList'
import Search from './Search';

const serverHttp = new consumeAPI('https://burger-builder-5404b.firebaseio.com')

const Ingredients = () => {
  const [ingredients, setIngredients] = useState([])

  const addIngredient = async (ingredient) => {
    // let options = {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(ingredient)
    // }

    try {
      const response = await serverHttp.post('/ingredients.json', ingredient)
      let parsedRes = await response.json()
      const newIngredient = {
        id: parsedRes.name,
        ...ingredient
      }
      console.log(newIngredient)
      setIngredients(prevIngredients => [...prevIngredients, newIngredient])
    } catch (e) {
      console.log(e)
    }

  }
  
  return (
    <div className="App">
      <IngredientForm addIngredient={addIngredient}/>

      <section>
        <Search />
        <IngredientsList ingredients={ingredients} onRemoveItem={() => {}} />
      </section>
    </div>
  );
}

export default Ingredients;
