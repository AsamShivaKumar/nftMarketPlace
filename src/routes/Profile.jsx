import React, { useEffect } from 'react';
import {useCookies} from 'react-cookie';
import {useNavigate} from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/profile.css';

function Profile(){
    const [cookies] = useCookies();
    const navigate = useNavigate();
    useEffect(() =>{
      if(cookies.walletAddress === undefined) navigate("/");
    },[cookies])
    return (
      <>
        <Navbar current="profile" />
        <div className="profileDiv">
             <div className='userDiv'>
                  <div className='userAvatar'>
                     <img src="/pics/user.png" className="userDP" alt="profile" title="profile"></img>
                     <span className='changeAvatar'>Change</span>
                  </div>
                  <div className='userDetails'>
                       <p className='name'>@username</p>
                       <p className='walletAddress'>0x21620a4F3f37F0950cEC4b854285F36a4eD09A2F</p>
                  </div>
             </div>
             <div className='userTokens'>
                  
             </div>
        </div>
      </>
    )
}

export default Profile;