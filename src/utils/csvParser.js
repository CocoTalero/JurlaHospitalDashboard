// Random name generator
const firstNamesMale = [
  'Ahmad', 'Budi', 'Candra', 'Dedi', 'Eka', 'Fajar', 'Guna', 'Hendra', 'Indra', 'Joko',
  'Karim', 'Lukman', 'Mukhtar', 'Novan', 'Odi', 'Panang', 'Qasim', 'Rifki', 'Samad', 'Toni',
  'Ubay', 'Vicky', 'Wahyu', 'Xander', 'Yanto', 'Zainudin', 'Agus', 'Bambang', 'Cahyo', 'Danang'
]

const firstNamesFemale = [
  'Ayu', 'Bella', 'Citra', 'Dewi', 'Eva', 'Fina', 'Gita', 'Hani', 'Ifa', 'Jaya',
  'Kanya', 'Lina', 'Maya', 'Nuri', 'Olla', 'Putri', 'Quila', 'Rina', 'Siti', 'Tina',
  'Ulfa', 'Vina', 'Wulan', 'Xenia', 'Yasmin', 'Zara', 'Amira', 'Bidadari', 'Citra', 'Dina'
]

const lastNames = [
  'Setiawan', 'Rahman', 'Wirawan', 'Kristina', 'Nugroho', 'Wijaya', 'Santoso', 'Hermawan', 'Kusuma', 'Gunawan',
  'Pratama', 'Saputra', 'Arifianto', 'Budiman', 'Cahyana', 'Darwis', 'Efendy', 'Fadilah', 'Gamawan', 'Handoko',
  'Irawan', 'Jatmiko', 'Kinanti', 'Lestari', 'Mardini', 'Nabila', 'Octavian', 'Pramono', 'Qurniawan', 'Rahayu',
  'Susilo', 'Tambunan', 'Utomo', 'Vanda', 'Wiraatmadja', 'Yuliana', 'Zubaida', 'Aditya', 'Bramasta', 'Cahyono'
]

const generateRandomName = (gender) => {
  const firstNames = gender === 'female' ? firstNamesFemale : firstNamesMale
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
  return `${firstName} ${lastName}`
}

// Utility untuk membaca dan parse CSV file
export const parseCSV = (csvText) => {
  const lines = csvText.trim().split('\n')
  const headers = lines[0].split(',')
  
  // Parse semua data pasien
  return lines.slice(1).map(line => {
    const values = line.split(',')
    const obj = {}
    headers.forEach((header, index) => {
      obj[header.trim()] = values[index]?.trim()
    })
    return obj
  })
}

// Transform data CSV ke format PatientRecords
export const transformCSVToPatientData = (csvData) => {
  return csvData.map((row, index) => ({
    id: parseInt(row.patient_id),
    name: generateRandomName(row.gender),
    gender: row.gender.charAt(0).toUpperCase() + row.gender.slice(1),
    age: parseInt(row.age),
    medicalId: `#MED-${String(row.patient_id).padStart(4, '0')}`,
    dob: `Age: ${row.age}`,
    insurance: row.discharge_status === 'recovered' ? 'Active' : 'Pending',
    status: row.admission_type === 'emergency' ? 'In-Patient' : 'Out-Patient',
    avatar: `P${row.patient_id}`,
    department: row.department,
    wait_time: parseInt(row.wait_time_min),
    length_of_stay: parseInt(row.length_of_stay_days),
    procedures: parseInt(row.procedures_count),
    medications: parseInt(row.medication_count),
    cost: Math.round(parseFloat(row.total_cost_EUR) || 0),
    satisfaction: parseInt(row.satisfaction_score)
  }))
}

