import React, { useState,useEffect } from 'react';
import {useCookies} from 'react-cookie';
import {useNavigate} from 'react-router-dom';
import Navbar from "../components/Navbar.jsx";
import NFT from '../components/NFT.jsx';
import Dummy from '../components/Dummy.jsx';
import Token from "../helpers/Token.jsx";
import Message from '../components/Message.jsx';
import "../styles/navbar.css";
import "../styles/explore.css";
import { ethers } from 'ethers';
import abi from '../MarketPlace.json';
import axios from 'axios';

function Explore(){
    const [cookies] = useCookies();
    const navigate = useNavigate();
    const {ethereum} = window;
    const contractAddi = "0xeA87aa0810B5d34D6D880d381337E23C471F1db5";
    const contractABI = abi.abi;
    const walletAddress = cookies.walletAddress;
    const dummy = [1,2,3,4,5,6,7,8];
    const [tokens,setTokens] = useState("");
    const [buying,setBuying] = useState(false);
    const [msg,setMsg] = useState("");
    useEffect(() =>{
      if(cookies.walletAddress === undefined) navigate("/");
    },[cookies]);
    
    // fetching nfts    
    useEffect(() =>{
       setNfts();
    },[]);
    
    async function setNfts(){
       const res = await getNfts();
       console.log(res);
       setTokens(res);
       console.log("Tokens:",tokens);
    }

    // fetching nfts
    async function getNfts(){
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddi,contractABI,signer);
      const nfts = await contract.getListedTokens();
      
      console.log(nfts);
      const tokensArr = await Promise.all(nfts.map( async (nft) => {
         const uri = await contract.tokenURI(nft.tokenId);
         let metaData = await axios.get(uri);
         metaData = metaData.data;
         console.log(metaData);

         const reqObj = {
            tokenId: Number(nft.tokenId), 
            address: walletAddress
         };
         
         let tokenData = await axios.post("/token", reqObj);
         tokenData = tokenData.data;
         console.log(tokenData);
         
         const likesCount = tokenData.token.likes.length;
         const views = tokenData.token.views;

         let currOwner = nft.currOwner;
         let res = await axios.post("/user", {address: walletAddress});
         console.log(res);
         res = res.data;
         console.log(res);
         if(res.success) currOwner = res.username;

         const token = new Token(metaData.title,metaData.imageUrl,ethers.utils.formatEther(nft.price),metaData.description,currOwner,likesCount,views,nft.tokenId,nft.currentlyListed,tokenData.liked);
         return token;
      }));
      return tokensArr;
    }

    // carousel
    useEffect(() =>{
      const carouselInt = setInterval(() => {
        const one = document.querySelector(".one");
        const two = document.querySelector(".two");
        const three = document.querySelector(".three");
        const four = document.querySelector(".four");
        const five = document.querySelector(".five");
        
        one.classList.add("two");
        one.classList.remove("one");
        two.classList.add("three");
        two.classList.remove("two");
        three.classList.add("five");
        three.classList.remove("three");
        four.classList.add("one");
        four.classList.remove("four");
        five.classList.add("four");
        five.classList.remove("five");
      },6000);
      
      // clean-up function to remove the interval when Explore componenet is unmounted!
      return () => ( clearInterval(carouselInt));
    },[]);
    
    // event listeners for nft divs
    useEffect(() => {
        document.querySelectorAll(".nftTile").forEach( nft => {
           nft.addEventListener("click", () => clickEvent(nft));
        });
        
        document.querySelector(".fi-sr-cross-circle").addEventListener("click",closeDiv);        
        document.querySelector(".buy").addEventListener("click", buyNFT);

        // clean-up function for removinf event listeners
        return () => {
         const div = document.querySelectorAll(".nftTile");
         if(div.length === 0) return;
         
         div.forEach( nft => {
            nft.removeEventListener("click", () => clickEvent(nft));
         });
         
         const close = document.querySelector(".fi-sr-cross-circle");
         if(close === null) return;
         close.removeEventListener("click",closeDiv);

         const btn = document.querySelector(".buy");
         if(btn === undefined || btn == null) return;
         btn.removeEventListener("click",buyNFT);
        }
    },[tokens]);

    async function likeToken(evt){  
        let tokenId = evt.target.getAttribute("tokenid");
        tokenId = Number(tokenId);
        const address = walletAddress;
        let res = await axios.post("/increaseLikes",{ tokenId: tokenId, address: address});
        res = res.data;
        const likesCount = res.likesCount;
        document.querySelector(".likes").innerHTML = likesCount;
        
        const currToken = tokens.filter( token => (token.tokenId == tokenId));
        console.log("currToken",currToken);
        currToken.likes = likesCount;
        tokenId = tokenId.toString();
        document.getElementById(tokenId).setAttribute("likes",likesCount.toString());
    }
    
    async function buyNFT(evt){
       if(buying) return;
       setBuying(true);
       const tokenId = evt.target.getAttribute("tokenid");
       const provider = new ethers.providers.Web3Provider(ethereum);
       const signer = provider.getSigner();
       const contract = new ethers.Contract(contractAddi,contractABI,signer);
       const price = await contract.getTokenPrice(tokenId);
       await contract.buyToken(tokenId, {value: price});
       
       const otherTokens = tokens.filter( token => token.tokenId != tokenId);
       setTokens([...otherTokens]);
       
       setMsg("You successfully bought the token!");
       document.querySelector(".message").classList.add("showMsg");
       setTimeout(() => ( document.querySelector(".message").classList.remove("showMsg") ), 2000);
       
       document.querySelector(".displayDiv").style.transform = "scale(0)";
    }

    function closeDiv(){
      document.querySelector(".displayDiv").style.transform = "scale(0)"
    }

    async function clickEvent(nft){
      const title = nft.children[1].children[0].innerHTML;
      const imageURL = nft.children[0].getAttribute("src");
      const descrp = nft.children[2].innerHTML;
      const price = nft.children[1].children[1].innerHTML;
      const owner = nft.children[1].children[2].innerHTML;
      const tokenId = nft.getAttribute("tokenid");
      const likes = nft.getAttribute("likes");
      let views = nft.getAttribute("views");
      const liked = nft.getAttribute("liked");
      
      const res = await axios.post("/increaseViews", { tokenId: Number(tokenId) });
      
      views = res.data.views;

      const div = document.querySelector(".displayDiv");
      const details = document.querySelector(".details");

      details.children[0].innerHTML = title;
      details.children[1].innerHTML = descrp;
      details.children[3].innerHTML = owner;
      details.children[4].innerHTML = "Current price - <span>" + price + "</span>";
      details.children[6].setAttribute("tokenid",tokenId);

      document.querySelector(".fi-ss-heart").classList.remove("liked");
      if(liked == 'true') document.querySelector(".fi-ss-heart").classList.add("liked");
      
      document.querySelector(".views").innerHTML = views;
      document.querySelector(".likes").innerHTML = likes;
      div.children[1].setAttribute("src",imageURL);
      div.style.transform = "scale(1)";
      document.querySelector(".fi-ss-heart").setAttribute("tokenid",tokenId);
      document.querySelector(".fi-ss-heart").addEventListener("click",likeToken);
    }

    function displayToken(token){
       return <NFT tokenId = {token.tokenId} imageUrl={token.url} title={token.title} descrp={ token.descrp} price={ token.price} key = {token.tokenId} owner= { token.owner } likes = { token.likes } views = {token.views } liked = { token.liked.toString()} />
    }
    
    function displayDummy(dummyId){
       return <Dummy key={dummyId}/>;
    }

    return (
        <>
          <Navbar current="explore"/>
          <div className="contentDiv">
               <Message msg = {msg}/>
               <h1 className="exploreTitle">Explore</h1>
               <div className="carousel">
                   <img src="/pics/1.gif" className= "item one"></img>
                   <img src="/pics/2.png" className= "item two"></img>
                   <img src="/pics/3.png" className= "item three"></img>
                   <img src="/pics/4.png" className= "item four"></img>
                   <img src="/pics/5.png" className= "item five"></img>
               </div>
               <i className="fi fi-rr-arrow-down"></i>
               <div className="nftDiv">
                  { tokens === "" && dummy.map(displayDummy) }
                  { tokens != "" && tokens.map(displayToken) }
               </div>
               <div className="displayDiv">
                    <i className="fi fi-sr-cross-circle"></i>
                    <img src="/pics/1.gif" className='nftImg'></img>
                    <div className='details'>
                       <h2 className='nftTitl'>Title</h2>
                       <p>Description</p>
                       <p>Currently owned by - </p>
                       <p className='currOwner'></p>
                       <p>Current price 0.01 eth</p>
                       <div className='stats'>
                          <i className="fi fi-sr-eye"></i><span className='views'>101</span>
                          <i className="fi fi-ss-heart"></i><span className='likes'>789</span>
                       </div>
                       { !buying && <button className='buy'>Buy Now</button> }
                       { buying && <button className='buy'>Please Wait!</button>}
                    </div>
               </div>
          </div>      
        </>
    )
}

export default Explore;