import { css } from '@emotion/react'
import { PacmanLoader } from 'react-spinners'

const style = {
  wrapper: `text-white h-96 w-72 flex flex-col justify-center items-center`,
  title: `font-semibold text-xl mb-12 underline decoration-sky-600`,
}

const cssOverride = css`
  display: block;
  margin: 0 auto;
  border-color: white;
`

const Loader = () => (
  <div className={style.wrapper}>
    <div className={style.title}>Transfering your coin ...</div>
    <PacmanLoader color={'#ffd60a'} loading={true} css={cssOverride} size={50} />
  </div>
);

export default Loader;