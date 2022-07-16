import React from 'react';
import {Link} from 'react-router-dom';
import "../styles/navbar.css";

function Navbar(props){
    return (
        <nav className='navbar'>
               <Link to="/home"><i className={ (props.current == "home" && "fi fi-sr-home current") || ("fi fi-sr-home")}></i></Link>
               <Link to="/explore"><i className={ (props.current == "explore" && "fi fi-sr-search current") || ("fi fi-sr-search")}></i></Link>
               <Link to="/create"><i className= { (props.current == "create" && "fi fi-sr-cloud-upload current") || ("fi fi-sr-cloud-upload")}></i></Link>
               <Link to="/profile"><i className={ (props.current == "profile" && "fi fi-sr-at current") || ("fi fi-sr-at")}></i></Link>
        </nav>
    )
}

export default Navbar;