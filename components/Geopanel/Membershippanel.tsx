// import React, { useContext, MouseEvent } from 'react'

// import { XMarkIcon } from '@heroicons/react/24/solid'
// import { MapContext, MapContextType } from '@/context/MapContext'
// import GeoInfoBtns from './GeoInfoBtns'


// import organizations from "../../public/rtc_members.geo.json"

// import * as turf from "@turf/turf";


// const Membershippanel = () => {

//     const { map, districts, memberpanelShown, defaultMapHandler } = useContext(MapContext) as MapContextType


//     return (
//         <>
//             {memberpanelShown && (
//                 <div className='flex flex-col absolute top-0 right-0 w-[14%] h-full z-20 overflow-y-scroll'>
//                     <div className={`flex items-start justify-between p-[18px] w-full bg-rtc_purple`}>

//                         <XMarkIcon className=' w-[20px] h-[20px] text-white cursor-pointer' onClick={defaultMapHandler} />
//                     </div>
//                     <div className='flex-1 p-[18px] w-full bg-white'>
//                         <div className='text-[10px] text-regular text-grey_1'>HCMC Campaign Support</div>
//                         <div className="flex flex-col gap-[5px] mt-[6px] text-rtc_navy">
//                             <div className="flex items-center gap-[5px] ">
//                                 {/* @ts-ignore */}
//                                 <img src={selectedDistrictFeatures?.properties!["HCMC support"].includes("Statewide RTC") ? "/icons/checked.svg" : "/icons/empty.svg"} alt="" className="w-[16px] h-[16px]" />
//                                 <div className="font-bold text-label">Statewide RTC</div>
//                             </div>
//                             <div className="flex items-center gap-[5px]">
//                                 {/* @ts-ignore */}
//                                 <img src={selectedDistrictFeatures?.properties!["HCMC support"].includes("Winter Eviction Moratorium") ? "/icons/checked.svg" : "/icons/empty.svg"} alt="" className="w-[16px] h-[16px]" />
//                                 <div className="font-bold text-label">Winter Eviction Moratorium</div>
//                             </div>
//                             <div className="flex items-center gap-[5px]">
//                                 {/* @ts-ignore */}
//                                 <img src={selectedDistrictFeatures?.properties!["HCMC support"].includes("Defend RTC") ? "/icons/checked.svg" : "/icons/empty.svg"} alt="" className="w-[16px] h-[16px]" />
//                                 <div className="font-bold text-label">Defend RTC</div>
//                             </div>
//                             <div className="flex items-center gap-[5px]">
//                                 {/* @ts-ignore */}
//                                 <img src={selectedDistrictFeatures?.properties!["HCMC support"].includes("Fund Local Law 53") ? "/icons/checked.svg" : "/icons/empty.svg"} alt="" className="w-[16px] h-[16px]" />
//                                 <div className="font-bold text-label">Power to Organize:<br /> Fund Local Law 53</div>
//                             </div>
//                         </div>
//                         <div className='my-[12px] w-full h-[1px] bg-grey_1'></div>
//                         <div className='text-[10px] text-regular text-grey_1'>Right to Counsel NYC Coalition
//                             Membership General Information
//                         </div>
//                         <div className="flex flex-col gap-[16px] mt-[6px] text-rtc_navy">
//                             {
//                                 (selectedDistrictFeatures?.properties.Address) !== undefined &&
//                                 <div className="flex items-center gap-[12px]">
//                                     <img src="/icons/apartment.svg" alt="" className="w-[16px] h-[16px]" />
//                                     <div className="w-[120px] font-regular text-label">{selectedDistrictFeatures?.properties.Address}</div>
//                                 </div>
//                             }
//                             <div className="flex items-center gap-[12px]">
//                                 <img src="/icons/phone.svg" alt="" className="w-[16px] h-[16px]" />
//                                 <div className="font-regular text-label">{selectedDistrictFeatures?.properties.Phone}</div>
//                             </div>
//                             {
//                                 (selectedDistrictFeatures?.properties.email) !== undefined &&
//                                 (
//                                     <div className="flex items-center gap-[12px]">
//                                         <img src="/icons/email.svg" alt="" className="w-[16px] h-[16px]" />
//                                         <div className="font-regular text-label">{selectedDistrictFeatures?.properties.email}</div>
//                                     </div>
//                                 )
//                             }
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </>
//     )
// }

// export default Membershippanel