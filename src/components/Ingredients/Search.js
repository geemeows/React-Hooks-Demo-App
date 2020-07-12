import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';
import consumeAPI from '../../fetch'

const serverHttp = new consumeAPI('https://burger-builder-5404b.firebaseio.com')

const Search = ({ filter }) => {
  const [title, setTitle] = useState('')
  const inputRef = useRef()

  useEffect(() => {
    const timer = setTimeout(() => {
      if (title === inputRef.current.value) {
        const query = title.length === 0 ? '' : `?orderBy="title"&equalTo="${title}"`;
        (async () => {
         try {
           const response = await serverHttp.get(`/ingredients.json${query}`)
           const parsedIngredients = await response.json()
           const ingredients = [] 
           for (let key in parsedIngredients) {
            ingredients.push({
              id: key,
              title: parsedIngredients[key].title,
              amount: parsedIngredients[key].amount,
            })
           }
           filter(ingredients)
         } catch (e) {
           console.log(e)
         }
       })()
      }
    }, 500)
    return () => {
      clearTimeout(timer)
    }
 }, [title, filter])

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input 
            ref={inputRef}
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)} />
        </div>
      </Card>
    </section>
  );
}

export default React.memo(Search)
