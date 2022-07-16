import React, { useEffect } from 'react';
import {useCookies} from 'react-cookie';
import {Link,useNavigate} from 'react-router-dom';
import Navbar from "../components/Navbar.jsx";
import "../styles/navbar.css";
import "../styles/explore.css";

function Explore(){
    const [cookies] = useCookies();
    const navigate = useNavigate();
    useEffect(() =>{
      if(cookies.walletAddress === undefined) navigate("/");
    },[cookies]);

    return (
        <>
          <Navbar current="explore"/> 
        </>
    )
}

export default Explore;