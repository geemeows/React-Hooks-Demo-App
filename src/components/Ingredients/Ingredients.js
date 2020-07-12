import React, { useReducer, useEffect, useCallback } from 'react';
import consumeAPI from '../../fetch'

import IngredientForm from './IngredientForm';
import IngredientsList from './IngredientList'
import Search from './Search';
import ErrorModal from '../UI/ErrorModal'

const serverHttp = new consumeAPI('https://burger-builder-5404b.firebaseio.com')

const ingredientsReducer = (currentIngredients, { type, payload }) => {
  switch (type) {
    case 'SET': 
      return payload
    case 'ADD':
      return [...currentIngredients, payload]
    case 'DELETE':
      return currentIngredients.filter(it => it.id !== payload)
    default:
      throw new Error('This cannot happen!')
  }
}
const httpReducer = (currentHttpState, { type, payload }) => {
  switch (type) {
    case 'SEND':
      return { isLoading: true, error: null }
    case 'RESPONSE':
      return { ...currentHttpState, isLoading: false }
    case 'ERROR': 
      return { isLoading: false, error: payload }
    case 'CLEAR':
      return { ...currentHttpState, error: null }
    default:
      throw new Error('Not happening')
  }
}

const Ingredients = () => {
  const [ingredients, dispatch] = useReducer(ingredientsReducer, [])
  const [{ isLoading, error}, dispatchHttp] = useReducer(httpReducer, { isLoading: false, error: null })

  useEffect(() => {
    console.log('RERENDERED', ingredients)
  }, [ingredients])

  const filterIngredients = useCallback(filteredIngredients => {
    dispatch({ type: 'SET', payload: filteredIngredients })
  }, [])

  const addIngredient = async (ingredient) => {
    try {
      dispatchHttp({ type: 'SEND' })
      const response = await serverHttp.post('/ingredients.json', ingredient)
      const parsedRes = await response.json()
      dispatchHttp({ type: 'RESPONSE' })
      const newIngredient = {
        id: parsedRes.name,
        ...ingredient
      }
      dispatch({ type: 'ADD', payload: newIngredient })
      
    } catch (err) {
      dispatchHttp({ type: 'ERROR', payload: 'Something went wrong!' })
      
    }

  }

  const removeIngredient = async (id) => {
    try {
      dispatchHttp({ type: 'SEND' })
      await serverHttp.delete(`/ingredients/${id}.json`)
      dispatchHttp({ type: 'RESPONSE' })
      dispatch({ type: 'DELETE', payload: id })
      
    } catch (err) {
      dispatchHttp({ type: 'ERROR', payload: 'Something went wrong!' })
    }
  }

  return (
    <div className="App">
      { error && <ErrorModal onClose={() => { dispatchHttp({ type: 'CLEAR'}) }}>{error}</ErrorModal>}
      <IngredientForm addIngredient={addIngredient} loading={isLoading} />

      <section>
        <Search filter={filterIngredients}/>
        <IngredientsList ingredients={ingredients} onRemoveItem={removeIngredient} />
      </section>
    </div>
  );
}

export default Ingredients;
