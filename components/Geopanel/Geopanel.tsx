import React, { useState, useContext, Dispatch, SetStateAction } from 'react'

import { XMarkIcon } from '@heroicons/react/24/solid'
import { MapContext, MapContextType } from '@/context/MapContext'
import GeoInfoBtns from '../elements/GeoInfoBtns'

import assembly from "../../public/nys_assembly.geo.json"
import senate from "../../public/nys_senate.geo.json"
import assemblyZipcodes from "../../public/assembly_zipcodes.json"
import senateZipcodes from "../../public/senate_zipcodes.json"
import zipcodes from "../../public/nys_zipcodes.geo.json"

import * as turf from "@turf/turf";
import mapboxgl, { EventData, MapMouseEvent } from 'mapbox-gl';

type Props = {
    selectedDistrictFeatures: {
        properties: {
            Address?: string
            Address2?: string
            City?: string
            District: number
            Geography: string
            House: string
            NAME: string
            name: string
            OBJECTID: string
            Party_x: "Republican" | "Democratic"
            Party_y: string
            Phone: string
            State: "NY"
            Zip: string
            dist_phone: string
            email: string
        },
        geometry: {
            coordinates: [][]
            type: "Polygon"
        }

    } | null
}
const Geopanel = ({ selectedDistrictFeatures }: Props) => {

    const { map, districts, legislations, geopanelShown, setGeopanelShown, defaultMapHandler } = useContext(MapContext) as MapContextType
    const selectedDistrictZipcodes = (districts === "senate" ? senateZipcodes : assemblyZipcodes).filter(z => z.district === selectedDistrictFeatures?.properties.District)
    const selectedDistrictPolygon = turf.polygon([(senate as GeoJson).features[0].geometry.coordinates[0]])

    // if (selectedDistrictPolygon !== null) {
    //     const filteredAssemblyDistricts = (assembly as GeoJson).features.filter((a, i) => {
    //         const assemblyPolygon = turf.polygon([a.geometry.coordinates[0]])
    //         if (turf.booleanOverlap(assemblyPolygon, selectedDistrictPolygon) || turf.booleanContains(selectedDistrictPolygon, assemblyPolygon)) return true
    //         return false
    //     })
    // }


    const zipcodeClickHandler = (e: any) => {
        const clickedZipcode = (zipcodes as GeoJson).features.filter((z, i) => z.properties.ZCTA5CE10 === e.target.innerText)
        console.log(clickedZipcode)

        map?.getSource("zipcodes").setData({
            type: "FeatureCollection",
            features: clickedZipcode,
        })
    }

    return (
        <>
            {geopanelShown && (
                <div className='flex flex-col absolute top-0 right-0 w-[14%] h-full z-20 overflow-y-scroll'>
                    {/* @ts-ignore */}
                    <div className={`flex items-start justify-between p-[18px]  w-full ${selectedDistrictFeatures?.properties.Party_x === "Democratic" ? "bg-demo_1" : "bg-rep_1"} `}>
                        <div>
                            <div className='text-label'>New York State {districts.charAt(0).toUpperCase() + districts.slice(1)}</div>
                            {/* @ts-ignore */}
                            <div className='font-bold text-subheadline'>District {selectedDistrictFeatures?.properties!.District}</div>
                        </div>
                        <XMarkIcon className=' w-[20px] h-[20px] text-white cursor-pointer' onClick={defaultMapHandler} />
                    </div>
                    <div className='flex-1 p-[18px] w-full bg-white'>
                        <div className='text-[10px] text-regular text-grey_1'>HCMC Campaign Support</div>
                        <div className="flex flex-col gap-[5px] mt-[6px] text-rtc_navy">
                            <div className="flex items-center gap-[5px] ">
                                {/* <img src=${properties["HCMC support"].includes("Statewide RTC") ? "/icons/checked.svg" : "/icons/empty.svg"} alt="" className="w-[16px] h-[16px]" /> */}
                                <div className="font-bold text-label">Statewide RTC</div>
                            </div>
                            <div className="flex items-center gap-[5px]">
                                {/* <img src=${properties["HCMC support"].includes("Winter Eviction Moratorium") ? "/icons/checked.svg" : "/icons/empty.svg"}  alt="" className="w-[16px] h-[16px]" /> */}
                                <div className="font-bold text-label">Winter Eviction Moratorium</div>
                            </div>
                            <div className="flex items-center gap-[5px]">
                                {/* <img src=${properties["HCMC support"].includes("Defend RTC") ? "/icons/checked.svg" : "/icons/empty.svg"} alt="" className="w-[16px] h-[16px]" /> */}
                                <div className="font-bold text-label">Defend RTC</div>
                            </div>
                            <div className="flex items-center gap-[5px]">
                                {/* <img src=${properties["HCMC support"].includes("Fund Local Law 53") ? "/icons/checked.svg" : "/icons/empty.svg"} alt="" className="w-[16px] h-[16px]" /> */}
                                <div className="font-bold text-label">Power to Organize:<br /> Fund Local Law 53</div>
                            </div>
                        </div>
                        <div className='my-[12px] w-full h-[1px] bg-grey_1'></div>
                        <div className='text-[10px] text-regular text-grey_1'>{districts.charAt(0).toUpperCase() + districts.slice(1)} District General Info</div>
                        <div className="flex flex-col gap-[16px] mt-[6px] text-rtc_navy">
                            <div className="flex items-center gap-[12px]">
                                <img src="/icons/person.svg" alt="" className="w-[16px] h-[16px]" />
                                <div className={`w-[120px] font-regular text-label ${selectedDistrictFeatures?.properties.Party_x === "Democratic" ? "text-demo_1" : "text-rep_1"}`}><span className='font-bold'>{selectedDistrictFeatures?.properties!.NAME}</span><br /> Democrat</div>
                            </div>
                            <div className="flex items-center gap-[12px]">
                                <img src="/icons/apartment.svg" alt="" className="w-[16px] h-[16px]" />
                                <div className="w-[120px] font-regular text-label">{selectedDistrictFeatures?.properties.Address}</div>
                            </div>
                            <div className="flex items-center gap-[12px]">
                                <img src="/icons/phone.svg" alt="" className="w-[16px] h-[16px]" />
                                <div className="font-regular text-label">{selectedDistrictFeatures?.properties.Phone}</div>
                            </div>
                            <div className="flex items-center gap-[12px]">
                                <img src="/icons/email.svg" alt="" className="w-[16px] h-[16px]" />
                                <div className="font-regular text-label">{selectedDistrictFeatures?.properties.email}</div>
                            </div>
                        </div>
                        <div className='my-[12px] w-full h-[1px] bg-grey_1'></div>
                        <div className='mb-[20px] text-[10px] text-grey_1'>
                            Click below to view intersecting geographic boundaries with Senate District 48.
                        </div>
                        <div>
                            <div className='mb-[5px] text-[10px] text-grey_1'>Assembly Districts</div>
                            <div className='grid grid-cols-4 gap-[8px]'>
                                <GeoInfoBtns name="116" clickHandler={(e) => zipcodeClickHandler(e)} />
                                <GeoInfoBtns name="120" clickHandler={(e) => zipcodeClickHandler(e)} />
                                <GeoInfoBtns name="125" clickHandler={(e) => zipcodeClickHandler(e)} />
                                <GeoInfoBtns name="127" clickHandler={(e) => zipcodeClickHandler(e)} />
                                <GeoInfoBtns name="128" clickHandler={(e) => zipcodeClickHandler(e)} />
                                <GeoInfoBtns name="129" clickHandler={(e) => zipcodeClickHandler(e)} />
                                <GeoInfoBtns name="130" clickHandler={(e) => zipcodeClickHandler(e)} />
                            </div>
                        </div>
                        <div className='my-[16px]'>
                            <div className='mb-[5px] text-[10px] text-grey_1'>Counties</div>
                            <div className='grid grid-cols-2 gap-[12px]'>
                                <GeoInfoBtns name="Cayuga" clickHandler={(e) => zipcodeClickHandler(e)} /> 
                                <GeoInfoBtns name="Oswego" clickHandler={(e) => zipcodeClickHandler(e)} /> 
                                <GeoInfoBtns name="Cortland" clickHandler={(e) => zipcodeClickHandler(e)} /> 
                                <GeoInfoBtns name="Wayne" clickHandler={(e) => zipcodeClickHandler(e)} />
                                <GeoInfoBtns name="Seneca" clickHandler={(e) => zipcodeClickHandler(e)} />
                                <GeoInfoBtns name="Tompkins" clickHandler={(e) => zipcodeClickHandler(e)} />
                            </div>
                        </div>
                        <div>
                            <div className='mb-[5px] text-[10px] text-grey_1'>Zip Codes</div>
                            <div className='grid grid-cols-3 gap-[12px]'>
                                {/* @ts-ignore */}
                                {selectedDistrictZipcodes[0] && selectedDistrictZipcodes[0].zips.map((z, i) => <GeoInfoBtns key={i} name={z} clickHandler={(e) => zipcodeClickHandler(e)} />)}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )

}

export default Geopanel

