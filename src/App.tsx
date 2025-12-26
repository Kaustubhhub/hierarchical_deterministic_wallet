import { useState } from 'react'
import './App.css'
import EthWallets from './components/web/EthWallets'
import SolanaWallets from './components/web/SolanaWallets'
import { generateMnemonic } from 'bip39'
import { ThemeProvider } from './components/web/theme-provider'
import Navbar from './components/web/navbar'
import { buttonVariants } from './components/ui/button'
import { CopyIcon } from 'lucide-react'
import { Toaster } from './components/ui/sonner'
import { toast } from 'sonner'

function App() {
  const [mneumonics, setMneumonics] = useState("")
  const [mneumonicsArray, setMneumonicsArray] = useState<string[]>([])

  const generate_mneumonics = () => {
    const mneumonics = generateMnemonic()
    const mneumonicsArray = mneumonics.split(" ");
    setMneumonics(mneumonics)
    setMneumonicsArray(mneumonicsArray)
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(mneumonics);
        toast.success("copied to clipboard")
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Navbar />
      <div className='text-center my-4 border-white'>
        <button className={buttonVariants()} onClick={generate_mneumonics}>Generate Pneumonics</button>
        <div className="mx-66 grid grid-cols-3 gap-2 my-4">
          {mneumonicsArray.map((ele, idx) => (
            <p className='border rounded p-1 hover:scale-102 hover:border-amber-50 transition-all' key={idx}>{ele}</p>
          ))}
        </div>
        {mneumonics !== "" && <div className='text-left '>
          <button onClick={handleCopy} className={`cursor-pointer ${buttonVariants({ variant: "secondary" })} mx-66`}>
            <CopyIcon />
            <p>copy mneumonics</p>
          </button>
        </div>}
      </div>

      {mneumonics !== "" && <div className='mx-66'>
        <SolanaWallets mneumonics={mneumonics} />
        <EthWallets mneumonics={mneumonics} />
      </div>}
      <Toaster closeButton />
    </ThemeProvider>
  )
}

export default App
