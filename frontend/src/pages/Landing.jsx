import { useEffect } from 'react'
import { Nav } from '../components/Nav'
import { Hero } from '../components/Hero'
import { Intro, Problem, Solution, SOSFeature, TimeSaved, Market, Roadmap, Compare, Pricing, Team, Contact, Footer } from '../components/landing'
import { SupportChat } from '../components/SupportChat'

function useScrollSnap() {
  useEffect(() => {
    let busy = false

    const go = (top) => {
      busy = true
      window.scrollTo({ top, behavior: 'smooth' })
      setTimeout(() => { busy = false }, 650)
    }

    const targets = () =>
      [...document.querySelectorAll('section:not(#top)'), document.querySelector('footer')]
        .filter(Boolean)
        .map((el) => el.offsetTop)

    const handle = (dir, e) => {
      const hero = document.getElementById('top')
      if (!hero) return
      const freeEnd = hero.offsetHeight - window.innerHeight

      if (window.scrollY < freeEnd - 4) return

      e.preventDefault()
      if (busy) return

      const tops = targets()

      if (dir > 0) {
        const next = tops.find((top) => top > window.scrollY + 4)
        if (next != null) go(next)
      } else {
        const prev = [...tops].reverse().find((top) => top < window.scrollY - 4)
        if (prev != null) {
          go(prev)
        } else {
          go(Math.max(0, freeEnd - Math.round(window.innerHeight * 0.5)))
        }
      }
    }

    const onWheel = (e) => handle(e.deltaY, e)

    const onKey = (e) => {
      const down = [' ', 'ArrowDown', 'PageDown'].includes(e.key)
      const up = ['ArrowUp', 'PageUp'].includes(e.key)
      if (!down && !up) return
      handle(down ? 1 : -1, e)
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKey)
    }
  }, [])
}

export default function App() {
  useScrollSnap()

  return (
    <>
      <Nav />
      <Hero />
      <Intro />
      <Problem />
      <Solution />
      <TimeSaved />
      <Market />
      <Compare />
      <Roadmap />
      <Pricing />
      <Team />
      <SOSFeature />
      <Contact />
      <Footer />
      <SupportChat />
    </>
  )
}
