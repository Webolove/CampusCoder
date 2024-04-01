import OutputSkeleton from '@/components/skeleton/OutputSkeleton';
import React, { useEffect, useState } from 'react'
import Split from 'react-split'

export default function Output({ testCase, testResult, output, codeError, setCustomInput, executing }) {
    const [textValue, setTextValue] = useState(testCase[0]);
    useEffect(() => {
        setCustomInput(textValue);
    }, [textValue]);

    return (
        <div className='w-full h-full'>
            <Split className='h-full'
                direction="vertical"
                sizes={[60, 40]}>
                <div className='w-full overflow-auto'>
                    <div className='flex flex-col'>
                        <div className='p-2 bg-zinc-600'>
                            <h3 className='tracking-wider text-bold'>Test Case</h3>
                        </div>
                        <div className='p-4'>
                            <p className='mb-2'>Custom input :</p>
                            <div className='rounded-2xl overflow-hidden h-[150px] border border-1 border-white'>
                                <textarea name="testCase" id="testCase" className='customInput w-full h-full resize-none p-3 bg-transparent focus:outline-none text-base' value={textValue} onChange={(event) => { setTextValue(event.target.value); }}></textarea>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='w-full overflow-auto'>
                    <div className='flex flex-col'>
                        <div className='p-2 bg-zinc-600'>
                            <h3 className='tracking-wider text-bold'>{executing ? <>Code in Execution..</> : <>Test Result</>}</h3>
                        </div>
                        {executing ? <div className='p-4 w-full'><OutputSkeleton /></div> : <div className={`p-4 w-full ${codeError ? "text-sm text-red-500" : "text-base"} output-container`}>
                            <div className='output-text'>
                                {output}
                            </div>
                        </div>}
                    </div>
                </div>
            </Split>
        </div>
    )
}
