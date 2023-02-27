import './Book.css'

function Book({title,excerpt,ISBN,category,publishedAt,bookCover}){
  console.log(bookCover)
  // let img="https://functionup-stg.s3.ap-south-1.amazonaws.com/thorium/iitd.png"
    return(
        <div className='container'>
          <div className='card'>
            <div className='imgBx'>
              <img src={bookCover} alt=' Bookcover'></img>
              <div/>
                <h2>{title}</h2>
                <p> {excerpt}</p>
               <p> {category} </p> 
              <p> {ISBN }</p>  
              <p>{publishedAt}</p>
            
            <div>
        <button>View</button>
        <button>Update</button>
        <button>Delete</button>
        <button>Review</button>
      </div>
          </div>
          
        </div>
        </div>
      
    )
}



export default Book