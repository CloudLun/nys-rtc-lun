import React, { useState } from 'react'

import { XMarkIcon } from '@heroicons/react/24/solid'

const Geopanel = () => {

    const [panelShown, setPanelShown] = useState(false)
    const panelClickHandler = (b: boolean) => {
        setPanelShown(b)
    }

    return (
        <>
            {panelShown && (
                <div className='flex flex-col absolute top-0 right-0 w-[12%] h-full z-20'>
                    <div className='flex items-start justify-between p-[18px]  w-full bg-demo_1'>
                        <div>
                            <div className='text-label'>New York State Senate</div>
                            <div className='font-bold text-subheadline'>District 48</div>
                        </div>
                        <XMarkIcon className=' w-[20px] h-[20px] text-white cursor-pointer' onClick={() => panelClickHandler(false)} />
                    </div>
                    <div className='flex-1 px-[18px] w-full bg-white'>
                        <div className='py-[18px]'>
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
                            <div className='text-[10px] text-regular text-grey_1'>District General Info</div>
                            <div className="flex flex-col gap-[16px] mt-[6px] text-rtc_navy">
                                <div className="flex items-center gap-[12px]">
                                    <img src="/icons/person.svg" alt="" className="w-[16px] h-[16px]" />
                                    <div className="w-[120px] font-regular text-label text-demo_1"><span className='font-bold'>Rachel May</span><br /> Democrat</div>
                                </div>
                                <div className="flex items-center gap-[12px]">
                                    <img src="/icons/apartment.svg" alt="" className="w-[16px] h-[16px]" />
                                    <div className="w-[120px] font-regular text-label">361 Main Street (Catskill Mill Storefront) Catskill, NY 12414</div>
                                </div>
                                <div className="flex items-center gap-[12px]">
                                    <img src="/icons/phone.svg" alt="" className="w-[16px] h-[16px]" />
                                    <div className="font-regular text-label">519-291-9415</div>
                                </div>
                                <div className="flex items-center gap-[12px]">
                                    <img src="/icons/email.svg" alt="" className="w-[16px] h-[16px]" />
                                    <div className="font-regular text-label">may@nysenate.gov</div>
                                </div>
                            </div>
                            <div className='my-[12px] w-full h-[1px] bg-grey_1'></div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )

}

export default Geopanel

