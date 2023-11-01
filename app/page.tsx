"use client";
import React, { useState, useEffect } from 'react';
import Map from '../components/Map/Map'
import Landing from '@/components/Landing';
import SidePanel from '@/components/SidePanel/SidePanel';
import Geopanel from '@/components/Geopanel/Geopanel';

import { MapProvider } from "../context/MapContext";


export default function Home() {

  const [geopanelShown, setGeopanelShown] = useState(false)

  return (
    <div className='relative w-[100vw] max-h-[100vh]'>
      <MapProvider >
        <SidePanel />
        <Map setGeopanelShown={setGeopanelShown} />
        <Geopanel geopanelShown={geopanelShown} setGeopanelShown={setGeopanelShown} />
      </MapProvider>
    </div>
  )
}
