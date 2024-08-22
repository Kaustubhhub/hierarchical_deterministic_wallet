
import { generateMnemonic } from 'bip39'
import { useState } from 'react'

const WalletGenerator = () => {
    const [mnemonics, setMnemonics] = useState('')
    const [isOpen, setIsOpen] = useState(true);
    const [isToastVisible, setIsToastVisible] = useState(false);

    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };
    const generateMnemonics = () => {
        const generatedMnemonics = generateMnemonic();
        console.log('generatedMnemonics', typeof generatedMnemonics);
        setMnemonics(generatedMnemonics)
    }
    const copyMnemonics = () => {
        navigator.clipboard.writeText(mnemonics).then(() => {
            setIsToastVisible(true);
            setTimeout(() => {
                setIsToastVisible(false);
            }, 3000); // Hide toast after 3 seconds
        });
    };
    return (
        <div className='flex  flex-col items-center justify-center p-4'>
            <button
                onClick={generateMnemonics}
                type="button"
                className="text-white bg-purple-700 hover:bg-purple-800 focus:outline-none  font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:bg-purple-600 dark:hover:bg-purple-700">
                Generate Mnemonics
            </button>
            {mnemonics === '' &&
                <div>
                    click Generate Mnemonics button
                </div>
            }
            {mnemonics !== '' &&
                <div
                    className='w-7/12'
                    id="accordion-collapse"
                    data-accordion="collapse"
                    aria-expanded={isOpen}
                    aria-controls="accordion-collapse-body-1"
                >
                    <h2 id="accordion-collapse-heading-1">
                        <button
                            type="button"
                            className="flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-gray-200 rounded-t-xl"
                            onClick={toggleAccordion}
                            aria-expanded={isOpen}
                            aria-controls="accordion-collapse-body-1"
                        >
                            <span>Generated Mnemonics</span>
                            <svg
                                data-accordion-icon
                                className={`w-3 h-3 ${isOpen ? 'rotate-180' : ''} shrink-0`}
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 10 6"
                            >
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5 5 1 1 5" />
                            </svg>
                        </button>
                    </h2>
                    <div
                        id="accordion-collapse-body-1"
                        className={`border border-t-0 transition-all duration-300 ${isOpen ? 'block' : 'hidden'}`}
                        aria-labelledby="accordion-collapse-heading-1"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="grid grid-cols-4 p-3 gap-4">
                            {mnemonics.split(' ').map((item, index) => (
                                <div key={index} className="p-2 border rounded-md text-center">
                                    {item}
                                </div>
                            ))}
                        </div>
                        <div className='flex justify-end items-end p-2'>
                            <button
                                onClick={copyMnemonics}
                                type="button"
                                className="items-center text-white bg-purple-700 hover:bg-purple-800 focus:outline-none font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:bg-purple-600 dark:hover:bg-purple-700"
                            >
                                Copy
                            </button>
                        </div>
                    </div>
                </div>
            }
            {isToastVisible && (
                <div
                    id="toast-default"
                    className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex items-center w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
                    role="alert"
                >
                    <div className="ms-3 text-sm font-normal">Mnemonic copied to clipboard!</div>
                    <button
                        type="button"
                        className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
                        onClick={() => setIsToastVisible(false)}
                        aria-label="Close"
                    >
                        <span className="sr-only">Close</span>
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    )
}

export default WalletGenerator
