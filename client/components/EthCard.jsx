import React, { useContext } from 'react';
import { AiFillPauseCircle } from 'react-icons/ai';
import { SiEthereum } from 'react-icons/si';
import { BsInfoCircle } from 'react-icons/bs';
import { RiSettings3Fill } from 'react-icons/ri'
import { AiOutlineDown } from 'react-icons/ai'
import ethLogo from '../assets/eth.png'
import Image from 'next/image'
import Modal from 'react-modal'
import { useRouter } from 'next/router'

import { TransactionContext } from '../context/TransactionContext';
import Loader from './Loader';
import { shortenAddress } from '../utils/shortenAddress';
import { client } from '../utils/sanityClient';

Modal.setAppElement('#__next')

const style = {
  wrapper: `flex items-center justify-center p-10`,
  content: `bg-[#191B1F] w-[40rem] rounded-2xl p-4`,
  formHeader: `px-2 flex items-center justify-between font-semibold text-xl p-4`,
  transferPropContainer: `bg-[#20242A] my-3 rounded-2xl p-2 text-3xl border border-[#20242A] hover:border-[#41444F] justify-between flex`,
  transferPropInput: `bg-transparent placeholder:text-[#B2B9D2] outline-none mb-6 flex w-full text-2xl`,
  currencySelector: `flex w-1/4 m-6`,
  currencySelectorContent: `w-full h-min flex items-center bg-[#2D2F36] hover:bg-[#41444F] rounded-2xl text-xl font-medium cursor-pointer p-2 mt-[-0.2rem]`,
  currencySelectorIcon: `flex items-center`,
  currencySelectorTicker: `mx-2`,
  currencySelectorArrow: `text-lg`,
  confirmButton: `bg-[#2172E5] my-2 rounded-2xl py-6 px-8 text-xl font-semibold flex items-center justify-center cursor-pointer border border-[#2172E5] hover:border-[#234169]`,
}

const modalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#0a0b0d',
    padding: 0,
    border: 'none',
  },
  overlay: {
    backgroundColor: 'rgba(10, 11, 13, 0.75)',
  },
}

const Input = ({ placeholder, name, type, value, handleChange }) => (
  <div className={style.transferPropContainer}>
    <input
      placeholder={placeholder}
      type={type}
      step='0.0001'
      value={value}
      onChange={(e) => handleChange(e, name)}
      className='my-2 rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm w-full'
    />
  </div>
);

const EthCard = () => {
  const { connectWallet, currentAccount, formData, handleChange, sendTransaction, isLoading } = useContext(TransactionContext);
  const router = useRouter()

  const handleSubmit = (e) => {
    const { addressTo, amount, keyword, message} = formData;

    e.preventDefault();

    if(!addressTo || !amount || !message) return;

    sendTransaction();
  }

  return (
    <div className='gradient-bg'>
      <div className='flex mf:flex-row flex-col items-start justify-between md:p-20 py-12 px-4'>
        <div className='flex flex-1 justify-start flex-col mf:mr-10'>
          <h1 className='flex-row text-3xl sm:text-5xl text-white py-1'>
            Send Crypto around the world
          </h1>
          <p className='text-left mt-5 text-white font-light md:w-9/12 w-11/12 text-lg font-semibold'>
            Send cryptocurrencies to people around the world fast, secure, and easy using Ethereum smart contracts.
          </p>
          {!currentAccount && (
            <button
              type='button'
              onClick={connectWallet}
              className='flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 rounded-full cursor-pointer hover:bg-[#2546bd]'
            >
              <p className='text-white text-base text-semibold'>Connect Wallet</p>
            </button>
          )}
        </div>
      </div>

      <div>
        <div className='flex flex-col items-center justify-start w-full mf:mt-0 mt-10'>
          <div className='p-3 justify-end items-start rounded-xl h-40 sm:w-72 w-full my-5 eth-card .white-glassmorpism'>
            <div className='flex justify-between flex-col w-full h-full'>

              <div className='flex justify-between items-start'>
                <div className='w-10 h-10 rounded-full border-2 border-white flex justify-center items-center'>
                  <SiEthereum fontSize={21} color='#fff' />
                </div>
                <BsInfoCircle fontSize={17} color='#fff' />
              </div>

              <div>
                <p className='text-white font-light text-sm'>
                  {shortenAddress(currentAccount)}
                </p>
                <p className='text-white font-bold text-lg mt-1'>
                  Ethereum
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>

      <div className={style.wrapper}>
        <div className={style.content}>

          <div className={style.formHeader}>
            <div>Transfer</div>
            <div>
              <RiSettings3Fill />
            </div>
          </div>

          <div>
            <Input placeholder='Address To' name='addressTo' type='text' handleChange={handleChange}/>
            <div className='bg-[#20242A] rounded-2xl justify-between flex border border-[#20242A] hover:border-[#41444F]'>
              <Input placeholder='Amount (ETH)' name='amount' type='number' handleChange={handleChange}/>
              <div className={style.currencySelector}>
              <div className={style.currencySelectorContent}>
                <div className={style.currencySelectorIcon}>
                  <Image src={ethLogo} alt='eth logo' height={20} width={20} />
                </div>
                <div className={style.currencySelectorTicker}>ETH</div>
                <AiOutlineDown className={style.currencySelectorArrow} />
              </div>
          </div>
            </div>
            <Input placeholder='Keywork' name='keyword' type='text' handleChange={handleChange}/>
            <Input placeholder='Message' name='message' type='text' handleChange={handleChange}/>
          </div>

          <div className='flex justify-center w-full'>
            {/* <div className='h-[1px] w-full bg-gray-400 my-2'/> */}
            <div>
              <button
                  type='button'
                  onClick={handleSubmit}
                  className={style.confirmButton}>
                    Send ETH
                </button>
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={!!router.query.loading} style={modalStyles}>
        <Loader />
      </Modal>
    </div>
  );
}

export default EthCard;