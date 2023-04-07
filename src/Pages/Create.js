
import React, { useState ,useEffect} from 'react'
import axios from 'axios'
import { toast} from 'react-toastify';
import { useNavigate,useParams } from "react-router-dom";
import './Create.css'

const Create = () => {
 const initialState={
  title: "",
  excerpt: "",
  // userId: "",
  ISBN: "",
  category: "",
  subcategory:"",
  releasedAt: ""
  // cover:""
 }

  const[BookData,setBookData]=useState(initialState)
  const [file, setFile] = useState(null);
  const{title,excerpt,ISBN,category,subcategory,releasedAt}=BookData
  const navigate=useNavigate()

  const {id}=useParams();
  //console.log("id",id)

  useEffect(()=>{
    if(id){
      singleBookDetails(id)  
    }
  },[id])

 

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  }
  console.log(file)
  const singleBookDetails= async(id)=>{
    let token = localStorage.getItem("token");
    const response=await axios.get(`http://localhost:4000/books/${id}`,  {
      headers: {
        "x-Api-Key": token,
          Accept: 'application/json',
      },
  })
    // console.log("response.data",response)
    if(response.status===200){
      setBookData({...response.data.data})
    }
  }

  //------------------------OnChange handler----------------//

  const changeHandler=(e)=>{
    let{name,value}=e.target
    setBookData({...BookData,[name]:value})
    //
  }
  console.log(BookData)
    //------------------------Create Book----------------//

 const createBook= async(data)=>{
  try{
     let token = localStorage.getItem("token"); 
    let response= await axios.post('http://localhost:4000/books',data,
    {
      headers: {
        "x-Api-Key": token,
        'Content-Type': 'multipart/form-data',
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
// -------------------update Book -------------------//

 const updateBook= async(data,id)=>{
  try{
     let token = localStorage.getItem("token");
     //console.log(token)
    let response= await axios.put(`http://localhost:4000/books/${id}`,data,
    {
      headers: {
        "x-Api-Key": token,
          Accept: 'application/json',
      },
  }
    )
    if(response.status===200){
      toast.success(response.data.message)
      setTimeout(() => navigate("/", { replace: true }), 1500);
    }
  }catch(err){
    toast.error(err.response.data.message)
  }
 }
   //------------------------Form Submit handler----------------//
 const handleSubmit =(e)=>{
  e.preventDefault()
  const formData = new FormData();
  // formData.append({...BookData});
  formData.append('file', file);
  formData.append('title', e.target.title.value);
  formData.append('excerpt', e.target.excerpt.value);
  formData.append('ISBN', e.target.ISBN.value);
  formData.append('category', e.target.category.value);
  formData.append('subcategory', e.target.subcategory.value);
  formData.append('releasedAt', e.target.releasedAt.value);
  // formData.append('file', e.target.file.files[0]);
  if(id) updateBook(BookData,id)
  else createBook(formData)
  //console.log("e",e.target.name)

}
//console.log("formData",formData)

  return (
    <>
    <h3>{id?"Update Book":"Create Book"}</h3>
   <br/>
    <form onSubmit={handleSubmit}>
      <div>
      <input type='text' placeholder='title ...' name='title'  onChange={changeHandler} value={title}></input>
      </div>
      <div>
      <input type='text' placeholder='excerpt ...' name='excerpt'  onChange={changeHandler} value={excerpt}></input>
      </div>
      {/* <div>
      <input type='text' placeholder='userId ...' name='userId' required onChange={changeHandler} value={userId}></input>
      </div> */}
      <div>
      <input type='text' placeholder='ISBN ...' name='ISBN' onChange={changeHandler} value={ISBN}></input>
      </div>
      <div>
      <input type='text' placeholder='category ...' name='category'  onChange={changeHandler} value={category}></input>
      </div>
      <div>
      <input type='text' placeholder='subCategory ...' name='subcategory' onChange={changeHandler} value={subcategory}></input>
      </div>
      <div>
      <input type='text' placeholder='releasedAt (yyyy-mm-dd) format...' name='releasedAt' onChange={changeHandler} value={releasedAt}></input>
      </div>
      <div className="file-upload">
      <label for="file-input">{id?"Update Book Cover":"Upload Book Cover"}</label>
      <input type="file" id="file-input" name="file" onChange={handleFileChange} />
      </div>
      <div>
      <input type='submit' value={id?"Update":"Add"}/>
      </div>
    </form> 
    </>
  )
}

export default Create