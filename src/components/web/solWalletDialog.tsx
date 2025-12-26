import type React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Connection, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction, type Keypair } from "@solana/web3.js";
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
    const [recieverPubKey, setRecieverPubKey] = useState<string>("")
    const [amount, setAmount] = useState<string>()

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
        toast.success("Balanced fetched.")
    };

    const requestAirdrop = async () => {
        try {
            const rpc_url = "https://api.devnet.solana.com";
            const rpc = createSolanaRpc(rpc_url);

            const receiver = address(walletDetail.publicKey.toString());
            const airdropAmt = lamports(BigInt(1 * LAMPORTS_PER_SOL));

            toast.info("Requesting airdrop...");

            await rpc.requestAirdrop(receiver, airdropAmt).send();

            toast.success("Airdrop successful!");

        } catch (err: any) {
            console.error("Airdrop failed:", err);
            toast.error(err?.message ?? "Airdrop failed. Please try again.");
        }
    };

    const sendSolana = async () => {
        if (!amount) {
            toast.error("please enter valid amount");
            return
        }
        if (recieverPubKey == "") {
            toast.error("please enter valid public key.");
            return
        }
        try {
            const connection = new Connection(import.meta.env.VITE_SOLANA_DEV_URL);
            const transaction = new Transaction();
            const lamportsToSend = Number(amount) * 100000000;
            const sendSolTransaction = SystemProgram.transfer({
                fromPubkey: walletDetail.publicKey,
                toPubkey: new PublicKey(recieverPubKey),
                lamports: lamportsToSend
            })
            transaction.add(sendSolTransaction)
            await sendAndConfirmTransaction(
                connection,
                transaction,
                [walletDetail]
            )
            toast.error("Transaction successfull!");
        } catch (error: any) {
            toast.error("error: ", error);
        }
    }

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
                        {walletDetail.publicKey.toString()}
                    </p>
                    <Button onClick={handleCopy} className={`cursor-pointer size-10 ${buttonVariants({ variant: "secondary" })}`}><CopyIcon /></Button>
                </div>

                <div className="flex justify-between items-center">
                    <p className="border w-8/12 p-2 rounded">{balance}</p>
                    <Button onClick={showBalance} className={`cursor-pointer ${buttonVariants({ variant: "secondary" })}`}>Show balance</Button>
                </div>

                <Separator />

                <h3>Transact Solana</h3>

                <Input onChange={(e) => {
                    setRecieverPubKey(e.target.value);
                }} className="w-8/12" placeholder="Enter recievers public key" />
                <div className="flex justify-between items-center">
                    <Input onChange={(e) => {
                        setAmount(e.target.value);
                    }} className="w-8/12 " />
                    <Button onClick={sendSolana} className={`cursor-pointer w-3/12  ${buttonVariants({ variant: "secondary" })}`}>send solana</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default DialogDemo;