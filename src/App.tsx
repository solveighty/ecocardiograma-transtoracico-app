import { HashRouter, Routes, Route } from 'react-router-dom';
import EchocardiogramDashboard from './pages/Dashboard';
import PatientForm from './forms/personal-data';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<EchocardiogramDashboard />} />
        <Route path="/ecocardiograma" element={<PatientForm />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
