import React, { useState,useEffect } from 'react';
import {useCookies} from 'react-cookie';
import {useNavigate} from 'react-router-dom';
import { ethers } from 'ethers';
import "../styles/create.css";
import Navbar from "../components/Navbar.jsx";
import { uploadFileToIPFS, uploadJson } from '../helpers/UploadNft';
import abi from "../MarketPlace.json";

function Create(){
    const [cookies] = useCookies();
    const navigate = useNavigate();
    const [uploading,setUploading] = useState(false);
    const contractAddi = "0xB1A7AD3e2dfD8cc6Ee4C36Ece8A1E70210E1E87e"; //"0xAFB057af1188b8fB14F39001E3047Ff245BebcA5";
    const contractABI = abi.abi;

    useEffect(() =>{
      if(cookies.walletAddress === undefined) navigate("/");
    },[cookies])
    
    async function uploadToContract(pinataUrl,title){
       console.log("in contract fuction");
       const {ethereum} = window;
       const provider = new ethers.providers.Web3Provider(ethereum);
       const signer = provider.getSigner();
       console.log(signer);
       const addi = await signer.getAddress();
       console.log(addi);
       const contract = new ethers.Contract(contractAddi,contractABI,signer);
       console.log(contract.address);
       const price = await contract.getListingPrice();
       console.log(Number(price));
       let transx = await contract.createToken(pinataUrl,title);
       await transx.wait();
       alert("Successfully created a new token!");
    }

    async function uploadNft(e){
         e.preventDefault();
         const {title,descrp,file} = e.target;
        //  e.target.submitButton.classList.add("clicked");
         e.target.submitButton.innerHTML = "Uploading...";
         const result = await uploadFileToIPFS(file.files[0]);
         if(result.success){
            const url = result.pinataUrl;
          
            const nftData ={
              title: title.value,
              description: descrp.value,
              imageUrl: url
            };
            const res = await uploadJson(nftData);
            console.log(res);
            
            await uploadToContract(res.pinataURL,title.value);
            e.target.submitButton.innerHTML = "Uploaded";
            setInterval(() => (e.target.submitButton.innerHTML = "Create NFT"),2000);
         }else{
            e.target.submitButton.classList.remove("clicked");
            e.target.submitButton.innerHTML = "Failed to upload";
            setTimeout(() => (e.target.submitButton.innerHTML = "Create NFT"),2000);
         }
    }

    return (
      <>
        <Navbar current="create" />
        <div className="formDiv">
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
            <button type="submit" className="createNft" name="submitButton">Create NFT</button>
          </form>
        </div>
      </>
    )
}

export default Create;