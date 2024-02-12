"use client"
import React, { useState } from 'react'
import Split from 'react-split'
import ProblemDesc from './ProblemDesc'
import Code from './Code'

export default function WorkSpace({ problemType }) {
    const [themeType, setTheme] = useState("Copilot");
    const [selectedTab, setSelectedTab] = useState("Description");

    return (
        <section className='workSpace p-2'>
            <Split className='split h-full' sizes={[40, 60]} minSize={[400, 500]}>
                <ProblemDesc problemType={problemType} themeType={themeType} selectedTab={selectedTab} setSelectedTab={setSelectedTab}/>
                <Code problemType={problemType} themeType={themeType} setTheme={setTheme} setSelectedTab={setSelectedTab} />
            </Split>
        </section>
    )
}
