import React, { useEffect } from 'react';
import Navbar from "../components/Navbar.jsx";
import "../styles/home.css";
import {Link} from 'react-router-dom';
import {useCookies} from 'react-cookie';
import {useNavigate} from 'react-router-dom';

function Home(){

    const [cookies] = useCookies();
    const navigate = useNavigate();
    
    useEffect(() => {if(cookies.walletAddress === undefined) navigate("/")}
    ,[cookies]);

    return (
        <React.Fragment>
            <Navbar current="home" />
            <div className="content">
                <div className="containerDiv">
                    <div className="openingText">
                        <h1>Create, explore, buy and sell incredible <p className="nft">NFTs</p></h1>
                    </div>
                    <span>Explore the listed nfts or create your own new NFTs</span>
                    <div className="buttons">
                        <Link to="/explore" className='exploreLink'>Explore</Link>
                        <Link to="/create" className='exploreLink'>Create</Link>
                    </div>
                </div>
                <img src="/pics/boredApe.png" className="apeNft"></img>               
            </div>
        </React.Fragment>      
    )
}

export default Home;