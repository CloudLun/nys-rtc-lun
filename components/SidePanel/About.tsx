"use client"
import React, { useState } from 'react'

import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid'

import { Columns } from './SidePanel'
import Link from 'next/link'

type Props = {
    expand: {
        "About": boolean,
        "Statewide RTC": boolean,
        "Winter Eviction Moratorium": boolean,
        "Defend RTC": boolean
    },
    legislationsClickHandler: (l: Columns) => void
}

const About = ({ expand, legislationsClickHandler }: Props) => {

    const [selectedContent, setSelectedContent] = useState<"intro" | "credits">("intro")

    const contentClickHandler = (c: "intro" | "credits") => setSelectedContent(c)


    return (
        <div className={`flex flex-col  px-[25px] pt-[12px] lg:pt-[10.5px] pb-[20px] text-rtc_navy ${expand["About"] ? "h-[calc(100vh-112px-240px)] xl:h-[calc(100vh-112px-200px)] bg-white overflow-y-scroll" : "h-[45px] bg-background_blue overflow-y-hidden"} border-y-[1px] border-grey_1 `}>
            <div className="flex justify-between items-center">
                <h2 className="font-semibold text-[13px] lg:text-title ">ABOUT</h2>
                {
                    expand["About"] ? <ChevronUpIcon className="w-[20px] h-[20px] cursor-pointer" onClick={() => legislationsClickHandler("About")} /> : <ChevronDownIcon className="w-[20px] h-[20px] cursor-pointer" onClick={() => legislationsClickHandler("About")} />
                }
            </div>
            <div className="flex justify-between items-start gap-[36px] my-[16px]">
                <h2 className={`pb-[3px] font-semibold text-title border-b-2 leading-[1.5]  ${selectedContent === "intro" ? "text-rtc_navy  border-rtc_navy" : "text-grey_1 border-white "}  cursor-pointer`} onClick={() => contentClickHandler("intro")}>the HCMC! Campaign Legislation Map</h2>
                <h2 className={`font-semibold text-title border-b-2 ${selectedContent === "credits" ? "text-rtc_navy  border-rtc_navy" : "text-grey_1 border-white "} cursor-pointer`} onClick={() => contentClickHandler("credits")}>Credits</h2>
            </div>
            {
                selectedContent === "intro" && (
                    <div className='flex-1 flex flex-col justify-between'>
                        <div className="text-body">
                            <p>
                                Housing Courts Must Change! (HCMC) is a New York statewide campaign launched by the Right to Counsel NYC Coalition in 2020 to transform the courts from an “eviction machine” to a place that holds landlords accountable, upholds tenants’ rights, and enables tenants to remain in their homes.
                            </p>
                            <div className="my-[20px]">
                                New York State (NYS) support for HCMC campaign legislation is shown in the map through Senate and Assembly districts. The HCMC campaign focuses on three legislation campagins:
                                <li>Statewide Right to Counsel (S2721 / A1493)</li>
                                <li>Defend Right to Counsel (S3254 / A4993)</li>
                                <li>Winter Eviction Moratorium (S1403 / A4093)</li>
                            </div>
                            <p>
                                Explore the map to view co-located geographic support between Right to Counsel NYC Coalition’s base support, zip code boundaries, counties, assembly districts, and senate districts.
                            </p>
                        </div>
                        <div className="my-[20px] font-semibold text-title text-rtc_purple">
                            Click on each tab below to start using the map.
                        </div>
                    </div>
                )
            }
            {
                selectedContent === "credits" && (
                    <div className="text-body overflow-y-scroll">
                        <p>
                            This web tool was designed and developed by BetaNYC’s Civic Innovation Lab in collaboration with the Right to Counsel NYC Coalition.
                        </p>
                        <div className="my-[20px]">
                            <p className='font-semibold text-title'>Right to Counsel NYC Coalition</p>
                            <p>The Right to Counsel NYC Coalition is a tenant-led coalition that formed in 2014 to disrupt Housing Court as a center of displacement and stop the eviction crisis that has threatened our families, our neighborhoods, and our homes for too long.
                                Our Coalition is made up of tenants, organizers, advocates, legal services organizations and more! Our work is rooted in principles of dignity, diversity, equity, humanity, and justice. After a hard fought, three-year grassroots campaign,
                                we won and became the first city in the nation to establish a Right to Counsel for tenants facing eviction.</p>
                        </div>
                        <div className="my-[20px]">
                            <p className='font-semibold text-title'>BetaNYC</p>
                            <p>BetaNYC is a civic organization dedicated to improving lives in New York through civic design,
                                technology, and data. BetaNYC’s Civic Innovation Lab supports the data and research needs of New Yorkers
                                through a community service initiative called Research and Data Assistance Request (RADAR).
                                <a className='underline' target='_blank' href={"https://beta.nyc/products/research-and-data-assistance-requests/"}> Follow this link to learn more about RADARs and how to submit a request!</a></p>
                        </div>
                        <div className="my-[20px] ">
                            <p className='font-semibold text-body'>Civic Innovation Lab at BetaNYC:</p>
                            <p>Ashley Louie (Director), Erik Brown, Hao Lun Hung, Hailee Luong</p>

                        </div>
                    </div>
                )
            }



        </div>
    )
}

export default About