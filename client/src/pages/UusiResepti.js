import React, { useState } from 'react';

const RuokaKategoria = () => {
  //Muuttujat
  const [RecipeCategory, setRecipeCategory] = useState(null);
  const [IngAmount, setIngAmount] = useState('');
  const [IngMeasure, setIngMeasure] = useState('ml');
  const [IngName, setIngName] = useState('');
  const [RecipeName, setRecipeName] = useState('');
  const [Ingredients, setIngredients] = useState([]); 
  const [RecipeDesc, setRecipeDesc] = useState('');
  const [RecipeGuide, setRecipeGuide] = useState('');
  const [UserID, setUserID] = useState('121');
  const [Tags, setTags] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
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

  const RecipeTagChange = (event) => {
    setTags(event.target.value)
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
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

  
  //Varmistaa että kentät eivät ole tyhjiä
  const TallennaBtnClick = async () => {
    if (RecipeName) {
      if (RecipeCategory){
        if(Ingredients.length > 0){
          if(RecipeGuide){
            try {
              const formData = new FormData();
              formData.append('UserID', UserID);
              formData.append('RecipeName', RecipeName);
              formData.append('RecipeCategory', RecipeCategory);
              formData.append('RecipeGuide', RecipeGuide);
              formData.append('RecipeDesc', RecipeDesc);
              formData.append('Tags', Tags);
              Ingredients.forEach((ingredient, index) => {
                formData.append(`Ingredients[${index}][IngAmount]`, ingredient.IngAmount);
                formData.append(`Ingredients[${index}][IngMeasure]`, ingredient.IngMeasure);
                formData.append(`Ingredients[${index}][IngName]`, ingredient.IngName);
              });
              if (selectedFile) {
                const reader = new FileReader();
                reader.readAsDataURL(selectedFile);
                reader.onloadend = () => {
                  const base64Data = reader.result.split(',')[1];
                  formData.append('image', base64Data);
                };
              }
  
              const response = await fetch('http://localhost:3001/api/recipe/add', {
                method: 'POST',
                body: formData,
              });
  
              if (response.ok) {
                console.log('Recipe added successfully');
              } else {
                console.error('Failed to add recipe:', response.statusText);
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
        <label>Reseptin ohje:</label>
      <div>
        <textarea type="text" value={RecipeGuide} onChange={RecipeGuideChange}></textarea>
      </div>
       <label>Reseptin kuvaus:</label>
       <div>
       <textarea type="text" value={RecipeDesc} onChange={RecipeDescChange}></textarea>
       </div>
       <label>Tags:</label>
       <div>
       <textarea type="text" value={Tags} onChange={RecipeTagChange}></textarea>
       </div>
       <label>Lisää kuva:</label>
       <div>
       <input type="file" name="file" accept=".jpg, .jpeg, .png" onChange={handleFileChange} />
      </div>
      </div>
      <button type="button" onClick={TallennaBtnClick}>
        Tallenna
      </button>
    </form>
  );
};

export default RuokaKategoria;
