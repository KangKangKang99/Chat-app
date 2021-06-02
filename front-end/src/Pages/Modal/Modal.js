import React, {useState} from "react";
import {GoAlert} from 'react-icons/all'
import './Modal.scss'
export function Modal (props){
    const [isModal,setIsModal]=useState();
    const close=()=>{
        props.parentCallback(true)
    }
    return(
        <div className={props.isModal==false?'Modal not-modal':'Modal active-modal'}>
            <div className='Modal__card'>
                <div className='card'>
                    <div onClick={close} className='Modal__closeBtn'></div>
                    <div className='Modal__alertDiv'>
                        <GoAlert className="Modal__alertIcon"/>
                        <div className='Modal__alertText'>Login failed!</div>
                    </div>
                    <div className='Modal__message'>
                        <p>Make sure the email and password you entered correctly. Then try again.</p>
                        <p className='mt-4 text-red-400 font-bold'>" {props.alertMessage} "</p>
                    </div>
                </div>
            </div>
        </div>
    )
}