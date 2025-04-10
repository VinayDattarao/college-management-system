'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { FaChartBar, FaBook, FaUserGraduate, FaCalendar, FaGraduationCap } from 'react-icons/fa'
import NotificationBell from './NotificationBell'
import { useState, useEffect } from 'react'

interface DashboardLayoutProps {
  children: React.ReactNode
  userRole: 'student' | 'lecturer'
  onLogout: () => void
}

export default function DashboardLayout({ children, userRole, onLogout }: DashboardLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const isLecturer = userRole === 'lecturer'
  const [lecturerName, setLecturerName] = useState('')
  const [studentRollNumber, setStudentRollNumber] = useState('')

  useEffect(() => {
    if (isLecturer) {
      const name = localStorage.getItem('lecturerName')
      setLecturerName(name || 'Lecturer')
    } else {
      const rollNumber = localStorage.getItem('rollNumber')
      setStudentRollNumber(rollNumber || '')
    }
  }, [isLecturer])

  const navigationLinks = isLecturer ? [
    { href: '/dashboard', icon: FaChartBar, label: 'Dashboard' },
    { href: '/classes', icon: FaBook, label: 'Manage Classes' },
    { href: '/students', icon: FaUserGraduate, label: 'Students' },
    { href: '/attendance', icon: FaCalendar, label: 'Attendance' },
    { href: '/timetable', icon: FaCalendar, label: 'Timetable' },
    { href: '/grades', icon: FaGraduationCap, label: 'Grades' },
  ] : [
    { href: '/dashboard', icon: FaChartBar, label: 'Dashboard' },
    { href: '/profile', icon: FaUserGraduate, label: 'My Profile' },
    { href: '/classes', icon: FaBook, label: 'My Classes' },
    { href: '/attendance', icon: FaCalendar, label: 'My Attendance' },
    { href: '/timetable', icon: FaCalendar, label: 'Timetable' },
    { href: '/grades', icon: FaGraduationCap, label: 'My Grades' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="fixed w-64 h-full bg-white dark:bg-gray-800 shadow-lg">
        <div className="p-6 border-b dark:border-gray-700">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Visi Coders</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {isLecturer ? 'Lecturer Portal' : 'Student Portal'}
          </p>
        </div>
        <nav className="mt-6">
          {navigationLinks.map((link) => (
            <Link 
              key={link.href}
              href={link.href} 
              className={`flex items-center px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                pathname === link.href ? 'bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400' : ''
              }`}
            >
              <link.icon className="mr-3" /> {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="flex justify-between items-center px-8 py-4">
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 dark:text-gray-300">
                {isLecturer ? lecturerName : `Roll No: ${studentRollNumber}`}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {isLecturer ? 'Computer Science Department' : 'Computer Science, Year 2'}
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <NotificationBell userRole={userRole} />
              <button 
                onClick={onLogout}
                className="text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  )
} 