"use client"
import React, { useState } from 'react'
import Split from 'react-split'
import ProblemDesc from './ProblemDesc'
import Code from './Code'

export default function WorkSpace({ problemType }) {
    const [themeType, setTheme] = useState("Copilot");
    const [selectedTab, setSelectedTab] = useState("Description");
    const [output, setOutput] = useState("");
    const [codeError, setCodeError] = useState(false);
    const [customInput, setCustomInput] = useState('');
    const [AllTestCase, setAllTestCases] = useState([]);
    const [AllExpectedOP, setAllExpectedOP] = useState([]);
    const [enrollment, setEnrollment] = useState();
    const [solved, setSolved] = useState(false);
    const [executing, setExecuting] = useState(false);

    return (
        <section className='workSpace p-2'>
            <Split className='split h-full' sizes={[40, 60]} minSize={[400, 500]}>
                <ProblemDesc problemType={problemType} themeType={themeType} selectedTab={selectedTab} setSelectedTab={setSelectedTab} output={output} codeError={codeError} setCustomInput={setCustomInput} setAllExpectedOP={setAllExpectedOP} setAllTestCases={setAllTestCases} enrollment={enrollment} setEnrollment={setEnrollment} solved={solved} setSolved={setSolved} executing={executing} />
                <Code problemType={problemType} themeType={themeType} setTheme={setTheme} setSelectedTab={setSelectedTab} setOutput={setOutput} setCodeError={setCodeError} customInput={customInput} AllExpectedOP={AllExpectedOP} AllTestCase={AllTestCase} enrollment={enrollment} setSolved={setSolved} executing={executing} setExecuting={setExecuting} />
            </Split>
        </section>
    )
}
