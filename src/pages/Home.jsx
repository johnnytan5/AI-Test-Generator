import {useRef} from 'react'
import {db} from "../firebase"
import {addDoc, collection} from "@firebase/firestore"

function Home (){

  const messagRef = useRef();
  const ref = collection(db, "messages")

  const handleSave = async(e) => {
    e.preventDefault();
    console.log(messagRef.current.value);

    let data = {message: messagRef.current.value,}

    try {
      await addDoc(ref, data);
      console.log("Message saved successfully")
    } catch (e)
    {
      console.log(e);
    }
    
  }

    return (
        <div>
          <h2>Welcome</h2>  
          <form onSubmit={handleSave}>
            <label>Enter message</label>
            <input type="text" ref={messagRef}></input>
            <button type="submit">Save</button>
          </form>
        </div>
    );
}

export default Home