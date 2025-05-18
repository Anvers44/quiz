// client/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy } from 'react';


// Lazy Loading des pages
const Home = lazy(() => import('./pages/Home'));
const Register = lazy(() => import('./pages/Register'));
const Login = lazy(() => import('./pages/Login'));

function App() {
  return (
    <Router>
      <div className="app-container">
        <main className="main-content">

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>

        </main>

      </div>
    </Router>
  );
}

export default App;