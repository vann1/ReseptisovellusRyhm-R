import React, {  useEffect, useState } from 'react';


const RatingComponent = (props) => {

    const [userRating, setUserRating] = useState(0);
    const [userFavorite, setUserFavorite] = useState(0);
    const [comment, setComment] = useState('');
    const [userEditRating, setUserEditRating] = useState(0);
    const [userEditFavorite, setUserEditFavorite] = useState(0);
    const [Editcomment, setEditComment] = useState('');
    const [recipeReviews, setRecipeReviews] = useState([]);
    const [userReview, setUserReview] = useState(null);



    const handleRatingChange = (rating) => {
        setUserRating(rating);
      };
    
    const handleCommentChange = (event) => {
    setComment(event.target.value);
    };
    
    const handleCheckboxChange = () => {
        setUserFavorite(userFavorite === 0 ? 1 : 0);
        
      };

      const handleEditRatingChange = (rating) => {
        setUserEditRating(rating);
      };
    
    const handleEditCommentChange = (event) => {
    setEditComment(event.target.value);
    };
    
    const handleEditCheckboxChange = () => {
      setUserEditFavorite(userFavorite === 0 ? 1 : 0);
        
      };






    const SearchReviews = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/review/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            recipeid: props.recipeid,
          }),
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
        setRecipeReviews(data.data.reviews);
        
        console.log(recipeReviews);
      } catch (error) {
        console.error('Error during reviewsearch:', error.message);
        setRecipeReviews([]);
      } 


      
  
    };

  
    useEffect(() => {
      SearchReviews();
    },[])

    const removeUserReview = () => {
      const userReviewIndex = recipeReviews.findIndex(review => review.userid === props.userid);
      if (userReviewIndex !== -1) {
        const removedReview = recipeReviews.splice(userReviewIndex, 1)[0];
        
        setUserReview(removedReview);
        console.log('Removed review:', removedReview);
        setRecipeReviews([...recipeReviews]); // Update state with the modified array
        setUserEditFavorite(removedReview.favorite);
        setUserEditRating(removedReview.rating);
        setEditComment(removedReview.review)
       
      }
    };
  
    useEffect(() => {
      const hasUserReview = recipeReviews.some(review => review.userid === props.userid);
      if (hasUserReview) {
        removeUserReview();
      }
    }, [recipeReviews, props.userid]);


      const handleSubmit = async () => {
        
        try {
            const response = await fetch('http://localhost:3001/api/review/add', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                recipeid: props.recipeid,
                userid: props.userid,
                rating: userRating,
                comment: comment,
                favorite: userFavorite,
              }),
            });
      
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
          } catch (error) {
            console.error('Error adding review:', error.message);
          } 
          setUserReview(true);
          setUserEditFavorite(userFavorite);
          setUserEditRating(userRating);
          setEditComment(comment)
          SearchReviews();

      };



    
    return(
            <div>
      
              {props.userid ? (
                
                 <div>
                  {!userReview ? (
                <div>
                <div>
                  <strong>Rate this recipe:</strong><br />
                  {[1, 2, 3, 4, 5].map((star, index) => (
                    <span
                      key={index}
                      style={{ cursor: 'pointer', color: star <= userRating ? 'gold' : 'gray' }}
                      onClick={() => handleRatingChange(star)}
                    >
                      &#9733;
                    </span>
                  ))}
                  <br></br><input
                    type="checkbox"
                    checked={userFavorite}
                    onChange={handleCheckboxChange}
                  /> Lisää suosikkeihin.
                </div>
                <div style={{ marginTop: '10px' }}>
                  <textarea
                    rows="4"
                    cols="50"
                    placeholder="Leave a comment..."
                    value={comment}
                    onChange={handleCommentChange}
                  />
                </div>
                {/* Submit button */}
                <div style={{ marginTop: '10px' }}>
                  <button onClick={handleSubmit}>Send Rating</button>
                </div>
                </div>

                    ): (
                      <div>
                <div>
                <div>
                  <strong>Muokkaa arvosteluasi:</strong><br />
                  {[1, 2, 3, 4, 5].map((star, index) => (
                    <span
                      key={index}
                      style={{ cursor: 'pointer', color: star <= userEditRating ? 'gold' : 'gray' }}
                      onClick={() => handleEditRatingChange(star)}
                    >
                      &#9733;
                    </span>
                  ))}
                  <br></br><input
                    type="checkbox"
                    checked={userEditFavorite}
                    onChange={handleEditCheckboxChange}
                  /> Lisää suosikkeihin.
                </div>
                <div style={{ marginTop: '10px' }}>
                  <textarea
                    rows="4"
                    cols="50"
                    placeholder="Leave a comment..."
                    value={Editcomment}
                    onChange={handleEditCommentChange}
                  />
                </div>
                
                
                </div>
                  
                  
              </div>
                     )}
                </div>



              ) : (
                <p>Kirjaudu sisään arvostellaksesi reseptin.</p>
              )}
                <div>
                {recipeReviews.map(review => (
                  <div key={review.reviewid} >
                    <p>Käyttäjänimi: {review.username}</p>
                    <p>Arvostelu: {review.rating}/5</p>
                    <p>Kommentti: {review.review}</p>
                    {/* You can render more details of the review here */}
                  </div>
                ))}      
              </div>

      </div>


    )
}

export {RatingComponent};

