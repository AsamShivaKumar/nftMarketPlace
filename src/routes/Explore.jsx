import React, { useState,useEffect } from 'react';
import {useCookies} from 'react-cookie';
import {useNavigate} from 'react-router-dom';
import Navbar from "../components/Navbar.jsx";
import NFT from '../components/NFT.jsx';
import Token from "../helpers/Token.jsx";
import "../styles/navbar.css";
import "../styles/explore.css";
import { ethers } from 'ethers';
import abi from '../MarketPlace.json';
import axios from 'axios';

function Explore(){
    const [cookies] = useCookies();
    const navigate = useNavigate();
    const {ethereum} = window;
    const contractAddi = "0xB1A7AD3e2dfD8cc6Ee4C36Ece8A1E70210E1E87e";
    const contractABI = abi.abi;
    const [tokens,setTokens] = useState([]);
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
         
         const token = new Token(metaData.title,metaData.imageUrl,ethers.utils.formatEther(nft.price),metaData.description,nft.currOwner,0,0,nft.tokenId,nft.currentlyListed);
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
    
    async function buyNFT(evt){
       const tokenId = evt.target.getAttribute("tokenid");
       console.log(tokenId);
       evt.target.innerHTML = "Please Wait...!"
       const provider = new ethers.providers.Web3Provider(ethereum);
       const signer = provider.getSigner();
       const contract = new ethers.Contract(contractAddi,contractABI,signer);
       const price = await contract.getTokenPrice(tokenId);
       console.log("Price", price);
       await contract.buyToken(tokenId, {value: price});
       
       const otherTokens = tokens.filter( token => token.tokenId != tokenId);
       setTokens([...otherTokens]);
       
       alert("You successfully bought the token!");
       document.querySelector(".displayDiv").style.transform = "scale(0)";
    }

    function closeDiv(){
      document.querySelector(".displayDiv").style.transform = "scale(0)"
    }

    function clickEvent(nft){
      const title = nft.children[1].children[0].innerHTML;
      const imageURL = nft.children[0].getAttribute("src");
      const descrp = nft.children[2].innerHTML;
      const price = nft.children[1].children[1].innerHTML;
      const owner = nft.children[1].children[2].innerHTML;
      const tokenId = nft.getAttribute("tokenid");

      const div = document.querySelector(".displayDiv");
      const details = document.querySelector(".details");

      details.children[0].innerHTML = title;
      details.children[1].innerHTML = descrp;
      details.children[3].innerHTML = owner;
      details.children[4].innerHTML = "Current price - <span>" + price + "</span>eth";
      details.children[6].setAttribute("tokenid",tokenId);
      
      div.children[1].setAttribute("src",imageURL);
      div.style.transform = "scale(1)" 
    }

    function displayToken(token){
       return <NFT tokenId = {token.tokenId} imageUrl={token.url} title={token.title} descrp={ token.descrp} price={ token.price} key = {token.tokenId} owner= { token.owner }/>
    }

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
               <i className="fi fi-rr-arrow-down"></i>
               <div className="nftDiv">
                  {/* <NFT imageUrl="/pics/1.gif" title="NFT1" descrp="nft one first nft" price = "0.01 eth" />
                  <NFT imageUrl="/pics/2.png" title="NFT1" descrp="nft one first nft" price = "0.01 eth" />
                  <NFT imageUrl="/pics/3.png" title="NFT1" descrp="nft one first nft" price = "0.01 eth" />
                  <NFT imageUrl="/pics/4.png" title="NFT1" descrp="nft one first nft" price = "0.01 eth" />
                  <NFT imageUrl="/pics/5.png" title="NFT1" descrp="nft one first nft" price = "0.01 eth" />
                  <NFT imageUrl="/pics/nfts.png" title="NFT1" descrp="nft one first nft" price = "0.01 eth" />
                  <NFT imageUrl="/pics/boredApe.png" title="NFT1" descrp="nft one first nft" price = "0.01 eth" /> */}
                  { tokens.map(displayToken)}
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
                          <i className="fi fi-sr-bookmark"></i>
                       </div>
                       <button className='buy'>Buy Now</button>
                    </div>
               </div>
          </div>      
        </>
    )
}

export default Explore;