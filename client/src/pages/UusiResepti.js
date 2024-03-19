import React, { useState } from 'react';
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from 'react-router-dom';
import '../styles/styles.css'

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
  const [image, setImage] = useState(null);

  
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
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
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

  const handleInputChange = (index, field, value) => {
    const updatedIngredients = [...Ingredients];
    updatedIngredients[index] = {
      ...updatedIngredients[index],
      [field]: value,
    };
    setIngredients(updatedIngredients);
  };


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
    <div className="component-background">
      <h1>Lisää uusi resepti</h1>
   
    <form>
       <div className="newrecipe">
      <div className="recipehalf">
      <label>Reseptin nimi: <br></br></label>
      <input type="text" value={RecipeName} onChange={RecipeNameChange} />
      <p>Reseptin kategoria:</p>
<div className="category-grid">
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
</div>
      
      <label >
        
        Vain rekisteröityneille käyttäjille?<br></br><input
          type="checkbox"
          checked={RecipeReg}
          onChange={handleCheckboxChange}
        /> Kyllä
      </label>
     <p>Ainesosat:</p>
<div className="ingredientlist">
   <div className="newingredient">
<table>
  <thead>
    <tr>
      <th>Määrä</th>
      <th>Mitta</th>
      <th>Ainesosa</th>
    </tr>
  </thead>
  <tbody>
    {Ingredients.map((ingredient, index) => (
      <tr key={index}>
        <td>
          <input
            type="number"
            min="0"
            value={ingredient.IngAmount}
            onChange={(e) => handleInputChange(index, 'IngAmount', e.target.value)}
            pattern="[0-9]*"
          />
        </td>
        <td>
          <select
            value={ingredient.IngMeasure}
            onChange={(e) => handleInputChange(index, 'IngMeasure', e.target.value)}
          >
            {options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </td>
        <td>
          <input
            type="text"
            value={ingredient.IngName}
            onChange={(e) => handleInputChange(index, 'IngName', e.target.value)}
          />
        </td>
      </tr>
    ))}
  </tbody>
</table>

<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
  <div>
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
    <input type="text" value={IngName} onChange={IngNameChange} />
  </div>
  </div>
</div>
<button type="button" onClick={addIngredient}>Lisää Ainesosa</button>
</div>
        
      <div>
       <label>Reseptin kuvaus:<br></br></label>
       <textarea type="text" value={RecipeDesc} onChange={RecipeDescChange} style={{height: '80px'}}></textarea>
       </div>
       <div>
       <label>tags:</label>
       <textarea type="text" value={Tags} onChange={TagsChange}style={{height: '60px'}}></textarea>
       </div>
 
      <div>
      <input type="file" accept=".jpg, .jpeg, .png" onChange={handleFileChange} />
      </div>
      </div>
      <div className="recipehalf">
        <div style={{height: '300px'}}>
        {image ? (
  <img src={image} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '100%' }} />
) : (
  <p>Kun lisäät kuvan, se tulee näkymään tähän.</p>
)}
        </div>
      <div>
        <label>Reseptin ohje:</label>
        <textarea type="text" value={RecipeGuide} onChange={RecipeGuideChange} style={{height: '300px'}}></textarea>
      </div>
      
</div>
<p></p>
      <button type="button" onClick={TallennaBtnClick}>
        Tallenna
      </button>
      </div>
    </form>

</div>
  );
};

export default RuokaKategoria;