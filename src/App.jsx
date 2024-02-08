import { GoogleGenerativeAI } from "@google/generative-ai";
import React,{ useState } from 'react'
import DishCard from "./DishCard";
import './DishCard.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
function App() {
  const [ loading, setLoading ] = useState( false );
  const [ dish, setdish ] = useState( [] );

  const API_KEY = "AIzaSyAiig2jH8mm5fJ9B6bGsiFMVQMMxnW53gU";

  async function fetchDataFromGeminiProVisionAPI() {
    try {
      const generationConfig = {
        maxOutputTokens: 8000,
      };
      setLoading( true );
      const genAI = new GoogleGenerativeAI( API_KEY );
      const model = genAI.getGenerativeModel( { model: "gemini-pro-vision", generationConfig } );

      const promptIng = "List only the ingredients or dishes shown in the image separated by comma";

      const fileInputEl = document.querySelector( "input[type=file]" );
      const imageParts = await Promise.all(
        [ ...fileInputEl.files ].map( fileToGenerativePart )
      );
    
      const resultIng = await model.generateContent( [ promptIng, ...imageParts ] );
      const textIng = resultIng.response.text();

      setLoading( false );

      const ingredientsArray = textIng.split( ',' ).map( item => item.trim() );

      await displayDishes( ingredientsArray );
      console.log( ingredientsArray )
      searchDish( { ingredientsArray } )

      async function searchDish( { ingredientsArray } ) {
        const API_KEY_R = "74e551a8abb34db0832b283b4e2fb388";
        const API_URL = `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${ API_KEY_R }`
        try {

          const response = await fetch( `${ API_URL }&ingredients=${ ingredientsArray.join( "," ) }&number=4` );
          const data = await response.json();
          setdish( data || [] );
        }
        catch ( error ) {
          console.error( "Error fetching data: ", error );
        }
      };

    } catch ( error ) {
      setLoading( false );
      console.error( "fetchDataFromGeminiAPI error: ", error );
    }
  }

  async function fileToGenerativePart( file ) {
    const base64EncodedDataPromise = new Promise( ( resolve ) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve( reader.result.split( "," )[ 1 ] );
      reader.readAsDataURL( file );
    } );
    return {
      inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
  }

  async function displayDishes( dishes ) {
    const dishListElement = document.getElementById( 'dishList' );
    dishListElement.innerHTML = '';
    for ( let i = 0; i < dishes.length; i++ ) {
      const dish = dishes[ i ];

      const listItem = document.createElement( 'li' );
      listItem.textContent = dish;

      dishListElement.appendChild( listItem );
    }

    console.log( dish )
  }

  return (
    <>
    <Router>
      <div>
        <input className="input-file" type="file" />

        <button
          disabled={loading}
          onClick={() => fetchDataFromGeminiProVisionAPI()}
        >
          {loading ? "Loading..." : "Get Recipe"}
        </button>
        <div className="response">
          <div className="ingre">
            <p>Ingredients:</p>
            <ul id="dishList"></ul>
          </div>

          <div>
            {dish.map( ( dish ) => (
              <DishCard dish={dish} key={dish.id} />
              
            ) )}
          </div>

        </div>
      </div>

      </Router>
    </>
  );
}

export default App;
