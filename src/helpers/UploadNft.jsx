import Axios from 'axios';

const Formdata = require("form-data");

// uploads file to ipfs and returns 
async function uploadFileToIPFS(file){
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    const data = new Formdata();
    data.append("file",file);
    
    return Axios.post(url,data,{
        maxBodyLength: 'Infinite',
        headers: {
           'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
           'pinata_api_key': process.env.REACT_APP_PINATA_API_KEY,
           'pinata_secret_api_key': process.env.REACT_APP_PINATA_SECRET_API_KEY
        }
        })
        .then((res) => {
            return {
                success: true,
                pinataUrl: "https://gateway.pinata.cloud/ipfs/" + res.data.IpfsHash
            }
        })
        .catch((err) =>{
            console.log(err);
            return {
                success: false
            }
        });
}

async function uploadJson(nftData){
    const url = "https://api.pinata.cloud/pinning/pinJSONToIPFS"; 
    
    console.log("JSON in upploadNft file",nftData);

    return Axios 
        .post(url, nftData, {
            headers: {
                pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
                pinata_secret_api_key: process.env.REACT_APP_PINATA_SECRET_API_KEY
            }
        })
        .then(function (response) {
           return {
               success: true,
               pinataURL: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
           };
        })
        .catch(function (error) {
            console.log(error)
            return {
                success: false,
                message: error.message,
            }

    });


    // .then((response) => {
    //     console.log("Json uploaded");
    //     return {
    //         success: true,
    //         pinataUrl: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
    //     }
    // })
    // .catch((err) => {
    //     console.log(err);
    //     return {
    //         success: false
    //     }
    // })
}

export {uploadFileToIPFS,uploadJson};