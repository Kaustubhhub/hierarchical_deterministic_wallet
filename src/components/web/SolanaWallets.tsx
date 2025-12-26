import { Keypair } from "@solana/web3.js";
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { useState } from "react"
import nacl from "tweetnacl";
import { buttonVariants } from "../ui/button";
import DialogDemo from "./solWalletDialog";

interface props {
    mneumonics: string
}

const SolanaWallets = ({ mneumonics }: props) => {
    const [index, setIndex] = useState(0);
    const [publicKeys, setPublicKeys] = useState<Keypair[]>([]);

    const addNewSolanaWallet = async () => {
        const seed = await mnemonicToSeed(mneumonics)
        const path = `m/44'/501'/${index}'/0'`;
        const deriveSeed = derivePath(path, seed.toString('hex')).key
        const secret = nacl.sign.keyPair.fromSeed(deriveSeed).secretKey;
        const keypair = Keypair.fromSecretKey(secret);
        setIndex(index + 1)
        setPublicKeys([...publicKeys, keypair]);
    }

    return (
        <div className="border rounded my-4 py-4">
            <div className="flex px-2 justify-between items-center">
                <h3 className="font-bold text-xl ">Sol Wallets</h3>
                <button className={buttonVariants({ variant: "secondary" })} onClick={addNewSolanaWallet} disabled={mneumonics == ""}>Add wallet</button>
            </div>
            {publicKeys.map((obj, idx) => (
                <DialogDemo walletDetail={obj}>
                    <div key={idx} className="cursor-pointer rounded flex justify-between border m-2 h-10 items-center p-2 hover:border-amber-50 hover:scale-101 transition-all duration-300">
                        <p> Wallet {idx + 1}</p>
                        <p className="text-muted-foreground text-xs">{obj.publicKey.toString()}</p>
                    </div>
                </DialogDemo>
            ))
            }
        </div >
    )
}

export default SolanaWallets