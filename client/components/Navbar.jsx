import React from 'react';
import Image from 'next/image'
import { HiMenuAlt4 } from 'react-icons/hi';
import { AiOutlineClose } from 'react-icons/ai';
import { FiArrowUpRight } from 'react-icons/fi'

import logo from '../assets/logo.png';
import uniswapLogo from '../assets/uniswap.png'

const NavbarItem = ({ title, classProps }) => {
  return (
    <li className={`mx-4 cursor-pointer $(classProps)`}>
      {title}
    </li>
  )
};

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = React.useState(false);

  return (
    <nav className='w-full flex md:justify-center justify-between items-center p-4 gradient-bg-welcome'>
      <div className='md:flex-[0.5] w-1/4 flex-initial justify-center items-center'>
        <Image src={logo} alt='logo' height={90} width={90} className='cursor-pointer'/>
      </div>
      <ul className='text-white text-xl md:flex hidden list-none flex-row justify-between items-center flex-initial'>
        {["Pool", "Exchange", "Guide"].map((item, index) => (
          <NavbarItem key={item + index} title={item} />
        ))}
        <a href='https://info.uniswap.org/#/'>
          <li className='bg-[#2925e3] py-2 px-7 mx-4 p-10 flex rounded-full cursor-pointer hover:bg-[#2546bd]'>
          Markets <FiArrowUpRight />
          </li>
        </a>
      </ul>
      <div className='flex relative p-4'>
        {toggleMenu
          ? <AiOutlineClose fontSize={28} className='text-white md:hidden cursor-pointer' onClick={() => setToggleMenu(false)}/>
          : <HiMenuAlt4 fontSize={28} className='text-white md:hidden cursor-pointer' onClick={() => setToggleMenu(true)}/>}
        {toggleMenu && (
          <ul
            className='z-10 fixed top-0 -right-2 p-4 w-[70vw] h-screen shadow-2xl md:hidden list-none
              flex flex-col justify-star items-end rounded-md blue-glassmorphism text-white animate-slide-in
            '
          >
            <li className='text-xl w-full my-2 p-2'>
              <AiOutlineClose onClick={() => setToggleMenu (false)} />
            </li>
            {["Pool", "Exchange", "Guide"].map((item, index) => (
              <NavbarItem key={item + index} title={item} classProps='my-2 text-lg'/>
            ))}
            <a href='https://info.uniswap.org/#/'>
              <li className='bg-[#2925e3] py-2 px-7 mx-4 flex rounded-full cursor-pointer hover:bg-[#2546bd]'>
              Markets <FiArrowUpRight />
              </li>
            </a>
          </ul>
        )}
      </div>
    </nav>
  );
}

export default Navbar;