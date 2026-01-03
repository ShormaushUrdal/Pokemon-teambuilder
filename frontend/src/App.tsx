import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/Authcontext";
import ProtectedRoute from "./Component/ProtectedRoute";
import Teambuilder from "./Pages/Teambuilder";
import Homepage from "./Pages/Homepage";
import Edit_team from "./Pages/Edit_team";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route 
            path="/teambuilder" 
            element={
              <ProtectedRoute>
                <Teambuilder />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/edit_team" 
            element={
              <ProtectedRoute>
                <Edit_team />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;