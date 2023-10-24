"use client";
import { createContext, useState, Dispatch, SetStateAction, ReactNode, } from "react";


export type MapContextType = {
    map: mapboxgl.Map | null,
    setMap: Dispatch<SetStateAction<mapboxgl.Map | null>>
    districts: Districts
    setDistricts: Dispatch<SetStateAction<Districts>>
}

type Props = {
    children: ReactNode
}


const MapContext = createContext<MapContextType | null>(null)

const MapProvider = ({ children }: Props) => {
    const [map, setMap] = useState<mapboxgl.Map | null>(null)
    const [districts, setDistricts] = useState<Districts>("senate")
    return <MapContext.Provider value={{ map, setMap, districts, setDistricts }}>
        {children}
    </MapContext.Provider>
}

export { MapContext, MapProvider }