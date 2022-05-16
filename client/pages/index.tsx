import type { NextPage } from 'next'
import { Navbar, EthCard, TransactionsRecord } from '../components'

const style = {
  wrapper: `h-screen max-h-screen h-min-screen text-white select-none flex flex-col justify-between`,
}

const Home: NextPage = () => {
  return (
    <div className={style.wrapper}>
      <Navbar />
      <EthCard />
      <TransactionsRecord />
     </div>
  )
}

export default Home
