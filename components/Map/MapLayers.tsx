import React, { useState, useEffect, useContext } from 'react'

import { MapContext, MapContextType } from '../../context/MapContext'

import Toggler from '../elements/Toggler'

import Image from 'next/image'
import { XMarkIcon } from '@heroicons/react/24/solid'


type Props = {
    districtsClickHandler: (x: Districts) => void
}



const MapLayers = ({ districtsClickHandler }: Props) => {

    const { map, districts } = useContext(MapContext) as MapContextType

    const [panelShown, setPanelShown] = useState(false)
    const [membershipShown, setMembershipShown] = useState(false)


    const panelClickHandler = (b: boolean) => {
        setPanelShown(b)
    }

    const membershipClickHandler = () => {
        setMembershipShown(!membershipShown)
    }

    // const [organizations, setOrganizations] = useState({
    //     Members: false,
    //     Supporters: false,
    //     Endorsers: false,
    // })

    // const organizationsClickHandler = (org: Organizations) => {
    //     let newOrg = { ...organizations }
    //     newOrg[org] = !newOrg[org]
    //     setOrganizations(newOrg)
    // }

    useEffect(() => {
        membershipShown ? map?.setLayoutProperty('organizations', "visibility", "visible") : map?.setLayoutProperty('organizations', "visibility", "none")
        // if (organizations["Members"]) {
        //     map?.setLayoutProperty('organizations_members', "visibility", "visible")
        // } else {
        //     map?.setLayoutProperty('organizations_members', "visibility", "none")
        // }
        // if (organizations["Supporters"]) {
        //     map?.setLayoutProperty('organizations_supporters', "visibility", "visible")
        // } else {
        //     map?.setLayoutProperty('organizations_supporters', "visibility", "none")
        // }
        // if (organizations["Endorsers"]) {
        //     map?.setLayoutProperty('organizations_endorsers', "visibility", "visible")
        // } else {
        //     map?.setLayoutProperty('organizations_endorsers', "visibility", "none")
        // }
    }, [membershipShown])



    return (

        <>
            <div className='absolute left-[480px] bottom-[30px]  drop-shadow-xl cursor-pointer z-20 '>
                <Image
                    src="/icons/map_layer_active.svg"
                    width={50}
                    height={50}
                    alt="active control panel"
                    onClick={() => panelClickHandler(true)}
                    className=''
                />
            </div>
            {panelShown && (
                <div className='absolute left-[480px] bottom-[30px] p-[25px] text-rtc_navy bg-white rounded-[18.23px] drop-shadow-xl z-20'>
                    <div className='flex items-center gap-[29px] pb-[12px] border-b-[1px] border-grey_1'>
                        <h2 className='font-bold text-title'>Statewide RTC Map Layers</h2>
                        <XMarkIcon className='w-[22px] h-[22px] text-grey_2 cursor-pointer' onClick={() => panelClickHandler(false)} />
                    </div>
                    <div className='flex flex-col gap-[9px] pt-[12px] pb-[17px] w-full border-b-[1px] border-grey_1'>
                        <h2 className='font-bold text-title'>Geographic Boundaries</h2>
                        <div className='flex w-full cursor-pointer'>
                            <div className={`flex justify-center items-center p-[8px] w-[50%] font-semibold text-label ${districts === "senate" ? "text-white bg-rtc_purple border-[2px] border-rtc_purple" : "text-grey_1 bg-white border-[3px] border-grey_1 "}  rounded-l-[8px]`}
                                onClick={() => districtsClickHandler("senate")}>Senate Districts</div>
                            <div className={`flex justify-center items-center p-[8px] w-[50%] font-semibold text-label ${districts === "assembly" ? "text-white bg-rtc_purple border-[2px] border-rtc_purple" : "text-grey_1 bg-white border-[3px] border-grey_1 "} rounded-r-[8px]`}
                                onClick={() => districtsClickHandler("assembly")}>Assembly Districts</div>
                        </div>
                    </div>
                    <div className='flex flex-col gap-[9px] pt-[12px]'>
                        <h2 className='font-bold text-title'>RTC Coalition Membership</h2>
                        <div className='flex flex-col gap-[15px]'>
                            <div className='flex justify-between items-center'>
                                <h3 className='font-semibold text-label'>Member Organizations</h3>
                                <Toggler show={membershipShown} clickHandler={membershipClickHandler} />
                            </div>
                            {/* <div className='flex justify-between items-center'>
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
                            </div> */}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default MapLayers