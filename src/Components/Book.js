import axios from "axios";
import "./Book.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Book({
  _id,
  title,
  excerpt,
  ISBN,
  category,
  publishedAt,
  bookCovers= "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRs4c9unfGjEfhwirheiT7lJNiU9LV5gxnHCg&usqp=CAU" ,
}) {
  //console.log(bookCover)
  const navigate = useNavigate();
  const navToPage = (url) => {
    navigate(url);
  };
  const handleDeleteBook = async (id) => {
    try {
      let token = localStorage.getItem("token");
      if (window.confirm("Are you sure to delete this book")) {
        let response = await axios.delete(
          `http://localhost:4000/books/${id}`,

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
          setTimeout(() => navigate("/", { replace: true }), 1500);
        }
      }
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  return (
    <div className="container">
      <div className="imgBx">
        <img src={bookCovers} alt=" Bookcover"></img>
        <div />
        <h2>{title}</h2>
        <p> {excerpt}</p>
        <p> {category} </p>
        <p> {ISBN}</p>
        <p>{publishedAt}</p>

        <div>
          <button onClick={() => navToPage(`/view/${_id}`)}>View</button>
          <button onClick={() => navToPage(`/create/${_id}`)}>Update</button>
          <button onClick={() => handleDeleteBook(_id)}>Delete</button>
        </div>
      </div>
    </div>
  );
}

export default Book;
