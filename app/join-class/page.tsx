'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import BackButton from '../components/BackButton'
import { FaCheck } from 'react-icons/fa'

interface Classroom {
  id: string
  name: string
  classCode: string
  subjects: Subject[]
  students: Student[]
}

interface Subject {
  id: string
  name: string
  code: string
}

interface Student {
  id: string
  name: string
  rollNumber: string
}

export default function JoinClass() {
  const router = useRouter()
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true'
    }
    return false
  })
  const [classCode, setClassCode] = useState('')
  const [rollNumber, setRollNumber] = useState('')
  const [studentName, setStudentName] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [classrooms, setClassrooms] = useState<Classroom[]>([])

  useEffect(() => {
    const savedClassrooms = localStorage.getItem('classrooms')
    if (savedClassrooms) {
      setClassrooms(JSON.parse(savedClassrooms))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('darkMode', isDarkMode.toString())
  }, [isDarkMode])

  const handleJoinClass = () => {
    setError('')
    setSuccess('')

    if (!classCode.trim() || !rollNumber.trim() || !studentName.trim()) {
      setError('Please fill in all fields')
      return
    }

    const classroom = classrooms.find(c => c.classCode === classCode)
    if (!classroom) {
      setError('Invalid class code')
      return
    }

    // Check if student is already enrolled
    const isAlreadyEnrolled = classroom.students.some(s => s.rollNumber === rollNumber)
    if (isAlreadyEnrolled) {
      setError('You are already enrolled in this class')
      return
    }

    // Add student to classroom
    const updatedClassrooms = classrooms.map(c => {
      if (c.id === classroom.id) {
        return {
          ...c,
          students: [
            ...c.students,
            {
              id: Date.now().toString(),
              name: studentName,
              rollNumber
            }
          ]
        }
      }
      return c
    })

    setClassrooms(updatedClassrooms)
    localStorage.setItem('classrooms', JSON.stringify(updatedClassrooms))
    setSuccess('Successfully joined the class!')
    
    // Clear form
    setClassCode('')
    setRollNumber('')
    setStudentName('')
  }

  return (
    <div className={`min-h-screen p-8 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <BackButton />
            <h1 className="text-3xl font-bold">Join Class</h1>
          </div>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-full ${
              isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
            } text-white`}
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>

        <div className={`p-6 rounded-lg shadow-lg ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Class Code</label>
              <input
                type="text"
                value={classCode}
                onChange={(e) => setClassCode(e.target.value.toUpperCase())}
                placeholder="Enter class code"
                className={`w-full p-2 rounded ${
                  isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Roll Number</label>
              <input
                type="text"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                placeholder="Enter your roll number"
                className={`w-full p-2 rounded ${
                  isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Enter your full name"
                className={`w-full p-2 rounded ${
                  isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'
                }`}
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            {success && (
              <div className="text-green-500 text-sm flex items-center space-x-2">
                <FaCheck />
                <span>{success}</span>
              </div>
            )}

            <button
              onClick={handleJoinClass}
              className={`w-full py-2 rounded-lg ${
                isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
              } text-white`}
            >
              Join Class
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 