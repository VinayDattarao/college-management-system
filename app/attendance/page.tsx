'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import BackButton from '../components/BackButton'

interface Student {
  id: string
  name: string
  rollNumber: string
  classId: string
}

interface Subject {
  id: string
  name: string
  code: string
}

interface Classroom {
  id: string
  name: string
  subjects: Subject[]
}

interface Attendance {
  id: string
  date: string
  present: boolean
  studentId: string
  subjectId: string
  classroomId: string
}

export default function Attendance() {
  const router = useRouter()
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const [selectedClassroom, setSelectedClassroom] = useState<string>('')
  const [selectedSubject, setSelectedSubject] = useState<string>('')
  const [students, setStudents] = useState<Student[]>([])
  const [attendance, setAttendance] = useState<Attendance[]>([])
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [isLoading, setIsLoading] = useState(true)
  const [userRole, setUserRole] = useState<string>('')
  const [studentRollNumber, setStudentRollNumber] = useState<string>('')
  const [studentClassroom, setStudentClassroom] = useState<Classroom | null>(null)
  const [tempAttendance, setTempAttendance] = useState<Attendance[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  useEffect(() => {
    const darkMode = localStorage.getItem('darkMode') === 'true'
    setIsDarkMode(darkMode)
    document.documentElement.classList.toggle('dark', darkMode)

    const userRole = localStorage.getItem('userRole')
    const rollNumber = localStorage.getItem('rollNumber')
    const classroomId = localStorage.getItem('classroomId')

    if (!userRole) {
      router.push('/')
      return
    }

    setUserRole(userRole)
    if (rollNumber) {
      setStudentRollNumber(rollNumber)
    }

    const loadData = async () => {
      setIsLoading(true)
      try {
        await fetchClassrooms()
        if (userRole === 'student' && classroomId) {
          const savedClassrooms = localStorage.getItem('classrooms')
          if (savedClassrooms) {
            const classrooms = JSON.parse(savedClassrooms)
            const classroom = classrooms.find((c: Classroom) => c.id === classroomId)
            if (classroom) {
              setStudentClassroom(classroom)
            }
          }
        } else {
          await fetchStudents()
        }
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  useEffect(() => {
    if ((userRole === 'lecturer' && selectedClassroom && selectedSubject && date) ||
        (userRole === 'student' && studentClassroom && selectedSubject && date)) {
      setIsLoading(true)
      fetchAttendance()
    } else {
      setAttendance([])
    }
  }, [selectedClassroom, studentClassroom, selectedSubject, date])

  const fetchClassrooms = async () => {
    try {
      const savedClassrooms = localStorage.getItem('classrooms')
      if (savedClassrooms) {
        setClassrooms(JSON.parse(savedClassrooms))
      }
    } catch (error) {
      console.error('Error loading classrooms:', error)
    }
  }

  const fetchStudents = async () => {
    try {
      const savedStudents = localStorage.getItem('students')
      if (savedStudents) {
        setStudents(JSON.parse(savedStudents))
      }
    } catch (error) {
      console.error('Error loading students:', error)
    }
  }

  const fetchAttendance = async () => {
    try {
      const savedAttendance = localStorage.getItem('attendance')
      if (savedAttendance) {
        const allAttendance = JSON.parse(savedAttendance)
        if (userRole === 'student') {
          const studentAttendance = allAttendance.filter((record: Attendance) => 
            record.classroomId === studentClassroom?.id && 
            record.subjectId === selectedSubject &&
            record.studentId === studentRollNumber &&
            (date ? record.date === date : true)  // Only filter by date if it's selected
          )
          // Sort by date in descending order (newest first)
          studentAttendance.sort((a: Attendance, b: Attendance) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          setAttendance(studentAttendance)
        } else {
          // For lecturer view, strictly filter by all criteria
          const filteredAttendance = allAttendance.filter((record: Attendance) => 
            record.classroomId === selectedClassroom && 
            record.subjectId === selectedSubject && 
            record.date === date
          )
          setAttendance(filteredAttendance)
        }
      } else {
        setAttendance([])
      }
    } catch (error) {
      console.error('Error loading attendance:', error)
      setAttendance([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveAttendance = () => {
    setIsSaving(true)
    setSaveMessage('')

    try {
      // Get existing attendance records
      const savedAttendance = localStorage.getItem('attendance') || '[]'
      let allAttendance = JSON.parse(savedAttendance)

      // Remove existing records for this specific class, subject, and date combination
      allAttendance = allAttendance.filter((record: Attendance) => 
        !(
          record.classroomId === selectedClassroom && 
          record.subjectId === selectedSubject && 
          record.date === date
        )
      )

      // Get all students in the selected classroom
      const classroomStudents = students.filter(student => student.classId === selectedClassroom)
      
      // Create attendance records for all students
      const newAttendanceRecords = classroomStudents.map(student => {
        // Check if there's a temporary attendance record for this student
        const tempRecord = tempAttendance.find(
          record => record.studentId === student.rollNumber
        )

        // Create a record for the student (either from temp attendance or default to absent)
        return {
          id: Date.now().toString() + student.rollNumber, // Ensure unique ID
          studentId: student.rollNumber,
          classroomId: selectedClassroom,
          subjectId: selectedSubject,
          date: date,
          present: tempRecord ? tempRecord.present : false // Default to absent if no record exists
        }
      })

      // Add new records
      allAttendance = [...allAttendance, ...newAttendanceRecords]

      // Save to localStorage
      localStorage.setItem('attendance', JSON.stringify(allAttendance))
      
      // Update the current view
      setAttendance(newAttendanceRecords)
      setTempAttendance([]) // Clear temporary attendance
      setSaveMessage('Attendance saved successfully!')
    } catch (error) {
      console.error('Error saving attendance:', error)
      setSaveMessage('Error saving attendance. Please try again.')
    } finally {
      setIsSaving(false)
      setTimeout(() => setSaveMessage(''), 3000)
    }
  }

  const handleAttendanceChange = (studentId: string, present: boolean) => {
    if (userRole !== 'lecturer') return

    const student = students.find(s => s.id === studentId)
    if (!student) return

    const newTempAttendance = [...tempAttendance]
    const existingIndex = newTempAttendance.findIndex(
      record => 
        record.studentId === student.rollNumber && 
        record.classroomId === selectedClassroom && 
        record.subjectId === selectedSubject && 
        record.date === date
    )

    if (existingIndex !== -1) {
      newTempAttendance[existingIndex].present = present
    } else {
      newTempAttendance.push({
        id: Date.now().toString() + student.rollNumber,
        studentId: student.rollNumber,
        classroomId: selectedClassroom,
        subjectId: selectedSubject,
        date,
        present
      })
    }

    setTempAttendance(newTempAttendance)
  }

  // Add initialization for attendance when component mounts
  useEffect(() => {
    // Initialize empty attendance array in localStorage if it doesn't exist
    if (!localStorage.getItem('attendance')) {
      localStorage.setItem('attendance', '[]')
    }
  }, [])

  // Update useEffect for fetching attendance to be more precise
  useEffect(() => {
    setAttendance([]) // Clear previous attendance data
    setTempAttendance([]) // Clear temporary attendance data
    
    if (userRole === 'lecturer') {
      if (selectedClassroom && selectedSubject && date) {
        setIsLoading(true)
        fetchAttendance()
      }
    } else if (userRole === 'student') {
      if (studentClassroom && selectedSubject) {
        setIsLoading(true)
        fetchAttendance()
      }
    }
  }, [selectedClassroom, studentClassroom, selectedSubject, date])

  const handleClearAttendance = () => {
    if (window.confirm('Are you sure you want to clear all attendance records? This action cannot be undone.')) {
      try {
        localStorage.setItem('attendance', '[]')
        setAttendance([])
        setTempAttendance([])
        setSaveMessage('All attendance records cleared successfully!')
        setTimeout(() => setSaveMessage(''), 3000)
      } catch (error) {
        console.error('Error clearing attendance:', error)
        setSaveMessage('Error clearing attendance records. Please try again.')
      }
    }
  }

  const renderLecturerView = () => (
    <>
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Classroom
            </label>
            <select
              value={selectedClassroom}
              onChange={(e) => {
                setSelectedClassroom(e.target.value)
                setSelectedSubject('')
              }}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">Select Classroom</option>
              {classrooms.map((classroom) => (
                <option key={classroom.id} value={classroom.id}>
                  {classroom.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              disabled={!selectedClassroom}
            >
              <option value="">Select Subject</option>
              {selectedClassroom && classrooms
                .find(c => c.id === selectedClassroom)
                ?.subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name} ({subject.code})
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end mb-4">
        <button
          onClick={handleClearAttendance}
          className="px-4 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700 flex items-center space-x-2"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
            />
          </svg>
          <span>Clear All Attendance Records</span>
        </button>
      </div>

      {selectedClassroom && selectedSubject && (
        <>
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden mb-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Roll Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {students
                    .filter(student => student.classId === selectedClassroom)
                    .map((student) => {
                      const studentAttendance = tempAttendance.find(
                        a => a.studentId === student.rollNumber
                      ) || attendance.find(
                        a => a.studentId === student.rollNumber
                      )
                      return (
                        <tr key={student.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {student.rollNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {student.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => handleAttendanceChange(student.id, !studentAttendance?.present)}
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                studentAttendance?.present
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              }`}
                            >
                              {studentAttendance?.present ? 'Present' : 'Absent'}
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handleSaveAttendance}
              disabled={isSaving || tempAttendance.length === 0}
              className={`px-4 py-2 rounded-lg text-white flex items-center space-x-2 ${
                isSaving || tempAttendance.length === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Save Attendance</span>
                </>
              )}
            </button>

            {saveMessage && (
              <div className={`px-4 py-2 rounded-lg ${
                saveMessage.includes('Error')
                  ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                  : 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
              }`}>
                {saveMessage}
              </div>
            )}
          </div>
        </>
      )}
    </>
  )

  const renderStudentView = () => (
    <>
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {studentClassroom && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Class
              </label>
              <div className="w-full rounded-md border border-gray-300 shadow-sm bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2.5">
                {studentClassroom.name}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2.5"
            >
              <option value="">Select Subject</option>
              {studentClassroom?.subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name} ({subject.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2.5"
            />
          </div>
        </div>
      </div>

      {selectedSubject && (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {attendance.length > 0 ? (
                  attendance.map((record) => (
                    <tr key={record.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {record.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          record.present
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {record.present ? 'Present' : 'Absent'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                      No attendance records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  )

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <BackButton />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Attendance</h1>
          </div>
          <button
            onClick={() => {
              const newDarkMode = !isDarkMode
              setIsDarkMode(newDarkMode)
              localStorage.setItem('darkMode', String(newDarkMode))
              document.documentElement.classList.toggle('dark', newDarkMode)
            }}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            aria-label="Toggle dark mode"
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

        {userRole === 'lecturer' ? renderLecturerView() : renderStudentView()}
      </div>
    </div>
  )
} 