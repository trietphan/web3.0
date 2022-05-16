import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useRouter } from 'next/router'
import { contractABI, contractAddress } from '../utils/constants';
import { parse } from '@ethersproject/transactions';
import { client } from '../utils/sanityClient'

export const TransactionContext = React.createContext();

let ethereum

if (typeof window !== 'undefined') {
  ethereum = window.ethereum
  // localStorage = window.localStorage
}

const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);

  return transactionContract;
}

export const TransactionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState('')
  const [formData, setFormData] = useState({ addressTo: '', amount: '', keyword: '', message: ''});
  const [isLoading, setIsLoading] = useState(false);
  // const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'));
  const [transactions, setTransactions] = useState([])
  const router = useRouter()


  useEffect(() => {
    if (isLoading) {
      router.push(`/?loading=${currentAccount}`)
    } else {
      router.push(`/`)
    }
  }, [isLoading])

  useEffect(() => {
    if (!currentAccount) return
    ;(async () => {
      const userDoc = {
        _type: 'users',
        _id: currentAccount,
        userName: 'Anonymous',
        address: currentAccount,
      }

      await client.createIfNotExists(userDoc)
    })()
  }, [currentAccount])

  const handleChange = (e, name) => {
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
  }

  const getAllTransactions = async () => {
    try {
      if(!ethereum) return alert('Please install Chrome metamask extenstion');
      const transactionContract = getEthereumContract();

      const availableTransactions = await transactionContract.getAllTransactions();
      const structureTransactions = availableTransactions.map((transaction) => ({
        addressTo: transaction.receiver,
        addressFrom: transaction.sender,
        timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
        message:  transaction.message,
        amount: parseInt(transaction.amount._hex) / (10 ** 18),
      }))
      console.log(structureTransactions);
      setTransactions(structureTransactions);
    } catch (error) {
      console.log(error);
    }
  }

  const checkIfWalletConnect = async () => {
    try {
      if(!ethereum) return alert('Please install Chrome metamask extenstion ');

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if(accounts.length) {
        setCurrentAccount(accounts[0]);

        getAllTransactions();
      } else {
        console.log('No accounts found');
      }
    } catch (error) {
      console.log(error);

      throw new Error('No Ethereum objects')
    }
  }

  const connectWallet = async () => {
    try {
      if(!ethereum) return alert('Please install Chrome metamask extenstion ');

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);

      throw new Error('No Ethereum objects')
    }
  }

  const recordData = async (
    txHash,
    amount,
    fromAddress = currentAccount,
    toAddress,
    message,
  ) => {
    const txDoc = {
      _type: 'transactions',
      _id: txHash,
      fromAddress: fromAddress,
      toAddress: toAddress,
      timestamp: new Date(Date.now()).toISOString(),
      txHash: txHash,
      amount: parseFloat(amount),
      message: message,
    }

    await client.createIfNotExists(txDoc)

    await client
      .patch(currentAccount)
      .setIfMissing({ transactions: [] })
      .insert('after', 'transactions[-1]', [
        {
          _key: txHash,
          _ref: txHash,
          _type: 'reference',
        },
      ])
      .commit()
      console.log('Committed');

    return
  }

  const checkIfTransactionsExist = async () => {
    try {
      const transactionContract = getEthereumContract();
      const transactionCount = await transactionContract.getTransactionCount();

      window.localStorage.setItem('transactionCount', transactionCount);
    } catch (error) {
      console.log(error);

      // throw new Error('No Ethereum objects');
    }
  }

  const sendTransaction = async (
    eth = ethereum,
    connectedAccount = currentAccount ) => {
    try {
      if(!eth) return alert('Please install Chrome metamask extenstion ');

      const { addressTo, amount, keyword, message} = formData;
      const transactionContract = getEthereumContract();
      const parsedAmount = ethers.utils.parseEther(amount);

      await eth.request({
        method: 'eth_sendTransaction',
        params: [{
          from: connectedAccount,
          to: addressTo,
          gas: '0x5208', // 21000 gwei hex
          value: parsedAmount._hex,
        }],
      });

      const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword);

      setIsLoading(true);
      console.log(`Loading - ${transactionHash.hash}`);
      await transactionHash.wait();

      await recordData(
        transactionHash.hash,
        amount,
        connectedAccount,
        addressTo,
        message,
      )

      setIsLoading(false);
      console.log(`Success - ${transactionHash.hash}`);

      // const transactionCount = await transactionContract.getTransactionCount();
      // setTransactionCount(transactionCount.toNumber());

    } catch (error) {
      console.log(error);

      // throw new Error('No Ethereum objects');
    }
  }

  useEffect(() => {
    checkIfWalletConnect();
    checkIfTransactionsExist();
  }, []);

  return (
    <TransactionContext.Provider value={{ connectWallet, currentAccount, formData, setFormData, handleChange, sendTransaction, transactions, isLoading }}>
      {children}
    </TransactionContext.Provider>
  )
}