import React,{useState,useEffect} from "react";
import axios from "axios";
import './LoginPage.scss'
import {MdError} from 'react-icons/all'
import {useHistory,Link} from "react-router-dom";

import {Modal} from "../Modal/Modal";
const LoginPage=()=>{
    const [isLogin,setisLogin]=useState(true)
    const [newUsername,setNewusername]=useState();
    const [newUserpassword,setNewuserpassword]=useState();
    const [newUseremail,setNewuseremail]=useState();
    const [userEmail,setUserEmail]=useState();
    const [userPassword,setUserPassword]=useState();
    const [rememberMe,setrememberMe]=useState(false);
    const [alertEmail,setAlertemail]=useState(null);
    const [alertPassword,setAlertpassword]=useState(null);
    const [alertName,setAlertName]=useState(null);
    const [invalid,setInvalid]=useState([false,false,false])
    const [isalert,setIsalert]=useState(false);
    const [alertMessage,setAlertMessage]=useState();
    const history=useHistory()
    useEffect(()=>{
        const cookie='user_token'
        if(getCookie(cookie)){
            let data={'user_token': getCookie(cookie)}
            const config={
                method: 'post',
                url: 'http://127.0.0.1:8000/api/login',
                headers: {
                    "Content-Type":"application/json",
                    "Accept":'application/json',
                    "Access-Control-Allow-Credentials":true,
                    "Access-Control-Allow-Headers": 'http://127.0.0.1:8000/api/login',
                    "Access-Control-Allow-Origin": "*",
                    "withCredentials": true
                },
                data : data
            }
            axios(config)
                .then(function (response) {
                    if(response.data.loginSuccess) {
                         sessionStorage.setItem('user_login','true')
                         sessionStorage.setItem('user_name',response.data.user_name);
                         history.push('/')
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    },[])
    // login or register
    function changetoSignUp(){
        setisLogin(false)
        setUserEmail(undefined)
        setUserPassword(undefined)

    }
    function changetoSignIn(){
        setisLogin(true)
        setNewuseremail(undefined)
        setNewuserpassword(undefined)
        setNewusername(undefined)
    }
    useEffect(
        ()=>{
            setTimeout(
                ()=>{
                    if(isLogin==true) {
                        if(document.getElementById("registerForm")){
                            document.getElementById("registerForm").reset();
                            setNewusername()
                            setNewuseremail()
                            setNewuserpassword()
                        }
                    }
                    if(isLogin==false) {
                        if(document.getElementById("loginForm")){
                            document.getElementById("loginForm").reset();
                            setUserEmail()
                            setUserPassword()
                        }
                    }
                },1000
            )
        },[isLogin]
    )

    // remeber password

    /*REQUIRED FORM.................................................*/
    // new-email-password
    useEffect(()=>{
        let x=newUseremail+''
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (newUseremail===undefined || x.length==0) {
            setAlertemail(<div className={'text-gray-300 opacity-70'}>*example: khuong@gmail.com</div>)
        }
        else {
            if (!re.test(x)) {
                setAlertemail(<div className={'text-red-500 opacity-70'}>*Not email type</div>)
                setInvalid( invalid.map((item,index)=> index === 0 ? false : item))
            }
            else checkMail()
        }
    },
    [newUseremail])
    // new-user-password
    useEffect(()=>{
        let x=newUserpassword+'';
        if (newUserpassword===undefined || x.length==0) {
            setAlertpassword(<div className={'text-gray-300 opacity-70'}>*Only digits and letters</div>)
            setInvalid( invalid.map((item,index)=> index === 1 ? false : item))
        }
        else if(!x.match(/^[0-9a-zA-Z]+$/)) {
            setAlertpassword(<div className='text-red-500 opacity-70'>*Invalid character</div>)
            setInvalid( invalid.map((item,index)=> index === 1 ? false : item))
        }
        else{
            if(x.length<6 && x.length>0) {
                setAlertpassword(<div className='text-red-300 opacity-70'>*At less 6 chars</div>)
                setInvalid( invalid.map((item,index)=> index === 1 ? false : item))
            }
            else if(x.length>=6 && x!==undefined){
                setAlertpassword(<div className='text-green-300 opacity-70'>*Password available</div>)
                setInvalid( invalid.map((item,index)=> index === 1 ? true : item))
            }
        }
    },[newUserpassword])
    //new-user-name
    useEffect(()=>{
        const re=/^[a-zA-Z0-9]{4,10}$/
        const x=newUsername+'';
        if (newUsername===undefined || x.length==0) {
            setAlertName(<div className="mt-4"></div>)
        }
        else {
            if (!re.test(x)) {
                setAlertName(<div className={'text-red-500 opacity-70'}>*4 - 10 characters and no specials</div>)
                setInvalid( invalid.map((item,index)=> index === 2 ? false : item))
            }
            else {
                checkUsername()
            }
        }
    },[newUsername])
    /*END REQUIRED FORM.................................................*/

    /*HANDLE SIGN IN AND SIGN UP.....................................*/
    // register funct
    async function register(){
        if(invalid[0] && invalid[1] && invalid[2]){
            let data={'user_name':newUsername,'user_password':newUserpassword,'user_email':newUseremail}
            const config={
                method: 'post',
                url: 'http://127.0.0.1:8000/api/register',
                headers: {
                    "Content-Type":"application/json",
                    "Accept":'application/json'
                },
                data : data
            }
            axios(config)
                .then(function (response) {
                    if(response.data.success){
                        setisLogin(true)
                        document.getElementById('user_name_login').value=newUseremail
                        document.getElementById('user_password_login').value=newUserpassword
                        setUserEmail(newUseremail)
                        setUserPassword(newUserpassword)
                    }
                })

                .catch(function (error) {
                    console.log(error);
                });
        }
        else console.log('err')
    }
    //login funct
    async function login(){
        let data={'user_email':userEmail,'user_password':userPassword,'remember_me':rememberMe}
        const config={
            method: 'post',
            url: 'http://127.0.0.1:8000/api/login',
            headers: {
                "Content-Type":"application/json",
                "Accept":'application/json',
                "Access-Control-Allow-Credentials":true,
                "Access-Control-Allow-Headers": 'http://127.0.0.1:8000/api/login',
                "Access-Control-Allow-Origin": "*",
                "withCredentials": true
            },
            data : data
        }
        axios(config)
            .then(function (response) {
                if(response.data.user_token) {
                    let expdate= new Date()
                    expdate.setDate(expdate.getDate()+30)
                    document.cookie= "user_token="+response.data.user_token+"; expires="+expdate+"path=/"
                    sessionStorage.setItem('user_name',response.data.user_name);
                }
                if(response.data.loginSuccess) {
                    sessionStorage.setItem('user_login','true')
                    sessionStorage.setItem('user_name',response.data.user_name);
                    history.push('/')
                }
                if(response.data.loginFail){
                    setIsalert(true)
                    setAlertMessage(response.data.loginFail)
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    //register click
    function handleSignUp(){
        if(newUseremail==undefined) setNewuseremail('')
        if(newUserpassword==undefined) setNewuserpassword('')
        if(newUsername ===undefined) setNewusername('')

        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let x = newUseremail+'';
        let y= newUserpassword+'';
        let z=newUsername+'';
        if(re.test(x) && y.match(/^[0-9a-zA-Z]+$/)
            && y.length>=6 && newUserpassword!=undefined
            && newUsername!=undefined && z.replace(/\s/g, '').length) {
            register()
        }
        else console.log('err')
    }
    //register click
    function handleSignIn(){
        if(userEmail==undefined) setUserEmail('')
        if(userPassword==undefined) setUserPassword('')
        if(userEmail!=undefined && userPassword !=undefined){
            const x= userEmail+''
            const y= userPassword+''
            if (x.length!=0 && y.length!=0){
                login()
            }
        }

    }
    /*END HANDLE SIGN IN AND SIGN UP.....................................*/
    /*CHECK EXISTS*/
    function checkMail(){
        let x=newUseremail+''
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (newUseremail!==undefined || x.length!=0) {
            if (re.test(x)) {
                let data={'user_email':newUseremail}
                const config={
                    method: 'post',
                    url: 'http://127.0.0.1:8000/api/check-mail',
                    headers: {
                        "Content-Type":"application/json",
                        "Accept":'application/json'
                    },
                    data : data
                }
                axios(config)
                    .then(function (response) {
                        response.data
                            ? setAlertemail(<div className='text-green-300 opacity-70'>*Email available</div>)
                            : setAlertemail(<div className='text-red-500 opacity-70'>*Email already exits</div>)

                        response.data
                            ? setInvalid( invalid.map((item,index)=> index === 0 ? true : item))
                            : setInvalid( invalid.map((item,index)=> index === 0 ? false : item))

                            })
                    .catch(function (error) {
                        console.log(error);
                    });
            }

        }

    }
    function checkUsername(){
        let data={'user_name':newUsername}
        const config={
            method: 'post',
            url: 'http://127.0.0.1:8000/api/check-user-name',
            headers: {
                "Content-Type":"application/json",
                "Accept":'application/json'
            },
            data : data
        }

        axios(config)
            .then(function (response) {
                response.data
                    ? setAlertName(<div className={'text-green-300 opacity-70'}>*User name available</div>)
                    : setAlertName(<div className={'text-red-500 opacity-70'}>*User name already exists</div>)
                if(response.data) setInvalid( invalid.map((item,index)=> index === 2 ? true : item))
                else setInvalid( invalid.map((item,index)=> index === 2 ? false : item))
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    /*END CHECK EXISTS*/
    /*Modal*/
    function callbackFunction(childData){
        setIsalert(false);
    }
    /*end Modal*/
    return(
        <div className='Loginpage'>
            <div className='form-box'>
                <div className={isLogin==true ? " sign-active" :"sign-not-active"}>

                    <form id='loginForm'>
                        <div className="form-box__sign--in ">
                            <h2>SIGN IN</h2>
                            <div>
                                <div className='relative h-4'></div>
                                <div className="relative">
                                    <input autoComplete="off" className={userEmail==''?'input__username input-err':'input__username'}
                                           id={'user_name_login'}
                                           onChange={(e) => setUserEmail(e.target.value)}
                                           type="text" placeholder='User Email'/>
                                    {userEmail==''?<MdError className='input-icon-err'/>:<div></div>}
                                </div>
                            </div>
                            <div>
                                <div className='relative h-4'></div>
                                <div className="relative">
                                    <input autoComplete="off" className={userPassword==''?'input__password input-err':'input__password'}
                                           id={'user_password_login'}
                                           onChange={(e) => setUserPassword(e.target.value)}
                                           type='password' placeholder='Password'/>
                                    {userPassword==''?<MdError className='input-icon-err'/>:<div></div>}
                                </div>
                            </div>
                            <div>
                                <div className='check-box'>
                                    <label className="checkbox">
                                        <input type="checkbox" onChange={()=>setrememberMe(!rememberMe)} checked={rememberMe} />
                                        <svg viewBox="0 0 21 18">
                                            <symbol id="tick-path" viewBox="0 0 21 18" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M5.22003 7.26C5.72003 7.76 7.57 9.7 8.67 11.45C12.2 6.05 15.65 3.5 19.19 1.69"
                                                    fill="none" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round"/>
                                            </symbol>
                                            <defs>
                                                <mask id="tick">
                                                    <use className="tick mask" href="#tick-path"/>
                                                </mask>
                                            </defs>
                                            <use className="tick" href="#tick-path" stroke="currentColor"/>
                                            <path fill="white" mask="url(#tick)"
                                                  d="M18 9C18 10.4464 17.9036 11.8929 17.7589 13.1464C17.5179 15.6054 15.6054 17.5179 13.1625 17.7589C11.8929 17.9036 10.4464 18 9 18C7.55357 18 6.10714 17.9036 4.85357 17.7589C2.39464 17.5179 0.498214 15.6054 0.241071 13.1464C0.0964286 11.8929 0 10.4464 0 9C0 7.55357 0.0964286 6.10714 0.241071 4.8375C0.498214 2.39464 2.39464 0.482143 4.85357 0.241071C6.10714 0.0964286 7.55357 0 9 0C10.4464 0 11.8929 0.0964286 13.1625 0.241071C15.6054 0.482143 17.5179 2.39464 17.7589 4.8375C17.9036 6.10714 18 7.55357 18 9Z"/>
                                        </svg>
                                        <svg className="lines" viewBox="0 0 11 11">
                                            <path d="M5.88086 5.89441L9.53504 4.26746"/>
                                            <path d="M5.5274 8.78838L9.45391 9.55161"/>
                                            <path d="M3.49371 4.22065L5.55387 0.79198"/>
                                        </svg>
                                    </label>
                                    <span>Remeber me</span>
                                </div>
                            </div>
                            <button onClick={handleSignIn} type='button'>Sign In</button>

                        </div>
                    </form>

                    <form id='registerForm'>
                        <div className="form-box__sign--up ">
                            <h2>SIGN UP</h2>
                            <div className=''>
                                <div className='text-left ml-12 text-xs font-bold italic'>{alertEmail}</div>
                                <div className='relative'>
                                    <input autoComplete="off" className={newUseremail==''?'input__email input-err':'input__email'} type='text' placeholder='Email'
                                           required
                                           onChange={(e) => setNewuseremail(e.target.value)}/>
                                    {newUseremail==''?<MdError className='input-icon-err'/>:<div></div>}
                                </div>
                            </div>
                            <div className=''>
                                <div className='text-left ml-12 text-xs font-bold italic'>{alertPassword}</div>
                                <div className="relative">
                                    <input autoComplete="off" className={newUserpassword==''?'input__password input-err':'input__password'} type='password'
                                           placeholder='Password' required
                                           onChange={(e) => setNewuserpassword(e.target.value)}/>
                                    {newUserpassword==''?<MdError className='input-icon-err'/>:<div></div>}
                                </div>
                            </div>
                            <div className=''>
                                <div className='text-left ml-12 text-xs font-bold italic'>{alertName}</div>
                                <div className="relative">
                                    <input autoComplete="off" className={newUsername==''?'input__username input-err':'input__username'} type="text"
                                           placeholder='User name' required
                                           onChange={(e) => setNewusername(e.target.value)}/>
                                    {newUsername==''?<MdError className='input-icon-err'/>:<div></div>}
                                </div>

                            </div>
                            <button type='button' onClick={()=>handleSignUp()} >Sign Up</button>
                        </div>
                    </form>
                </div>
                <div className={isLogin==true ? " overlay-active" :"overlay-not-active"}>
                    <div className={isLogin==false ?'form-box__overlay--left active__overlay-left':'form-box__overlay--left not-active__overlay-left'}>
                        <h2>Welcome Back!</h2>
                        <p>To keep connected with us please login with your personal info</p>
                        <button onClick={()=>changetoSignIn()}>Sign In</button>
                    </div>
                    <div className={isLogin== true ? 'form-box__overlay--right active__overlay-right':'form-box__overlay--right not-active__overlay-right'}>
                        <h2>Hello, New Friend</h2>
                        <p>If this is your first time, tell us who you are and join us</p>
                        <button onClick={()=>changetoSignUp()} >Sign up</button>
                    </div>
                </div>
            </div>
            <Modal isModal={isalert} alertMessage={alertMessage} parentCallback={callbackFunction}/>
        </div>
    )
}
export default LoginPage

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}
// xử lý required form -> okey
// xử lý kiểm tra đã tồn tại email -> okey
// xử lý token kiểm soát truy xuất