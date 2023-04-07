import React, { useEffect, useState } from "react";
import axios from "axios";
import Book from "../Components/Book";

const Home = () => {
  const [allBook, setAllBook] = useState([]);

  useEffect(() => {
    getAllBook();
  }, []);

  const getAllBook = async () => {
    let token = localStorage.getItem("token");
    let response = await axios.get("http://localhost:4000/books", {
      headers: {
        "x-Api-Key": token,
        Accept: "application/json",
      },
    });
    setAllBook(response.data.data);
  };

  //console.log(allBook)
  return (
    <div>
      <h1>Home Page</h1>
      {allBook.length>0 && allBook.map((each) => <Book key={each._id} {...each} />)}
    </div>
  );
};

export default Home;
