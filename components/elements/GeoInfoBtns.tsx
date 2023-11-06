import React from 'react'


type Props = {
    name: string
    clickHandler: () => void
}

const GeoInfoBtns = ({name, clickHandler}:Props) => {
  return (
    <div className='flex justify-center items-center p-[8px] font-bold text-label text-rtc_navy bg-[rgba(129,41,72,.1)] rounded-[4px] cursor-pointer' onClick={clickHandler}>
        {name}
    </div>  
  )
}

export default GeoInfoBtns