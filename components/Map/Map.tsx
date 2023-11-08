"use client";

import React, { useState, useRef, useEffect, useContext, Dispatch, SetStateAction } from "react";
import { MapContext, MapContextType } from "../../context/MapContext";

import mapboxgl, { EventData, MapMouseEvent } from 'mapbox-gl';
import { GeoJSONSource } from 'mapbox-gl';

import assembly from "../../public/nys_assembly.geo.json"
import senate from "../../public/nys_senate.geo.json"
import organizations from "../../public/rtc_members.geo.json"
import counties from "../../public/nys_counties.geo.json"
// import zipcodes from "../../public/nys_zipcodes.geo.json"

import * as turf from "@turf/turf";


import Legend from "./Legend";
import MapLayers from "./MapLayers";
import Geopanel from "../Geopanel/Geopanel";

import "./Map.css"



const Map = () => {
    const mapContainer = useRef<HTMLInputElement>(null);
    const { map, setMap, districts, setDistricts, setGeopanelShown, legislations, mapClickHandler, defaultMapHandler } = useContext(MapContext) as MapContextType

    const senateFeatures = (senate as GeoJson).features
    const assemblyFeatures = (assembly as GeoJson).features
    const organizationsFeatures = (organizations as GeoJson).features
    const countiesFeatures = (counties as GeoJson).features


    // senateFeatures.forEach((s, i) => {
    //     senateFeatures[i].properties.zipCodes = []
    // })
    // useEffect(() => {
    // senateFeatures.forEach((s, i) => {
    //     senateFeatures[i].properties.zipCodes = []
    // })
    // const senatePolygon = turf.polygon([senateFeatures[0].geometry.coordinates[0]])
    // const filtered = zipcodeFeatures.filter((z, i) => i !== 1299).filter((z, i) => i !== 1407)
    // const filteredZipcodesFeatures = filtered.filter((z, i) => {
    //     let zipcodesPolygon
    //     if (z.geometry.coordinates[0].length === 1) {
    //         zipcodesPolygon = turf.polygon([z.geometry.coordinates[0][0]])
    //         if (turf.booleanOverlap(zipcodesPolygon, senatePolygon) || turf.booleanContains(senatePolygon, zipcodesPolygon)) return true
    //         return false
    //     } else {
    //         zipcodesPolygon = turf.polygon([z.geometry.coordinates[0]])
    //         if (turf.booleanOverlap(zipcodesPolygon, senatePolygon) || turf.booleanContains(senatePolygon, zipcodesPolygon)) return true
    //         return false
    //     }

    // })
    // }, [])



    const [lng, setLng] = useState(-78.5);
    const [lat, setLat] = useState(43.05);
    const [zoom, setZoom] = useState(-6.25);

    const [selectedDistrictFeatures, setSelectedDistrictFeatures] = useState(null)


    const districtsClickHandler = (districts: Districts) => {
        setDistricts(districts)

        switch (districts) {
            case "senate":
                (map?.getSource("districts") as GeoJSONSource).setData({
                    type: "FeatureCollection",
                    features: senateFeatures
                });
                break
            case "assembly":
                (map?.getSource("districts") as GeoJSONSource).setData({
                    type: "FeatureCollection",
                    features: assemblyFeatures
                });
                break
        }

        defaultMapHandler()
    }

    useEffect(() => {
        mapboxgl.accessToken =
            "pk.eyJ1IjoiY2xvdWRsdW4iLCJhIjoiY2s3ZWl4b3V1MDlkejNkb2JpZmtmbHp4ZiJ9.MbJU7PCa2LWBk9mENFkgxw";
        const m = new mapboxgl.Map({
            container: mapContainer.current || "",
            style: "mapbox://styles/cloudlun/clm6k2n6y02gi01ns267c139m",
            center: [lng, lat],
            zoom: zoom,
            minZoom: 6,
            maxZoom: 12,
            interactive: true,
            doubleClickZoom: false,
        });

        m.addControl(new mapboxgl.NavigationControl())

        m.on("move", () => {
            setLng(Number(m.getCenter().lng.toFixed(4)));
            setLat(Number(m.getCenter().lat.toFixed(4)));
            setZoom(Number(m.getZoom()));
        });

        m.on("load", () => {
            setMap(m);

            m.addSource("districts", {
                type: "geojson",
                data: {
                    type: "FeatureCollection",
                    features: senateFeatures,
                },
            })

            m.addSource("click_area", {
                type: "geojson",
                data: {
                    type: "FeatureCollection",
                    features: [],
                },
            })

            m.addSource("hover_area", {
                type: "geojson",
                data: {
                    type: "FeatureCollection",
                    features: [],
                },
            })

            m.addSource("organizations", {
                type: "geojson",
                data: {
                    type: "FeatureCollection",
                    features: organizationsFeatures,
                },
            })

            m.addSource("district_label", {
                type: "geojson",
                data: {
                    type: "FeatureCollection",
                    features: []
                },
            })


            m.addSource("hover_label", {
                type: "geojson",
                data: {
                    type: "FeatureCollection",
                    features: []
                },
            })


            m.addSource("click_label", {
                type: "geojson",
                data: {
                    type: "FeatureCollection",
                    features: []
                },
            })


            m.loadImage("./icons/pattern_rep.png", (error, image) => {
                if (error) throw error;
                m.addImage("pattern_rep", image as ImageBitmap, {
                    sdf: true,
                });
            });

            m.loadImage("./icons/pattern_demo.png", (error, image) => {
                if (error) throw error;
                m.addImage("pattern_demo", image as ImageBitmap, {
                    sdf: true,
                });
            });

            m.addLayer({
                'id': 'districts',
                'type': 'fill',
                'source': 'districts',
                'layout': {},
                'paint': {
                    'fill-color': [
                        "case",
                        ["all", ["==", ["get", "Party_x"], "Democratic"]],
                        "#007CEE",
                        "#D04E40"
                    ],
                    'fill-opacity': [
                        "case",
                        ["in", legislations, ["get", "HCMC support"]],
                        .75, 0
                    ]
                },
            });

            m.addLayer({
                'id': 'districts_outline',
                'type': 'line',
                'source': 'districts',
                'layout': {},
                'paint': {
                    'line-color': [
                        "case",
                        ["all", ["==", ["get", "Party_x"], "Democratic"]],
                        "#006fd6",
                        "#D04E40"
                    ],
                    'line-width': 1
                }
            });

            m.addLayer({
                id: "pattern_rep",
                type: "fill",
                source: 'districts',
                paint: {
                    "fill-pattern": 'pattern_rep',
                    'fill-opacity': [
                        "case",
                        ["all", ["==", ["get", "Party_x"], "Republican"], ["!", ["in", legislations, ["get", "HCMC support"]]]],
                        0.2, 0
                    ]
                }
            })

            m.addLayer({
                id: "pattern_demo",
                type: "fill",
                source: 'districts',
                paint: {
                    "fill-pattern": 'pattern_demo',
                    'fill-opacity': [
                        "case",
                        ["all", ["==", ["get", "Party_x"], "Democratic"], ["!", ["in", legislations, ["get", "HCMC support"]]]],
                        .2, 0
                    ]
                }
            })


            m.addLayer({
                'id': 'hover_area',
                'type': 'fill',
                'source': 'hover_area',
                'layout': {},
                'paint': {
                    'fill-color': "black",
                    "fill-opacity": .3
                }
            })


            m.addLayer({
                'id': 'hover_area_outline',
                'type': 'line',
                'source': 'hover_area',
                'layout': {},
                'paint': {
                    'line-color': "black",
                    'line-opacity': 1
                },
            });

            m.addLayer({
                'id': 'click_area',
                'type': 'fill',
                'source': 'click_area',
                'layout': {},
                'paint': {
                    'fill-color': [
                        "case",
                        ["all", ["==", ["get", "Party_x"], "Democratic"]],
                        "#0057A8",
                        "#A03327"
                    ],
                    "fill-opacity": .75
                },
            });

            m.addLayer({
                'id': 'click_area_outline',
                'type': 'line',
                'source': 'click_area',
                'layout': {},
                'paint': {
                    'line-color': [
                        "case",
                        ["all", ["==", ["get", "Party_x"], "Democratic"]],
                        "#0057A8",
                        "#A03327"
                    ],
                    'line-width': 1.25
                }
            });



            m.addLayer({
                id: 'organizations',
                type: 'circle',
                source: 'organizations',
                layout: {
                    "visibility": "none"
                },
                paint: {
                    "circle-radius": 4,
                    "circle-stroke-width": 2.25,
                    "circle-stroke-color": "#802948",
                    "circle-color":
                        [
                            "case",
                            ["in", `Member`, ["get", "Membership Status"]],
                            "#802948", "#ffffff"
                        ],
                }
            })


            m.addLayer({
                id: 'hover_label',
                type: 'symbol',
                source: 'hover_label',
                layout: {
                    'text-field': ['get', 'label'],
                    'text-justify': 'auto',
                    'text-size': 13,
                    'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
                    'text-radial-offset': 0.5,
                    'text-font': ["Arial Unicode MS Bold"]
                },
                paint: {
                    'text-color': 'white'
                }
            })

            m.addLayer({
                id: 'click_label',
                type: 'symbol',
                source: 'click_label',
                layout: {
                    'text-field': ['get', 'label'],
                    'text-justify': 'auto',
                    'text-size': 13,
                    'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
                    // 'text-radial-offset': 0.5,
                    'text-font': ["Arial Unicode MS Bold"]
                },
                paint: {
                    'text-color': 'white'
                }
            })

            m.addLayer({
                id: "district_label",
                type: 'symbol',
                source: 'district_label',
                layout: {
                    'text-field': ['get', 'label'],
                    'text-justify': 'auto',
                    'text-size': 14,
                    'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
                    // 'text-radial-offset': 0.5,
                    'text-font': ["Arial Unicode MS Bold"],
                    "text-offset": [0, -1.5]
                },
                paint: {
                    'text-opacity': 1,
                    "text-color": [
                        "case",
                        ["all", ["==", ["get", "party"], "Democratic"]],
                        "#007CEE",
                        "#D04E40"
                    ],
                    'text-halo-color': 'white',
                    "text-halo-width": 0.35
                }
            })


            m.on("click", "districts", (e: MapMouseEvent & EventData) => {
                setSelectedDistrictFeatures(e.features[0])
                mapClickHandler(m, e, legislations)
            })


            const popup = new mapboxgl.Popup({
                offset: [0, 0],
                anchor: "bottom",
                closeButton: false,
                closeOnClick: true,
            })

            popup.setMaxWidth("1200px")

            const districtTooptipGenerator = (properties: any) => {
                return (`<div class="content">
                <div class="px-[17px] py-[10px] width-full ${properties.Party_x === "Democratic" ? "bg-demo_1" : "bg-rep_1"}   rounded-t-[20px]">
                <div class="col-start-1 col-end-2 font-bold text-white text-[18px]">${districts.charAt(0).toUpperCase() + districts.slice(1)} District ${properties.District}</div>
                </div>
            <div class="px-[17px] pt-[8px] pb-[12px] text-navy bg-white rounded-b-[20px]">
                <div class="font-regular text-[8px] text-[#7F7F7F]">Housing Courts Must Change! Campaign Support</div>
                <div class="flex flex-col gap-[5px] mt-[6px] mb-[8px]">
                    <div class="flex items-center gap-[5px]">
                        <img src=${properties["HCMC support"].includes("Statewide RTC") ? "/icons/checked.svg" : "/icons/empty.svg"} alt="" className="w-[16px] h-[16px]" />
                        <div class="font-bold text-rtc_navy text-[12px]">Statewide RTC</div>
                    </div>
                    <div class="flex items-center gap-[5px]">
                        <img src=${properties["HCMC support"].includes("Winter Eviction Moratorium") ? "/icons/checked.svg" : "/icons/empty.svg"}  alt="" className="w-[16px] h-[16px]" />
                        <div class="font-bold text-rtc_navy text-[12px]">Winter Eviction Moratorium</div>
                    </div>
                    <div class="flex items-center gap-[5px]">
                        <img src=${properties["HCMC support"].includes("Defend RTC") ? "/icons/checked.svg" : "/icons/empty.svg"} alt="" className="w-[16px] h-[16px]" />
                        <div class="font-bold text-rtc_navy text-[12px]">Defend RTC</div>
                    </div>
                    <div class="flex items-center gap-[5px]">
                        <img src=${properties["HCMC support"].includes("Fund Local Law 53") ? "/icons/checked.svg" : "/icons/empty.svg"} alt="" className="w-[16px] h-[16px]" />
                        <div class="font-bold text-rtc_navy text-[12px]">Power to Organize:<br /> Fund Local Law 53</div>
                    </div>
                </div>
                <div class="font-regular text-[12px] text-grey_2 underline">
                    Click the map for further details   
                </div>
            </div></div>`)
            }
            let districtNumber = 0

            m.on("mousemove", "districts", (e: MapMouseEvent & EventData) => {
                const { properties } = e.features[0]
                if (properties.District !== districtNumber) {
                    popup.remove()
                    let content = districtTooptipGenerator(properties)
                    popup.setLngLat([e.lngLat['lng'], e.lngLat["lat"]]).setHTML(content).addTo(m)
                    // districtNumber = properties.District
                }
            })

            m.on("mouseleave", "districts", () => popup.remove())

            m.on("mousemove", 'organizations', (e: MapMouseEvent & EventData) => {
                const { properties } = e.features[0]

                let content = `<div class="content">
                <div class="flex justify-between items-center px-[18px] py-[15px] w-[267px] text-white bg-[#96315F] rounded-t-[20px]">
                    <div class="w-[150px] font-bold text-[14px]">${properties.Name}</div>
                    <div class="flex flex-col items-center">
                        <img src="/icons/checked_member.svg" alt="" className="w-[16px] h-[16px]" />
                        <div class="font-regular text-[10px] text-start ">${properties['Membership Status']}</div>
                    </div>
                </div>
                <div class="px-[17px] pt-[8px] pb-[12px] text-navy bg-white rounded-b-[20px]">
                <div class="font-regular text-[8px] text-[#7F7F7F]">Housing Courts Must Change! Campaign Support</div>
                <div class="flex flex-col gap-[5px] mt-[6px] mb-[8px]">
                    <div class="flex items-center gap-[5px]">
                        <img src=${properties["Legislation"].includes("Statewide RTC") ? "/icons/checked.svg" : "/icons/empty.svg"} alt="" className="w-[16px] h-[16px]" />
                        <div class="font-bold text-rtc_navy text-[12px]">Statewide RTC</div>
                    </div>
                    <div class="flex items-center gap-[5px]">
                        <img src=${properties["Legislation"].includes("Winter Eviction Moratorium") ? "/icons/checked.svg" : "/icons/empty.svg"}  alt="" className="w-[16px] h-[16px]" />
                        <div class="font-bold text-rtc_navy text-[12px]">Winter Eviction Moratorium</div>
                    </div>
                    <div class="flex items-center gap-[5px]">
                        <img src=${properties["Legislation"].includes("Defend RTC") ? "/icons/checked.svg" : "/icons/empty.svg"} alt="" className="w-[16px] h-[16px]" />
                        <div class="font-bold text-rtc_navy text-[12px]">Defend RTC</div>
                    </div>
                    <div class="flex items-center gap-[5px]">
                        <img src=${properties["Legislation"].includes("Fund Local Law 53") ? "/icons/checked.svg" : "/icons/empty.svg"} alt="" className="w-[16px] h-[16px]" />
                        <div class="font-bold text-rtc_navy text-[12px]">Power to Organize:<br /> Fund Local Law 53</div>
                    </div>
                </div>
                <div class="font-regular text-[12px] text-grey_2 underline">
                    Click the map for further details   
                </div>
            </div>
            </div>`
                popup.setLngLat([e.lngLat['lng'], e.lngLat["lat"]]).setHTML(content).addTo(m)
            })

            m.on("mouseleave", "organizations", () => popup.remove())

            // while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            //     coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            //     }

        })
        return () => {
            m.remove();
        };
    }, [])



    return (
        <>
            <div className="absolute w-[100vw] h-[100vh] z-10" ref={mapContainer} >
            </div >
            <Legend />
            <MapLayers districtsClickHandler={districtsClickHandler} />
            <Geopanel selectedDistrictFeatures={selectedDistrictFeatures} />
        </>
    )

}

export default Map