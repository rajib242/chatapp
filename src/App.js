
import {React,useState,useEffect,useRef} from 'react';
import { Input,Box,VStack} from '@chakra-ui/react';
import { HStack,Container,Button} from '@chakra-ui/react'
import Message from "./components/Message.jsx"
import {onAuthStateChanged,getAuth,GoogleAuthProvider,signInWithPopup,signOut} from "firebase/auth";
import {app} from "./components/firebase";

import "firebase/auth";
import {getFirestore,addDoc,collection,serverTimestamp,onSnapshot,query,orderBy} from "firebase/firestore";


const auth = getAuth(app);
const db = getFirestore(app);


const loginHandler = ()=>{
  const provider = new GoogleAuthProvider();

  signInWithPopup(auth,provider);
}

const logoutHandler = ()=>{
  signOut(auth);
}




const App = () =>{
   const[user,setUser] = useState(false);
   
   const [message,setMessage] = useState("");
   const [messages,setMessages] = useState([]);
   const divForScroll = useRef(null);


const submitHandler = async (e) =>{
 e.preventDefault(); 

 try{
     setMessage("");
   await addDoc(collection(db,"Messages"),{
     text:message,
     uid:user.uid,
     uri:user.photoURL,
     createdAt:serverTimestamp()
   });

   
   divForScroll.current.scrollIntoView({behavior:"smooth"});
 }catch(error){
  alert(error)
 }

}
//useEffect
   useEffect(()=>{
    const q = query(collection(db,"Messages"),orderBy("createdAt","asc"))
  const unsubscribe = onAuthStateChanged(auth,(data)=>{
    // console.log(data);
      setUser(data);
    });

 const unsubscribeForMessages = onSnapshot(q,(snap)=>{
      setMessages(
         snap.docs.map((item)=>{
           const id = item.id;
          return {id, ...item.data() };
         })
      )
   });

     return ()=>{
        unsubscribe();
        unsubscribeForMessages();
     }
},[]);




  return(
     <Box bg={"red.100"}>
        {user?(
               <Container h={"100vh"} bg={"white"}>
          <VStack h={"full"}bg={"telegram.100"} padding={"4"}>
             <Button onClick={logoutHandler} colorScheme={"green"} w={"full"}>
                  Logout
             </Button>

                <VStack h="full" w={"full"} overflowY="auto" css={{"&::-webkit-scrollbar":{
                  display:"none"
                }}}>
                    {
                      messages.map((item) => (
                        <Message
                          key={item.id}
                          user={item.uid === user.uid ? "me" : "other"}
                          text={item.text} 
                          uri={item.uri}
                          />
                          ))
                   }
                 </VStack>    
  
                  <div ref={divForScroll}>
                      
                  </div>
               <form onSubmit={submitHandler} style={{ width:"100%"}}>
                  <HStack>
                      <Input value={message} onChange={(e)=>setMessage(e.target.value)} placeholder="Enter a message....." />
                      <Button type="submit" colorScheme={"purple"}>Send</Button>
                  </HStack>
               </form>

          </VStack>
        </Container> 
            ):(
                
               <VStack justifyContent={"center"} h="100vh">
                   <Button onClick={loginHandler} colorScheme={"green"}>Sign In Google </Button>
               </VStack>
            )}  
     </Box>
  );
}

export default App;