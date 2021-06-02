import React,{useEffect,useState} from "react";
import './Header_mobile.scss'
const Header_mobile =()=>{
    const [isOpen, setIsOpen]=useState(false)
    const openMenu=()=>{
        setIsOpen(!isOpen)
    }
    return(
        <div>
            <div className='Header-container'>
            </div>
            <div onClick={openMenu} className={`${isOpen}`==`true`  ? `Menu-layer`:``}>
            </div>
            <div className={`${isOpen}`==`true`? `Menu-tab`:``}>
            </div>
            <div onClick={openMenu} className={`${isOpen}`==`true`?`hamburger is-active`:`hamburger`}>
                <div className=" bar-1"></div>
                <div className=" bar-2"></div>
                <div className=" bar-3"></div>
            </div>
        </div>
    )
}
export default Header_mobile