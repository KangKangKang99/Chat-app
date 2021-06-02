import React,{useEffect,useState} from "react";
import {useHistory} from 'react-router-dom'
import './Chatbox.scss';
import {IoSendSharp} from 'react-icons/all'
import axios from "axios";
import useKeypress from 'react-use-keypress';
import useChat from "../../useChat";
import {Messenger} from "./Messenger";
const Chatbox=()=>{
    const { roomId } = 1
    const [userStatus,setUserstatus]=useState([])
    const [message,setMessage]=useState([])
    const [loadMess,setLoadMess]=useState();
    const [currentMess,setCurrentmess]=useState();
    const [notbeLoad,setNotbeload]=useState(false)
    const {messages,sendMessage} = useChat(roomId)
    const current_user=sessionStorage.getItem('user_name')
    const history=useHistory()
    function exit(){
        sessionStorage.removeItem('user_login');
        document.cookie = 'user_token' +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        document.cookie = 'user_token' +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        history.push('/login')
    }
    async function getUser(){
        const config={
            method: 'get',
            url: 'http://127.0.0.1:8000/api/get-user',
            headers: {
                "Content-Type": "application/json",
                "Accept": 'application/json',
            }
        }
        await axios(config)
           .then(function (response)
           {
               setUserstatus(response.data.user_name)
           })
            .catch(function (error) {console.log(error)});
    }
    async function getMessage(){
        const config={
            method: 'get',
            url: 'http://127.0.0.1:8000/api/get-message',
            headers: {
                "Content-Type": "application/json",
                "Accept": 'application/json',
            }
        }
        await axios(config)
            .then(function (response)
            {
                setMessage(response.data.data)
                setLoadMess(response.data.next_page_url)
            })
            .catch(function (error) {console.log(error)});
    }
    async function saveMessage(){
        const data={'message_content':currentMess,'user_name':current_user}
        const config={
            method: 'post',
            url: 'http://127.0.0.1:8000/api/save-message',
            headers: {
                "Content-Type": "application/json",
                "Accept": 'application/json',
            },
            data:data
        }
        await axios(config)
            .then(function (response)
            {
            })
            .catch(function (error) {console.log(error)});
    }
    async function sendMess(){
       let x= currentMess+'';
       if(x.length>0){
           await getUser()
           await saveMessage()
           await sendMessage(currentMess)
           await setCurrentmess("")
           document.getElementById('chatInput').value=''
       }

    }
    async function loadMore(){
        if(notbeLoad==false){
            document.getElementById('chat_text').scrollTop+=50
            const config={
                method: 'get',
                url: loadMess,
                headers: {
                    "Content-Type": "application/json",
                    "Accept": 'application/json',
                }
            }
            /*document.getElementById('chat_text').scrollTop+=document.getElementById('chat_text').offsetHeight*/
            await axios(config)
                .then(function (response)
                {
                    response.data.data.map(
                        (item,i)=>{
                            setMessage(state => [ ...state,item])
                        }
                    )
                    if(response.data.next_page_url==null){
                        setNotbeload(true)

                    }
                    else{
                        setLoadMess(response.data.next_page_url)

                    }
                })
                .catch(function (error) {console.log(error)});
        }
        if(document.getElementById('number20')){
            document.getElementById('number20').scrollIntoView({ behavior: 'auto', block: 'center' })}
    }
    useEffect(()=> {
        getMessage()
    },[messages])
    useEffect(()=>{
        if(!sessionStorage.getItem('user_login')){
            history.push('/login')
        }
        else {
            getUser()
        }
    },[])
    useKeypress('Enter', ()=>sendMess())
    useKeypress('Escape', ()=>exit())
    function scroll(){
        var scrollTop = document.getElementById('chat_text').scrollTop;
        var scrollHeight = document.getElementById('chat_text').scrollHeight; // added
        var offsetHeight = document.getElementById('chat_text').offsetHeight;
        let ccontentHeight =document.getElementById('content').offsetHeight
        // var clientHeight = document.getElementById('box').clientHeight;
        var contentHeight = scrollHeight - offsetHeight; // added
        if (contentHeight <= -scrollTop) // modified
        {
            loadMore()
            console.log(ccontentHeight)
            console.log(scrollTop)
        }


    }
    function convertime(item){
        let time= item.substr(10,6)
        let date= item.substr(8,2)
        let month = item.substr(5,2)
        let year = item.substr(2,2)
        return time+' '+date+'/'+month+'/'+year
    }
    let content =
        <div id='content'>
            {
                message.slice(0).reverse().map(
                    (item,i)=>
                        item.user_name == current_user
                            ? <div id={'number'+i} key={i} className='Chatbox__mess--user1 flex flex-row-reverse'>
                                <div className='Itemmess1'></div>
                                <div className='Contentmess1'>
                                    <h3>{item.user_name}</h3>
                                    <p>{item.message_content}</p>
                                    <p className='timer'>{convertime(item.message_time)}</p>
                                </div>
                            </div>
                            : <div id={'number'+i} key={i} className='Chatbox__mess--user2 flex flex-row'>
                                <div className="Itemmess2"></div>
                                <div className='Contentmess2'>
                                    <h3>{item.user_name}</h3>
                                    <p>{item.message_content}</p>
                                    <p className='timer'>{convertime(item.message_time)}</p>
                                </div>
                            </div>
                )
            }
        </div>
    return(
        <div className='Chatapp'>
            <div className='Chatbox'>
                <div className='Chatbox__userlist'>
                    <h1>User list</h1>
                    {
                        userStatus.map(
                            (item,i)=>
                                <div key={i} className='Chatbox__user--online'>
                                    <p>{item}</p>
                                </div>
                        )
                    }
                    <div onClick={()=>exit()} className='Chatbox__exit'>
                    </div>
                </div>
                <div className='Chatbox__message'>
                    <div onScroll={scroll} id='chat_text' className='Chatbox__text'>
                        {
                           content
                        }

                    </div>

                    <div className='Chatbox__type'>
                        <input id='chatInput' onChange={(e)=>setCurrentmess(e.target.value)} className='Chatbox__input' type="text" placeholder='Enter your message...'/>
                        <IoSendSharp onClick={sendMess} className='Chatbox__sendIcon'/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default  Chatbox