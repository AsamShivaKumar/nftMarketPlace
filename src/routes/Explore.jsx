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
          <div className="contentDiv">
               <h1 className="exploreTitle">Explore</h1>
               <div className="carousel">
                   <img src="/pics/1.gif" className= "item one"></img>
                   <img src="/pics/2.png" className= "item two"></img>
                   <img src="/pics/3.png" className= "item three"></img>
                   <img src="/pics/4.png" className= "item four"></img>
                   <img src="/pics/5.png" className= "item five"></img>
               </div>
          </div>      
        </>
    )
}

export default Explore;