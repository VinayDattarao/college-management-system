'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FaFileExcel, FaDownload, FaEdit, FaSave, FaTimes } from 'react-icons/fa'
import * as XLSX from 'xlsx'
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

interface Grade {
  id: string
  studentId: string
  classroomId: string
  subjectId: string
  midExamMarks: number
  labMarks: number
  assignmentMarks: number
  seminarMarks: number
  projectMarks: number
  grade: string // A, B, C, D, F
}

export default function Grades() {
  const router = useRouter()
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const [selectedClassroom, setSelectedClassroom] = useState<string>('')
  const [selectedSubject, setSelectedSubject] = useState<string>('')
  const [students, setStudents] = useState<Student[]>([])
  const [grades, setGrades] = useState<Grade[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [userRole, setUserRole] = useState<string>('')
  const [studentRollNumber, setStudentRollNumber] = useState<string>('')
  const [studentClassroom, setStudentClassroom] = useState<Classroom | null>(null)
  const [saveMessage, setSaveMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [tempGrades, setTempGrades] = useState<Grade[]>([])
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

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

  const calculateGrade = (midExam: number, lab: number, assignment: number, seminar: number, project: number) => {
    const total = midExam + lab + assignment + seminar + project
    if (total >= 90) return 'A'
    if (total >= 80) return 'B'
    if (total >= 70) return 'C'
    if (total >= 60) return 'D'
    return 'F'
  }

  useEffect(() => {
    if ((userRole === 'lecturer' && selectedClassroom && selectedSubject) ||
        (userRole === 'student' && studentClassroom && selectedSubject)) {
      setTempGrades([])
      setHasUnsavedChanges(false)
      fetchGrades()
    } else {
      setGrades([])
      setTempGrades([])
      setHasUnsavedChanges(false)
    }
  }, [selectedClassroom, studentClassroom, selectedSubject])

  useEffect(() => {
    return () => {
      setTempGrades([])
      setHasUnsavedChanges(false)
    }
  }, [selectedSubject])

  const handleSaveGrades = (studentId: string, grades: Partial<Grade>) => {
    try {
      const student = students.find(s => s.id === studentId)
      if (!student) throw new Error('Student not found')

      const newGrade: Grade = {
        id: Date.now().toString(),
        studentId: student.rollNumber,
        classroomId: selectedClassroom,
        subjectId: selectedSubject,
        midExamMarks: grades.midExamMarks || 0,
        labMarks: grades.labMarks || 0,
        assignmentMarks: grades.assignmentMarks || 0,
        seminarMarks: grades.seminarMarks || 0,
        projectMarks: grades.projectMarks || 0,
        grade: calculateGrade(
          grades.midExamMarks || 0,
          grades.labMarks || 0,
          grades.assignmentMarks || 0,
          grades.seminarMarks || 0,
          grades.projectMarks || 0
        )
      }

      setTempGrades(prevGrades => {
        const newGrades = prevGrades.filter(g => 
          !(g.studentId === student.rollNumber && 
            g.subjectId === selectedSubject && 
            g.classroomId === selectedClassroom)
        )
        return [...newGrades, newGrade]
      })
      setHasUnsavedChanges(true)
      setSaveMessage('Changes are not saved yet. Click "Save All Changes" to save permanently.')
    } catch (error) {
      console.error('Error updating grades:', error)
      setSaveMessage('Error updating grades. Please try again.')
    }
  }

  const handleSaveAllGrades = () => {
    setIsSaving(true)
    setSaveMessage('')

    try {
      const savedGrades = localStorage.getItem('grades') || '[]'
      let allGrades = JSON.parse(savedGrades)

      // Remove existing grades for this class and subject
      allGrades = allGrades.filter((grade: Grade) => 
        !(grade.classroomId === selectedClassroom && 
          grade.subjectId === selectedSubject)
      )

      // Add all temporary grades
      allGrades = [...allGrades, ...tempGrades]
      
      localStorage.setItem('grades', JSON.stringify(allGrades))
      setGrades(tempGrades)
      setHasUnsavedChanges(false)
      setSaveMessage('All grades saved successfully!')
    } catch (error) {
      console.error('Error saving all grades:', error)
      setSaveMessage('Error saving grades. Please try again.')
    } finally {
      setIsSaving(false)
      setTimeout(() => setSaveMessage(''), 3000)
    }
  }

  const handleClearGrades = () => {
    if (window.confirm('Are you sure you want to clear all grades? This action cannot be undone.')) {
      try {
        localStorage.setItem('grades', '[]')
        setGrades([])
        setTempGrades([])
        setHasUnsavedChanges(false)
        setSaveMessage('All grades cleared successfully!')
        setTimeout(() => setSaveMessage(''), 3000)
      } catch (error) {
        console.error('Error clearing grades:', error)
        setSaveMessage('Error clearing grades. Please try again.')
      }
    }
  }

  const fetchGrades = () => {
    try {
      const savedGrades = localStorage.getItem('grades')
      if (savedGrades) {
        const allGrades = JSON.parse(savedGrades)
        if (userRole === 'student') {
          const studentGrades = allGrades.filter((grade: Grade) =>
            grade.studentId === studentRollNumber &&
            grade.subjectId === selectedSubject &&
            grade.classroomId === studentClassroom?.id
          )
          setGrades(studentGrades)
        } else {
          const classGrades = allGrades.filter((grade: Grade) =>
            grade.classroomId === selectedClassroom &&
            grade.subjectId === selectedSubject
          )
          setGrades(classGrades)
        }
      }
    } catch (error) {
      console.error('Error loading grades:', error)
      setGrades([])
    }
  }

  const handleResetGrades = (studentId: string) => {
    try {
      const student = students.find(s => s.id === studentId)
      if (!student) throw new Error('Student not found')

      // Remove the student's grade from temporary grades
      setTempGrades(prevGrades => 
        prevGrades.filter(g => 
          !(g.studentId === student.rollNumber && 
            g.subjectId === selectedSubject && 
            g.classroomId === selectedClassroom)
        )
      )

      // Always set hasUnsavedChanges to true when resetting
      setHasUnsavedChanges(true)
      setSaveMessage('Grades reset for this student. Click "Save All Changes" to confirm.')
    } catch (error) {
      console.error('Error resetting grades:', error)
      setSaveMessage('Error resetting grades. Please try again.')
    }
  }

  const renderLecturerView = () => (
    <>
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Classroom
            </label>
            <select
              value={selectedClassroom}
              onChange={(e) => {
                if (hasUnsavedChanges) {
                  if (window.confirm('You have unsaved changes. Are you sure you want to switch classrooms? All unsaved changes will be lost.')) {
                    setSelectedClassroom(e.target.value)
                    setSelectedSubject('')
                  }
                } else {
                  setSelectedClassroom(e.target.value)
                  setSelectedSubject('')
                }
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
              onChange={(e) => {
                if (hasUnsavedChanges) {
                  if (window.confirm('You have unsaved changes. Are you sure you want to switch subjects? All unsaved changes will be lost.')) {
                    setSelectedSubject(e.target.value)
                  }
                } else {
                  setSelectedSubject(e.target.value)
                }
              }}
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
        </div>
      </div>

      <div className="flex justify-between mb-4">
        <button
          onClick={handleClearGrades}
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
          <span>Clear All Grades</span>
        </button>

        <div className="flex items-center space-x-4">
          {hasUnsavedChanges && (
            <button
              onClick={handleSaveAllGrades}
              disabled={isSaving}
              className={`px-4 py-2 rounded-lg text-white bg-green-600 hover:bg-green-700 flex items-center space-x-2 ${
                isSaving ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <FaSave className="h-5 w-5" />
              <span>{isSaving ? 'Saving...' : 'Save All Changes'}</span>
            </button>
          )}
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
      </div>

      {selectedClassroom && selectedSubject && (
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
                    Mid-Exam (35)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Lab (40)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Assignment (5)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Seminar (5)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Project (5)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Grade
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {students
                  .filter(student => student.classId === selectedClassroom)
                  .map((student) => {
                    const studentGrade = tempGrades.find(g => g.studentId === student.rollNumber) ||
                                       grades.find(g => g.studentId === student.rollNumber)
                    return (
                      <tr key={student.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {student.rollNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {student.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <input
                            type="number"
                            min="0"
                            max="35"
                            value={studentGrade?.midExamMarks || ''}
                            onChange={(e) => {
                              const value = Math.min(35, Math.max(0, parseInt(e.target.value) || 0))
                              handleSaveGrades(student.id, {
                                ...studentGrade,
                                midExamMarks: value
                              })
                            }}
                            className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <input
                            type="number"
                            min="0"
                            max="40"
                            value={studentGrade?.labMarks || ''}
                            onChange={(e) => {
                              const value = Math.min(40, Math.max(0, parseInt(e.target.value) || 0))
                              handleSaveGrades(student.id, {
                                ...studentGrade,
                                labMarks: value
                              })
                            }}
                            className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <input
                            type="number"
                            min="0"
                            max="5"
                            value={studentGrade?.assignmentMarks || ''}
                            onChange={(e) => {
                              const value = Math.min(5, Math.max(0, parseInt(e.target.value) || 0))
                              handleSaveGrades(student.id, {
                                ...studentGrade,
                                assignmentMarks: value
                              })
                            }}
                            className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <input
                            type="number"
                            min="0"
                            max="5"
                            value={studentGrade?.seminarMarks || ''}
                            onChange={(e) => {
                              const value = Math.min(5, Math.max(0, parseInt(e.target.value) || 0))
                              handleSaveGrades(student.id, {
                                ...studentGrade,
                                seminarMarks: value
                              })
                            }}
                            className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <input
                            type="number"
                            min="0"
                            max="5"
                            value={studentGrade?.projectMarks || ''}
                            onChange={(e) => {
                              const value = Math.min(5, Math.max(0, parseInt(e.target.value) || 0))
                              handleSaveGrades(student.id, {
                                ...studentGrade,
                                projectMarks: value
                              })
                            }}
                            className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            studentGrade?.grade === 'A' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                            studentGrade?.grade === 'B' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                            studentGrade?.grade === 'C' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                            studentGrade?.grade === 'D' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                            'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {studentGrade?.grade || 'N/A'}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  )

  const renderStudentView = () => (
    <>
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              className="w-full rounded-md border border-gray-300 shadow-sm bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2.5"
            >
              <option value="">Select Subject</option>
              {studentClassroom?.subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name} ({subject.code})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {selectedSubject && grades.length > 0 && (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Your Grades
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">Mid-Exam</h3>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {grades[0]?.midExamMarks}/35
                </p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">Lab</h3>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {grades[0]?.labMarks}/40
                </p>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">Assignment</h3>
                <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                  {grades[0]?.assignmentMarks}/5
                </p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-purple-800 dark:text-purple-200 mb-2">Seminar</h3>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {grades[0]?.seminarMarks}/5
                </p>
              </div>
              <div className="bg-pink-50 dark:bg-pink-900/20 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-pink-800 dark:text-pink-200 mb-2">Project</h3>
                <p className="text-2xl font-bold text-pink-900 dark:text-pink-100">
                  {grades[0]?.projectMarks}/5
                </p>
              </div>
            </div>
            <div className="mt-6 text-center">
              <div className="inline-block">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Final Grade</h3>
                <span className={`px-6 py-2 rounded-full text-lg font-medium ${
                  grades[0]?.grade === 'A' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                  grades[0]?.grade === 'B' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                  grades[0]?.grade === 'C' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                  grades[0]?.grade === 'D' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                  'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {grades[0]?.grade}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedSubject && grades.length === 0 && (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            No grades available for this subject yet.
          </p>
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Grades</h1>
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