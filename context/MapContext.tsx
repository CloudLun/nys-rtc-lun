"use client";
import { createContext, useState, Dispatch, SetStateAction, ReactNode, } from "react";


import mapboxgl, { EventData, MapMouseEvent } from 'mapbox-gl';

export type MapContextType = {
    map: mapboxgl.Map | null,
    setMap: Dispatch<SetStateAction<mapboxgl.Map | null>>
    districts: Districts
    setDistricts: Dispatch<SetStateAction<Districts>>
    districtData: GeoJson["features"] | null
    setDistrictData: Dispatch<SetStateAction<GeoJson["features"] | null>>
    membershipShown: boolean
    setMembershipShown: Dispatch<SetStateAction<boolean>>
    legislations: Legislations
    setLegislations: Dispatch<SetStateAction<Legislations>>
    mapClickHandler: (m: mapboxgl.Map, e: MapMouseEvent & EventData, legislations: Legislations) => void
}

type Props = {
    children: ReactNode
}


const MapContext = createContext<MapContextType | null>(null)

const MapProvider = ({ children }: Props) => {




    const [map, setMap] = useState<mapboxgl.Map | null>(null)
    const [districts, setDistricts] = useState<Districts>("senate")
    const [districtData, setDistrictData] = useState<GeoJson["features"] | null>(null)
    const [membershipShown, setMembershipShown] = useState<boolean>(false)
    const [legislations, setLegislations] = useState<Legislations>("Statewide RTC")



    const mapClickHandler = (m: mapboxgl.Map, e: MapMouseEvent & EventData, legislations: Legislations) => {
        const district = e.features[0].properties.District
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
        // setGeopanelShown(true)
        setDistrictData(e.features[0])
    }




    return <MapContext.Provider value={{ map, setMap, districts, setDistricts, districtData, setDistrictData, membershipShown, setMembershipShown, legislations, setLegislations, mapClickHandler }}>
        {children}
    </MapContext.Provider>
}

export { MapContext, MapProvider }