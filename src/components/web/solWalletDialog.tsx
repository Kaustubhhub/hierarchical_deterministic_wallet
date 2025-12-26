import type React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import type { Keypair } from "@solana/web3.js";
import { Button, buttonVariants } from "../ui/button";
import { CopyIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";


function DialogDemo({ children, walletDetail }: { children: React.ReactNode, walletDetail: Keypair }) {

    const handleCopy = async () => {
        await navigator.clipboard.writeText(walletDetail.publicKey.toString())
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

                <div className="border rounded p-2 flex justify-between items-center transition-all duration-300 hover:border-amber-50">
                    <p className="text-muted-foreground">
                        {walletDetail.publicKey.toString()}
                    </p>
                    <Button onClick={handleCopy} className={`size-10 ${buttonVariants({ variant: "secondary" })}`}><CopyIcon /></Button>
                </div>
                <div className="flex justify-between items-center">
                    <p className="border w-8/12 p-2 rounded">****</p>
                    <Button className={`cursor-pointer ${buttonVariants({ variant: "secondary" })}`}>Show balance</Button>
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