import React, { useContext, MouseEvent } from 'react'

import { XMarkIcon } from '@heroicons/react/24/solid'
import { MapContext, MapContextType } from '@/context/MapContext'
import GeoInfoBtns from './GeoInfoBtns'

import assembly from "../../public/nys_assembly.geo.json"
import senate from "../../public/nys_senate.geo.json"

import assemblyOverlapped from "../../public/assembly_overlapping_boundaries.json"
import senateOverlapped from "../../public/senate_overlapping_boundaries.json"
import zipcodes from "../../public/nys_zipcodes.geo.json"
import counties from "../../public/nys_counties.geo.json"

import * as turf from "@turf/turf";
import { GeoJSONSource } from 'mapbox-gl';

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

    const { map, districts, geopanelShown, defaultMapHandler } = useContext(MapContext) as MapContextType
    const selectedDistrictOverlappedData = (districts === "senate" ? senateOverlapped : assemblyOverlapped).filter(d => d.district === selectedDistrictFeatures?.properties.District)[0]

    const congressionsClickHandler = (e: MouseEvent<HTMLElement>) => {
        const congressions = (districts === "senate" ? assembly : senate)
        const clickedCongressions = (congressions as GeoJson).features.filter((c, i) => c.properties.District.toString() === (e.target as HTMLElement).innerText)

        /* @ts-ignore */
        map?.getSource("hover_area").setData({
            type: "FeatureCollection",
            features: clickedCongressions,
        })

        let coordinatesArray = clickedCongressions[0].geometry.coordinates[0]
        while (coordinatesArray.length === 1) coordinatesArray = coordinatesArray[0]
        const targetPolygon = turf.polygon([coordinatesArray])
        /* @ts-ignore */
        const targetCentroid = turf.center(targetPolygon).geometry.coordinates


        const labelData = {
            'type': 'FeatureCollection',
            'features': [
                {
                    "type": "Feature",
                    "properties": {
                        "label": clickedCongressions[0].properties.District.toString()
                    },
                    "geometry": {
                        'type': 'Point',
                        'coordinates': targetCentroid
                    }
                }
            ]
        }

        /* @ts-ignore */
        map?.getSource("hover_label").setData({
            type: "FeatureCollection",
            features: labelData.features as GeoJson["features"]
        })
        // map?.setPaintProperty("district_label", "text-opacity", 1)

    }


    const zipcodeMouseEnterHandler = (e: MouseEvent<HTMLElement>) => {
        const hoveredZipcode = (zipcodes as GeoJson).features.filter((z, i) => z.properties.ZCTA5CE10 === (e.target as HTMLElement).innerText)
        /* @ts-ignore */
        map?.getSource("hover_area").setData({
            type: "FeatureCollection",
            features: hoveredZipcode,
        })

        let coordinatesArray = hoveredZipcode[0].geometry.coordinates[0]
        while (coordinatesArray.length === 1) coordinatesArray = coordinatesArray[0]

        const targetPolygon = turf.polygon([coordinatesArray])
        /* @ts-ignore */
        const targetCentroid = turf.center(targetPolygon).geometry.coordinates
        const labelData = {
            'type': 'FeatureCollection',
            'features': [
                {
                    "type": "Feature",
                    "properties": {
                        "label": hoveredZipcode[0].properties.ZCTA5CE10
                    },
                    "geometry": {
                        'type': 'Point',
                        'coordinates': targetCentroid
                    }
                }
            ]
        }


        /* @ts-ignore */
        map?.getSource("hover_label").setData({
            type: "FeatureCollection",
            features: labelData.features as GeoJson["features"]
        })
        map?.setPaintProperty("district_label", "text-opacity", 0)



    }

    const countyMouseEnterHandler = (e: MouseEvent<HTMLElement>) => {
        const hoveredCounty = (counties as GeoJson).features.filter((c, i) => c.properties.name.replace("County", "").trim() === (e.target as HTMLElement).innerText)
        /* @ts-ignore */
        map?.getSource("hover_area").setData({
            type: "FeatureCollection",
            features: hoveredCounty,
        })

        const targetPolygon = turf.polygon(hoveredCounty[0].geometry.coordinates[0])
        /* @ts-ignore */
        const targetCentroid = turf.center(targetPolygon).geometry.coordinates
        const labelData = {
            'type': 'FeatureCollection',
            'features': [
                {
                    "type": "Feature",
                    "properties": {
                        "label": hoveredCounty[0].properties.name.replace("County", "").trim()
                    },
                    "geometry": {
                        'type': 'Point',
                        'coordinates': targetCentroid
                    }
                }
            ]
        }
        /* @ts-ignore */
        map?.getSource("hover_label").setData({
            type: "FeatureCollection",
            features: labelData.features as GeoJson["features"]
        })

        map?.setPaintProperty("district_label", "text-opacity", 0)

    }

    const removeHoverEventHandler = () => {
        /* @ts-ignore */
        map?.getSource("hover_area").setData({
            type: "FeatureCollection",
            features: [],
        })
        /* @ts-ignore */
        map?.getSource("hover_label").setData({
            type: "FeatureCollection",
            features: []
        })

        map?.setPaintProperty("district_label", "text-opacity", 1)


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
                                {/* @ts-ignore */}
                                <img src={selectedDistrictFeatures?.properties!["HCMC support"].includes("Statewide RTC") ? "/icons/checked.svg" : "/icons/empty.svg"} alt="" className="w-[16px] h-[16px]" />
                                <div className="font-bold text-label">Statewide RTC</div>
                            </div>
                            <div className="flex items-center gap-[5px]">
                                {/* @ts-ignore */}
                                <img src={selectedDistrictFeatures?.properties!["HCMC support"].includes("Winter Eviction Moratorium") ? "/icons/checked.svg" : "/icons/empty.svg"} alt="" className="w-[16px] h-[16px]" />
                                <div className="font-bold text-label">Winter Eviction Moratorium</div>
                            </div>
                            <div className="flex items-center gap-[5px]">
                                {/* @ts-ignore */}
                                <img src={selectedDistrictFeatures?.properties!["HCMC support"].includes("Defend RTC") ? "/icons/checked.svg" : "/icons/empty.svg"} alt="" className="w-[16px] h-[16px]" />
                                <div className="font-bold text-label">Defend RTC</div>
                            </div>
                            <div className="flex items-center gap-[5px]">
                                {/* @ts-ignore */}
                                <img src={selectedDistrictFeatures?.properties!["HCMC support"].includes("Fund Local Law 53") ? "/icons/checked.svg" : "/icons/empty.svg"} alt="" className="w-[16px] h-[16px]" />
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
                            {
                                (selectedDistrictFeatures?.properties.Address) !== undefined &&
                                <div className="flex items-center gap-[12px]">
                                    <img src="/icons/apartment.svg" alt="" className="w-[16px] h-[16px]" />
                                    <div className="w-[120px] font-regular text-label">{selectedDistrictFeatures?.properties.Address}</div>
                                </div>
                            }
                            <div className="flex items-center gap-[12px]">
                                <img src="/icons/phone.svg" alt="" className="w-[16px] h-[16px]" />
                                <div className="font-regular text-label">{selectedDistrictFeatures?.properties.Phone}</div>
                            </div>
                            {
                                (selectedDistrictFeatures?.properties.email) !== undefined &&
                                (
                                    <div className="flex items-center gap-[12px]">
                                        <img src="/icons/email.svg" alt="" className="w-[16px] h-[16px]" />
                                        <div className="font-regular text-label">{selectedDistrictFeatures?.properties.email}</div>
                                    </div>
                                )
                            }
                        </div>
                        <div className='my-[12px] w-full h-[1px] bg-grey_1'></div>
                        <div className='mb-[20px] text-[10px] text-grey_1'>
                            Click below to view intersecting geographic boundaries with {districts.charAt(0).toUpperCase() + districts.slice(1)} District {selectedDistrictFeatures?.properties!.District}.
                        </div>
                        <div>
                            <div className='mb-[5px] text-[10px] text-grey_1'>{districts === "senate" ? "Assembly" : "Senate"} Districts</div>
                            <div className='grid grid-cols-4 gap-[8px]'>
                                {
                                    selectedDistrictOverlappedData &&
                                    selectedDistrictOverlappedData.congressions
                                        .map((c, i) =>
                                            <GeoInfoBtns key={i} name={c.toString()} mouseEnterHandler={congressionsClickHandler} mouseOutHandler={removeHoverEventHandler}/>)
                                }
                            </div>
                        </div>
                        <div className='my-[16px]'>
                            <div className='mb-[5px] text-[10px] text-grey_1'>Counties</div>
                            <div className='grid grid-cols-2 gap-[12px]'>
                                {
                                    selectedDistrictOverlappedData &&
                                    selectedDistrictOverlappedData.counties.map((c, i) =>
                                        <GeoInfoBtns key={i} name={c.replace("County", "")} mouseEnterHandler={countyMouseEnterHandler} mouseOutHandler={removeHoverEventHandler} />)
                                }
                            </div>
                        </div>
                        <div>
                            <div className='mb-[5px] text-[10px] text-grey_1'>Zip Codes</div>
                            <div className='grid grid-cols-3 gap-[12px]'>
                                {
                                    selectedDistrictOverlappedData &&
                                    selectedDistrictOverlappedData.zip_codes.map((z, i) =>
                                        <GeoInfoBtns key={i} name={z} mouseEnterHandler={zipcodeMouseEnterHandler} mouseOutHandler={removeHoverEventHandler} />)
                                }
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )

}

export default Geopanel

