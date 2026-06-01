import { useState } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import HealthcareDashboard from './components/HealthcareDashboard'
import PatientRecords from './components/PatientRecords'
import DoctorSchedules from './components/DoctorSchedules'
import Pharmacy from './components/Pharmacy'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <HealthcareDashboard />
      case 'patients':
        return <PatientRecords />
      case 'doctors':
        return <DoctorSchedules />
      case 'pharmacy':
        return <Pharmacy />
      default:
        return <HealthcareDashboard />
    }
  }

  return (
    <div className="app-wrapper">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      {renderPage()}
    </div>
  )
}

export default App
