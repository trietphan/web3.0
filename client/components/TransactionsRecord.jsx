import React, { useEffect, useState, useContext } from 'react';

import { TransactionContext } from '../context/TransactionContext';
import { shortenAddress } from '../utils/shortenAddress';
import { client } from '../utils/sanityClient';
import Image from 'next/image';
import ethLogo from '../assets/ethCurrency.png';
import { FiArrowUpRight } from 'react-icons/fi';

const style = {
  wrapper: `h-full select-none text-sky-400 gradient-bg-record w-screen justify-center items-end flex w-full 2xl:px-20`,
  txRecordCard: 'bg-[#191a1e] rounded-xl shadow-lg my-4 p-4',
  txHistoryItem: `p-2 flex items-center space-x-4 justify-end`,
  txDetails: `flex items-center`,
  fromAddress: `text-[#fee440] mx-2`,
  toAddress: `text-[#ee6c4d] mx-2`,
  txTimestamp: `mx-2`,
  etherscanLink: `flex items-center text-violet-400`,
  mes: 'flex w-max p-3 px-5 rounded-3xl shadow-2xl',
}

const TransactionRecord = () => {
  const { isLoading, currentAccount } = useContext(TransactionContext)
  const [transactionHistory, setTransactionHistory] = useState([])

  useEffect(() => {
    ;(async () => {
      if (!isLoading && currentAccount) {
        const query = `
          *[_type=="users" && _id == "${currentAccount}"] {
            "transactionList": transactions[]->{amount, fromAddress, toAddress, timestamp, txHash, message}|order(timestamp desc)[0..5]
          }
        `

        const clientRes = await client.fetch(query)

        setTransactionHistory(clientRes[0].transactionList)
      }
    })()
  }, [isLoading, currentAccount])

  return (
    <div className={style.wrapper}>
      <div className="md:p-12 py-12 px-4">
        {currentAccount ? (
          <h3 className="text-white text-3xl text-center my-2">
            Transactions History
          </h3>
        ) : (
          <h3 className="text-white text-3xl text-center my-2">
            Connect your account for transactions history
          </h3>
        )}

        {transactionHistory &&
          transactionHistory?.map((transaction, index) => (
            <div className={style.txRecordCard}>
              <div className={style.txHistoryItem} key={index}>
                <div className={style.txDetails}>
                  <Image src={ethLogo} height={20} width={15} alt='eth' />
                  {transaction.amount} {' '}
                  Ξ sent from
                  <span className={style.fromAddress}>
                  {shortenAddress(transaction.fromAddress)}
                  </span>
                  to {' '}
                  <span className={style.toAddress}>
                    {shortenAddress(transaction.toAddress)}
                  </span>
                </div>{' '}
                on{' '}
                <div className={style.txTimestamp}>
                  {new Date(transaction.timestamp).toLocaleString('en-US', {
                    timeZone: 'PST',
                    hour12: true,
                    timeStyle: 'short',
                    dateStyle: 'long',
                  })}
                </div>
                <div className={style.etherscanLink}>
                  <a
                    href={`https://ropsten.etherscan.io/tx/${transaction.txHash}`}
                    target='_blank'
                    rel='noreferrer'
                    className={style.etherscanLink}
                  >
                    View on Etherscan
                    <FiArrowUpRight />
                  </a>
                </div>

              </div>
              <div className={style.mes}>
                  <p className="text-white font-bold text-green-500">Message: {transaction.message}</p>
                </div>
            </div>

          ))}

      </div>
    </div>
  )
}

export default TransactionRecord;