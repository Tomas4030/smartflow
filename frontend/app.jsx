

function App() {
  return (
    <>
      <Nav/>
      <Hero/>
      <Intro/>
      <Problem/>
      <Solution/>
      <TimeSaved/>
      <Market/>
      <Roadmap/>
      <Compare/>
      <Pricing/>
      <Team/>
      <Contact/>
      <Footer/>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App/>);
