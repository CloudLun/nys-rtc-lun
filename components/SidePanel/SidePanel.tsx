import React, { useState, useEffect, useContext } from "react";

import { MapContext, MapContextType } from '../../context/MapContext'

import LegislationColumns from "./LegislationColumns";

import Image from 'next/image'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid'

const legislationsData = {
    "Statewide RTC": {
        fullName: "Statewide Right to Counsel (S2721 / A1493)",
        legislation: "Statewide Right to Counsel",
        number: "S2721 / A1493",
        content: "The COVID-19 pandemic made New York State's eviction crisis even worse. With more than 175,000 active eviction cases across the state (as of September 2023), New York communities need long term solutions that will keep them safe and securely housed. We're calling on NY State to pass Statewide Right to Counsel (S2721 / A1493), so ALL tenants across New York State have the right to a lawyer when facing an eviction."

    },
    "Winter Eviction Moratorium": {
        fullName: "Winter Eviction Moratorium (S3254 / A4993)",
        legislation: "Winter Eviction Moratorium",
        number: "S3254 / A4993",
        content: "Local Right to Counsel laws must be defended! We know that 84% of tenants who have a lawyer are able to stay in their home. RTC is only effective if tenants are given the time they need to find a lawyer. The NYS legislature must pass our Defend Right to Counsel Legislation (S3254 / A4993)  to ensure that tenants in localities that have passed a Right to Counsel law are given the time they need to be connected to legal representation!",

    },
    "Defend RTC": {
        fullName: "Defend Right to Counsel (S1403 / A4093)",
        legislation: "Defend Right to Counsel",
        number: "S1403 / A4093",
        content: "Evictions tear apart families and communities, result in homelessness, and can cause serious mental and physical health problems. Especially during the winter months, New Yorkers need stable housing to keep kids in school, protect from infectious disease, and stay safe from the brutal cold. We're calling on NY State to pass a Winter Eviction Moratorium (S1403/A4093), to keep New Yorkers in their homes and out of the cold.",

    }
}


type Columns = "About" | "Statewide RTC" | "Winter Eviction Moratorium" | "Defend RTC"


const SidePanel = () => {



    const [expand, setExpand] = useState({
        "About": true,
        "Statewide RTC": false,
        "Winter Eviction Moratorium": false,
        "Defend RTC": false
    })


    const expandClickHandler = (l: Columns) => {
        const newExpand = { ...expand } as {
            "About": boolean,
            "Statewide RTC": boolean,
            "Winter Eviction Moratorium": boolean,
            "Defend RTC": boolean
        }
        (Object.keys(newExpand) as Columns[]).forEach((e: Columns) => e === l ? newExpand[e] = !newExpand[e] : newExpand[e] = false)
        setExpand(newExpand)
    }





    // useEffect(() => {
    //     map?.setPaintProperty('districts', 'fill-opacity', [
    //         "case",
    //         ["in", `${legislations['current']}`, ["get", "HCMC support"]],
    //         1, 0
    //     ])
    // }, [legislations])







    return (
        <div className="absolute pt-[40px] pb-[27px] w-[450px] h-full bg-background_blue z-20">
            <div className="mb-[30px] px-[30px]">
                <h1 className="font-bold text-headline text-rtc_purple">Housing Courts Must Change!</h1>
                <h2 className="font-bold text-subheadline text-rtc_navy">NY State Right to Counsel Map for HCMC Support</h2>
            </div>
            <div className={`flex flex-col justify-between px-[30px] pt-[15px] pb-[35px] text-rtc_navy ${expand["About"] ? "h-[500px] bg-white" : "h-[45px] bg-background_blue"} border-t-[1px] border-grey_1 overflow-y-hidden`}>
                <div>
                    <div className="flex justify-between items-center">
                        <h2 className="font-semibold text-title ">ABOUT</h2>
                        {
                            expand["About"] ? <ChevronUpIcon className="w-[20px] h-[20px] cursor-pointer" onClick={() => expandClickHandler("About")} /> : <ChevronDownIcon className="w-[20px] h-[20px] cursor-pointer" onClick={() => expandClickHandler("About")} />
                        }
                    </div>
                    <div className="flex justify-between items-start my-[16px]">
                        <h2 className="pb-[3px] font-semibold text-title border-b-2 border-rtc_navy">the HCMC! Campaign Legislation Map</h2>
                        <h2 className="font-semibold text-title text-grey_1">Credits</h2>
                    </div>
                    <div className="text-body">
                        <p>
                            Housing Courts Must Change! (HCMC) is a New York statewide campaign launched by the Right to Counsel NYC Coalition in 2020 to transform the courts from an “eviction machine” to a place that holds landlords accountable, upholds tenants’ rights, and enables tenants to remain in their homes.
                        </p>
                        <p className="my-[20px]">
                            New York State (NYS) support for HCMC campaign legislation is shown in the map through Senate and Assembly districts. The HCMC campaign focuses on three legislation campagins:
                            Statewide Right to Counsel (S2721 / A1493)
                            Defend Right to Counsel (S3254 / A4993)
                            Winter Eviction Moratorium (S1403 / A4093)
                        </p>
                        <p>
                            Explore the map to view co-located geographic support between Right to Counsel NYC Coalition’s base support, zip code boundaries, counties, assembly districts, and senate districts.
                        </p>
                    </div>
                </div>
                <div className="mt-[20px] font-semibold text-title text-rtc_purple">
                    Click on each tab below to start using the map.
                </div>


            </div>

            <LegislationColumns legislation={"Statewide RTC"} title={legislationsData["Statewide RTC"]['fullName']} name={legislationsData["Statewide RTC"]['legislation']} number={legislationsData["Statewide RTC"]['number']} content={legislationsData["Statewide RTC"]['content']} expand={expand["Statewide RTC"]} expandClickHandler={() => expandClickHandler("Statewide RTC")} />
            <LegislationColumns legislation={"Winter Eviction Moratorium"} title={legislationsData["Winter Eviction Moratorium"]['fullName']} name={legislationsData["Winter Eviction Moratorium"]['legislation']} number={legislationsData["Winter Eviction Moratorium"]['number']} content={legislationsData["Winter Eviction Moratorium"]['content']} expand={expand["Winter Eviction Moratorium"]} expandClickHandler={() => expandClickHandler("Winter Eviction Moratorium")} />
            <LegislationColumns legislation={"Defend RTC"} title={legislationsData["Defend RTC"]['fullName']} name={legislationsData["Defend RTC"]['legislation']} number={legislationsData["Defend RTC"]['number']} content={legislationsData["Defend RTC"]['content']} expand={expand["Defend RTC"]} expandClickHandler={() => expandClickHandler("Defend RTC")} />

            <div className="absolute bottom-[15px] left-[30px] flex items-center gap-[15px]">
                <Image
                    src="/logos/RTC.png"
                    width={131.79}
                    height={30}
                    alt="RTC"
                />
                <Image
                    src="/logos/betaNYC.svg"
                    width={97.65}
                    height={40}
                    alt="BetaNYC"
                />
            </div>
        </div>
    )
}

export default SidePanel