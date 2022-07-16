import React, { useEffect } from 'react';
import {useCookies} from 'react-cookie';
import {useNavigate} from 'react-router-dom';
import "../styles/create.css";
import Navbar from "../components/Navbar.jsx";


function Create(){
    const [cookies] = useCookies();
    const navigate = useNavigate();
    useEffect(() =>{
      if(cookies.walletAddress === undefined) navigate("/");
    },[cookies])
    
    return (
      <>
        <Navbar current="create" />
        <div className="formDiv">
          <div className="textDiv">
             <h1 className="createText">Create your own NFT</h1>
             <p>Specify the name, give the description for the NFT and upload the file.</p>
             <p>That's it! You own an NFT now!</p>
             <div className="divBg"></div>
          </div>
          <form>
            <input type="text"></input>
            <textarea>...Description</textarea>
            <input type="file"></input>
            <button type="submit">Create NFT</button>
          </form>
        </div>
      </>
    )
}

export default Create;