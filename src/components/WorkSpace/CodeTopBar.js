import React from 'react'
import CustomDropDown from '../CustomDropDown'
import { IoSettingsOutline } from "react-icons/io5";
import SettingsModal from '../SettingModel';

export default function CodeTopBar({ formType, setFormType, formss, theme, settings, setSettings, themeType, setTheme, setSelectedTab }) {
    return (
        <div className='flex place-items-center justify-between p-2 w-full bg-zinc-600'>
            <CustomDropDown formType={formType} setFormType={setFormType} formss={formss} theme={theme} />
            <div className='flex place-items-center justify-between w-fit px-2 space-x-2'>
                <div className='w-fit px-2 py-1 bg-zinc-600 hover:bg-zinc-500 shadow-lg shadow-gray-700 transition-all duration-300 rounded-xl cursor-pointer' onClick={()=>{setSelectedTab("Output")}}>
                    Run
                </div>

                <div className='h-[22px] w-2px border border-white'></div>

                <div className='w-fit px-2 py-1 bg-zinc-600 hover:bg-zinc-500 shadow-lg shadow-gray-700 transition-all duration-300 rounded-xl cursor-pointer' onClick={()=>{setSelectedTab("Output")}}>
                    Submit
                </div>
            </div>
            <div className='text-white cursor-pointer' onClick={() => { setSettings({ ...settings, settingModelIsOpen: true }) }}>
                <IoSettingsOutline fontSize={23} />
            </div>

            {settings.settingModelIsOpen && <SettingsModal settings={settings} setSettings={setSettings} themeType={themeType} setTheme={setTheme} />}
        </div>
    )
}
