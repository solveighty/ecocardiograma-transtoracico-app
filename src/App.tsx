import { BrowserRouter, Routes, Route } from 'react-router-dom';
import EchocardiogramDashboard from './pages/Dashboard';

function App() {
  return (
    <>
      <EchocardiogramDashboard />
      <BrowserRouter>
        <Routes>
      
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
