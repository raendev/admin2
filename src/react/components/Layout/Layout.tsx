import { useEffect, useState } from 'react'
import { Link, useParams, Outlet } from "react-router-dom"
import { ContractNameForm, CosmWasmContract, NearContract, Logo, NearLogin } from '..'
import { Sidebar } from './Sidebar'
import css from './layout.module.css'
import useWindowDimensions from '../../hooks/useWindowDimensions'

let hideSidebarTimeout: number

// set to match the timing of the CSS `slideUp` animation; must be at least as long
const HIDE_SIDEBAR_AFTER = 200

export const Layout = () => {
  const { isMobile } = useWindowDimensions()
  const { contract, method, protocol } = useParams()
  const [open, setOpenRaw] = useState(false)
  const [displaySidebar, setDisplaySidebar] = useState(false)

  // only close menu after short delay to allow CSS animation to complete
  function setOpen(newOpen: boolean) {
    setOpenRaw(newOpen)
    if (newOpen) {
      clearTimeout(hideSidebarTimeout)
      setDisplaySidebar(true)
    } else {
      hideSidebarTimeout = window.setTimeout(
        () => setDisplaySidebar(false),
        HIDE_SIDEBAR_AFTER
      )
    }
  }

  // close menu when switching between mobile and desktop
  // also close menu after method selected from sidebar
  useEffect(() => {
    setOpen(false)
  }, [isMobile, method])

  return (
    <div className="flex">
      {!isMobile && <Sidebar />}
      <div className="flex-1 h-full overflow-y-scroll oveflow-x-hidden overscroll-none">
       <div className={`${isMobile ? 'mycelium' : 'bg-white dark:bg-neutral-800'} p-4`}>
          {isMobile && (
            <div className="flex gap-2 items-center justify-between mb-2">
              <div className="flex gap-5 items-center">
                <button
                  aria-controls="mobileSidebarWrap"
                  className={css.menu}
                  onClick={() => setOpen(!open)}
                  style={{ flex: '0 0 auto' }}
                >
                  <span className={open ? css.open : css.closed} aria-hidden />
                  <span className="sr-only">{open ? 'Close Menu' : 'Open Menu'}</span>
                </button>
                <Link to="/" className="border-0 shrink-1 basis-20">
                  <Logo className="p-0" />
                </Link>
              </div>
              {protocol === 'near' && <NearLogin />}
            </div>
          )}
          <ContractNameForm
            protocol={protocol === 'near' ? 'NEAR' : 'CosmWasm'}
            contract={contract}
          />
        </div>
        {isMobile && (
          <div
            className={`${css.mobileSidebarWrap} absolute overflow-hidden width-9/10 left-[2.5%] z-20 h-full max-h-screen`}
            data-state={open ? 'open' : 'closed'}
            id="mobileSidebarWrap"
            aria-live="polite"
            style={{ display: displaySidebar ? undefined : 'none' }}
          >
            <Sidebar />
          </div>
        )}
        <div
          className="container mx-auto p-4"
          id="mainContent" // referenced by links in `Methods/Method.tsx`
          aria-live="polite"
        >
          {protocol === 'near'
            ? <NearContract />
            : protocol === 'cw'
            ? <CosmWasmContract />
            : <Outlet />
          }
        </div>
      </div>
    </div>
  )
}
