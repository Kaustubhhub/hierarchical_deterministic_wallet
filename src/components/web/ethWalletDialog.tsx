import type React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button, buttonVariants } from "../ui/button";
import { CopyIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { toast } from "sonner";
import { useState } from "react";
import { ethers, type Wallet } from "ethers";

function EthDialogDemo({ children, walletDetail }: { children: React.ReactNode, walletDetail: Wallet }) {
    const ETH_URL = import.meta.env.VITE_ETHEREUM_DEV_URL;
    const [balance, setBalance] = useState<string>("****")
    const [recieverPubKey, setRecieverPubKey] = useState<string>("")
    const [amount, setAmount] = useState<string>()

    const handleCopy = async () => {
        await navigator.clipboard.writeText(walletDetail.address);
        toast.success("copied to clipboard!")
    }

    const showBalance = async () => {
        const body = {
            jsonrpc: "2.0",
            id: 1,
            method: "eth_getBalance",
            params: [walletDetail.address, "latest"]
        };

        try {
            const result = await fetch(ETH_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            const data = await result.json();
            const wei = Number(BigInt(data.result))
            setBalance(wei.toString())
            toast.success("Balance fetched.")
        } catch (error: any) {
            toast.error("Error fetching balance. Please try again later")
        }
    };

    const requestAirdrop = async () => {
        window.open("https://www.alchemy.com/faucets/ethereum-sepolia", "_blank");
    };

    const sendEthereum = async () => {
        try {
            if (!walletDetail?.privateKey) throw new Error("Wallet not loaded");
            if (!amount) {
                toast.error("Please input valid amount");
                return;
            }
            const provider = new ethers.JsonRpcProvider(ETH_URL);

            const wallet = new ethers.Wallet(walletDetail.privateKey, provider);

            const value = ethers.parseEther(amount);
            const tx = {
                to: recieverPubKey,
                value,
                gasLimit: 21000n
            };

            const response = await wallet.sendTransaction(tx);
            toast.loading("Transaction submitted...");
            const receipt = await response.wait(); // waits for confirmation
            if (!receipt) {
                toast.error("Failed");
                return
            }
            toast.success(`Transaction confirmed in block ${receipt.blockNumber}`);
        } catch (err: any) {
            console.error(err);
            toast.error("Transaction failed");
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Wallet Details</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Explore wallet functions
                </DialogDescription>
                <Button onClick={requestAirdrop} className={`cursor-pointer ${buttonVariants({ variant: "secondary" })}`}>request airdrop</Button>

                <div className="border rounded p-2 flex justify-between items-center transition-all duration-300 hover:border-amber-50">
                    <p className="text-muted-foreground">
                        {/* {walletDetail.publicKey.toString()} */}
                        {walletDetail.address}
                    </p>
                    <Button onClick={handleCopy} className={`cursor-pointer size-10 ${buttonVariants({ variant: "secondary" })}`}><CopyIcon /></Button>
                </div>

                <div className="flex justify-between items-center">
                    <p className="border w-8/12 p-2 rounded">{balance}</p>
                    <Button onClick={showBalance} className={`cursor-pointer ${buttonVariants({ variant: "secondary" })}`}>Show balance</Button>
                </div>

                <Separator />

                <h3>Transact Ethereum</h3>

                <Input onChange={(e) => {
                    setRecieverPubKey(e.target.value);
                }} className="w-8/12" placeholder="Enter recievers public key" />
                <div className="flex justify-between items-center">
                    <Input onChange={(e) => {
                        setAmount(e.target.value);
                    }} className="w-8/12 " />
                    <Button onClick={sendEthereum} className={`cursor-pointer w-3/12  ${buttonVariants({ variant: "secondary" })}`}>send ethereum</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default EthDialogDemo;