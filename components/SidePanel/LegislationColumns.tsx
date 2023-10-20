import React, { useState } from 'react'

import VotesVisualization from './VotesVisualization'

import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid'
import exp from 'constants'

type Props = {
    legislation: Legislations
    title: string
    name: string
    number: string
    content: string
    expand: boolean
    expandClickHandler: () => void
}

const LegislationColumns = ({ legislation, title, name, number, content, expand, expandClickHandler }: Props) => {

    return (
        <div className={`px-[30px] pt-[15px] pb-[35px] text-rtc_navy ${expand ? " bg-white" : "h-[45px] bg-background_blue"} border-t-[1px] border-grey_1  overflow-y-hidden`}>
            <div className="flex justify-between items-center mb-[27px]">
                <h2 className="font-semibold text-title uppercase">{name}<span className='ml-[15px] font-regular text-label'>{number}</span></h2>
                {
                    expand ? <ChevronUpIcon className="w-[20px] h-[20px] cursor-pointer" onClick={expandClickHandler} /> : <ChevronDownIcon className="w-[20px] h-[20px] cursor-pointer" onClick={expandClickHandler} />
                }
            </div>
            <VotesVisualization legislations={legislation} />
            <div>
                <h2 className='mb-[14px] font-semibold text-title'>{title}</h2>
                <p className='w-[340px] font-regular text-body'>{content}</p>
            </div>
        </div>
    )
}

export default LegislationColumns