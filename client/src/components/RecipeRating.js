import React, {  useState } from 'react';

const RatingComponent = (props) => {

    const [userRating, setUserRating] = useState(0);
    const [userFavorite, setUserFavorite] = useState(0);
    const [comment, setComment] = useState('');
    

    const handleRatingChange = (rating) => {
        setUserRating(rating);
      };
    
    const handleCommentChange = (event) => {
    setComment(event.target.value);
    };
    
    const handleCheckboxChange = () => {
        setUserFavorite(userFavorite === 0 ? 1 : 0);
        
      };

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




        console.log('User Rating:', userRating);
        console.log('Comment:', comment);
        console.log('Favorite:', userFavorite);
        console.log('UserID: ', props.userid);
        console.log('Recipeid: ', props.recipeid);
      };
    
    return(
        
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

                {/* Text box for comment */}
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



    )
}

export {RatingComponent};

