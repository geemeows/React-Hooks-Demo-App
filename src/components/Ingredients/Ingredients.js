import React, { useState, useEffect, useCallback } from 'react';
import consumeAPI from '../../fetch'

import IngredientForm from './IngredientForm';
import IngredientsList from './IngredientList'
import Search from './Search';

const serverHttp = new consumeAPI('https://burger-builder-5404b.firebaseio.com')

const Ingredients = () => {
  const [ingredients, setIngredients] = useState([])

  useEffect(() => {
    console.log('RERENDERED', ingredients)
  }, [ingredients])

  const filterIngredients = useCallback(filteredIngredients => {
    setIngredients(filteredIngredients)
  }, [])

  const addIngredient = async (ingredient) => {
    try {
      const response = await serverHttp.post('/ingredients.json', ingredient)
      const parsedRes = await response.json()
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
        <Search filter={filterIngredients}/>
        <IngredientsList ingredients={ingredients} onRemoveItem={() => {}} />
      </section>
    </div>
  );
}

export default Ingredients;
