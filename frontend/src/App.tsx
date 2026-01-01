import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Pages/Dashboard"
import Homepage from "./Pages/Homepage"
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path = "/" element = {<Homepage/>}/>
        <Route path = "/dashboard" element = {<Dashboard/>}/> 
      </Routes>
    </BrowserRouter>
  )
}

export default App
