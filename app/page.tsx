"use client";
import React, { useState, useEffect } from 'react';
import Map from '../components/Map/Map'
import Landing from '@/components/Landing';
import SidePanel from '@/components/SidePanel/SidePanel';
import Geopanel from '@/components/Geopanel/Geopanel';

import { MapProvider } from "../context/MapContext";


export default function Home() {
  

  // useEffect(() => {

  //   d3.json("/rtc_members.json").then(data => {
  //     const dataGeoJson = data.map((d) => {
  //       return ({
  //         "type": "Feature",
  //         "properties": { ...d},
  //         "geometry": {
  //           "coordinates": [
  //             +d["lon"],
  //             +d["lat"]
  //           ],
  //           "type": "Point"
  //         }
  //       })
  //     })

  //     console.log(dataGeoJson)



  //   })
  // })


  return (
    <div className='relative w-[100vw] max-h-[100vh]'>
      <MapProvider >
        <SidePanel />
        <Map />
        <Geopanel />
      </MapProvider>
    </div>
  )
}
