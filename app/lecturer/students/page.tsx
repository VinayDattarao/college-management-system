'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FaFileExcel, FaDownload } from 'react-icons/fa'
import * as XLSX from 'xlsx'

interface Student {
  id: string
  name: string
  rollNumber: string
}

interface Class {
  id: string
  name: string
  code: string
  students: Student[]
}

const initialClasses = [
  {
    id: '1',
    name: 'CSE A',
    code: 'CSE-A',
    students: []
  }
]

export default function StudentsPage() {
  const [classes, setClasses] = useState<Class[]>([])
  const [selectedClass, setSelectedClass] = useState<Class | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const role = localStorage.getItem('userRole')
    if (!role) {
      router.push('/')
      return
    }
    setUserRole(role)

    const savedClasses = localStorage.getItem('classes')
    if (savedClasses) {
      const parsedClasses = JSON.parse(savedClasses)
      setClasses(parsedClasses)
      if (parsedClasses.length > 0) {
        setSelectedClass(parsedClasses[0])
      }
    } else {
      setClasses(initialClasses)
      setSelectedClass(initialClasses[0])
      localStorage.setItem('classes', JSON.stringify(initialClasses))
    }
  }, [router])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !selectedClass) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet)

        const newStudents = jsonData.map((row: any) => ({
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: row.Name || '',
          rollNumber: row['Roll Number'] || ''
        }))

        const updatedClass = {
          ...selectedClass,
          students: newStudents
        }

        const updatedClasses = classes.map(cls =>
          cls.id === selectedClass.id ? updatedClass : cls
        )

        setClasses(updatedClasses)
        setSelectedClass(updatedClass)
        localStorage.setItem('classes', JSON.stringify(updatedClasses))
      } catch (error) {
        console.error('Error processing file:', error)
      }
    }
    reader.readAsArrayBuffer(file)
  }

  const downloadTemplate = () => {
    const template = [
      {
        'Roll Number': '',
        'Name': ''
      }
    ]

    const ws = XLSX.utils.json_to_sheet(template)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Students')
    XLSX.writeFile(wb, 'student_template.xlsx')
  }

  if (userRole !== 'lecturer') {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Access Denied</h1>
        <p>Only lecturers can access this page.</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Student Management</h1>

      <div className="mb-6">
        <select
          value={selectedClass?.id || ''}
          onChange={(e) => {
            const classId = e.target.value
            const cls = classes.find(c => c.id === classId)
            setSelectedClass(cls || null)
          }}
          className="border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
        >
          {classes.map(cls => (
            <option key={cls.id} value={cls.id}>
              {cls.name} ({cls.code})
            </option>
          ))}
        </select>
      </div>

      {selectedClass && (
        <div className="space-y-6">
          <div className="flex gap-4">
            <label className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600">
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
              onClick={downloadTemplate}
              className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              <FaDownload />
              <span>Download Template</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b dark:border-gray-700">Roll Number</th>
                  <th className="px-4 py-2 border-b dark:border-gray-700">Name</th>
                </tr>
              </thead>
              <tbody>
                {selectedClass.students.map(student => (
                  <tr key={student.id}>
                    <td className="px-4 py-2 border-b dark:border-gray-700">{student.rollNumber}</td>
                    <td className="px-4 py-2 border-b dark:border-gray-700">{student.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
} 