import React, { useState } from 'react';
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from 'react-router-dom';
const RuokaKategoria = () => {
  //ContextApi for current user
  const {user} = useAuthContext();
  const navigate = useNavigate();
  //Muuttujat
  const [RecipeCategory, setRecipeCategory] = useState(null);
  const [IngAmount, setIngAmount] = useState('');
  const [IngMeasure, setIngMeasure] = useState('ml');
  const [IngName, setIngName] = useState('');
  const [RecipeName, setRecipeName] = useState('');
  const [Ingredients, setIngredients] = useState([]); 
  const [RecipeDesc, setRecipeDesc] = useState('');
  const [RecipeGuide, setRecipeGuide] = useState('');
  const [Tags, setTags] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  //Vaihtoehdot kategorialle ja ainesosan mitalle
  const Kategoria = ['Alkupala', 'Juoma', 'Välipala', 'Pääruoka', 'Jälkiruoka', 'Leivonnaiset', 'Muu'];
  const options = ['ml', 'tl', 'rkl', 'dl', 'l', 'kkp' ,'g', 'kg', 'kpl'];
  const [RecipeReg, setRecipeReg] = useState(0);

  
  /*Mitat:
  Tilavuus:
  ml = millilitra 1ml
  tl = teelusikka 5ml
  rkl = ruokalusikka 15ml
  dl= desilitra 100ml 
  kkp = kahvikuppi 150ml / 1,5 dl
  l = litra = 1000 ml / 10 dl
  Paino:
  g = gramma 1g
  kg = kilogramma 1000g
  Muut:
  kpl = kappale
  */

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const base64Data = await readFileAsBase64(file);
        setSelectedFile(base64Data);
      } catch (error) {
        console.error('Error reading file as base64:', error);
      }
    }
  };

  const handleCheckboxChange = () => {
    setRecipeReg(RecipeReg === 0 ? 1 : 0);
    
  };
  const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        reader.onload = () => {
          resolve(reader.result?.split(',')[1]);
        };
        reader.onerror = (error) => {
          reject(error);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        reject(error);
      }
    });
  };
  //use state changerit
  const CategoryChange = (option) => {
    setRecipeCategory(option);
  };

  const IngAmountChange = (event) => {
    const input = event.target.value.replace(/[^0-9]/g, '');
    setIngAmount(input);
  };

  const IngMeasureChange = (event) => {
    setIngMeasure(event.target.value);
  };

  const IngNameChange = (event) => {
    setIngName(event.target.value);
  };

  const RecipeNameChange = (event) => {
    setRecipeName(event.target.value);
  };

  const RecipeDescChange = (event) =>{
    setRecipeDesc(event.target.value);
  };

  const RecipeGuideChange = (event) => {
    setRecipeGuide(event.target.value)
  }

  const TagsChange = (event) => {
    setTags(event.target.value)
  }


  //Ainesosan lisääminen Varmistaa että inputit eivät ole tyhjiä
  const addIngredient = () => {
    if (IngAmount) {
      if (IngName){
      setIngredients([...Ingredients, { IngAmount, IngMeasure, IngName }]);
      setIngAmount('');
      setIngMeasure('ml');
      setIngName('');
    } else{
      alert('Ainesosan nimi puuttuu');
    }
    } else {
      alert('Ainesosan määrä puuttuu');
    }
  };
 

  //Heittää consoleen mitä tallentuu, tietokanta yhteys myöhemmin
  //Varmistaa että kentät eivät ole tyhjiä
  const TallennaBtnClick = async () => {
    if (RecipeName) {
      if (RecipeCategory){
        if(Ingredients.length > 0){
          if(RecipeGuide){
            const UserID = `${user.userid}`
            console.log(user);
            console.log(UserID);
            console.log(selectedFile);
            try {

              //checks if user is logged in to the site
              if(!user) {
                throw Error('Sinun täytyy kirjautuu sisään jotta voit luoda uusia reseptejä.')
             }
              const response = await fetch('http://localhost:3001/api/recipe/add', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                  UserID,
                  RecipeName,
                  RecipeCategory,
                  RecipeGuide,
                  RecipeDesc,
                  Tags,
                  Ingredients,
                  selectedFile,
                  RecipeReg,
                }),
              });
        
              if (response.ok) {
                console.log('Recipe added successfully');
              } else {
                console.error('Failed to add recipe:', response.statusText);
                //if not valid jwt token redirect to login
                navigate('/LoginPage')
              }
            } catch (error) {
              console.error('Error:', error.message);
            }

          } else{
            alert('Reseptin ohje puuttuu');
          }
        } else {
          alert('Reseptillä pitää olla vähintään 1 ainesosa.');
        }
      } else {
        alert('Reseptin kategoria puuttuu!')
      }
    } else {
      alert('Reseptin nimi puuttuu!');
    }
  };

  return (
    <form>
      <label>Reseptin nimi:</label>
      <input type="text" value={RecipeName} onChange={RecipeNameChange} />
        <p>Reseptin kategoria:</p>
      {Kategoria.map((option, index) => (
        <div id="RuokaKategoria" key={index}>
          <input
            type="checkbox"
            id={`checkbox-${index}`}
            value={option}
            checked={RecipeCategory === option}
            onChange={() => CategoryChange(option)}
          />
          <label htmlFor={`checkbox-${index}`}>{option}</label>
        </div>
      ))}
      
      <label >
        <input
          type="checkbox"
          checked={RecipeReg}
          onChange={handleCheckboxChange}
        />
        Vain rekisteröityneille käyttäjille?
      </label>
      <p>Ainesosat:</p>
      {Ingredients.map((ingredient, index) => (
        <div key={index} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <div>
            <label>Määrä:</label>
            <input type="text" value={ingredient.IngAmount} readOnly />
          </div>
          <div>
            <label>Mitta:</label>
            <input type="text" value={ingredient.IngMeasure} readOnly />
          </div>
          <div>
            <label>Ainesosa:</label>
            <input type="text" value={ingredient.IngName} readOnly />
          </div>
        </div>
      ))}
      
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <div>
          <label>Määrä:</label>
          <input type="text" value={IngAmount} onChange={IngAmountChange} />
        </div>
        <div>
          <select value={IngMeasure} onChange={IngMeasureChange}>
            {options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Ainesosa:</label>
          <input type="text" value={IngName} onChange={IngNameChange} />
        </div>
        <button type="button" onClick={addIngredient}>
        Lisää Ainesosa
        </button>
      </div>
      <div>
        <div>
        <label>Reseptin ohje:</label>
        <textarea type="text" value={RecipeGuide} onChange={RecipeGuideChange}></textarea>
      </div>
      <div>
       <label>Reseptin kuvaus:</label>
       <textarea type="text" value={RecipeDesc} onChange={RecipeDescChange}></textarea>
       </div>
       <div>
       <label>tags:</label>
       <textarea type="text" value={Tags} onChange={TagsChange}></textarea>
       </div>
      </div>
      <div>
      <input type="file" accept=".jpg, .jpeg, .png" onChange={handleFileChange} />
      </div>
      <button type="button" onClick={TallennaBtnClick}>
        Tallenna
      </button>
    </form>
  );
};

export default RuokaKategoria;