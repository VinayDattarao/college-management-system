'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Subject {
  id: string
  name: string
  code: string
}

interface Class {
  id: string
  name: string
  code: string
  subjects: Subject[]
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

export default function ClassManagement() {
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
      // Initialize with CSE A class if no classes exist
      const initialClass: Class = {
        id: '1',
        name: 'CSE A',
        code: 'CSE-A',
        subjects: initialSubjects
      }
      setClasses([initialClass])
      setSelectedClass(initialClass)
      localStorage.setItem('classes', JSON.stringify([initialClass]))
    }
  }, [router])

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
      <h1 className="text-2xl font-bold mb-6">Class Management</h1>

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
        <div>
          <h2 className="text-xl font-semibold mb-4">Subjects in {selectedClass.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedClass.subjects.map(subject => (
              <div key={subject.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h3 className="font-semibold">{subject.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Code: {subject.code}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 