import React, {MouseEvent} from 'react'


type Props = {
    name: string
    mouseEnterHandler: (e:MouseEvent<HTMLElement>) => void
    mouseOutHandler: () => void
}

const GeoInfoBtns = ({name, mouseEnterHandler, mouseOutHandler}:Props) => {
  return (
    <div className='flex justify-center items-center p-[8px] font-bold text-label text-rtc_navy bg-[rgba(129,41,72,.1)] rounded-[4px] hover:bg-[rgba(129,41,72,.4)] cursor-pointer' onMouseEnter={mouseEnterHandler} onMouseOut={mouseOutHandler}>
        {name}
    </div>  
  )
}

export default GeoInfoBtns