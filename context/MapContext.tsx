"use client";
import { createContext, useState, Dispatch, SetStateAction, ReactNode, } from "react";

import mapboxgl, { EventData, MapMouseEvent } from 'mapbox-gl';

import * as turf from "@turf/turf";

export type MapContextType = {
    map: mapboxgl.Map | null,
    setMap: Dispatch<SetStateAction<mapboxgl.Map | null>>
    districts: Districts
    setDistricts: Dispatch<SetStateAction<Districts>>
    membershipShown: boolean
    setMembershipShown: Dispatch<SetStateAction<boolean>>
    memberpanelShown: boolean
    setMemberpanelShown: Dispatch<SetStateAction<boolean>>
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
    const [geopanelShown, setGeopanelShown] = useState(false)
    const [membershipShown, setMembershipShown] = useState(false)
    const [legislations, setLegislations] = useState<Legislations>("Statewide RTC")
    const [memberpanelShown, setMemberpanelShown] = useState(false)

    const mapClickHandler = (m: mapboxgl.Map, e: MapMouseEvent & EventData, legislations: Legislations) => {

        const district = e.features[0].properties.District

        if (e.features[0].properties["HCMC support"].includes(legislations)) {
            m.setPaintProperty("districts", "fill-opacity", [
                "case",
                ["all", ["==", ["get", "District"], district], ["in", legislations, ["get", "HCMC support"]]],
                .75,
                ["in", legislations, ["get", "HCMC support"]],
                .1,
                0
            ])
            m.setPaintProperty("pattern_rep", "fill-opacity", [
                "case",
                ["all", ["==", ["get", "Party_x"], "Republican"], ["!", ["in", legislations, ["get", "HCMC support"]]]],
                .25, 0
            ])

            m.setPaintProperty("pattern_demo", "fill-opacity", [
                "case",
                ["all", ["==", ["get", "Party_x"], "Democratic"], ["!", ["in", legislations, ["get", "HCMC support"]]]],
                .25, 0
            ])
        }

        if (e.features[0].properties.Party_x === "Republican" && !e.features[0].properties["HCMC support"].includes(legislations)) {
            m.setPaintProperty("districts", "fill-opacity", [
                "case",
                ["in", legislations, ["get", "HCMC support"]],
                .1, 0
            ])
            m.setPaintProperty("pattern_rep", "fill-opacity", [
                "case",
                ["all", ["==", ["get", "District"], district], ["==", ["get", "Party_x"], "Republican"]],
                .75,
                ["all", ["==", ["get", "Party_x"], "Republican"], ["!", ["in", legislations, ["get", "HCMC support"]]]],
                .25, 0
            ])

            m.setPaintProperty("pattern_demo", "fill-opacity", [
                "case",
                ["all", ["==", ["get", "Party_x"], "Democratic"], ["!", ["in", legislations, ["get", "HCMC support"]]]],
                .25, 0
            ])

        }

        if (e.features[0].properties.Party_x === "Democratic" && !e.features[0].properties["HCMC support"].includes(legislations)) {
            m.setPaintProperty("districts", "fill-opacity", [
                "case",
                ["in", legislations, ["get", "HCMC support"]],
                .1, 0
            ])
            m.setPaintProperty("pattern_rep", "fill-opacity", [
                "case",
                ["all", ["==", ["get", "Party_x"], "Republican"], ["!", ["in", legislations, ["get", "HCMC support"]]]],
                .25, 0
            ])

            m.setPaintProperty("pattern_demo", "fill-opacity", [
                "case",
                ["all", ["==", ["get", "District"], district]],
                .75,
                ["all", ["==", ["get", "Party_x"], "Democratic"], ["!", ["in", legislations, ["get", "HCMC support"]]]],
                .25, 0
            ])

        }


        let coordinatesArray = e.features[0].geometry.coordinates[0]
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
                        "label": "District " + e.features[0].properties.District.toString(),
                        "party": e.features[0].properties.Party_x
                    },
                    "geometry": {
                        'type': 'Point',
                        'coordinates': targetCentroid
                    }
                }
            ]
        }

        /* @ts-ignore */
        m.getSource("district_label").setData({
            type: "FeatureCollection",
            features: labelData.features as GeoJson["features"]
        })

        map?.setPaintProperty("district_label", "text-opacity", 1)

        /* @ts-ignore */
        map?.getSource("click_area").setData({
            type: "FeatureCollection",
            features: []
        })

        /* @ts-ignore */
        map?.getSource("click_label").setData({
            type: "FeatureCollection",
            features: []
        })


        m.flyTo({
            center: targetCentroid as [number, number],
            zoom: 6.9
        })

        setGeopanelShown(true)

    }

    const defaultMapHandler = () => {
        map?.setPaintProperty("districts", "fill-opacity", [
            "case",
            ["in", `${legislations}`, ["get", "HCMC support"]],
            .75, 0
        ])
        map?.setPaintProperty("pattern_rep", "fill-opacity", [
            "case",
            ["all", ["==", ["get", "Party_x"], "Republican"], ["!", ["in", legislations, ["get", "HCMC support"]]]],
            .5, 0
        ]
        )
        map?.setPaintProperty("pattern_demo", "fill-opacity", [
            "case",
            ["all", ["==", ["get", "Party_x"], "Democratic"], ["!", ["in", legislations, ["get", "HCMC support"]]]],
            .5, 0
        ])

        map?.flyTo({
            center: [-78.5, 43.05] as [number, number],
            zoom: -6.25
        })

        /* @ts-ignore */
        map?.getSource("click_area").setData({
            type: "FeatureCollection",
            features: []
        })

        /* @ts-ignore */
        map?.getSource("click_label").setData({
            type: "FeatureCollection",
            features: []
        })

        /* @ts-ignore */
        map?.getSource("district_label").setData({
            type: "FeatureCollection",
            features: []
        })

        setGeopanelShown(false)
    }






    return <MapContext.Provider value={{ map, setMap, districts, setDistricts, membershipShown, setMembershipShown, geopanelShown, setGeopanelShown,memberpanelShown, setMemberpanelShown  ,legislations, setLegislations, mapClickHandler, defaultMapHandler }}>
        {children}
    </MapContext.Provider>
}

export { MapContext, MapProvider }