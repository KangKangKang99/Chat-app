import React from "react";
import './Chatbox.scss'
export function Messenger(props){

        if(props.item.user_name==props.curren_user){
            return (
                <div  className='Chatbox__mess--user1 flex flex-row-reverse relative'>
                    <div className='Itemmess1'></div>
                    <div className='Contentmess1'>
                        <h3>{props.item.user_name}</h3>
                        <p>{props.item.message_content}</p>
                        <p className='timer'>{props.item.message_time}</p>
                    </div>
                </div>
            )
        }
        else return (
            <div  className='Chatbox__mess--user2 flex flex-row relative'>
                <div className="Itemmess2"></div>
                <div className='Contentmess2'>
                    <h3>{props.item.user_name}</h3>
                    <p>{props.item.message_content}</p>
                    <p className='timer'>{props.item.message_time}</p>
                </div>
            </div>
        )



}