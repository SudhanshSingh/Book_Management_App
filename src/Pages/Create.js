
import React, { useState } from 'react'
import axios from 'axios'
import { toast} from 'react-toastify';
import { useNavigate } from "react-router-dom";

const Create = () => {

  const[BookData,setBookData]=useState({})
  const navigate=useNavigate()

  const changeHandler=(e)=>{
    setBookData({...BookData,[e.target.name]:e.target.value})
    console.log(BookData)
  }

 const createBookHandler= async(e)=>{
  try{
     e.preventDefault()
     let token = localStorage.getItem("token");
     console.log(token)
    let response= await axios.post('http://localhost:4000/books',BookData,
    {
      headers: {
        "x-Api-Key": token,
          Accept: 'application/json',
      },
  }
    )
    if(response.status===201){
      toast.success(response.data.message)
      setTimeout(() => navigate("/", { replace: true }), 1500);
    }
  }catch(err){
    toast.error(err.response.data.message)
  }
 }
  return (
    <>
    <div>Create Book</div>
   <br/>
    <form onSubmit={createBookHandler}>
      <div>
      <input type='text' placeholder='title ...' name='title' required onChange={changeHandler}></input>
      </div>
      <div>
      <input type='text' placeholder='excerpt ...' name='excerpt'required onChange={changeHandler}></input>
      </div>
      <div>
      <input type='text' placeholder='userId ...' name='userId' required onChange={changeHandler}></input>
      </div>
      <div>
      <input type='text' placeholder='ISBN ...' name='ISBN' onChange={changeHandler}></input>
      </div>
      <div>
      <input type='text' placeholder='category ...' name='category' required onChange={changeHandler}></input>
      </div>
      <div>
      <input type='text' placeholder='subCategory ...' name='subCategory' onChange={changeHandler}></input>
      </div>
      <div>
      <input type='text' placeholder='releasedAt ...' name='releasedAt' onChange={changeHandler}></input>
      </div>
    
      <div>
      <input type='file' placeholder='book cover ...' name='cover' onChange={changeHandler} ></input>
      </div>
      <input type='submit'/>
    </form> 

    </>
  )
}

export default Create