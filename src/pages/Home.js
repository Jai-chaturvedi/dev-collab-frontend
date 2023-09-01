import React from 'react';
import {v4 as uuidV4} from 'uuid';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate =useNavigate();
  const [roomId,setRoomId] = useState('');
  const [username,setUsername] = useState('');
  const createNewRoom = (e)=>{
   e.preventDefault();
   const id = uuidV4();
   setRoomId(id);

   toast.success('Created a new room');

  }
  const joinRoom = ()=>{
      if(!roomId || !username) {
        toast.error('ROOM ID & Username is required');
        return ;
      }
      //Redirect
      navigate(`/editor/${roomId}`,{
        state : {
          username,
        },
      });
     

  }
  const handleInputEnter = (e)=>{
     if(e.code==='Enter'){
        joinRoom();
     }
  }
  return (
    <div className="homePageWrapper">
      <div className="formWrapper">
          <img className="logo" src="/dev-collab-removebg-preview.png" alt='dev-collab-logo'/>
          <h4 className="mainLabel">Paste invitation Room ID</h4>
          <div className="inputGroup">

            <input type="text" className="inputBox" 
            placeholder="ROOM ID"
            onChange={(e)=>setRoomId(e.target.value)}
            value ={roomId}
            onKeyUp={handleInputEnter}/>

            <input type="text" className="inputBox" placeholder="USERNAME"
            onChange={(e)=>setUsername(e.target.value)}
            value ={username}
            onKeyUp={handleInputEnter}/>

            <button onClick={joinRoom} className="btn joinBtn">Join</button>

            <span className="createInfo">If you don't have an invite then create a &nbsp;
            <a onClick={createNewRoom} href="" className="createNewBtn">new room</a>
            </span>

          </div>
        </div>
    </div>
  )
}

export default Home;