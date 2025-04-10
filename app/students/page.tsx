'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import BackButton from '../components/BackButton'
import { FaUserPlus, FaDatabase, FaEdit, FaTrash, FaBook } from 'react-icons/fa'

interface Student {
  id: string
  name: string
  rollNumber: string
  classId: string
  class: string
  enrolledClasses?: string[]
}

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

export default function Students() {
  const router = useRouter()
  const [userRole, setUserRole] = useState<string>('')
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true'
    }
    return false
  })
  const [students, setStudents] = useState<Student[]>([])
  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const [showAddStudent, setShowAddStudent] = useState(false)
  const [selectedClassId, setSelectedClassId] = useState<string>('')
  const [newStudent, setNewStudent] = useState<Student>({
    id: '',
    name: '',
    rollNumber: '',
    classId: '',
    class: ''
  })
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)

  useEffect(() => {
    const role = localStorage.getItem('userRole')
    if (role) setUserRole(role)
    loadStudents()
    loadClassrooms()
  }, [])

  useEffect(() => {
    localStorage.setItem('darkMode', isDarkMode.toString())
  }, [isDarkMode])

  const loadStudents = () => {
    const savedStudents = localStorage.getItem('studentProfiles')
    if (savedStudents) {
      setStudents(JSON.parse(savedStudents))
    }
  }

  const loadClassrooms = () => {
    const savedClassrooms = localStorage.getItem('classrooms')
    if (savedClassrooms) {
      setClassrooms(JSON.parse(savedClassrooms))
    }
  }

  const handleAddStudent = () => {
    if (!selectedClassId) {
      alert('Please select a class first')
      return
    }

    if (newStudent.name.trim() && newStudent.rollNumber.trim()) {
      // Check for duplicates
      const isDuplicateName = students.some(s => 
        s.name.toLowerCase() === newStudent.name.toLowerCase() && 
        s.classId === selectedClassId
      )
      const isDuplicateRoll = students.some(s => 
        s.rollNumber.toLowerCase() === newStudent.rollNumber.toLowerCase()
      )

      if (isDuplicateName) {
        alert('A student with this name already exists in this class')
        return
      }

      if (isDuplicateRoll) {
        alert('A student with this roll number already exists')
        return
      }

      const studentId = Date.now().toString()
      const selectedClassroom = classrooms.find(c => c.id === selectedClassId)
      
      if (!selectedClassroom) {
        alert('Selected class not found')
        return
      }

      const updatedStudent = {
        ...newStudent,
        id: studentId,
        classId: selectedClassId,
        class: selectedClassroom.name
      }

      // Update students list and database
      const allStudents = [...students]
      const databaseStudents = JSON.parse(localStorage.getItem('studentDatabase') || '[]')
      
      allStudents.push(updatedStudent)
      databaseStudents.push({
        ...updatedStudent,
        lastUpdated: new Date().toISOString()
      })

      setStudents(allStudents)
      localStorage.setItem('studentProfiles', JSON.stringify(allStudents))
      localStorage.setItem('studentDatabase', JSON.stringify(databaseStudents))

      // Update classroom
      const updatedClassrooms = classrooms.map(classroom => {
        if (classroom.id === selectedClassId) {
          return {
            ...classroom,
            students: [...classroom.students, updatedStudent]
          }
        }
        return classroom
      })
      setClassrooms(updatedClassrooms)
      localStorage.setItem('classrooms', JSON.stringify(updatedClassrooms))

      setNewStudent({ id: '', name: '', rollNumber: '', classId: '', class: '' })
      setShowAddStudent(false)
    } else {
      alert('Please fill in all required fields')
    }
  }

  const handleViewProfile = (student: Student) => {
    localStorage.setItem('selectedStudent', JSON.stringify(student))
    router.push(`/profile?rollNumber=${student.rollNumber}`)
  }

  const handleDeleteStudent = (studentId: string, rollNumber: string) => {
    // Remove from students list
    const updatedStudents = students.filter(s => s.id !== studentId)
    setStudents(updatedStudents)
    localStorage.setItem('studentProfiles', JSON.stringify(updatedStudents))

    // Remove from student database
    const databaseStudents = JSON.parse(localStorage.getItem('studentDatabase') || '[]')
    const updatedDatabaseStudents = databaseStudents.filter((s: Student) => s.id !== studentId)
    localStorage.setItem('studentDatabase', JSON.stringify(updatedDatabaseStudents))

    // Remove from all classrooms
    const updatedClassrooms = classrooms.map(classroom => ({
      ...classroom,
      students: classroom.students.filter(s => s.id !== studentId)
    }))
    setClassrooms(updatedClassrooms)
    localStorage.setItem('classrooms', JSON.stringify(updatedClassrooms))

    // Remove student profile
    localStorage.removeItem(`studentProfile_${rollNumber}`)

    // Clean up any other student-related data
    const savedProfiles = localStorage.getItem('studentProfiles')
    if (savedProfiles) {
      const profiles = JSON.parse(savedProfiles)
      const updatedProfiles = profiles.filter((p: Student) => p.rollNumber !== rollNumber)
      localStorage.setItem('studentProfiles', JSON.stringify(updatedProfiles))
    }
  }

  const handleLoadStudents = () => {
    if (!selectedClassId) {
      alert('Please select a class first')
      return
    }

    const selectedClassroom = classrooms.find(c => c.id === selectedClassId)
    if (selectedClassroom) {
      // Get all students from the database
      const databaseStudents = JSON.parse(localStorage.getItem('studentDatabase') || '[]')
      
      // Filter out students who are already in the class
      const existingStudentIds = new Set(selectedClassroom.students.map(s => s.id))
      const studentsToAdd = databaseStudents.filter((s: Student) => !existingStudentIds.has(s.id))
      
      if (studentsToAdd.length === 0) {
        alert('No new students to add to this class')
        return
      }

      // Update the students with class information
      const updatedStudentsForClass = studentsToAdd.map((student: Student) => ({
        ...student,
        classId: selectedClassId,
        class: selectedClassroom.name
      }))

      // Update classroom with new students
      const updatedClassroom = {
        ...selectedClassroom,
        students: [...selectedClassroom.students, ...updatedStudentsForClass]
      }

      // Update classrooms state and storage
      const updatedClassrooms = classrooms.map(c => 
        c.id === selectedClassId ? updatedClassroom : c
      )
      setClassrooms(updatedClassrooms)
      localStorage.setItem('classrooms', JSON.stringify(updatedClassrooms))

      // Update students list
      const allStudents = [...students, ...updatedStudentsForClass]
      setStudents(allStudents)
      localStorage.setItem('studentProfiles', JSON.stringify(allStudents))

      // Update database with enrollment information
      const updatedDatabaseStudents = databaseStudents.map((s: Student) => {
        const matchingStudent = updatedStudentsForClass.find(us => us.id === s.id)
        if (matchingStudent) {
          return {
            ...s,
            enrolledClasses: [...(s.enrolledClasses || []), selectedClassId],
            lastUpdated: new Date().toISOString()
          }
        }
        return s
      })
      localStorage.setItem('studentDatabase', JSON.stringify(updatedDatabaseStudents))

      alert(`Successfully enrolled ${updatedStudentsForClass.length} new students in ${selectedClassroom.name}`)
    }
  }

  const handleDatabaseClick = () => {
    router.push('/student-database')
  }

  const handleEditClick = (student: Student) => {
    setEditingStudent(student)
  }

  const handleSaveEdit = () => {
    if (!editingStudent) return

    // Check for duplicates excluding the current student
    const isDuplicateName = students.some(s => 
      s.name.toLowerCase() === editingStudent.name.toLowerCase() && 
      s.classId === editingStudent.classId &&
      s.id !== editingStudent.id
    )
    const isDuplicateRoll = students.some(s => 
      s.rollNumber.toLowerCase() === editingStudent.rollNumber.toLowerCase() &&
      s.id !== editingStudent.id
    )

    if (isDuplicateName) {
      alert('A student with this name already exists in this class')
      return
    }

    if (isDuplicateRoll) {
      alert('A student with this roll number already exists')
      return
    }

    // Update students list
    const updatedStudents = students.map(s => 
      s.id === editingStudent.id ? editingStudent : s
    )
    setStudents(updatedStudents)
    localStorage.setItem('studentProfiles', JSON.stringify(updatedStudents))

    // Update student database
    const databaseStudents = JSON.parse(localStorage.getItem('studentDatabase') || '[]')
    const updatedDatabaseStudents = databaseStudents.map((s: Student) => {
      if (s.id === editingStudent.id) {
        return {
          ...editingStudent,
          lastUpdated: new Date().toISOString()
        }
      }
      return s
    })
    localStorage.setItem('studentDatabase', JSON.stringify(updatedDatabaseStudents))

    // Update classroom
    const updatedClassrooms = classrooms.map(classroom => ({
      ...classroom,
      students: classroom.students.map(s => 
        s.id === editingStudent.id ? editingStudent : s
      )
    }))
    setClassrooms(updatedClassrooms)
    localStorage.setItem('classrooms', JSON.stringify(updatedClassrooms))

    setEditingStudent(null)
  }

  const displayedClassroom = selectedClassId 
    ? classrooms.find(c => c.id === selectedClassId)
    : null

  if (userRole !== 'lecturer') {
    return <div className="p-8 text-center">Access denied</div>
  }

  return (
    <div className={`min-h-screen p-8 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <BackButton />
            <h1 className="text-3xl font-bold">Students</h1>
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
              onClick={() => setShowAddStudent(true)}
              disabled={!selectedClassId}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                !selectedClassId
                  ? 'bg-gray-400 cursor-not-allowed'
                  : isDarkMode
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white`}
            >
              <FaUserPlus />
              <span>Add Student</span>
            </button>
            <button
              onClick={handleLoadStudents}
              disabled={!selectedClassId}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                !selectedClassId
                  ? 'bg-gray-400 cursor-not-allowed'
                  : isDarkMode
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-green-500 hover:bg-green-600'
              } text-white`}
            >
              <FaBook />
              <span>Load Students</span>
            </button>
            <button
              onClick={handleDatabaseClick}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                isDarkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'
              } text-white`}
            >
              <FaDatabase />
              <span>Student Database</span>
            </button>
          </div>
        </div>

        {showAddStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className={`p-6 rounded-lg shadow-xl max-w-md w-full ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <h3 className="text-lg font-semibold mb-4">
                Add New Student to {displayedClassroom?.name}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Student Name</label>
                  <input
                    type="text"
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                    className={`w-full p-2 rounded border ${
                      isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                    }`}
                    placeholder="Enter student name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Roll Number</label>
                  <input
                    type="text"
                    value={newStudent.rollNumber}
                    onChange={(e) => setNewStudent({ ...newStudent, rollNumber: e.target.value })}
                    className={`w-full p-2 rounded border ${
                      isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                    }`}
                    placeholder="Enter roll number"
                  />
                </div>
                <div className="flex justify-end space-x-2 mt-6">
                  <button
                    onClick={() => setShowAddStudent(false)}
                    className="px-4 py-2 rounded-lg bg-gray-500 hover:bg-gray-600 text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddStudent}
                    className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    Add Student
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Display students for selected class */}
        {displayedClassroom && (
          <div className={`p-6 rounded-lg shadow-lg ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h2 className="text-xl font-semibold mb-4">{displayedClassroom.name} ({displayedClassroom.classCode})</h2>
            {displayedClassroom.students.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No students enrolled yet</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedClassroom.students.map((student) => (
                  <div
                    key={student.id}
                    className={`p-4 rounded-lg shadow-md ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-grow">
                        {editingStudent?.id === student.id ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={editingStudent.name}
                              onChange={(e) => setEditingStudent({
                                ...editingStudent,
                                name: e.target.value
                              })}
                              className={`w-full p-2 rounded border ${
                                isDarkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'
                              }`}
                              placeholder="Student Name"
                            />
                            <input
                              type="text"
                              value={editingStudent.rollNumber}
                              onChange={(e) => setEditingStudent({
                                ...editingStudent,
                                rollNumber: e.target.value
                              })}
                              className={`w-full p-2 rounded border ${
                                isDarkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'
                              }`}
                              placeholder="Roll Number"
                            />
                            <div className="flex space-x-2">
                              <button
                                onClick={handleSaveEdit}
                                className="px-3 py-1 rounded bg-green-500 hover:bg-green-600 text-white"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingStudent(null)}
                                className="px-3 py-1 rounded bg-gray-500 hover:bg-gray-600 text-white"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <h3 className="text-lg font-semibold">{student.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Roll No: {student.rollNumber}</p>
                          </>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditClick(student)}
                          className="p-2 rounded-full text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteStudent(student.id, student.rollNumber)}
                          className="p-2 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-900"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 