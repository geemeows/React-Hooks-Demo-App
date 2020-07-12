import React, { useState, useEffect, useCallback } from 'react';
import consumeAPI from '../../fetch'

import IngredientForm from './IngredientForm';
import IngredientsList from './IngredientList'
import Search from './Search';
import ErrorModal from '../UI/ErrorModal'

const serverHttp = new consumeAPI('https://burger-builder-5404b.firebaseio.com')

const Ingredients = () => {
  const [ingredients, setIngredients] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState()

  useEffect(() => {
    console.log('RERENDERED', ingredients)
  }, [ingredients])

  const filterIngredients = useCallback(filteredIngredients => {
    setIngredients(filteredIngredients)
  }, [])

  const addIngredient = async (ingredient) => {
    try {
      setIsLoading(true)
      const response = await serverHttp.post('/ingredients.json', ingredient)
      const parsedRes = await response.json()
      setIsLoading(false)
      const newIngredient = {
        id: parsedRes.name,
        ...ingredient
      }
      setIngredients(prevIngredients => [...prevIngredients, newIngredient])
    } catch (err) {
      setIsLoading(false)
      setError('Something went wrong!')
    }

  }

  const removeIngredient = async (id) => {
    try {
      setIsLoading(true)
      await serverHttp.delete(`/ingredients/${id}.json`)
      setIsLoading(false)
      setIngredients(prevIngredients => prevIngredients.filter(ingredient => ingredient.id !== id ))
      
    } catch (err) {
      setIsLoading(false)
      setError('Something went wrong!')
    }
  }

  return (
    <div className="App">
      { error && <ErrorModal onClose={() => { setError(null) }}>{error}</ErrorModal>}
      <IngredientForm addIngredient={addIngredient} loading={isLoading} />

      <section>
        <Search filter={filterIngredients}/>
        <IngredientsList ingredients={ingredients} onRemoveItem={removeIngredient} />
      </section>
    </div>
  );
}

export default Ingredients;
