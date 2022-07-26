import React, { useEffect } from 'react';
import "../styles/nft.css";

function NFT(props){

   return (
     <div className='nftTile'>
        <img className="nftImage" src={props.imageUrl} alt="nftImage" title="nft"></img>
        <div className='priceTile'>
             <p>{props.title}</p>
             <p>{props.price}</p>
        </div>
        <h2 className='descrpHide'>{props.descrp}</h2>
     </div>
   );
}

export default NFT;