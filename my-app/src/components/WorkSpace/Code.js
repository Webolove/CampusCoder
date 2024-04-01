
import React, { useEffect, useState } from 'react'
import CodeTopBar from './CodeTopBar';
import CodeMirror from '@uiw/react-codemirror'
import { githubDark } from '@uiw/codemirror-theme-github'
import { copilot } from '@uiw/codemirror-theme-copilot'
import { solarizedDark } from '@uiw/codemirror-theme-solarized';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { cpp } from '@codemirror/lang-cpp'
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/firebase';


export default function Code({ problemType, themeType, setTheme, setSelectedTab, setOutput, setCodeError, customInput, AllExpectedOP, AllTestCase, enrollment, setSolved, executing, setExecuting }) {
    const [codeLang, setCodeLang] = useState("");
    const languages = ["C++", "Java", "Python"];
    const [userCode, setUserCode] = useState("");
    const [user] = useAuthState(auth);
    const [fonts, setFonts] = useState("16px");

    useEffect(() => {
        const storedFormType = localStorage.getItem('langType');
        if (storedFormType != undefined)
            setCodeLang(JSON.parse(storedFormType));

        const localFonts = localStorage.getItem('CC-fonts');
        if (localFonts)
            setFonts(JSON.parse(localFonts));
    }, [])

    const [settings, setSettings] = useState({
        fontSize: fonts,
        settingModelIsOpen: false,
        dropdownIsOpen: false
    })

    useEffect(() => {

        if (codeLang != "")
            localStorage.setItem('langType', JSON.stringify(codeLang))

        const code = localStorage.getItem(`${codeLang}-${problemType}`)
        if (user && code)
            setUserCode(JSON.parse(code));
        else
            setUserCode("")
    }, [user, codeLang])

    const handleCodeChange = (value) => {
        setUserCode(value);
        localStorage.setItem(`${codeLang}-${problemType}`, JSON.stringify(value))
    }

    return (
        <div className='p-2 h-full w-full'>
            <div className={`flex flex-col place-items-start justify-between rounded-xl text-white h-full overflow-hidden ${themeType == "Copilot" ? "bg-[#232b2e]" : themeType == "Github-Dark" ? "bg-[#0d1117]" : themeType == "Solarized" ? "bg-[#012b37]" : "bg-[#1e1f1f]"}`}>
                <CodeTopBar formType={`${codeLang == "" ? "C++" : codeLang}`} setFormType={setCodeLang} formss={languages} theme={"dark"} settings={settings} setSettings={setSettings} themeType={themeType} setTheme={setTheme} setSelectedTab={setSelectedTab} userCode={userCode} setOutput={setOutput} setCodeError={setCodeError} customInput={customInput} AllTestCase={AllTestCase} AllExpectedOP={AllExpectedOP} enrollment={enrollment} problemType={problemType} setSolved={setSolved} executing={executing} setExecuting={setExecuting} />
                <div className='overflow-scroll w-full h-full'>
                    <CodeMirror
                        value={userCode}
                        onChange={handleCodeChange}
                        theme={themeType == "Copilot" ? copilot : themeType == "Github-Dark" ? githubDark : themeType == "Solarized" ? solarizedDark : vscodeDark}
                        extensions={codeLang == "C++" ? [cpp()] : codeLang == "Python" ? [python()] : [java()]}
                        style={{ fontSize: settings.fontSize }}
                    />
                </div>
            </div>
        </div>
    )
}
