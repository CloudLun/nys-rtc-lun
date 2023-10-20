import React, { useState, useEffect, useContext } from 'react'

import { MapContext, MapContextType } from '../../context/MapContext'

import Toggler from '../elements/Toggler'

import Image from 'next/image'
import { XMarkIcon } from '@heroicons/react/24/solid'



type Props = {
    districts: Districts
    districtsClickHandler: (x: Districts) => void
}


const Legend = ({ districts, districtsClickHandler }: Props) => {

    const { map } = useContext(MapContext) as MapContextType

    const [panelShown, setPanelShown] = useState(false)
    const [organizations, setOrganizations] = useState({
        Members: false,
        Supporters: false,
        Endorsers: false,
    })

    const panelClickHandler = (b: boolean) => {
        setPanelShown(b)
    }

    const organizationsClickHandler = (org: Organizations) => {
        let newOrg = { ...organizations }
        newOrg[org] = !newOrg[org]
        setOrganizations(newOrg)
    }




    useEffect(() => {
        if (organizations["Members"]) {
            map?.setLayoutProperty('organizations_members', "visibility", "visible")
        } else {
            map?.setLayoutProperty('organizations_members', "visibility", "none")
        }
        if (organizations["Supporters"]) {
            map?.setLayoutProperty('organizations_supporters', "visibility", "visible")
        } else {
            map?.setLayoutProperty('organizations_supporters', "visibility", "none")
        }
        if (organizations["Endorsers"]) {
            map?.setLayoutProperty('organizations_endorsers', "visibility", "visible")
        } else {
            map?.setLayoutProperty('organizations_endorsers', "visibility", "none")
        }
    }, [organizations])

    return (
        <>
            <div className='absolute left-[480px] bottom-[100px] flex flex-col gap-[6px] p-[15px] text-rtc_navy bg-white rounded-[18.23px] drop-shadow-xl z-20'>
                <div>
                    <h2 className='mb-[8px] font-bold text-title leading-[22.5px]'>Statewide Right to Counsel <br /> Senate District Support Map</h2>
                </div>
                <div className='flex items-center gap-[10px]'>
                    <div className='w-[16px] h-[16px] bg-demo'></div>
                    <div className='text-label'>Support, Democrat</div>
                </div>
                <div className='flex items-center gap-[10px]'>
                    <div className='w-[16px] h-[16px] bg-rep'></div>
                    <div className='text-label'>Support, Republican</div>
                </div>
                <div className='flex items-center gap-[10px]'>
                    <Image
                        src="/icons/pattern_demo.png"
                        width={16}
                        height={16}
                        alt="No Support, Democrat"
                    />
                    <div className='text-label'>No Support, Democrat</div>
                </div>
                <div className='flex items-center gap-[10px]'>
                    <Image
                        src="/icons/pattern_rep.png"
                        width={16}
                        height={16}
                        alt="No Support, Republican"
                    />
                    <div className='text-label '>No Support, Republican</div>
                </div>
                {
                    organizations["Members"] && (<div className='flex items-center gap-[10px]'>
                        <div className='w-[16px] h-[16px] bg-[#802948] border-[2px] border-[#802948] rounded-full'></div>
                        <div className='text-label'>Member, Right to Counsel Coalition </div>
                    </div>)
                }
                {
                    organizations["Supporters"] && (<div className='flex items-center gap-[10px]'>
                        <div className='w-[16px] h-[16px] bg-[#802948] border-[2px] border-[#802948] rounded-full'></div>
                        <div className='text-label'>Supporter, Right to Counsel Coalition </div>
                    </div>)
                }

                {
                    organizations["Endorsers"] && (<div className='flex items-center gap-[10px]'>
                        <div className='w-[16px] h-[16px] bg-white border-[2px] border-[#802948] rounded-full'></div>
                        <div className='text-label'>Endorser, Right to Counsel Coalition </div>
                    </div>)
                }


            </div>
            <div className='absolute left-[480px] bottom-[35px]  drop-shadow-xl cursor-pointer z-20 '>
                <Image
                    src="/icons/active_control.svg"
                    width={50}
                    height={50}
                    alt="active control panel"
                    onClick={() => panelClickHandler(true)}
                />
            </div>
            {panelShown && (
                <div className='absolute left-[480px] bottom-[100px] p-[25px] text-rtc_navy bg-white rounded-[18.23px] drop-shadow-xl z-20'>
                    <div className='flex items-center gap-[29px] pb-[12px] border-b-[1px] border-grey_1'>
                        <h2 className='font-bold text-title'>Statewide RTC Map Layers</h2>
                        <XMarkIcon className='w-[22px] h-[22px] text-grey_2 cursor-pointer' onClick={() => panelClickHandler(false)} />
                    </div>
                    <div className='flex flex-col gap-[9px] pt-[12px] pb-[17px] w-full border-b-[1px] border-grey_1'>
                        <h2 className='font-bold text-title'>Geographic Boundaries</h2>
                        <div className='flex w-full cursor-pointer'>
                            <div className={`flex justify-center items-center p-[8px] w-[50%] font-semibold text-label ${districts === "senate" ? "text-white bg-rtc_purple border-[3px] border-rtc_purple" : "text-grey_1 bg-white border-[3px] border-grey_1 "}  rounded-l-[8px]`}
                                onClick={() => districtsClickHandler("senate")}>Senate Districts</div>
                            <div className={`flex justify-center items-center p-[8px] w-[50%] font-semibold text-label ${districts === "assembly" ? "text-white bg-rtc_purple border-[3px] border-rtc_purple" : "text-grey_1 bg-white border-[3px] border-grey_1 "} rounded-r-[8px]`}
                                onClick={() => districtsClickHandler("assembly")}>Assembly Districts</div>
                        </div>
                    </div>
                    <div className='flex flex-col gap-[15px] pt-[12px]'>
                        <h2 className='font-bold text-title'>RTC Coalition Membership</h2>
                        <div className='flex flex-col gap-[15px]'>
                            <div className='flex justify-between items-center'>
                                <h3 className='font-semibold text-label'>Member Organizations</h3>
                                <Toggler show={organizations["Members"]} clickHandler={() => organizationsClickHandler("Members")} />
                            </div>
                            <div className='flex justify-between items-center'>
                                <h3 className='font-semibold text-label'>Supporters</h3>
                                <Toggler show={organizations["Supporters"]} clickHandler={() => organizationsClickHandler("Supporters")} />
                            </div>
                            <div className='flex justify-between items-center'>
                                <h3 className='font-semibold text-label'>Endorsers</h3>
                                <Toggler show={organizations["Endorsers"]} clickHandler={() => organizationsClickHandler("Endorsers")} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </>

    )
}

export default Legend