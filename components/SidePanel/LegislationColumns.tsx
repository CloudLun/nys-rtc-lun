import React from 'react'

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
    legislationsClickHandler: () => void
}

const LegislationColumns = ({ legislation, title, name, number, content, expand, legislationsClickHandler }: Props) => {

    return (
        <div className={`px-[30px] pt-[15px] pb-[20px] text-rtc_navy ${expand ? " bg-white" : "h-[45px] bg-background_blue"} border-t-[1px] border-grey_1  overflow-y-hidden cursor-pointer`} onClick={legislationsClickHandler}>
            <div className="flex justify-between items-center mb-[15px]">
                <h2 className="font-semibold text-title uppercase">{name}<span className='ml-[15px] font-regular text-label'>{number}</span></h2>
                {
                    expand ? <ChevronUpIcon className="w-[20px] h-[20px] cursor-pointer"  /> : <ChevronDownIcon className="w-[20px] h-[20px] cursor-pointer" />
                }
            </div>
            <VotesVisualization legislation={legislation} />
            <div>
                <h2 className='mb-[14px] font-semibold text-title'>{title}</h2>
                <p className='font-regular text-body'>{content}</p>
            </div>
        </div>
    )
}

export default LegislationColumns