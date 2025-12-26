import type React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { LAMPORTS_PER_SOL, type Keypair } from "@solana/web3.js";
import { Button, buttonVariants } from "../ui/button";
import { CopyIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { toast } from "sonner";
import { useState } from "react";
import { address, createSolanaRpc, lamports } from "@solana/kit";

function DialogDemo({ children, walletDetail }: { children: React.ReactNode, walletDetail: Keypair }) {
    const SOL_URL = import.meta.env.VITE_SOLANA_DEV_URL;
    const [balance, setBalance] = useState<string>("****")
    const handleCopy = async () => {
        await navigator.clipboard.writeText(walletDetail.publicKey.toString())
        toast.success("copied to clipboard")
    }

    const showBalance = async () => {
        if (!SOL_URL) {
            alert("URL is not present");
            return;
        }

        const body = {
            jsonrpc: "2.0",
            id: 1,
            method: "getBalance",
            params: [walletDetail.publicKey.toString()]
        };

        const result = await fetch(SOL_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        const data = await result.json();

        if (!data) {
            toast.error("Failed to fetch balance")
        }

        setBalance(data.result.value);
        toast.error("Balanced fetched.")
    };

    const requestAirdrop = async () => {

        const rpc_url = "https://api.devnet.solana.com";
        const rpc = createSolanaRpc(rpc_url);

        let receiver = address(walletDetail.publicKey.toString());

        let airdropAmt = lamports(BigInt(1 * LAMPORTS_PER_SOL));

        let signature = await rpc.requestAirdrop(receiver, airdropAmt).send();

        toast.success("Airdrop successfull!")

        console.log(signature);
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
                <Button onClick={requestAirdrop} className={`cursor-pointer ${buttonVariants({ variant: "secondary" })}`}>request airdrop</Button>

                <div className="border rounded p-2 flex justify-between items-center transition-all duration-300 hover:border-amber-50">
                    <p className="text-muted-foreground">
                        {walletDetail.publicKey.toString()}
                    </p>
                    <Button onClick={handleCopy} className={`cursor-pointer size-10 ${buttonVariants({ variant: "secondary" })}`}><CopyIcon /></Button>
                </div>
                <div className="flex justify-between items-center">
                    <p className="border w-8/12 p-2 rounded">{balance}</p>
                    <Button onClick={showBalance} className={`cursor-pointer ${buttonVariants({ variant: "secondary" })}`}>Show balance</Button>
                </div>

                <Separator />
                <h3>Transact Solana  </h3>

                <Input className="w-8/12" placeholder="Enter recievers public key" />
                <div className="flex justify-between items-center">
                    <Input className="w-8/12 " />
                    <Button className={`cursor-pointer w-3/12  ${buttonVariants({ variant: "secondary" })}`}>send solana</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default DialogDemo;