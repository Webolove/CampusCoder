import React, { useState } from 'react'
import { BsChevronDown, BsCheckLg } from "react-icons/bs"

export default function CustomDropDown({ formType, setFormType, formss, theme }) {
    const [dropDownOpen, setDropDownOpen] = useState(false);

    const handleClickDropdown = () => {
        setDropDownOpen(!dropDownOpen);
    }

    return (
        <div className='w-[170px]'>
            <div className='relative full'>
                <div className='flex place-items-center justify-between'>
                    <button
                        onClick={handleClickDropdown}
                        className={`flex cursor-pointer items-center rounded-lg px-3 py-1.5 text-left focus:outline-none whitespace-nowrap ${theme == "dark" ? "bg-slate-800 hover:bg-slate-700 hover:ring-1 hover:ring-white active:bg-slate-700" : "bg-white hover:bg-[#ebe6e6] active:bg-[#e6e6eb]"} trasition-all duration-300 w-[170px] justify-between`}
                    type='button'
                    >
                    {formType}
                    <BsChevronDown />
                </button>
            </div>

            {dropDownOpen && (
                <ul
                    className={`absolute mt-1 max-h-56 overflow-auto rounded-lg p-2 z-50 focus:outline-none shadow-lg w-full ${theme == "dark" ? "bg-neutral-600" : "bg-[#f0f0f5]"}`}
                    style={{
                        filter: "drop-shadow(rgba(0, 0, 0, 0.04) 0px 1px 3px) drop-shadow(rgba(0, 0, 0, 0.12) 0px 6px 16px)",
                    }}
                >
                    {formss.map((formtypes, idx) => (
                        <SettingsListItem
                            key={idx}
                            formtypes={formtypes}
                            selectedOption={formType}
                            setDropDownOpen={setDropDownOpen}
                            handleFormTypeChange={(formtype) => {
                                setFormType(formtype);
                            }}
                        />
                    ))}
                </ul>
            )}
        </div>
        </div >
    )
}


const SettingsListItem = ({ formtypes, selectedOption, setDropDownOpen, handleFormTypeChange }) => {
    return (
        <li className='relative flex h-8 cursor-pointer select-none py-1.5 pl-2 text-label-2 dark:text-dark-label-2 hover:bg-dark-fill-3 rounded-lg'>
            <div
                className={`flex h-5 flex-1 items-center pr-2 ${selectedOption === formtypes ? "font-medium" : ""}`}
                onClick={() => { handleFormTypeChange(formtypes); setDropDownOpen(false) }}
            >
                <div className='whitespace-nowrap'>{formtypes}</div>
            </div>
            <span
                className={`text-blue dark:text-dark-blue flex items-center pr-2 ${selectedOption === formtypes ? "visible" : "invisible"
                    }`}
            >
                <BsCheckLg />
            </span>
        </li>
    );
};
