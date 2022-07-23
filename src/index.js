import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import App from "./routes/App.jsx";
import Home from "./routes/Home.jsx";
import Create from "./routes/Create.jsx";
import Profile from "./routes/Profile.jsx";
import Explore from "./routes/Explore.jsx";
import { CookiesProvider } from 'react-cookie';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <CookiesProvider>
  <BrowserRouter>
    <Routes>
       <Route path="/" element={ <App />}></Route>
       <Route path="/home" element={ <Home />}></Route>
       <Route path="/explore" element={<Explore />}></Route>
       <Route path="/create" element={ <Create />}></Route>
       <Route path="/profile" element={ <Profile />}></Route>
    </Routes>
  </BrowserRouter>
  </CookiesProvider>
);

const carousel = document.getElementsByClassName("carousel");

if(carousel){
  setInterval(() => {
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
  },6000)
}
