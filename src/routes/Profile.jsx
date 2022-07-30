import React, { useState,useEffect } from 'react';
import {useCookies} from 'react-cookie';
import {useNavigate} from 'react-router-dom';
import Navbar from '../components/Navbar';
import Token from '../helpers/Token';
import '../styles/profile.css';
import { ethers } from 'ethers';
import axios from "axios";
import abi from "../MarketPlace.json";

const contractAddi = "0xB1A7AD3e2dfD8cc6Ee4C36Ece8A1E70210E1E87e";
const contractABI = abi.abi;
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contract = new ethers.Contract(contractAddi,contractABI,signer);

function openDiv(data){
  if(data.currentlyListed === "all") return;
   
  const title = data.title;
  const imageURL = data.imageUrl
  const descrp = data.descrp;
  const price = data.price;
  const owner = data.owner;
  const tokenId = data.tokenId;

  const div = document.querySelector(".tokenDisplay");
  const details = document.querySelector(".details");

  details.children[0].innerHTML = title;
  details.children[1].innerHTML = descrp;
  details.children[3].innerHTML = owner;
  details.children[4].innerHTML = "Current price - " + price + " eth";
  
  div.children[1].setAttribute("src",imageURL);
  div.style.transform = "scale(1)";
  
  document.querySelector(".fi-sr-cross-circle").addEventListener("click",closeDiv);
  const btn = details.children[6].children[1];
  if(data.currentlyListed == true){
     btn.innerHTML = "Change Listing Price";
     btn.classList.add("incrPrice");
     btn.classList.remove("list");

     document.querySelector(".incrPrice").addEventListener("click", () => data.update(tokenId));
  }else{
    btn.innerHTML = "List";
    btn.classList.add("list");
    btn.classList.remove("incrPrice");
    document.querySelector(".list").addEventListener("click",() => data.listToken(tokenId));
  }

}

function closeDiv(){
  document.querySelector(".tokenDisplay").style.transform = "scale(0)";
  document.querySelector(".price").value = "";
}

function NFTToken(props){
  return (
    <div className='nftTile' onClick={() => openDiv(props)}>
       <img className="nftImage" src={props.imageUrl} alt="nftImage" title="nft"></img>
       <div className='priceTile'>
            <p>{props.title}</p>
            <p>{props.price}</p>
       </div>
       <h2 className='descrpHide'>{props.descrp}</h2>
    </div>
  );
}


