import React from 'react';

function NFT(props){
   
   return (
     <div className='nftTile'>
        <img src={props.imageUrl} alt="nftImage" title="nft"></img>
        <div className='priceTile'>
             <h2>{props.title}</h2>
             <h2>{props.price}</h2>
        </div>
        <h2>{props.descrp}</h2>
     </div>
   );
}

export default NFT;