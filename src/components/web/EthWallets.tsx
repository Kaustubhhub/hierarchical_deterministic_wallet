import { mnemonicToSeed } from "bip39";
import { Wallet } from "ethers";
import { HDNodeWallet } from "ethers";
import { useState } from "react";
import { buttonVariants } from "../ui/button";
import EthDialogDemo from "./ethWalletDialog";

interface props {
    mneumonics: string
}
const EthWallets = ({ mneumonics }: props) => {
    const [index, setIndex] = useState(0);
    const [publicKeys, setPublicKeys] = useState<Wallet[]>([]);

    const addEthWallet = async () => {
        const seed = await mnemonicToSeed(mneumonics);
        const derivationPath = `m/44'/60'/${index}'/0'`;
        const hdNode = HDNodeWallet.fromSeed(seed);
        const child = hdNode.derivePath(derivationPath);
        const privateKey = child.privateKey;
        const wallet = new Wallet(privateKey);
        setIndex(index + 1);
        setPublicKeys([...publicKeys, wallet]);
    }

    return (
        <div className="border rounded my-4 py-4 px-4">
            <div className="flex justify-between items-center">
                <h3 className="font-bold text-xl">Eth Wallets</h3>
                <button className={buttonVariants({ variant: "secondary" })} disabled={mneumonics == ""} onClick={addEthWallet}>Add wallet</button>
            </div>
            {publicKeys.map((obj, idx) => (
                <EthDialogDemo walletDetail={obj}>
                    <div className="cursor-pointer rounded flex justify-between border my-2 h-10 items-center p-2 hover:border-amber-50 hover:scale-101 transition-all duration-300">
                        <p> Wallet {idx + 1}</p>
                        <p className="text-muted-foreground text-xs">{obj.address}</p>
                    </div>
                </EthDialogDemo>
            ))}
        </div>
    )
}

export default EthWallets