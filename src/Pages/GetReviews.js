import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./GetReviews.css";
import Reviews from "../Components/Reviews";

const GetReviews = () => {
  const [reviews, setReviews] = useState([]);

  const navigate = useNavigate();

  const navToPage = (url, state) => {
    navigate(url, state);
  };
  const { id } = useParams();
  //console.log("id",id)

  useEffect(() => {
    if (id) {
      getReviews(id);
    }
  }, [id]);

  const getReviews = async (id) => {
    let token = localStorage.getItem("token");
    const response = await axios.get(
      `http://localhost:4000/books/${id}/review`,
      {
        headers: {
          "x-Api-Key": token,
          Accept: "application/json",
        },
      }
    );
    // console.log("response.data",response.data.data)
    if (response.status === 200) {
      setReviews([...response.data.data]);
    }
  };
  //console.log("reviews",reviews)
  return (
    <div style={{ marginTop: "50px" }}>
      <div className="card">
        <div className="card-header">
          <p>Book Reviews</p>
        </div>
        <div className="container">
          {reviews.length ? (
            reviews.map((each) => <Reviews key={each._id} {...each} />)
          ) : (
            <>
              <h3>"No Reviews Found For This Book"</h3>
              <button onClick={() => navToPage(`/view/${id}`)}>Go Back</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GetReviews;
