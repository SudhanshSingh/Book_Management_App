import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

const Reviews = (reviewData) => {
  const { reviewedBy, rating, reviewedAt, review, _id, bookId } = reviewData;
  //console.log("reviewData",reviewData)
  const navigate = useNavigate();
  const { id } = useParams();
  const navToPage = (url, state) => {
    navigate(url, state);
  };

  const handleDeleteReview = async (bookId, reviewId) => {
    try {
      let token = localStorage.getItem("token");
      if (window.confirm("Are you sure to delete this book")) {
        let response = await axios.delete(
          `http://localhost:4000/books/${bookId}/review/${reviewId}`,
          {
            headers: {
              "x-Api-Key": token,
              Accept: "application/json",
            },
          }
        );

        //console.log('deleteRes',response)
        if (response.status === 200) {
          toast.success(response.data.message);
          setTimeout(() => {
            console.log("deleted");
            navigate(`/view/${id}`);
          }, 2000);
        }
      }
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  return (
    <div>
      {/* {reviewData?"":<h3>"No reviews for this book"</h3>} */}

      <strong>ReviewedBy : </strong>
      <span>{reviewedBy}</span>
      <br />
      <strong>Rating : </strong>
      <span>{rating}</span>
      <br />
      <strong>Review : </strong>
      <span>{review}</span>
      <br />
      <strong>reviewedAt : </strong>
      <span>{new Date(reviewedAt).toString()}</span>
      <br />
      <button
        onClick={() =>
          navToPage(`/review/${_id}`, {
            state: { bookId: bookId, reviewId: _id },
          })
        }
      >
        Update Review
      </button>
      <button onClick={() => handleDeleteReview(bookId, _id)}>
        Delete Review
      </button>
      <button onClick={() => navToPage(`/view/${id}`)}>Go Back</button>
      <hr></hr>
      <br />
    </div>
  );
};

export default Reviews;
