import { ModeToggle } from "./mode-toggle"

const Navbar = () => {
    return (
        <div className='flex justify-around border items-center py-3'>
            <h1 className="text-2xl font-bold">Web based wallet</h1>
            <ModeToggle />
        </div>
    )
}

export default Navbar;