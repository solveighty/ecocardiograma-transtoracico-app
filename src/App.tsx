import { BrowserRouter, Routes, Route } from 'react-router-dom';
import EchocardiogramDashboard from './pages/Dashboard';
import PatientForm from './forms/personal-data';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EchocardiogramDashboard />} />
        <Route path="/ecocardiograma" element={<PatientForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
