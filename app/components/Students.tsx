'use client'

import { useState, useEffect } from 'react'
import { FaPlus, FaTrash, FaFileExcel, FaUpload, FaUserPlus, FaEraser } from 'react-icons/fa'
import * as XLSX from 'xlsx'
import { useRouter } from 'next/navigation'
import BackButton from './BackButton'

interface Student {
  id: string
  name: string
  rollNumber: string
  email: string
}

export default function Students() {
  const router = useRouter()
  const [students, setStudents] = useState<Student[]>(() => {
    // Initialize with 60 students with specified roll numbers
    const initialStudents: Student[] = [];
    for (let i = 1; i <= 60; i++) {
      const rollNumber = `23E41A05${i.toString().padStart(2, '0')}`;
      initialStudents.push({
        id: i.toString(),
        name: `Student ${i}`,
        rollNumber,
        email: `student${i}@example.com`
      });
    }
    return initialStudents;
  });
  const [newStudent, setNewStudent] = useState<Partial<Student>>({})
  const [isAddingStudent, setIsAddingStudent] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const darkMode = localStorage.getItem('darkMode') === 'true'
    setIsDarkMode(darkMode)

    const role = localStorage.getItem('userRole')
    if (!role) {
      router.push('/')
      return
    }
    setUserRole(role)

    const savedStudents = localStorage.getItem('students')
    if (savedStudents) {
      setStudents(JSON.parse(savedStudents))
    }
  }, [router])

  const validateStudent = (student: Partial<Student>): string | null => {
    if (!student.name || student.name.trim() === '') {
      return 'Name is required'
    }
    if (!student.rollNumber || student.rollNumber.trim() === '') {
      return 'Roll Number is required'
    }
    if (!student.email || student.email.trim() === '') {
      return 'Email is required'
    }
    if (!student.email.includes('@')) {
      return 'Invalid email format'
    }
    return null
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet)

        const errors: string[] = []
        const newStudents = jsonData.map((row: any, index: number) => {
          if (!row.Name || !row['Roll Number'] || !row.Email) {
            errors.push(`Row ${index + 1}: Missing required fields`)
            return null
          }

          const student = {
            id: `student-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: row.Name.toString().trim(),
            rollNumber: row['Roll Number'].toString().trim(),
            email: row.Email.toString().trim()
          }

          const validationError = validateStudent(student)
          if (validationError) {
            errors.push(`Row ${index + 1}: ${validationError}`)
            return null
          }

          return student
        }).filter(Boolean) as Student[]

        if (errors.length > 0) {
          setError(`Import errors:\n${errors.join('\n')}`)
          return
        }

        if (newStudents.length === 0) {
          setError('No valid students found in the Excel file')
          return
        }

        setStudents(prevStudents => {
          const updatedStudents = [...prevStudents, ...newStudents]
          localStorage.setItem('students', JSON.stringify(updatedStudents))
          return updatedStudents
        })
        setError('')
      } catch (error) {
        console.error('Error processing file:', error)
        setError('Error processing Excel file. Please check the file format.')
      }
    }
    reader.readAsArrayBuffer(file)
  }

  const handleAddStudent = () => {
    const validationError = validateStudent(newStudent)
    if (validationError) {
      setError(validationError)
      return
    }

    const student: Student = {
      id: `student-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: newStudent.name!,
      rollNumber: newStudent.rollNumber!,
      email: newStudent.email!
    }

    setStudents(prevStudents => {
      const updatedStudents = [...prevStudents, student]
      localStorage.setItem('students', JSON.stringify(updatedStudents))
      return updatedStudents
    })
    setNewStudent({})
    setIsAddingStudent(false)
    setError('')
  }

  const handleDeleteStudent = (studentId: string) => {
    if (!confirm('Are you sure you want to delete this student?')) return

    setStudents(prevStudents => {
      const updatedStudents = prevStudents.filter(s => s.id !== studentId)
      localStorage.setItem('students', JSON.stringify(updatedStudents))
      return updatedStudents
    })
  }

  const handleClearAll = () => {
    if (confirm('Are you sure you want to delete all student data? This action cannot be undone.')) {
      setStudents([])
      localStorage.setItem('students', JSON.stringify([]))
      setError('')
    }
  }

  if (userRole !== 'lecturer') {
    return (
      <div className={`p-6 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white'}`}>
        <BackButton />
        <div className="text-center text-red-500">
          Only lecturers can access this page
        </div>
      </div>
    )
  }

  return (
    <div className={`p-6 min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white'}`}>
      <BackButton />
      <h1 className="text-2xl font-bold mb-6">Student Management</h1>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-4">
            <label className={`flex items-center gap-2 px-4 py-2 rounded cursor-pointer ${
              isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
            } text-white`}>
              <FaFileExcel />
              <span>Import Excel</span>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            <button
              onClick={() => setIsAddingStudent(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded ${
                isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'
              } text-white`}
            >
              <FaUserPlus />
              <span>Add Student</span>
            </button>
            {students.length > 0 && (
              <button
                onClick={handleClearAll}
                className={`flex items-center gap-2 px-4 py-2 rounded ${
                  isDarkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'
                } text-white`}
              >
                <FaEraser />
                <span>Clear All</span>
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 rounded-lg whitespace-pre-line">
            {error}
          </div>
        )}

        {isAddingStudent && (
          <div className={`p-4 rounded-lg shadow mb-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h4 className="font-semibold mb-2">Add New Student</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <input
                type="text"
                placeholder="Name"
                value={newStudent.name || ''}
                onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                className={`border rounded px-3 py-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
              />
              <input
                type="text"
                placeholder="Roll Number"
                value={newStudent.rollNumber || ''}
                onChange={(e) => setNewStudent({ ...newStudent, rollNumber: e.target.value })}
                className={`border rounded px-3 py-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
              />
              <input
                type="email"
                placeholder="Email"
                value={newStudent.email || ''}
                onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                className={`border rounded px-3 py-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setIsAddingStudent(false)
                  setNewStudent({})
                  setError('')
                }}
                className={`px-4 py-2 rounded ${
                  isDarkMode ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-500 hover:bg-gray-600'
                } text-white`}
              >
                Cancel
              </button>
              <button
                onClick={handleAddStudent}
                className={`px-4 py-2 rounded ${
                  isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'
                } text-white`}
              >
                Save
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className={`min-w-full rounded-lg shadow ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <thead>
              <tr>
                <th className={`px-6 py-3 border-b ${isDarkMode ? 'border-gray-700 bg-gray-900 text-gray-400' : 'border-gray-200 bg-gray-50 text-gray-500'} text-left text-xs font-medium uppercase tracking-wider`}>
                  Name
                </th>
                <th className={`px-6 py-3 border-b ${isDarkMode ? 'border-gray-700 bg-gray-900 text-gray-400' : 'border-gray-200 bg-gray-50 text-gray-500'} text-left text-xs font-medium uppercase tracking-wider`}>
                  Roll Number
                </th>
                <th className={`px-6 py-3 border-b ${isDarkMode ? 'border-gray-700 bg-gray-900 text-gray-400' : 'border-gray-200 bg-gray-50 text-gray-500'} text-left text-xs font-medium uppercase tracking-wider`}>
                  Email
                </th>
                <th className={`px-6 py-3 border-b ${isDarkMode ? 'border-gray-700 bg-gray-900 text-gray-400' : 'border-gray-200 bg-gray-50 text-gray-500'} text-left text-xs font-medium uppercase tracking-wider`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {students.map(student => (
                <tr key={student.id}>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {student.name}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {student.rollNumber}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {student.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleDeleteStudent(student.id)}
                      className={`text-red-500 hover:text-red-700 ${isDarkMode ? 'hover:text-red-400' : ''}`}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 