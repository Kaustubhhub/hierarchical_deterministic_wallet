import { ModeToggle } from "./mode-toggle"

const Navbar = () => {
    return (
        <div className='flex justify-around border items-center py-3'>
            <div className="flex justify-between items-centerm gap-4">
                <img src="../../../blockchain.png" height={40} width={40} alt="" />
                <h1 className="text-2xl font-bold">Block Lens</h1>
            </div>
            <ModeToggle />
        </div>
    )
}

export default Navbar;