import React, { useState } from "react";
import RecipeCard from "./Pages/RecipeCard";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

const DishCard = ( { dish: { id, title } } ) => {

  return (
    <div>
      <div>
        <h3>{title}</h3>
        <div></div>
      </div>
      <Link to={`/recipe/${ id }`}>Show recipe</Link>
      <Routes>
        <Route path={`/recipe/${ id }`} element={<RecipeCard id={id} />} />
      </Routes>
    </div>


  )
}

export default DishCard;