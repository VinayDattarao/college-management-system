'use client'

import { useState, useEffect } from 'react'
import { FaCheck, FaTimes, FaFileExcel, FaDownload } from 'react-icons/fa'
import BackButton from './BackButton'
import * as XLSX from 'xlsx'

interface Student {
  id: string
  name: string
  rollNumber: string
}

interface Subject {
  id: string
  name: string
  code: string
}

const initialSubjects: Subject[] = [
  { id: '1', name: 'Discrete Mathematics', code: 'DM' },
  { id: '2', name: 'Business Economics and Financial Analysis', code: 'BEFA' },
  { id: '3', name: 'Database Management Systems', code: 'DBMS' },
  { id: '4', name: 'Software Engineering', code: 'SE' },
  { id: '5', name: 'Aptitude', code: 'APT' },
  { id: '6', name: 'Communication Skills', code: 'CS' },
  { id: '7', name: 'Operating Systems Lab', code: 'OSL' },
  { id: '8', name: 'DBMS Lab', code: 'DBL' },
  { id: '9', name: 'Node.js', code: 'NJS' },
  { id: '10', name: 'CRT/Coding', code: 'CRT' },
  { id: '11', name: 'Societal Project/Seminar', code: 'SPS' }
]

interface Class {
  id: string
  name: string
  subjects: Subject[]
}

interface AttendanceRecord {
  studentId: string
  date: string
  status: 'present' | 'absent'
}

export default function AttendanceManagement() {
  const [selectedClass, setSelectedClass] = useState<string>('')
  const [selectedSubject, setSelectedSubject] = useState<string>('')
  const [classes, setClasses] = useState<Class[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [userRole, setUserRole] = useState<string | null>(null)
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const role = localStorage.getItem('userRole')
    if (!role) {
      window.location.href = '/'
      return
    }
    setUserRole(role)

    // Check dark mode preference
    const darkMode = localStorage.getItem('darkMode') === 'true'
    setIsDarkMode(darkMode)

    // Load classes with their subjects
    const savedClasses = localStorage.getItem('classes')
    if (savedClasses) {
      const parsedClasses = JSON.parse(savedClasses)
      const updatedClasses = parsedClasses.map((cls: Class) => ({
        ...cls,
        subjects: initialSubjects
      }))
      setClasses(updatedClasses)
      if (updatedClasses.length > 0) {
        setSelectedClass(updatedClasses[0].id)
      }
      localStorage.setItem('classes', JSON.stringify(updatedClasses))
    }

    // Load students
    const savedStudents = localStorage.getItem('students')
    if (savedStudents) {
      setStudents(JSON.parse(savedStudents))
    }

    // Load attendance records
    const savedAttendance = localStorage.getItem('attendance')
    if (savedAttendance) {
      setAttendanceRecords(JSON.parse(savedAttendance))
    }
  }, [])

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedClass(e.target.value)
    setSelectedSubject('')
  }

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubject(e.target.value)
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value)
  }

  const handleAttendanceChange = (studentId: string, status: 'present' | 'absent') => {
    const newRecords = [...attendanceRecords]
    const existingIndex = newRecords.findIndex(
      record => record.studentId === studentId && record.date === date
    )

    if (existingIndex >= 0) {
      newRecords[existingIndex] = { ...newRecords[existingIndex], status }
    } else {
      newRecords.push({ studentId, date, status })
    }

    setAttendanceRecords(newRecords)
    localStorage.setItem('attendance', JSON.stringify(newRecords))
  }

  const getAttendanceStatus = (studentId: string) => {
    const record = attendanceRecords.find(
      record => record.studentId === studentId && record.date === date
    )
    return record?.status || 'absent'
  }

  const exportToExcel = () => {
    if (!selectedClass || !selectedSubject) return

    const classStudents = students.filter(s => s.id.startsWith(selectedClass))
    const subject = initialSubjects.find(s => s.id === selectedSubject)
    
    const data = classStudents.map(student => {
      const status = getAttendanceStatus(student.id)
      return {
        'Roll Number': student.rollNumber,
        'Name': student.name,
        'Status': status === 'present' ? 'Present' : 'Absent',
        'Date': date,
        'Subject': subject?.name,
        'Subject Code': subject?.code
      }
    })

    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Attendance')
    XLSX.writeFile(wb, `attendance_${date}.xlsx`)
  }

  if (userRole !== 'lecturer') {
    return (
      <div className={`p-6 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white'}`}>
        <BackButton />
        <div className="text-center text-red-500">
          Only lecturers can manage attendance
        </div>
      </div>
    )
  }

  const selectedClassData = classes.find(c => c.id === selectedClass)
  const classStudents = students.filter(s => s.id.startsWith(selectedClass))

  return (
    <div className={`p-6 min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white'}`}>
      <BackButton />
      <h1 className="text-2xl font-bold mb-6">Attendance Management</h1>
      
      <div className="space-y-4 mb-6">
        <div>
          <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
            Select Class
          </label>
          <select
            value={selectedClass}
            onChange={handleClassChange}
            className={`w-full p-2 border rounded ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
          >
            <option value="">Select a class</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>

        {selectedClass && (
          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
              Select Subject
            </label>
            <select
              value={selectedSubject}
              onChange={handleSubjectChange}
              className={`w-full p-2 border rounded ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
            >
              <option value="">Select a subject</option>
              {initialSubjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name} ({subject.code})
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={handleDateChange}
            className={`w-full p-2 border rounded ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
          />
        </div>

        {selectedClass && selectedSubject && (
          <button
            onClick={exportToExcel}
            className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            <FaFileExcel />
            <span>Export to Excel</span>
          </button>
        )}
      </div>

      {selectedClass && selectedSubject && (
        <div className="overflow-x-auto">
          <table className={`min-w-full rounded-lg shadow ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <thead>
              <tr>
                <th className={`px-6 py-3 border-b ${isDarkMode ? 'border-gray-700 bg-gray-900 text-gray-400' : 'border-gray-200 bg-gray-50 text-gray-500'} text-left text-xs font-medium uppercase tracking-wider`}>
                  Roll Number
                </th>
                <th className={`px-6 py-3 border-b ${isDarkMode ? 'border-gray-700 bg-gray-900 text-gray-400' : 'border-gray-200 bg-gray-50 text-gray-500'} text-left text-xs font-medium uppercase tracking-wider`}>
                  Name
                </th>
                <th className={`px-6 py-3 border-b ${isDarkMode ? 'border-gray-700 bg-gray-900 text-gray-400' : 'border-gray-200 bg-gray-50 text-gray-500'} text-left text-xs font-medium uppercase tracking-wider`}>
                  Status
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {classStudents.map((student) => (
                <tr key={student.id}>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {student.rollNumber}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {student.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAttendanceChange(student.id, 'present')}
                        className={`p-2 rounded transition-colors ${
                          getAttendanceStatus(student.id) === 'present'
                            ? 'bg-green-500 text-white'
                            : isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        <FaCheck />
                      </button>
                      <button
                        onClick={() => handleAttendanceChange(student.id, 'absent')}
                        className={`p-2 rounded transition-colors ${
                          getAttendanceStatus(student.id) === 'absent'
                            ? 'bg-red-500 text-white'
                            : isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
} 