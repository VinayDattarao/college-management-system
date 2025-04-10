'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import BackButton from '../components/BackButton'
import { FaSync, FaSearch } from 'react-icons/fa'

interface Student {
  id: string
  name: string
  rollNumber: string
  classId: string
  class: string
  lastUpdated?: string
  department?: string
  semester?: string
  academicYear?: string
  hasUpdatedProfile?: boolean
}

interface Classroom {
  id: string
  name: string
  classCode: string
  students: Student[]
}

export default function StudentDatabase() {
  const router = useRouter()
  const [userRole, setUserRole] = useState<string>('')
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [students, setStudents] = useState<Student[]>([])
  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const [selectedClassId, setSelectedClassId] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const role = localStorage.getItem('userRole')
    if (role) setUserRole(role)
    const darkMode = localStorage.getItem('darkMode') === 'true'
    setIsDarkMode(darkMode)
    loadClassrooms()
  }, [])

  const loadClassrooms = () => {
    const savedClassrooms = localStorage.getItem('classrooms')
    if (savedClassrooms) {
      setClassrooms(JSON.parse(savedClassrooms))
    }
  }

  const handleLoadStudents = () => {
    if (!selectedClassId) {
      alert('Please select a class first')
      return
    }

    const selectedClass = classrooms.find(c => c.id === selectedClassId)
    if (!selectedClass) {
      alert('Selected class not found')
      return
    }

    // Get all student profiles that have been saved/updated
    const allProfiles = JSON.parse(localStorage.getItem('studentProfiles') || '[]')
    
    // Map all students from the class, marking those who have updated their profiles
    const classStudents = selectedClass.students.map(student => {
      const profile = allProfiles.find((p: Student) => p.rollNumber === student.rollNumber)
      if (profile) {
        return {
          ...profile,
          class: selectedClass.name,
          classId: selectedClassId,
          hasUpdatedProfile: true
        }
      }
      return {
        ...student,
        class: selectedClass.name,
        classId: selectedClassId,
        hasUpdatedProfile: false
      }
    })

    setStudents(classStudents)
  }

  const filteredStudents = students.filter(student => {
    const searchLower = searchQuery.toLowerCase()
    return (
      student.name.toLowerCase().includes(searchLower) ||
      student.rollNumber.toLowerCase().includes(searchLower) ||
      student.class.toLowerCase().includes(searchLower)
    )
  })

  if (userRole !== 'lecturer') {
    return <div className="p-8 text-center">Access denied</div>
  }

  return (
    <div className={`min-h-screen p-8 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <BackButton />
            <h1 className="text-3xl font-bold">Student Database</h1>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className={`px-4 py-2 rounded-lg ${
                isDarkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white border-gray-300'
              } border`}
            >
              <option value="">Select Class</option>
              {classrooms.map((classroom) => (
                <option key={classroom.id} value={classroom.id}>
                  {classroom.name} ({classroom.classCode})
                </option>
              ))}
            </select>
            <button
              onClick={handleLoadStudents}
              disabled={!selectedClassId}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                !selectedClassId
                  ? 'bg-gray-400 cursor-not-allowed'
                  : isDarkMode
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white`}
            >
              <FaSync />
              <span>Load Students</span>
            </button>
            <div className="relative">
              <input
                type="text"
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-10 pr-4 py-2 rounded-lg ${
                  isDarkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white border-gray-300'
                } border`}
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          {filteredStudents.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">
              {selectedClassId 
                ? 'No students found in this class' 
                : 'Please select a class and click "Load Students"'}
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStudents.map((student) => (
                <div
                  key={student.id}
                  className={`p-4 rounded-lg ${
                    isDarkMode 
                      ? student.hasUpdatedProfile ? 'bg-gradient-to-br from-green-900 to-gray-800' : 'bg-gray-700'
                      : student.hasUpdatedProfile ? 'bg-gradient-to-br from-green-50 to-gray-50' : 'bg-gray-50'
                  } shadow-md relative`}
                >
                  {student.hasUpdatedProfile && (
                    <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs ${
                      isDarkMode ? 'bg-green-800 text-green-100' : 'bg-green-100 text-green-800'
                    }`}>
                      Profile Updated
                    </div>
                  )}
                  <h3 className="text-lg font-semibold">{student.name}</h3>
                  <div className={`mt-2 space-y-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <p>Roll No: {student.rollNumber}</p>
                    <p>Class: {student.class}</p>
                    {student.department && <p>Department: {student.department}</p>}
                    {student.semester && <p>Semester: {student.semester}</p>}
                    {student.academicYear && <p>Academic Year: {student.academicYear}</p>}
                    {student.lastUpdated && (
                      <p className="text-sm text-gray-500">
                        Last Updated: {new Date(student.lastUpdated).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 