// Hitung statistik dari data CSV
export const calculateStats = (csvData) => {
  const totalPatients = csvData.length
  const inPatients = csvData.filter(row => row.admission_type === 'emergency').length
  const outPatients = totalPatients - inPatients
  const avgAge = Math.round(csvData.reduce((sum, row) => sum + parseInt(row.age), 0) / totalPatients)
  const avgCost = Math.round(csvData.reduce((sum, row) => sum + (parseFloat(row.total_cost_EUR) || 0), 0) / totalPatients)
  const avgSatisfaction = 4.2
  
  // Recovery rate
  const recoveredCount = csvData.filter(row => row.discharge_status === 'recovered').length
  const recoveryRate = Math.round((recoveredCount / totalPatients) * 100)
  
  // Readmission rate (30-day)
  const readmittedCount = csvData.filter(row => row.readmitted_30d === '1').length
  const readmissionRate = Math.round((readmittedCount / totalPatients) * 100)
  
  // Average length of stay
  const avgLengthOfStay = Math.round(csvData.reduce((sum, row) => sum + parseInt(row.length_of_stay_days), 0) / totalPatients)
  
  // Admission type comparison
  const admissionComparison = [
    { name: 'Emergency', value: inPatients, percentage: Math.round((inPatients / totalPatients) * 100) },
    { name: 'Scheduled', value: outPatients, percentage: Math.round((outPatients / totalPatients) * 100) }
  ]
  
  // Department statistics - initialize with 9 departments from DoctorSchedules
  const departmentStats = {
    'Cardiology': { name: 'Cardiology', patients: 0, recovered: 0, avgSatisfaction: 0, totalMeds: 0 },
    'Pediatrics': { name: 'Pediatrics', patients: 0, recovered: 0, avgSatisfaction: 0, totalMeds: 0 },
    'Neurology': { name: 'Neurology', patients: 0, recovered: 0, avgSatisfaction: 0, totalMeds: 0 },
    'Immunology': { name: 'Immunology', patients: 0, recovered: 0, avgSatisfaction: 0, totalMeds: 0 },
    'Orthopedics': { name: 'Orthopedics', patients: 0, recovered: 0, avgSatisfaction: 0, totalMeds: 0 },
    'General Medicine': { name: 'General Medicine', patients: 0, recovered: 0, avgSatisfaction: 0, totalMeds: 0 },
    'Dermatology': { name: 'Dermatology', patients: 0, recovered: 0, avgSatisfaction: 0, totalMeds: 0 },
    'Psychiatrist': { name: 'Psychiatrist', patients: 0, recovered: 0, avgSatisfaction: 0, totalMeds: 0 },
    'ICU': { name: 'ICU', patients: 0, recovered: 0, avgSatisfaction: 0, totalMeds: 0 }
  }
  
  csvData.forEach(row => {
    // Map CSV department to one of 9 departments (or keep if matches)
    let mappedDept = row.department
    if (!departmentStats[row.department]) {
      // If department not in our list, randomly assign to one of the 9
      const depts = Object.keys(departmentStats)
      mappedDept = depts[Math.floor(Math.random() * depts.length)]
    }
    
    departmentStats[mappedDept].patients++
    if (row.discharge_status === 'recovered') departmentStats[mappedDept].recovered++
    departmentStats[mappedDept].totalMeds += parseInt(row.medication_count)
  })
  
  const departmentData = Object.values(departmentStats).map(dept => ({
    name: dept.name,
    patients: dept.patients,
    recovered: dept.recovered,
    recoveryRate: Math.round((dept.recovered / dept.patients) * 100),
    avgMedsPerPatient: Math.round(dept.totalMeds / dept.patients)
  }))
  
  // Medication analytics
  const medicationAnalytics = {}
  csvData.forEach(row => {
    const medCount = parseInt(row.medication_count)
    if (medCount <= 2) medicationAnalytics['Low (1-2)'] = (medicationAnalytics['Low (1-2)'] || 0) + 1
    else if (medCount <= 5) medicationAnalytics['Medium (3-5)'] = (medicationAnalytics['Medium (3-5)'] || 0) + 1
    else medicationAnalytics['High (6+)'] = (medicationAnalytics['High (6+)'] || 0) + 1
  })
  
  const medicationData = Object.entries(medicationAnalytics).map(([category, count]) => ({
    category,
    count,
    percentage: Math.round((count / totalPatients) * 100)
  }))
  
  // Pharmacy inventory data
  const pharmacyData = [
    { id: 1, name: 'Insulin R', category: 'Diabetes Care', stock: 45, capacity: 100, status: 'Adequate' },
    { id: 2, name: 'Amoxicillin', category: 'Antibiotics', stock: 78, capacity: 150, status: 'Good' },
    { id: 3, name: 'Atorvastatin', category: 'Cardiovascular', stock: 92, capacity: 200, status: 'Good' },
    { id: 4, name: 'Metformin', category: 'Diabetes Care', stock: 156, capacity: 300, status: 'Good' },
    { id: 5, name: 'Paracetamol IV', category: 'Pain Relief', stock: 34, capacity: 100, status: 'Low' },
    { id: 6, name: 'Lisinopril', category: 'Cardiovascular', stock: 88, capacity: 200, status: 'Good' }
  ]
  
  // Bed occupancy rate
  const totalBedDays = csvData.reduce((sum, row) => sum + parseInt(row.length_of_stay_days), 0)
  const occupancyRate = Math.round((totalBedDays / (700 * 30)) * 100) // 700 beds, 30 days
  
  // Weekly data
  const weeklyData = [
    { name: 'Mon', value: Math.round(Math.random() * 200) },
    { name: 'Tue', value: Math.round(Math.random() * 200) },
    { name: 'Wed', value: Math.round(Math.random() * 200) },
    { name: 'Thu', value: Math.round(Math.random() * 200) },
    { name: 'Fri', value: Math.round(Math.random() * 200) },
    { name: 'Sat', value: Math.round(Math.random() * 200) },
    { name: 'Sun', value: Math.round(Math.random() * 200) }
  ]

  // Monthly data
  const monthlyData = [
    { name: 'Jan', value: Math.round(Math.random() * 800) },
    { name: 'Feb', value: Math.round(Math.random() * 800) },
    { name: 'Mar', value: Math.round(Math.random() * 800) },
    { name: 'Apr', value: Math.round(Math.random() * 800) },
    { name: 'May', value: Math.round(Math.random() * 800) },
    { name: 'Jun', value: Math.round(Math.random() * 800) },
    { name: 'Jul', value: Math.round(Math.random() * 800) },
    { name: 'Aug', value: Math.round(Math.random() * 800) },
    { name: 'Sep', value: Math.round(Math.random() * 800) },
    { name: 'Oct', value: Math.round(Math.random() * 800) },
    { name: 'Nov', value: Math.round(Math.random() * 800) },
    { name: 'Dec', value: Math.round(Math.random() * 800) }
  ]

  // Age range distribution
  const ageRanges = {
    '0-20': 0,
    '21-30': 0,
    '31-40': 0,
    '41-50': 0,
    '51-60': 0,
    '61+': 0
  }

  csvData.forEach(row => {
    const age = parseInt(row.age)
    if (age <= 20) ageRanges['0-20']++
    else if (age <= 30) ageRanges['21-30']++
    else if (age <= 40) ageRanges['31-40']++
    else if (age <= 50) ageRanges['41-50']++
    else if (age <= 60) ageRanges['51-60']++
    else ageRanges['61+']++
  })

  const ageRangeData = Object.entries(ageRanges).map(([range, count]) => ({
    range,
    count,
    percentage: Math.round((count / totalPatients) * 100)
  }))

  // Department patient distribution
  const departmentPatientData = Object.values(departmentStats).map(dept => ({
    name: dept.name,
    patients: dept.patients,
    percentage: Math.round((dept.patients / totalPatients) * 100)
  }))
  
  return {
    totalInpatients: inPatients,
    availableBeds: Math.max(0, 700 - inPatients),
    doctorsOnDuty: Math.max(10, Math.round(totalPatients / 10)),
    emergencyQueue: csvData.filter(row => row.admission_type === 'emergency' && row.readmitted_30d === '1').length,
    weeklyData,
    monthlyData,
    ageRangeData,
    avgAge,
    totalPatients,
    avgCost,
    avgSatisfaction,
    recoveryRate,
    readmissionRate,
    avgLengthOfStay,
    admissionComparison,
    departmentData,
    medicationData,
    occupancyRate,
    departmentPatientData,
    pharmacyData
  }
}
