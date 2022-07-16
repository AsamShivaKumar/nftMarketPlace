import React, { useEffect } from 'react';
import {useCookies} from 'react-cookie';
import {useNavigate} from 'react-router-dom';
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
      </>
    )
}

export default Create;