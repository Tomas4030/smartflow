import { Nav } from '../components/Nav'
import { Hero } from '../components/Hero'
import { Intro, Problem, Solution, TimeSaved, Market, Roadmap, Compare, Pricing, Team, Contact, Footer } from '../components/Sections'
import { SupportChat } from '../components/SupportChat'

export default function App() {
  return (
    <>
      <Nav />
      <Hero />
      <Intro />
      <Problem />
      <Solution />
      <TimeSaved />
      <Market />
      <Roadmap />
      <Compare />
      <Pricing />
      <Team />
      <Contact />
      <Footer />
      <SupportChat />
    </>
  )
}
