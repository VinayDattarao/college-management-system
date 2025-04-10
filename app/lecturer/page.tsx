'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LecturerDashboard() {
  const [userRole, setUserRole] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const role = localStorage.getItem('userRole')
    if (!role || role !== 'lecturer') {
      router.push('/')
      return
    }
    setUserRole(role)
  }, [router])

  if (!userRole) {
    return null
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Welcome to Lecturer Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Students</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Manage student data and import student lists from Excel files.
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Attendance</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Track and manage student attendance for different subjects.
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Timetable</h2>
          <p className="text-gray-600 dark:text-gray-300">
            View and manage class schedules and timetables.
          </p>
        </div>
      </div>
    </div>
  )
} 