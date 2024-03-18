import React, { useState, useEffect } from 'react';
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate, useParams } from 'react-router-dom';
const EditRecipePage = () => {
  //ContextApi for current user
  const {user} = useAuthContext();
  const navigate = useNavigate();
  const { id } = useParams();
  //Muuttujat
  const [RecipeCategory, setRecipeCategory] = useState(null);
  const [IngAmount, setIngAmount] = useState('');
  const [IngMeasure, setIngMeasure] = useState('ml');
  const [IngName, setIngName] = useState('');
  const [RecipeName, setRecipeName] = useState('');
  const [Ingredients, setIngredients] = useState([]); 
  const [updatedIngredients, setUpdatededIngredients] = useState([]); 
  const [ingredientsPlaceholder, setIngredientsPlaceholder] = useState([]); 
  const [RecipeDesc, setRecipeDesc] = useState('');
  const [RecipeGuide, setRecipeGuide] = useState('');
  const [Tags, setTags] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [recipe, setRecipe] = useState(null);
  const [userHasAccess, setUserHasAccess] = useState(false);
  const [ingAmountArray ,setIngAmountArray] = useState([])
  const [ingNameArray, setIngNameArray] = useState([]);
  const [ingMeasureArray ,setIngMeasureArray] = useState([]);
  const [missingFieldsMessage, setMissingFieldsMessage] = useState('');
  //Vaihtoehdot kategorialle ja ainesosan mitalle
  const Kategoria = ['Alkupala', 'Juoma', 'Välipala', 'Pääruoka', 'Jälkiruoka', 'Leivonnaiset', 'Muu'];
  const options = ['ml', 'tl', 'rkl', 'dl', 'l', 'kkp' ,'g', 'kg', 'kpl'];
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
  const IngAmountChangeArray = (event, index) => {
    const newAmounts = [...ingAmountArray];
    newAmounts[index] = event.target.value;
    setIngAmountArray(newAmounts);
  };
  const IngNameChangeArray = (event, index) => {
    const newNames = [...ingNameArray];
    newNames[index] = event.target.value;
    setIngNameArray(newNames);
  };
  const IngMeasureChangeArray = (event, index) => {
    const newMeasures = [...ingMeasureArray];
    newMeasures[index] = event.target.value;
    setIngMeasureArray(newMeasures);
  };


  //Ainesosan lisääminen Varmistaa että inputit eivät ole tyhjiä
  const addIngredient = async (e) => {
    if (IngAmount) {
      if (IngName){
      setIngredients([...Ingredients, { IngAmount, IngMeasure, IngName }]);
      setIngAmount('');
      setIngMeasure('ml');
      setIngName('');
    } else{
      e.preventDefault();
      alert('Ainesosan nimi puuttuu');
    }
    } else {
      e.preventDefault();
      alert('Ainesosan määrä puuttuu');
    }
  };

  const editIngredients = () => {
      const combinedArray = ingredientsPlaceholder.map((ingredient, index) => ({
      ingredientid: ingredient.ingredientid,
      recipeid: ingredient.recipeid,
      IngAmount: ingAmountArray[index] || '',
      IngMeasure: ingMeasureArray[index] || '',
      IngName: ingNameArray[index] || '',
    }));
    if(checkFields(combinedArray)){
    setMissingFieldsMessage('');
    setUpdatededIngredients(combinedArray)
    }
    else {
      setMissingFieldsMessage('Täytä kaikki kentät ennen tallentamista');
    }
  }


  const checkFields = (arrayOfObjects) => {
    return arrayOfObjects.every(obj => Object.values(obj).every(value => value !== ''));
  };


  //Heittää consoleen mitä tallentuu, tietokanta yhteys myöhemmin
  //Varmistaa että kentät eivät ole tyhjiä
  const editBtnClick = async () => {
    if (RecipeName) {
      if (RecipeCategory){
          if(RecipeGuide){
            const UserID = `${user.userid}`
            try {
              //checks if user is logged in to the site
              if(!user) {
                throw Error('Sinun täytyy kirjautuu sisään jotta voit luoda uusia reseptejä.')
             }
              const response = await fetch('http://localhost:3001/api/recipe/edit', {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                  id,
                  UserID,
                  RecipeName,
                  RecipeCategory,
                  RecipeGuide,
                  RecipeDesc,
                  Tags,
                  updatedIngredients,
                  Ingredients
                }),
              });
        
              if (response.ok) {
                console.log('Recipe edited successfully');
                navigate('/ProfilePage')
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
        alert('Reseptin kategoria puuttuu!')
      }
    } else {
      alert('Reseptin nimi puuttuu!');
    }
  };

  useEffect(() => {
    const getRecipe = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/recipe/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          },
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        setRecipe(data.data.recipes.recordset[0]);
        setRecipeName(data.data.recipes.recordset[0].recipename)
        setRecipeGuide(data.data.recipes.recordset[0].instructions)
        setRecipeDesc(data.data.recipes.recordset[0].description)
        setTags(data.data.recipes.recordset[0].tags)
        setUserHasAccess(user.userid === data.data.recipes.recordset[0].userid);
        setRecipeCategory(data.data.recipes.recordset[0].category);
      } catch (error) {
        console.error('Error during search:', error.message);
      }
    }
    getRecipe();
    getIngredients();
  }, [id, user]);


