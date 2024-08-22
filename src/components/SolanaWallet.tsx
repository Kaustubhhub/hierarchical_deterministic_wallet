import { Keypair, PublicKey } from '@solana/web3.js';
import { mnemonicToSeed } from 'bip39';
import { derivePath } from 'ed25519-hd-key';
import React, { useEffect, useState } from 'react';
import nacl from "tweetnacl";

interface Wallet {
    publicKey: PublicKey;
    privateKey: string;
    mnemonic: string;
}

const SolanaWallet = ({ mnemonic }: { mnemonic: string }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    useEffect(() => {
        setWallets([]);
        setCurrentIndex(0);
    }, [mnemonic]);

    const addWallet = async () => {
        const seed = await mnemonicToSeed(mnemonic);
        const path = `m/44'/501'/${currentIndex}'/0'`;
        const derivedSeed = derivePath(path, seed.toString()).key;
        const keypair = nacl.sign.keyPair.fromSeed(derivedSeed);

        const publicKey = Keypair.fromSecretKey(keypair.secretKey).publicKey;
        const privateKey = Buffer.from(keypair.secretKey).toString('hex');

        setWallets([...wallets, { publicKey, privateKey, mnemonic }]);
        setCurrentIndex(currentIndex + 1);
    };

    if (!mnemonic) {
        return <div></div>;
    }

    return (
        <div className='p-4'>
            <div className='flex justify-between border p-2 rounded-lg'>
                <div className='flex items-center justify-center pr-10'>
                    Solana Wallets
                </div>
                <div className='flex items-center justify-center'>
                    <button
                        onClick={addWallet}
                        type="button"
                        className="text-white bg-purple-700 hover:bg-purple-800 focus:outline-none font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:bg-purple-600 dark:hover:bg-purple-700">
                        Add Wallet
                    </button>
                </div>
            </div>
            <div className='border'>
                {wallets.map((wallet, index) => (
                    <div key={wallet.publicKey.toBase58()} className='w-full'>
                        <h2 id={`accordion-collapse-heading-${index}`}>
                            <button
                                type="button"
                                className="flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-gray-200 rounded-t-xl"
                                onClick={() => toggleAccordion(index)}
                                aria-expanded={openIndex === index}
                                aria-controls={`accordion-collapse-body-${index}`}
                            >
                                <span>Wallet {index + 1}</span>
                                <svg
                                    data-accordion-icon
                                    className={`w-3 h-3 ${openIndex === index ? 'rotate-180' : ''} shrink-0`}
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
                            id={`accordion-collapse-body-${index}`}
                            className={`border border-t-0 transition-all duration-300 ${openIndex === index ? 'block' : 'hidden'}`}
                            aria-labelledby={`accordion-collapse-heading-${index}`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-3">
                                <div>
                                    <strong>Public Key:</strong> {wallet.publicKey.toBase58()}
                                </div>
                                <div>
                                    <strong>Private Key:</strong> {wallet.privateKey}
                                </div>
                                <div className='flex justify-end items-end p-2'>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(wallet.publicKey.toBase58());
                                            alert("Public Key copied to clipboard!");
                                        }}
                                        type="button"
                                        className="text-white bg-purple-700 hover:bg-purple-800 focus:outline-none font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:bg-purple-600 dark:hover:bg-purple-700"
                                    >
                                        Copy Public Key
                                    </button>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(wallet.privateKey);
                                            alert("Private Key copied to clipboard!");
                                        }}
                                        type="button"
                                        className="ml-2 text-white bg-red-700 hover:bg-red-800 focus:outline-none font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:bg-red-600 dark:hover:bg-red-700"
                                    >
                                        Copy Private Key
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SolanaWallet;
