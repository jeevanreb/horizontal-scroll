import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import HorizontalScrollWithThankYou from './components/HorizontalScrollWithThankYou'
import ScrollingSections from './components/PinComponent'

function App() {

  return (
    <>
  <main className="">
      {/* <HorizontalScrollWithThankYou /> */}
      <div className='h-screen w-full bg-white text-black flex items-center justify-center relative'>text helo</div>
      <ScrollingSections />
            <div className='h-screen w-full bg-black text-white flex items-center justify-center relative' style={{ marginTop: '-100vh' }}>text helo</div>
    </main>
    </>
  )
}

export default App