function Profile(){
    const [cookies] = useCookies();
    const navigate = useNavigate();
    useEffect(() =>{
      if(cookies.walletAddress === undefined) navigate("/");
    },[cookies]);
    
    const walletAddress = cookies.walletAddress;
    const [allTokens,setAllTokens] = useState([]);
    const [tokens,setTokens] = useState([]);
    const [listed,setListed] = useState([]);
    const [unlisted,setUnlisted] = useState([]);

    useEffect(() => {
       getTokens();
    },[]);

    // event listeners
    useEffect(() => {
       const spans = document.querySelectorAll(".navigation span");
       spans.forEach( (span) => {
          span.addEventListener("click", () => {
             document.querySelector(".active").classList.remove("active");
             span.classList.add("active");
             if(span.innerHTML == "All"){
               setTokens(allTokens);
             }else if(span.innerHTML == "Listed"){
               document.querySelector(".all").classList.add("listedTokens");
               document.querySelector(".all").classList.remove("unlistedTokens");
               setTokens(listed);
             }else{
               document.querySelector(".all").classList.remove("listedTokens");
               document.querySelector(".all").classList.add("unlistedTokens");
               setTokens(unlisted);
             } 
          })
       });
    },[allTokens]);

    async function getTokens(){
          const nfts = await contract.getMyTokens(walletAddress);          
          const tokensArr = await Promise.all(nfts.map( async (nft) => {
            const uri = await contract.tokenURI(nft.tokenId);
            let metaData = await axios.get(uri);
            metaData = metaData.data;
            
            const token = new Token(metaData.title,metaData.imageUrl,ethers.utils.formatEther(nft.price),metaData.description,nft.currOwner,0,0,nft.tokenId,nft.currentlyListed);
            return token;
         }));

         const listedNfts = [];
         const unlisted = [];
         
         tokensArr.forEach( (token) => {
             if(!token.currentlyListed) unlisted.push(token);
             else listedNfts.push(token);
         });
         
         const allNfts = tokensArr.map(nft => {
           return new Token(nft.title,nft.url,nft.price,nft.descrp,nft.owner,0,0,nft.tokenId,"all");
         });
         
         setTokens(allNfts);
         setAllTokens(allNfts);
         setListed(listedNfts);
         setUnlisted(unlisted);
    }

    function displayToken(token){
     return <NFTToken tokenId={token.tokenId} imageUrl={token.url} title={token.title} descrp={ token.descrp} price={ token.price} key = {token.tokenId} currentlyListed = {token.currentlyListed} owner = { token.owner } update = {updatePrice} listToken = { listToken }/>
    }
    
    // function to change the listing price of a token

    async function updatePrice(tokenId){
      
      const newPrice = document.querySelector(".price").value;
      if(newPrice === "") return;
      document.querySelector(".incrPrice").innerHTML = "Please Wait!...";
      await contract.updateTokenPrice(tokenId,ethers.utils.parseEther(newPrice));
      alert("Price updated!");
      document.querySelector(".incrPrice").innerHTML = "Price Updated!";
      setTimeout(() => ( document.querySelector(".incrPrice").innerHTML = "Change Listing Price"), 3000);

      document.querySelector(".details").children[4].innerHTML = "Current price - " + newPrice + " eth";

      let currToken = listed.filter( tok => (tok.tokenId === tokenId));
      
      currToken[0].price = newPrice;
      let remaining = listed.filter( tok => (tok.tokenId != tokenId));
      setListed([...currToken,...remaining]);

      currToken = allTokens.filter( tok => (tok.tokenId === tokenId));
      currToken[0].price = newPrice;
      remaining = allTokens.filter( tok => (tok.tokenId !== tokenId));
      setAllTokens([...currToken,...remaining]);
    }

    // function to list nft

    async function listToken(tokenId){
      console.log(tokenId);
      console.log(typeof(tokenId));
      let price = document.querySelector(".price").value;
      if(price === "") return;
      price = ethers.utils.parseEther(price);

      var listingPrice = await contract.getListingPrice();
      // listingPrice = listingPrice.toString();
      console.log(listingPrice,"Price of nft",price);
      
      document.querySelector(".list").innerHTML = "Please Wait!...";
      const tranx = await contract.listToken(tokenId,price,{ value: listingPrice });
      await tranx.wait();
      
      alert("NFT listed");
      document.querySelector(".tokenDisplay").style.transform = "scale(0)";
      
      price = ethers.utils.formatEther(price)
      let currToken = unlisted.filter( token => (token.tokenId === tokenId));
      let remaining = unlisted.filter( token => (token.tokenId != tokenId));
      
      setUnlisted([...remaining]);
      currToken[0].price = price;
      currToken[0].currentlyListed = true;
      setListed( prev => ( [...prev,...currToken]));
      
      currToken = allTokens.filter( token => (token.tokenId === tokenId));
      currToken[0].price = price;
      remaining = allTokens.filter( token => (token.tokenId != tokenId));
      setAllTokens([...currToken,...remaining]);

    }



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
                       <p className='name'>@username <i className="fi fi-sr-edit-alt"></i> </p>
                       <p className='walletAddress'>0x21620a4F3f37F0950cEC4b854285F36a4eD09A2F</p>
                  </div>
             </div>
             <div className='userTokens'>
                  <nav className="navigation">
                     <span className='active'>All</span>
                     <span>Listed</span>
                     <span>Unlisted</span>
                  </nav>
                  <div className='tokensDiv'>
                     <div className='all'> 
                        { tokens.map(displayToken) }
                     </div>
                  </div>
             </div>
             <div className='tokenDisplay'>
                  <i className="fi fi-sr-cross-circle"></i>
                  <img src="/pics/1.gif" className='nftImg'></img>
                  <div className='details'>
                     <h2 className='nftTitl'>Title</h2>
                     <p>Description</p>
                     <p>Currently owned by</p>
                     <p className='currOwner'></p>
                     <p>Current price 0.01 eth</p>
                     <div className='stats'>
                          <i className="fi fi-sr-eye"></i><span className='views'>101</span>
                          <i className="fi fi-ss-heart"></i><span className='likes'>789</span>
                          <i className="fi fi-sr-bookmark"></i>
                     </div>
                     <div>
                          <input type="text" placeholder="Enter price" className='price' required></input>
                          <button className='btn'>List</button>
                     </div>
                  </div>
             </div>
        </div>
      </>
    )
}

export default Profile;