import { mnemonicToSeed } from "bip39";
import { Wallet } from "ethers";
import { HDNodeWallet } from "ethers";
import { useState } from "react";
import { buttonVariants } from "../ui/button";

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
        <div className="border">
            <div className="flex justify-around items-center">
                <h3>Eth Wallets</h3>
                <button className={buttonVariants()} disabled={mneumonics == ""} onClick={addEthWallet}>Add wallet</button>
            </div>
            {publicKeys.map((obj, idx) => (
                <div key={idx}>
                    Eth Wallet Add : {obj.address}
                </div>
            ))}
        </div>
    )
}

export default EthWallets