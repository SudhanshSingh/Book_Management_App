import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./GetReviews.css";
import { useLocation, useParams, useNavigate } from "react-router-dom";

const AddReview = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  //console.log("id",id)

  const { state } = useLocation();
  //console.log("useLocation",state)

  let initialReview = {
    bookId: "",
    rating: "",
    reviewedBy: "",
    review: "",
    reviewedAt: "",
  };

  const [reviewData, setReviewData] = useState(initialReview);
  const { rating, reviewedBy, review, reviewedAt } = reviewData;

  useEffect(() => {
    if (state) {
      getReviews(state.bookId, state.reviewId);
    }
  }, [state]);

  reviewData["bookId"] = id;
  const handleOnchangeReview = (e) => {
    let { name, value } = e.target;
    setReviewData({ ...reviewData, [name]: value });
  };
  reviewData["rating"] = parseInt(rating);
  //console.log("reviewData",reviewData)

  const createReview = async (data) => {
    try {
      let token = localStorage.getItem("token");
      //console.log(token)
      let response = await axios.post(
        `http://localhost:4000/books/${id}/review`,
        data,
        {
          headers: {
            "x-Api-Key": token,
            Accept: "application/json",
          },
        }
      );
      if (response.status === 201) {
        toast.success(response.data.message);
        setTimeout(
          () => navigate(`/getReviews/${id}`, { replace: true }),
          1500
        );
      }
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  const getReviews = async (bookId, reviewId) => {
    let token = localStorage.getItem("token");
    const response = await axios.get(
      `http://localhost:4000/books/${bookId}/review/${reviewId}`,
      {
        headers: {
          "x-Api-Key": token,
          Accept: "application/json",
        },
      }
    );
    //console.log("response.data",response.data.data)
    if (response.status === 200) {
      setReviewData({ ...response.data.data[0] });
    }
  };

  const updateReview = async (data, bookId, reviewId) => {
    try {
      let token = localStorage.getItem("token");
      let response = await axios.put(
        `http://localhost:4000/books/${bookId}/review/${reviewId}`,
        data,
        {
          headers: {
            "x-Api-Key": token,
            Accept: "application/json",
          },
        }
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        setTimeout(
          () => navigate(`/getReviews/${bookId}`, { replace: true }),
          1000
        );
      }
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };
  const handleOnsubmitReview = (e) => {
    e.preventDefault();
    if (state) updateReview(reviewData, state.bookId, state.reviewId);
    else createReview(reviewData);
  };
  return (
    <div>
      <h1>{state ? "Update Review" : "Add Review"}</h1>
      <form onSubmit={handleOnsubmitReview}>
        <div>
          <input
            type="text"
            placeholder="Enter review"
            name="review"
            value={review}
            onChange={handleOnchangeReview}
          ></input>
        </div>
        <div>
          <input
            type="text"
            placeholder="Enter reviewedBy"
            name="reviewedBy"
            value={reviewedBy}
            onChange={handleOnchangeReview}
          ></input>
        </div>
        <div>
          <input
            type="number"
            placeholder="Enter rating"
            name="rating"
            value={rating}
            onChange={handleOnchangeReview}
          ></input>
        </div>
        <div>
          <input
            type="text"
            placeholder="reviewedAt (yyyy-mm-dd) format..."
            name="reviewedAt"
            onChange={handleOnchangeReview}
            value={reviewedAt}
          ></input>
        </div>
        <div>
          <input type="submit" value={state ? "Update" : "Add"}></input>
        </div>
      </form>
    </div>
  );
};

export default AddReview;
