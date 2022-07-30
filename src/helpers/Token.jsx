
export default function Token(title,url,price,descrp,owner,likes,views,tokenId,currentlyListed){
    this.tokenId = tokenId;
    this.title = title;
    this.url = url;
    this.price = price;
    this.descrp = descrp;
    this.owner = owner;
    this.likes = likes;
    this.views = views;
    this.currentlyListed = currentlyListed;
 }