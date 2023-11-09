import React, { useContext, MouseEvent } from 'react'

import { XMarkIcon } from '@heroicons/react/24/solid'
import { MapContext, MapContextType } from '@/context/MapContext'
import GeoInfoBtns from './GeoInfoBtns'


import members from "../../public/rtc_members.geo.json"
import membersOverlapped from "../../public/rtc_members_overlapping.json"

import * as turf from "@turf/turf";


type Props = {
    selectedMemberFeatures: {
        properties: {
            Website: string,
            Name: string,
            Legislation: string[],
            Phone: string,
            Address: string,
            'Membership Status': string[],
        }
    } | null
}


const Membershippanel = ({ selectedMemberFeatures }: Props) => {

    const { map, districts, memberpanelShown, defaultMapHandler } = useContext(MapContext) as MapContextType
    const selectedMemberOverlappedData = (membersOverlapped).filter(m => m.Name === selectedMemberFeatures?.properties.Name)[0]
    return (
        <>
            {memberpanelShown && (
                <div className='flex flex-col absolute top-0 right-0 w-[14%] h-full z-20 overflow-y-scroll'>
                    <div className='px-[18px] py-[12px] w-full bg-rtc_purple'>
                        <div className={`flex items-start justify-between my-[12px] w-full `}>
                            <div className='w-[75%] font-semibold text-subheadline'>{selectedMemberFeatures?.properties.Name.toUpperCase()}</div>
                            <XMarkIcon className='w-[20px] h-[20px] text-white cursor-pointer' onClick={defaultMapHandler} />
                        </div>
                        <div className='flex items-center gap-[6px]'>
                            <img src={selectedMemberFeatures?.properties["Membership Status"].includes("Member") ? "/icons/checked_member.svg" : "/icons/empty_member.svg"} alt="" className='w-[20px] h-[20px]' />
                            <div>
                                <div className='text-[10px] text-[rgba(255,255,255, 0.8)]'>Right to Counsel NYC Coalition</div>
                                <div className='font-semibold text-label'>Campaign Member</div>
                            </div>
                        </div>
                    </div>
                    <div className='flex-1 p-[18px] w-full bg-white'>
                        <div className='text-[10px] text-regular text-grey_1'>HCMC Campaign Support</div>
                        <div className="flex flex-col gap-[5px] mt-[6px] text-rtc_navy">
                            <div className="flex items-center gap-[5px] ">
                                {/* @ts-ignore */}
                                <img src={selectedMemberFeatures?.properties!["Legislation"].includes("Statewide RTC") ? "/icons/checked.svg" : "/icons/empty.svg"} alt="" className="w-[16px] h-[16px]" />
                                <div className="font-bold text-label">Statewide RTC</div>
                            </div>
                            <div className="flex items-center gap-[5px]">
                                {/* @ts-ignore */}
                                <img src={selectedMemberFeatures?.properties!["Legislation"].includes("Winter Eviction Moratorium") ? "/icons/checked.svg" : "/icons/empty.svg"} alt="" className="w-[16px] h-[16px]" />
                                <div className="font-bold text-label">Winter Eviction Moratorium</div>
                            </div>
                            <div className="flex items-center gap-[5px]">
                                {/* @ts-ignore */}
                                <img src={selectedMemberFeatures?.properties!["Legislation"].includes("Defend RTC") ? "/icons/checked.svg" : "/icons/empty.svg"} alt="" className="w-[16px] h-[16px]" />
                                <div className="font-bold text-label">Defend RTC</div>
                            </div>
                            <div className="flex items-center gap-[5px]">
                                {/* @ts-ignore */}
                                <img src={selectedMemberFeatures?.properties!["Legislation"].includes("Fund Local Law 53") ? "/icons/checked.svg" : "/icons/empty.svg"} alt="" className="w-[16px] h-[16px]" />
                                <div className="font-bold text-label">Power to Organize:<br /> Fund Local Law 53</div>
                            </div>
                        </div>
                        <div className='my-[12px] w-full h-[1px] bg-grey_1'></div>
                        <div className='text-[10px] text-regular text-grey_1'>Right to Counsel NYC {selectedMemberFeatures?.properties["Membership Status"]} General Information
                        </div>
                        <div className="flex flex-col gap-[16px] mt-[6px] text-rtc_navy">
                            {
                                (selectedMemberFeatures?.properties.Address) !== undefined &&
                                <div className="flex items-center gap-[12px]">
                                    <img src="/icons/apartment.svg" alt="" className="w-[16px] h-[16px]" />
                                    <div className="w-[120px] font-regular text-label">{selectedMemberFeatures?.properties.Address}</div>
                                </div>
                            }
                            <div className="flex items-center gap-[12px]">
                                <img src="/icons/phone.svg" alt="" className="w-[16px] h-[16px]" />
                                <div className="font-regular text-label">{selectedMemberFeatures?.properties.Phone}</div>
                            </div>
                            {
                                (selectedMemberFeatures?.properties.Website) !== undefined &&
                                (
                                    <div className="flex items-center gap-[12px]">
                                        <img src="/icons/email.svg" alt="" className="w-[16px] h-[16px]" />
                                        <div className="font-regular text-label">{selectedMemberFeatures?.properties.Website}</div>
                                    </div>
                                )
                            }
                        </div>
                        <div className='my-[12px] w-full h-[1px] bg-grey_1'></div>
                        <div className='mb-[20px] text-[10px] text-grey_1'>
                            Click below to view intersecting geographic boundaries with {selectedMemberFeatures?.properties.Name}.
                        </div>
                        <div>
                            <div className='mb-[5px] text-[10px] text-grey_1'>Senate Districts</div>
                            <div className='grid grid-cols-4 gap-[8px]'>
                                <GeoInfoBtns name={"41"} />
                            </div>
                        </div>
                        <div className='my-[16px]'>
                            <div className='mb-[5px] text-[10px] text-grey_1'>Assembly Districts</div>
                            <div className='grid grid-cols-4 gap-[8px]'>
                                <GeoInfoBtns name={"102"} />
                            </div>
                        </div>
                        <div className='my-[16px]'>
                            <div className='mb-[5px] text-[10px] text-grey_1'>Counties</div>
                            <div className='grid grid-cols-3 gap-[12px]'>
                                <GeoInfoBtns name={"Greene"} />
                            </div>
                        </div>
                        <div>
                            <div className='mb-[5px] text-[10px] text-grey_1'>Zip Codes</div>
                            <div className='grid grid-cols-3 gap-[12px]'>
                                <GeoInfoBtns name={"12414"} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Membershippanel