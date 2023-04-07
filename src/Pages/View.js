import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./View.css";

const View = () => {
  const [book, setBook] = useState({});
  //const[relesedDate,setRelesedDate]=useState(book.releasedAt)

  const navigate = useNavigate();
  const navToPage = (url) => {
    navigate(url);
  };
  const { id } = useParams();
  //console.log("id",id)

  useEffect(() => {
    if (id) {
      singleBookDetails(id);
    }
  }, [id]);

  const singleBookDetails = async (id) => {
    let token = localStorage.getItem("token");
    const response = await axios.get(`http://localhost:4000/books/${id}`, {
      headers: {
        "x-Api-Key": token,
        Accept: "application/json",
      },
    });
    //console.log("response.data",response)
    if (response.status === 200) {
      setBook({ ...response.data.data });
    }
  };
  //console.log("book",book)

  return (
    <div style={{ marginTop: "50px" }}>
      <div className="card">
        <div className="card-header">
          <p>Book Details</p>
        </div>
        <div className="container">
          <strong>ID : </strong>
          <span>{book && book._id}</span>
          <br />
          <strong>Title : </strong>
          <span>{book && book.title}</span>
          <br />
          <strong>Excerpt : </strong>
          <span>{book && book.excerpt}</span>
          <br />
          <strong> Category : </strong>
          <span>{book && book.category}</span>
          <br />
          <strong>ISBN : </strong>
          <span>{book && book.ISBN}</span>
          <br />
          <strong>Bookcover : </strong>
          <span>{book && book.bookCover}</span>
          <br />
          <strong>bookID : </strong>
          <span>{book && book.bookId}</span>
          <br />
          <strong>Reviews : </strong>
          <span>{book && book.reviews}</span>
          <br />
          <strong>ReleasedAt : </strong>
          <span>{book && new Date(book.releasedAt).toString()}</span>
          <br />
          <button onClick={() => navToPage(`/getReviews/${book._id}`)}>
            {" "}
            See Reviews
          </button>
          <button onClick={() => navToPage(`/review/${book._id}`)}>
            Add Review
          </button>
          <button onClick={() => navToPage(`/`)}>Go Back</button>
        </div>
      </div>
    </div>
  );
};

export default View;
