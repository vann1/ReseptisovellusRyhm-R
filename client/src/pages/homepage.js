import React, { useState, useEffect } from 'react';
const HomePage = () => {
    const [input, setInput] = useState('');
    const searchRecipes = async () => {
        try {
            console.log("lol")
            const response = await fetch("http://localhost:3001/api/recipe/searchAll", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ input }),
            });
            const data = await response.json();
            if (!response.ok) {
              throw new Error(data.error);
            } 
            
            if (response.ok) {
                console.log(data)
            } 
          } catch (error) {
            console.error("Error:", error);
          }
    }




    return(
        <div className="container-home">
            <div className="homepage-top">
                <h1>Resepti haku</h1>
                <div className="homepage-search">
                    <input type="text" className="home-search-input" placeholder="Etsi..." onChange={(e) => setInput(e.target.value)}></input><button onClick={() => searchRecipes()} className="home-search-button">Hae</button>
                </div>
            </div>
        </div>
    )
  };
    
  
  export  {HomePage};