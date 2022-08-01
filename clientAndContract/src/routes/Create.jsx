import React, { useState,useEffect } from 'react';
import {useCookies} from 'react-cookie';
import {useNavigate} from 'react-router-dom';
import { ethers } from 'ethers';
import axios from 'axios';
import "../styles/create.css";
import Navbar from "../components/Navbar.jsx";
import Message from '../components/Message';
import { uploadFileToIPFS, uploadJson } from '../helpers/UploadNft';
import abi from "../MarketPlace.json";

function Create(){
    const [cookies] = useCookies();
    const navigate = useNavigate();
    const [uploading,setUploading] = useState(false);
    const [msg,setMsg] = useState("");
    const contractAddi = "0xeA87aa0810B5d34D6D880d381337E23C471F1db5"; //"0xAFB057af1188b8fB14F39001E3047Ff245BebcA5";
    const contractABI = abi.abi;

    useEffect(() =>{
      if(cookies.walletAddress === undefined) navigate("/");
    },[cookies])
    
    async function uploadToContract(pinataUrl,title){
       const {ethereum} = window;
       const provider = new ethers.providers.Web3Provider(ethereum);
       const signer = provider.getSigner();
       const contract = new ethers.Contract(contractAddi,contractABI,signer);
       const price = await contract.getListingPrice();
       await contract.createToken(pinataUrl,title);
       
       let tokenId = await contract.countOFTokens();
       tokenId = Number(tokenId);
       
       axios
       .post("/newToken",{ tokenId: tokenId+1})
       .then((res) => {
           if(res.data.success){
            setMsg("Successfully created a token!");
            document.querySelector(".message").classList.add("showMsg");
            setTimeout(() => ( document.querySelector(".message").classList.remove("showMsg") ), 2000);
           }
       })
       .catch(err => (console.log(err)));
    }

    async function uploadNft(e){
         e.preventDefault();
         if(uploading) return;
         setUploading(true);
         const {title,descrp,file} = e.target;
         const result = await uploadFileToIPFS(file.files[0]);
         if(result.success){
            const url = result.pinataUrl;
          
            const nftData ={
              title: title.value,
              description: descrp.value,
              imageUrl: url
            };
            const res = await uploadJson(nftData);
            
            await uploadToContract(res.pinataURL,title.value);
            setInterval(() => (e.target.submitButton.innerHTML = "Create NFT"),2000);
            e.target.title.value = "";
            e.target.descrp.value = "";
            e.target.file.value = null;
            setUploading(false);
         }else{
            e.target.submitButton.classList.remove("clicked");
            setTimeout(() => (e.target.submitButton.innerHTML = "Create NFT"),2000);
            e.target.title.value = "";
            e.target.descrp.value = "";
            e.target.file.value = null;
            setUploading(false);
         }
    }

    return (
      <>
        <Navbar current="create" />
        <div className="formDiv">
          <Message msg = {msg}/>
          <div className="textDiv">
             <h1 className="createText">Create your own NFT</h1>
             <p>Specify the name, give the description for the NFT and upload the file.</p>
             <p>That's it! You own an NFT now!</p>
             <div className="divBg"></div>
          </div>
          <form className="nftForm" onSubmit={uploadNft}>
            <input type="text" className="nftTitle" placeholder="Title..." name="title" required></input>
            <textarea className="descrp" placeholder="Description..." name="descrp" required></textarea>
            <input type="file" className="fileInput" name="file" required></input>
            { !uploading && <button type="submit" className="createNft" name="submitButton">Create NFT</button> }
            { uploading && <button type="submit" className="createNft" name="submitButton">Uploading...</button> }
          </form>
        </div>
      </>
    )
}

export default Create;