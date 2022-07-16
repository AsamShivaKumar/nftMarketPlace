import React,{useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import "../styles/app.css";

export default function App(){
    
    const [wallet,setWallet] = useState("");
    const [walletFound,setWalletFound] = useState(false);
    const {ethereum} = window;
    const navigate = useNavigate();
    const [cookies,setCookie] = useCookies();

    function findWallet(){
       if(cookies.walletAddress) navigate("/home");
       if(!ethereum) return;
       setWalletFound(true);
    }
    
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
        <div className="blocks"></div>
        <div className="title">
            <h1>OFFSHORE</h1>
            <span>Explore | Buy | Sell</span>
        </div>
        { walletFound && (wallet === "") && <button className="connect" onClick={connectWallet}>Connect MetaMask</button> }
        { !walletFound && <button className="connect">Install MetaMask</button> }
        { walletFound && (wallet !== "") && <button className="connect" onClick={dive}>Dive into exploration!</button>}
        <img src="/pics/nfts.png" className="nfts" />
    </div>
    );
}