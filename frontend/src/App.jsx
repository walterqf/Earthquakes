import EarthQuake from "./components/EarthQuake"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import EarthquakeDetail from "./components/EarthquakeDetail"
import Home from "./components/Home"

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/earthquake" element={<EarthQuake />} />
        <Route path="/earthquake/:id" element={<EarthquakeDetail />} />
        {/* <Route path="/addemployee" element={<Addemployee />} /> */}
      </Routes>
    </Router>
  </>
  )
}

export default App