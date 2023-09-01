import React,{useEffect, useRef, useState} from 'react'
import Client from '../components/Client';
import Editor from '../components/Editor';
import { initSocket } from '../socket';
import ACTIONS from '../Actions';
import { Navigate, useLocation ,useNavigate,useParams} from 'react-router-dom';
import toast from 'react-hot-toast';
const EditorPage = () => {

  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const reactNavigator = useNavigate();
  const {roomId} = useParams();
  const [clients,setClients]=useState([]);

  useEffect(()=>{
       const init = async()=>{
          socketRef.current = await initSocket();

          socketRef.current.on('connect_error',(err)=>handleErrors(err));
          socketRef.current.on('connect_failed',(err)=>handleErrors(err));

          function handleErrors(err) {
            console.log('socket error', err);
            toast.error('Socket connection failed, try again later.');
            reactNavigator('/');
          }

          socketRef.current.emit(ACTIONS.JOIN,{
            roomId,
            username : location.state?.username,
          });

          // Listening for joined event
          socketRef.current.on(ACTIONS.JOINED,({clients,username,socketId})=>{
                if(username!==location.state?.username){
                  toast.success(`${username} has joined the room`);
                }
              setClients(clients);
              socketRef.current.emit(ACTIONS.SYNC_CODE,{
                code : codeRef.current,
                socketId,
              });

          })
          // listening for disconnected 
          socketRef.current.on(ACTIONS.DISCONNECTED,({socketId,username})=>{
                     toast.success(`${username} left the room`);
                     setClients((prev)=>{
                          return prev.filter((client)=>
                               client.socketId!==socketId
                          );
                     });
          })
       };

       init();
       
       return ()=>{
        socketRef.current.disconnect();
        socketRef.current.off(ACTIONS.JOINED).disconnect();
        socketRef.current.off(ACTIONS.DISCONNECTED).disconnect();
       }

  },[]);

  async function copyRoomId(){
    try{
           await navigator.clipboard.writeText(roomId);
           toast.success('Room ID is successfully copied');

    }catch(err){
             toast.error('Could not copy the Room ID');
             console.log(err);
    }
  }
  //-----uncomment this------------
  function leaveRoom(){
     reactNavigator('/');
  }

   if(!location.state){
          return <Navigate to ='/'/>
   }

  return (
    <div className="mainWrap">
       <div className="aside">
          <div className="asideInner">
            <div className="app-logo">

              <img className="logoImage" src="/dev-collab-removebg-preview.png" alt="logo"/>

            </div>

            <h3>Connected</h3>
            <div className="clientsList">
                 {
                  clients.map(client=>(
                    <Client key={client.socketId}
                    username={client.username}/>
                  ))
                 }
            </div>
          </div>
          <button className="btn copyBtn"
           onClick={copyRoomId}>Copy Room ID</button>
          <button className='btn leaveBtn'
          onClick={leaveRoom}>Leave</button>
       </div>
       <div className="editorWrap">
         <Editor socketRef= {socketRef} roomId={roomId} onCodeChange={(code)=>{codeRef.current=code;}}/>
       </div>
    </div>
  )
}

export default EditorPage