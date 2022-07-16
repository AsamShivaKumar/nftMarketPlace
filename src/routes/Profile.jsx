import React, { useEffect } from 'react';
import {useCookies} from 'react-cookie';
import {useNavigate} from 'react-router-dom';
import Navbar from '../components/Navbar';

function Profile(){
    const [cookies] = useCookies();
    const navigate = useNavigate();
    useEffect(() =>{
      if(cookies.walletAddress === undefined) navigate("/");
    },[cookies])
    return (
      <>
        <Navbar current="profile" />
      </>
    )
}

export default Profile;