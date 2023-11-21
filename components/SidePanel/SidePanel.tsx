import React, { useState, useEffect, useContext } from "react";

import { MapContext, MapContextType } from '../../context/MapContext'

import LegislationColumns from "./LegislationColumns";
import About from "./About";

import Image from 'next/image'

import legislationsInfo from "../../public/legislation_info.json"

export type Columns = "About" | "Statewide RTC" | "Winter Eviction Moratorium" | "Defend RTC"



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





const SidePanel = () => {

    const { map, legislations, setLegislations, mapClickHandler, defaultMapHandler } = useContext(MapContext) as MapContextType
    const [expand, setExpand] = useState({
        "About": true,
        "Statewide RTC": false,
        "Winter Eviction Moratorium": false,
        "Defend RTC": false
    })


    const legislationsClickHandler = (l: Columns) => {
        const newExpand = { ...expand } as {
            "About": boolean,
            "Statewide RTC": boolean,
            "Winter Eviction Moratorium": boolean,
            "Defend RTC": boolean
        }
        (Object.keys(newExpand) as Columns[]).forEach((e: Columns) => e === l ? newExpand[e] = true : newExpand[e] = false)
        setExpand(newExpand)

        if (l !== "About") {
            setLegislations(l)
        }
    }





    useEffect(() => {
        defaultMapHandler(legislations)
    }, [legislations])







    return (
        <div className="flex flex-col justify-between absolute py-[20px] w-[450px] h-full bg-background_blue z-50">
            <div className="flex flex-col justify-between">
                <div>
                    <div className="mb-[20px] px-[30px]">
                        <h1 className="font-bold text-headline text-rtc_purple">Housing Courts Must Change!</h1>
                        <h2 className="font-bold text-subheadline text-rtc_navy">NY State Right to Counsel Map for HCMC Support</h2>
                    </div>
                    <About expand={expand} legislationsClickHandler={legislationsClickHandler} />
                </div>
                <div>
                    <LegislationColumns legislation={"Statewide RTC"} title={legislationsInfo[0]["Bill Name"]} name={legislationsInfo[0]["Bill Name"]} number={legislationsInfo[0]["Senate Number"] + " / " + legislationsInfo[0]["Assembly Number"]} content={legislationsInfo[0]["Bill Description"]} expand={expand["Statewide RTC"]} legislationsClickHandler={() => legislationsClickHandler("Statewide RTC")} />
                    <LegislationColumns legislation={"Defend RTC"} title={legislationsInfo[2]["Bill Name"]} name={legislationsInfo[2]["Bill Name"]} number={legislationsInfo[2]["Senate Number"] + " / " + legislationsInfo[2]["Assembly Number"]} content={legislationsInfo[2]["Bill Description"]} expand={expand["Defend RTC"]} legislationsClickHandler={() => legislationsClickHandler("Defend RTC")} />
                    <LegislationColumns legislation={"Winter Eviction Moratorium"} title={legislationsInfo[3]["Bill Name"]} name={legislationsInfo[3]["Bill Name"]} number={legislationsInfo[3]["Senate Number"] + " / " + legislationsInfo[3]["Assembly Number"]} content={legislationsInfo[3]["Bill Description"]} expand={expand["Winter Eviction Moratorium"]} legislationsClickHandler={() => legislationsClickHandler("Winter Eviction Moratorium")} />

                </div>
            </div>
            <div className="flex items-center gap-[15px] px-[30px]">
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