const sendIngredients = async () => {
            try {
              const response = await fetch(`http://localhost:3001/api/ingredients/add`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                  Ingredients,
                  id
                }),
              });
              
              const data = await response.json();
              if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
              }
              
              console.log("TEST", data.data)
            } catch (error) {
              console.error('Error during search:', error.message);
            }
}
useEffect(() => {
  if(Ingredients.length === 0){
    
    return;
    
  } 
  console.log("asda")
  sendIngredients();
},[Ingredients])

          const getIngredients = async () => {
            try {
              const response = await fetch(`http://localhost:3001/api/ingredients/${id}`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${user.token}`
                },
              });
              const data = await response.json();
              if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
              }
              const newIngAmountArray = [];
              const newIngNameArray = [];
              const newIngMeasureArray = [];
              for(let i = 0;i < data.data.ingredients.length; i++)
              {
                newIngAmountArray.push(data.data.ingredients[i].quantity);
                newIngNameArray.push(data.data.ingredients[i].ingredientname);
                newIngMeasureArray.push(data.data.ingredients[i].measure);
              }
              setIngAmountArray(newIngAmountArray);
              setIngNameArray(newIngNameArray);
              setIngMeasureArray(newIngMeasureArray);
              setIngredientsPlaceholder(data.data.ingredients);
            } catch (error) {
              console.error('Error during search:', error.message);
            }
          }

          const deleteIngredient = async (ingredientId) => {
            try {
                const response = await fetch(`http://localhost:3001/api/ingredients/${ingredientId}`, {
                  method: 'DELETE',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                  },
                });
                if (!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
                }
                if(response.ok){
                    console.log('Ingredient deleted:' + response.message);
                }
              } catch (error) {
                console.error('Error deleting ingredient:', error.message);
              }
        }
        
  return (
    <div>
    {userHasAccess ? (
    <form>
      <label>Reseptin nimi:</label>
      <input type="text" value={RecipeName} onChange={RecipeNameChange} />
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

      {ingredientsPlaceholder.map((ingredient, index) => (
        <div key={index} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <div>
            <label>Määrä:</label>
            <input type="number" value={ingAmountArray[index] || ''} onChange={(event) => IngAmountChangeArray(event, index)} />
          </div>
          <div>
          {/* <select value={ingMeasureArray[index] || ''} onChange={(event) => IngMeasureChangeArray(event, index)}>
            <option value="" disabled selected>{ingredientsPlaceholder[index].measure}</option>
              {options.map((option, index) => (
                <option key={index} value={option} selected={option === ingredient.measure} >
                  {option} 
                </option>
              ))}
            </select> */}
            <select value={ingMeasureArray[index] || ''} onChange={(event) => IngMeasureChangeArray(event, index)}>
              {options.map((option, index) => (
                <option key={index} value={option}>
                  {option} 
                </option> 
              ))}
            </select>
          </div>
          <div>
            <label>Ainesosa:</label>
            <input type="text" value={ingNameArray[index] || ''} onChange={(event) => IngNameChangeArray(event, index)} />
          </div>
          <div>
            <button onClick={() => {deleteIngredient(ingredientsPlaceholder[index].ingredientid)}}>Poista</button>
          </div>
        </div> 
      ))}
        <button type="button" onClick={editIngredients}>Tallenna muutokset</button> {missingFieldsMessage && <div style={{ color: 'red' }}>{missingFieldsMessage}</div>}


      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <div>
          <label>Määrä:</label>
          <input type="text" value={IngAmount} onChange={IngAmountChange} />
        </div>
        <div>
          <select  value={IngMeasure} onChange={IngMeasureChange}>
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
        <div>
          <button type="submit" onClick={(e) => addIngredient(e)}>
          Lisää Ainesosa
          </button>
        </div>
      </div>
      <div>
        <label>Reseptin ohje:</label>
      <div>
        <textarea type="text" value={RecipeGuide} onChange={RecipeGuideChange}></textarea>
      </div>
       <label>Reseptin kuvaus:</label>
       <div>
       <textarea type="text" value={RecipeDesc} onChange={RecipeDescChange}></textarea>
       </div>
       <label>tags:</label>
       <div>
       <textarea type="text" value={Tags} onChange={TagsChange}></textarea>
       </div>
      </div>
      {/* <div>
      <input type="file" accept=".jpg, .jpeg, .png" onChange={handleFileChange} />
      </div> */}
      <button type="button" onClick={editBtnClick}>
        Tallenna muokkaus
      </button>
    </form>
    ) : (         <div>
        <h1>Loading...</h1>
      </div> )}
      </div>
  );
};

export {EditRecipePage}