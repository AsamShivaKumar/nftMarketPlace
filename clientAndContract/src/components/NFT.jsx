import React, { useEffect } from 'react';
import "../styles/nft.css";

function NFT(props){
   
   return (
     <div className='nftTile' tokenid = {props.tokenId} likes = {props.likes} views = {props.views} liked = {props.liked} id = {props.tokenId}>
        <img className="nftImage" src={props.imageUrl} alt="nftImage" title="nft"></img>
        <div className='priceTile'>
             <p>{props.title}</p>
             <p>{props.price}<i className="fi fi-brands-ethereum"></i></p>
             <p style = { {display: "none" } } >{props.owner}</p>
        </div>
        <h2 className='descrpHide'>{props.descrp}</h2>
     </div>
   );
}

export default NFT;