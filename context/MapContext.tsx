"use client";
import { createContext, useState, Dispatch, SetStateAction, ReactNode, } from "react";

import mapboxgl, { EventData, MapMouseEvent } from 'mapbox-gl';

import * as turf from "@turf/turf";

export type MapContextType = {
    map: mapboxgl.Map | null,
    setMap: Dispatch<SetStateAction<mapboxgl.Map | null>>
    districts: Districts
    setDistricts: Dispatch<SetStateAction<Districts>>
    // selectedDistrictFeatures: GeoJson["features"] | null
    // setSelectedDistrictFeatures: Dispatch<SetStateAction<GeoJson["features"] | null>>
    membershipShown: boolean
    setMembershipShown: Dispatch<SetStateAction<boolean>>
    legislations: Legislations
    setLegislations: Dispatch<SetStateAction<Legislations>>
    geopanelShown: boolean
    setGeopanelShown: Dispatch<SetStateAction<boolean>>
    mapClickHandler: (m: mapboxgl.Map, e: MapMouseEvent & EventData, legislations: Legislations) => void
    defaultMapHandler: () => void
}

type Props = {
    children: ReactNode
}


const MapContext = createContext<MapContextType | null>(null)

const MapProvider = ({ children }: Props) => {

    const [map, setMap] = useState<mapboxgl.Map | null>(null)
    const [districts, setDistricts] = useState<Districts>("senate")
    // const [selectedDistrictFeatures, setSelectedDistrictFeatures] = useState<GeoJson["features"] | null>(null)
    const [geopanelShown, setGeopanelShown] = useState(false)
    const [membershipShown, setMembershipShown] = useState(false)
    const [legislations, setLegislations] = useState<Legislations>("Statewide RTC")

    const mapClickHandler = (m: mapboxgl.Map, e: MapMouseEvent & EventData, legislations: Legislations) => {
        const district = e.features[0].properties.District
        const targetPolygon = turf.polygon(e.features[0].geometry.coordinates)
        const targetCentroid = turf.centroid(targetPolygon).geometry.coordinates

        if (e.features[0].properties["HCMC support"].includes(legislations)) {
            m.setPaintProperty("districts", "fill-opacity", [
                "case",
                ["all", ["==", ["get", "District"], district], ["in", legislations, ["get", "HCMC support"]]],
                .9,
                ["in", legislations, ["get", "HCMC support"]],
                .4,
                0
            ])
            m.setPaintProperty("pattern_rep", "fill-opacity", [
                "case",
                ["all", ["==", ["get", "Party_x"], "Republican"], ["!", ["in", legislations, ["get", "HCMC support"]]]],
                .1, 0
            ])

            m.setPaintProperty("pattern_demo", "fill-opacity", [
                "case",
                ["all", ["==", ["get", "Party_x"], "Democratic"], ["!", ["in", legislations, ["get", "HCMC support"]]]],
                .1, 0
            ])
        }

        if (e.features[0].properties.Party_x === "Republican" && !e.features[0].properties["HCMC support"].includes(legislations)) {
            m.setPaintProperty("districts", "fill-opacity", [
                "case",
                ["in", legislations, ["get", "HCMC support"]],
                .4, 0
            ])
            m.setPaintProperty("pattern_rep", "fill-opacity", [
                "case",
                ["all", ["==", ["get", "District"], district], ["==", ["get", "Party_x"], "Republican"]],
                .5,
                ["all", ["==", ["get", "Party_x"], "Republican"], ["!", ["in", legislations, ["get", "HCMC support"]]]],
                .1, 0
            ])

            m.setPaintProperty("pattern_demo", "fill-opacity", [
                "case",
                ["all", ["==", ["get", "Party_x"], "Democratic"], ["!", ["in", legislations, ["get", "HCMC support"]]]],
                .1, 0
            ])

        }

        if (e.features[0].properties.Party_x === "Democratic" && !e.features[0].properties["HCMC support"].includes(legislations)) {
            console.log('a')
            m.setPaintProperty("districts", "fill-opacity", [
                "case",
                ["in", legislations, ["get", "HCMC support"]],
                .4, 0
            ])
            m.setPaintProperty("pattern_rep", "fill-opacity", [
                "case",
                ["all", ["==", ["get", "Party_x"], "Republican"], ["!", ["in", legislations, ["get", "HCMC support"]]]],
                .1, 0
            ])

            m.setPaintProperty("pattern_demo", "fill-opacity", [
                "case",
                ["all", ["==", ["get", "District"], district]],
                .5,
                ["all", ["==", ["get", "Party_x"], "Democratic"], ["!", ["in", legislations, ["get", "HCMC support"]]]],
                .1, 0
            ])

        }
        setGeopanelShown(true)
        m.flyTo({
            center: targetCentroid as [number, number],
            zoom: 6.9
        })
    }

    const defaultMapHandler = () => {
        map?.setPaintProperty("districts", "fill-opacity", [
            "case",
            ["in", `${legislations}`, ["get", "HCMC support"]],
            1, 0
        ])
        map?.setPaintProperty("pattern_rep", "fill-opacity", [
            "case",
            ["all", ["==", ["get", "Party_x"], "Republican"], ["!", ["in", legislations, ["get", "HCMC support"]]]],
            0.2, 0
        ]
        )
        map?.setPaintProperty("pattern_demo", "fill-opacity", [
            "case",
            ["all", ["==", ["get", "Party_x"], "Democratic"], ["!", ["in", legislations, ["get", "HCMC support"]]]],
            .2, 0
        ])

        map?.flyTo({
            center: [-78.5, 43.05] as [number, number],
            zoom: -6.25
        })

        //                         {/* @ts-ignore */}
        // map?.getSource("hoveredArea").setData({
        //     type: "FeatureCollection",
        //     features: [],
        // })

        setGeopanelShown(false)
    }

    




    return <MapContext.Provider value={{ map, setMap, districts, setDistricts, membershipShown, setMembershipShown, geopanelShown, setGeopanelShown, legislations, setLegislations, mapClickHandler, defaultMapHandler }}>
        {children}
    </MapContext.Provider>
}

export { MapContext, MapProvider }