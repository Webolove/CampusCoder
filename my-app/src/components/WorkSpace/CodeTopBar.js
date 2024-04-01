import React, { useState } from 'react'
import CustomDropDown from '../CustomDropDown'
import { IoSettingsOutline } from "react-icons/io5";
import SettingsModal from '../SettingModel';
import SubmitBtn from './SubmitBtn';

export default function CodeTopBar({ formType, setFormType, formss, theme, settings, setSettings, themeType, setTheme, setSelectedTab, userCode, setOutput, setCodeError, customInput, AllTestCase, AllExpectedOP, enrollment, problemType, setSolved, executing, setExecuting }) {
    


    // handleRun is used for custom testCases
    const handleRun = async () => {
        try {
            setExecuting(true);
            const res = await fetch('http://localhost:8000/compile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code: userCode, language: formType, input: customInput }),
            }).then(response => {
                if (!response.ok) {
                    setCodeError(true);
                } else
                    setCodeError(false);
                return response.json();
            }).then(data => {
                {
                    if (data.hasOwnProperty('error'))
                        setOutput(data.error + '\n' + data.message);
                    else
                        setOutput(data.output);
                }
            }).catch(error => {
                console.error('Fetch error:', error);
            });

            console.log(res);
            setExecuting(false);
        } catch (e) {
            console.log("error occ ", e)
        }
    }

    return (
        <div className='flex place-items-center justify-between p-2 w-full bg-zinc-600'>
            <CustomDropDown formType={formType} setFormType={setFormType} formss={formss} theme={theme} />
            <div className={`flex place-items-center justify-between w-fit px-2 space-x-2 ${executing && "hidden"}`}>
                <div className='w-fit px-2 py-1 bg-zinc-600 hover:bg-zinc-500 shadow-lg shadow-gray-700 transition-all duration-300 rounded-xl cursor-pointer' onClick={() => { setSelectedTab("Output"); handleRun(); }}>
                    Run
                </div>

                <div className='h-[22px] w-2px border border-white'></div>


                <SubmitBtn formType={formType} setSelectedTab={setSelectedTab} userCode={userCode} setOutput={setOutput} setCodeError={setCodeError} AllTestCase={AllTestCase} AllExpectedOP={AllExpectedOP} enrollment={enrollment} problemType={problemType} setExecuting={setExecuting} setSolved={setSolved} />
            </div>
            <div className={`custom-loader-executing ${!executing && "hidden"}`}></div>

            <div className='text-white cursor-pointer' onClick={() => { setSettings({ ...settings, settingModelIsOpen: true }) }}>
                <IoSettingsOutline fontSize={23} />
            </div>

            {settings.settingModelIsOpen && <SettingsModal settings={settings} setSettings={setSettings} themeType={themeType} setTheme={setTheme} />}
        </div>
    )
}
