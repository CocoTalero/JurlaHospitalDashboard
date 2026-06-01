import { useState, useEffect } from 'react'
import { Search, Filter, Download, MoreVertical, Plus } from 'lucide-react'
import '../styles/PatientRecords.css'
import drSakilaImage from '../assets/dr. Sakila.jpeg'
import csvData from '../assets/healthcare_patient_journey.csv?raw'
import { parseCSV, transformCSVToPatientData } from '../utils/csvParser'

let patientData = []

const getAvatarColor = (initials) => {
  const colors = ['#0284c7', '#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b']
  return colors[initials.charCodeAt(0) % colors.length]
}

const getStatusColor = (status) => {
  switch (status) {
    case 'In-Patient':
      return 'in-patient'
    case 'Out-Patient':
      return 'out-patient'
    case 'Expired':
      return 'expired'
    default:
      return 'default'
  }
}

const getInsuranceIcon = (insurance) => {
  switch (insurance) {
    case 'BlueCross':
      return '🛡️'
    case 'Medicare':
      return '🛡️'
    case 'Aetna':
      return '🛡️'
    case 'Private':
      return '🔒'
    case 'Expired':
      return '⚠️'
    default:
      return '📋'
  }
}

export default function PatientRecords() {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [patients, setPatients] = useState([])
  const itemsPerPage = 5

  useEffect(() => {
    // Parse CSV dan transform data
    const parsedData = parseCSV(csvData)
    const transformedData = transformCSVToPatientData(parsedData)
    setPatients(transformedData)
    patientData = transformedData
  }, [])

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.medicalId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.status.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage)
  const startIdx = (currentPage - 1) * itemsPerPage
  const displayedPatients = filteredPatients.slice(startIdx, startIdx + itemsPerPage)

  // Generate pagination buttons with ellipsis
  const getPaginationButtons = () => {
    const buttons = []
    const maxVisible = 5
    let startPage = Math.max(1, currentPage - 2)
    let endPage = Math.min(totalPages, currentPage + 2)

    // Adjust range if near start
    if (currentPage <= 3) {
      endPage = Math.min(totalPages, maxVisible)
    }
    // Adjust range if near end
    if (currentPage > totalPages - 3) {
      startPage = Math.max(1, totalPages - maxVisible + 1)
    }

    // Add first page
    if (startPage > 1) {
      buttons.push(1)
      if (startPage > 2) {
        buttons.push('...')
      }
    }

    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(i)
    }

    // Add last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push('...')
      }
      buttons.push(totalPages)
    }

    return buttons
  }

  const paginationButtons = getPaginationButtons()

  return (
    <div className="patient-records">
      {/* Header */}
      <div className="records-header">
        <div className="header-content">
          <div className="header-title">
            <h1>Patient Records</h1>
            <p>Welcome back,  Sakila</p>
          </div>
          <div className="header-actions">
            <button className="btn-register">
              <Plus size={18} />
              Register Patient
            </button>
            <Search size={32} className="search-icon" />
            <div className="user-profile">
              <div className="avatar" style={{ overflow: 'hidden' }}>
                <img src={drSakilaImage} alt=" Sakila" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div className="user-info">
                <p> Sakila</p>
                <p>Head of Medical Records</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="records-content">
        {/* Search and Filter Bar */}
        <div className="search-filter-bar">
          <div className="search-box">
            <Search size={20} className="search-input-icon" />
            <input
              type="text"
              placeholder="Search by name, ID or status..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="search-input"
            />
          </div>
          <div className="filter-actions">
            <button className="btn-filter">
              <Filter size={18} />
              Filter
            </button>
            <button className="btn-export">
              <Download size={18} />
              Export
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="table-container">
          <table className="patients-table">
            <thead>
              <tr>
                <th>NAME</th>
                <th>MEDICAL ID</th>
                <th>DOB</th>
                <th>INSURANCE</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {displayedPatients.map((patient) => (
                <tr key={patient.id} className="patient-row">
                  <td className="name-cell">
                    <div className="patient-info-cell">
                      <div className="avatar-small" style={{ background: getAvatarColor(patient.avatar) }}>
                        {patient.avatar}
                      </div>
                      <div>
                        <p className="patient-name">{patient.name}</p>
                        <p className="patient-meta">{patient.gender}, {patient.age}</p>
                      </div>
                    </div>
                  </td>
                  <td className="medical-id">{patient.medicalId}</td>
                  <td className="dob">{patient.dob}</td>
                  <td className="insurance">
                    <div className="insurance-info">
                      <span className="insurance-icon">{getInsuranceIcon(patient.insurance)}</span>
                      <span>{patient.insurance}</span>
                    </div>
                  </td>
                  <td className="status">
                    <span className={`status-badge ${getStatusColor(patient.status)}`}>
                      {patient.status}
                    </span>
                  </td>
                  <td className="action">
                    <button className="btn-action">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination">
          <p className="pagination-info">Showing {startIdx + 1}-{Math.min(startIdx + itemsPerPage, filteredPatients.length)} of {filteredPatients.length} patients</p>
          <div className="pagination-controls">
            <button
              className="btn-pagination"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              ←
            </button>
            {paginationButtons.map((button, index) => 
              button === '...' ? (
                <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>
              ) : (
                <button
                  key={button}
                  className={`btn-page ${currentPage === button ? 'active' : ''}`}
                  onClick={() => setCurrentPage(button)}
                >
                  {button}
                </button>
              )
            )}
            <button
              className="btn-pagination"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
