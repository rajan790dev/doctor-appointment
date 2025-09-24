import React, { useState, useRef, useEffect } from 'react'
import { assets } from "../assets/assets"
import { NavLink, useNavigate } from 'react-router-dom'
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const Navbar = () => {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const {token,setToken,currentUser,setVerifiedToken} = useContext(AppContext)
    const [showDropdown, setShowDropdown] = useState(false);

    // 👇 dropdown container ref
    const dropdownRef = useRef(null);

    // 👇 click outside handler
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        if (showDropdown) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showDropdown]);

    return (
        <div className='flex item-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400'>
            <img onClick={() => navigate("/")} className='w-44 cursor-pointer' src={assets.logo} alt="logo" />
            
            {/* Desktop menu */}
            <ul className='hidden md:flex items-start gap-5 font-medium'>
                <NavLink to={'/'}><li className='py-1'>HOME</li></NavLink>
                <NavLink to={'/doctors'}><li className='py-1'>ALL DOCTORS</li></NavLink>
                <NavLink to={'/about'}><li className='py-1'>ABOUT</li></NavLink>
                <NavLink to={'/contact'}><li className='py-1'>CONTACT</li></NavLink>
            </ul>

            <div className='flex items-center gap-4'>
                {
                    token ? (
                        <div 
                            className='flex items-center gap-2 cursor-pointer relative'
                            onClick={() => setShowDropdown(!showDropdown)}
                            ref={dropdownRef} // 👈 ref yaha lagaya
                        >
                            <img className='w-8 rounded-full' src={currentUser.image} alt="" />
                            <img className='w-2.5 ' src={assets.dropdown_icon} alt="" />

                            {/* Dropdown */}
                            {showDropdown && (
                                <div className='absolute top-12 right-0 text-base font-medium text-gray-600 z-20'>
                                    <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
                                        <p onClick={() => { navigate("my-profile"); setShowDropdown(false) }} className='hover:text-black cursor-pointer'>My Profile</p>
                                        <p onClick={() => { navigate("my-appointments"); setShowDropdown(false) }} className='hover:text-black cursor-pointer'>My Appointments</p>
                                        <p className='hover:text-black cursor-pointer' onClick={() => { setToken(''); setShowDropdown(false); localStorage.removeItem('aToken'); setVerifiedToken(false); navigate('/login')}} >Logout</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button 
                            onClick={() => navigate("/login")} 
                            className='bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block'
                        >
                            Create Account
                        </button>
                    )
                }

                {/* Mobile menu toggle */}
                <img 
                    onClick={() => setShowMenu(true)} 
                    className='w-6 md:hidden' 
                    src={assets.menu_icon} 
                    alt="" 
                />

                {/* Mobile menu */}
                <div className={`${showMenu ? 'fixed w-1/2' : 'h-0 w-0'} md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}>
                    <div className='flex justify-end px-5 py-6'>
                        <img className='w-7' onClick={() => setShowMenu(false)} src={assets.cross_icon} alt="" />
                    </div>
                    <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>
                        <NavLink onClick={() => setShowMenu(false)} to="/"><p className='px-4 py-2 rounded inline-block'>Home</p></NavLink>
                        <NavLink onClick={() => setShowMenu(false)} to="/doctors"><p className='px-4 py-2 rounded inline-block'>All Doctors</p></NavLink>
                        <NavLink onClick={() => setShowMenu(false)} to="/about"><p className='px-4 py-2 rounded inline-block'>About</p></NavLink>
                        <NavLink onClick={() => setShowMenu(false)} to="/contact"><p className='px-4 py-2 rounded inline-block'>Contact</p></NavLink>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Navbar
