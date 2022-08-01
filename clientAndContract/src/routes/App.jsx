import React,{useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import "../styles/app.css";
import Message from '../components/Message.jsx';

export default function App(){
    
    const [wallet,setWallet] = useState("");
    const [walletFound,setWalletFound] = useState(false);
    const {ethereum} = window;
    const navigate = useNavigate();
    const [cookies,setCookie] = useCookies();
    const [msg,setMsg] = useState("Use Goerli Test Network!");

    function findWallet(){
       if(cookies.walletAddress) navigate("/home");
       if(!ethereum) return;
       setWalletFound(true);
    }

    useEffect( () => {
       document.querySelector(".message").classList.add("showMsg");
       setTimeout( () => (document.querySelector(".message").classList.remove("showMsg")), 3000);
    },[]);
    
    useEffect(
        findWallet,
    [cookies.walletAddress]);

    async function connectWallet(){
        const accounts = await ethereum.request({method: "eth_requestAccounts"});
        if(accounts.length === 0) return;
        setWallet(accounts[0]);
    }

    function dive(){
        setCookie("walletAddress",wallet,{ path: "/"});
        navigate("/home");
    }

    return (
    <div className="top">
        <Message msg = { msg } /> 
        <div className="blocks"></div>
        <div className="title">
            <h1>OFFSHORE</h1>
            <span>Explore | Buy | Sell</span>
        </div>
        { walletFound && (wallet === "") && <button className="connect" onClick={connectWallet}>Connect MetaMask</button> }
        { !walletFound && <button className="connect"><a href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en">Install MetaMask</a></button> }
        { walletFound && (wallet !== "") && <button className="connect" onClick={dive}>Dive into exploration!</button>}
        <img src="/pics/nfts.png" className="nfts" />
    </div>
    );
}