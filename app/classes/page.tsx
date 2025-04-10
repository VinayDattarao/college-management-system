'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import BackButton from '../components/BackButton'
import { FaTrash, FaPlus, FaFileImport, FaCopy } from 'react-icons/fa'

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

interface Classroom {
  id: string
  name: string
  classCode: string
  subjects: Subject[]
  students: Student[]
}

export default function Classes() {
  const router = useRouter()
  const [userRole, setUserRole] = useState<string>('')
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true'
    }
    return false
  })
  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const [newClassroom, setNewClassroom] = useState<Classroom>({
    id: '',
    name: '',
    classCode: '',
    subjects: [],
    students: []
  })
  const [newSubject, setNewSubject] = useState<Subject>({
    id: '',
    name: '',
    code: ''
  })
  const [showAddClassroom, setShowAddClassroom] = useState(false)
  const [showAddSubject, setShowAddSubject] = useState(false)
  const [selectedClassroom, setSelectedClassroom] = useState<string>('')
  const [timetableSubjects, setTimetableSubjects] = useState<Subject[]>([])
  const [showClassCode, setShowClassCode] = useState<string | null>(null)
  const [showStudents, setShowStudents] = useState<string | null>(null)

  useEffect(() => {
    const role = localStorage.getItem('userRole')
    if (role) setUserRole(role)
    loadClassrooms()
    loadTimetableSubjects()
  }, [])

  useEffect(() => {
    localStorage.setItem('darkMode', isDarkMode.toString())
  }, [isDarkMode])

  const generateClassCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = ''
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
  }

  const loadClassrooms = () => {
    const savedClassrooms = localStorage.getItem('classrooms')
    if (savedClassrooms) {
      setClassrooms(JSON.parse(savedClassrooms))
    }
  }

  const loadTimetableSubjects = () => {
    const timetable = [
      { name: 'DM', code: 'CS301' },
      { name: 'Comm-Skills', code: 'CS302' },
      { name: 'BEFA', code: 'CS303' },
      { name: 'DBMS', code: 'CS304' },
      { name: 'OS', code: 'CS305' },
      { name: 'SE', code: 'CS306' },
      { name: 'Node.js', code: 'CS307' },
      { name: 'APTITUDE', code: 'CS308' },
      { name: 'COI', code: 'CS309' },
      { name: 'CRT/Coding', code: 'CS310' }
    ]
    setTimetableSubjects(timetable)
  }

  const handleAddClassroom = () => {
    if (newClassroom.name.trim()) {
      const classCode = generateClassCode()
      const updatedClassrooms = [
        ...classrooms,
        {
          ...newClassroom,
          id: Date.now().toString(),
          classCode
        }
      ]
      setClassrooms(updatedClassrooms)
      localStorage.setItem('classrooms', JSON.stringify(updatedClassrooms))
      setNewClassroom({ id: '', name: '', classCode: '', subjects: [], students: [] })
      setShowAddClassroom(false)
      setShowClassCode(classCode)
    }
  }

  const handleAddSubject = () => {
    if (newSubject.name.trim() && newSubject.code.trim() && selectedClassroom) {
      const updatedClassrooms = classrooms.map(classroom => {
        if (classroom.id === selectedClassroom) {
          return {
            ...classroom,
            subjects: [
              ...classroom.subjects,
              {
                ...newSubject,
                id: Date.now().toString()
              }
            ]
          }
        }
        return classroom
      })
      setClassrooms(updatedClassrooms)
      localStorage.setItem('classrooms', JSON.stringify(updatedClassrooms))
      setNewSubject({ id: '', name: '', code: '' })
      setShowAddSubject(false)
    }
  }

  const handleDeleteClassroom = (classroomId: string) => {
    const updatedClassrooms = classrooms.filter(classroom => classroom.id !== classroomId)
    setClassrooms(updatedClassrooms)
    localStorage.setItem('classrooms', JSON.stringify(updatedClassrooms))
  }

  const handleDeleteSubject = (classroomId: string, subjectId: string) => {
    const updatedClassrooms = classrooms.map(classroom => {
      if (classroom.id === classroomId) {
        return {
          ...classroom,
          subjects: classroom.subjects.filter(subject => subject.id !== subjectId)
        }
      }
      return classroom
    })
    setClassrooms(updatedClassrooms)
    localStorage.setItem('classrooms', JSON.stringify(updatedClassrooms))
  }

  const handleImportSubjects = () => {
    if (selectedClassroom) {
      const updatedClassrooms = classrooms.map(classroom => {
        if (classroom.id === selectedClassroom) {
          return {
            ...classroom,
            subjects: [
              ...classroom.subjects,
              ...timetableSubjects.filter(
                timetableSubject => 
                  !classroom.subjects.some(
                    existingSubject => existingSubject.name === timetableSubject.name
                  )
              )
            ]
          }
        }
        return classroom
      })
      setClassrooms(updatedClassrooms)
      localStorage.setItem('classrooms', JSON.stringify(updatedClassrooms))
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className={`min-h-screen p-8 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <BackButton />
            <h1 className="text-3xl font-bold">Class Management</h1>
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

        {userRole === 'lecturer' && (
          <div className="mb-8 space-y-4">
            <div className="flex space-x-4">
              <button
                onClick={() => setShowAddClassroom(true)}
                className={`px-4 py-2 rounded-lg ${
                  isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                } text-white flex items-center space-x-2`}
              >
                <FaPlus />
                <span>Add Classroom</span>
              </button>
            </div>

            {showAddClassroom && (
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                <h3 className="text-lg font-semibold mb-4">Add New Classroom</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Classroom Name"
                    value={newClassroom.name}
                    onChange={(e) => setNewClassroom({ ...newClassroom, name: e.target.value })}
                    className={`w-full p-2 rounded ${
                      isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'
                    }`}
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setShowAddClassroom(false)}
                      className="px-4 py-2 rounded-lg bg-gray-500 hover:bg-gray-600 text-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddClassroom}
                      className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {showClassCode && (
          <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            <div className={`p-6 rounded-lg shadow-xl max-w-md w-full ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <h3 className="text-lg font-semibold mb-4">Class Code Generated</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                    {showClassCode}
                  </div>
                  <button
                    onClick={() => copyToClipboard(showClassCode)}
                    className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white"
                    title="Copy to clipboard"
                  >
                    <FaCopy size={12} />
                  </button>
                </div>
                <p className="text-sm text-gray-500">
                  Share this code with your students. They can use it to join the class.
                </p>
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowClassCode(null)}
                    className="px-4 py-2 rounded-lg bg-gray-500 hover:bg-gray-600 text-white"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classrooms.map((classroom) => (
            <div
              key={classroom.id}
              className={`rounded-lg overflow-hidden shadow-lg ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <div className={`p-4 ${
                isDarkMode ? 'bg-gray-700' : 'bg-blue-500 text-white'
              }`}>
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold">{classroom.name}</h2>
                    <div className="text-sm opacity-80">Code: {classroom.classCode}</div>
                  </div>
                  {userRole === 'lecturer' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedClassroom(classroom.id)
                          setShowAddSubject(true)
                        }}
                        className="p-2 rounded-full bg-green-500 hover:bg-green-600 text-white"
                        title="Add Subject"
                      >
                        <FaPlus size={12} />
                      </button>
                      <button
                        onClick={() => handleDeleteClassroom(classroom.id)}
                        className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white"
                        title="Delete Classroom"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">Subjects</h3>
                  {userRole === 'lecturer' && (
                    <button
                      onClick={() => {
                        setSelectedClassroom(classroom.id)
                        handleImportSubjects()
                      }}
                      className="flex items-center space-x-1 text-sm text-blue-500 hover:text-blue-600"
                    >
                      <FaFileImport size={12} />
                      <span>Import from Timetable</span>
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  {classroom.subjects.map((subject) => (
                    <div
                      key={subject.id}
                      className={`p-3 rounded-lg ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-semibold">{subject.name}</div>
                          <div className="text-sm text-gray-500">{subject.code}</div>
                        </div>
                        {userRole === 'lecturer' && (
                          <button
                            onClick={() => handleDeleteSubject(classroom.id, subject.id)}
                            className="p-1 text-red-500 hover:text-red-600"
                            title="Delete Subject"
                          >
                            <FaTrash size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">Enrolled Students</h3>
                    <button
                      onClick={() => setShowStudents(showStudents === classroom.id ? null : classroom.id)}
                      className="text-sm text-blue-500 hover:text-blue-600"
                    >
                      {showStudents === classroom.id ? 'Hide' : 'Show'} Students
                    </button>
                  </div>
                  {showStudents === classroom.id && (
                    <div className="space-y-2">
                      {classroom.students.length > 0 ? (
                        classroom.students.map((student) => (
                          <div
                            key={student.id}
                            className={`p-3 rounded-lg ${
                              isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="font-semibold">{student.name}</div>
                                <div className="text-sm text-gray-500">Roll No: {student.rollNumber}</div>
                              </div>
                              {userRole === 'lecturer' && (
                                <button
                                  onClick={() => {
                                    const updatedClassrooms = classrooms.map(c => {
                                      if (c.id === classroom.id) {
                                        return {
                                          ...c,
                                          students: c.students.filter(s => s.id !== student.id)
                                        }
                                      }
                                      return c
                                    })
                                    setClassrooms(updatedClassrooms)
                                    localStorage.setItem('classrooms', JSON.stringify(updatedClassrooms))
                                  }}
                                  className="p-1 text-red-500 hover:text-red-600"
                                  title="Remove Student"
                                >
                                  <FaTrash size={12} />
                                </button>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className={`p-3 rounded-lg ${
                          isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                        } text-center text-gray-500`}>
                          No students enrolled yet
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {showAddSubject && (
          <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            <div className={`p-6 rounded-lg shadow-xl max-w-md w-full ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <h3 className="text-lg font-semibold mb-4">Add New Subject</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Subject Name"
                  value={newSubject.name}
                  onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                  className={`w-full p-2 rounded ${
                    isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'
                  }`}
                />
                <input
                  type="text"
                  placeholder="Subject Code"
                  value={newSubject.code}
                  onChange={(e) => setNewSubject({ ...newSubject, code: e.target.value })}
                  className={`w-full p-2 rounded ${
                    isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'
                  }`}
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setShowAddSubject(false)}
                    className="px-4 py-2 rounded-lg bg-gray-500 hover:bg-gray-600 text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddSubject}
                    className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 