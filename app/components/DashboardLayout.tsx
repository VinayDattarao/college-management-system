'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FaBell, FaMoon, FaSun, FaSignOutAlt } from 'react-icons/fa'

interface DashboardLayoutProps {
  children: React.ReactNode
  userRole: 'student' | 'lecturer'
  onLogout: () => void
}

export default function DashboardLayout({ children, userRole, onLogout }: DashboardLayoutProps) {
  const router = useRouter()
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [notifications, setNotifications] = useState<string[]>([])
  const [showNotifications, setShowNotifications] = useState(false)

  useEffect(() => {
    // Check system preference for dark mode
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setIsDarkMode(prefersDark)
    document.documentElement.classList.toggle('dark', prefersDark)

    // Load demo notifications
    setNotifications([
      'New assignment posted in CS101',
      'Upcoming class in 30 minutes',
      'Grade updated for Data Structures'
    ])
  }, [])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Visi Coders
              </h1>
            </div>

            {/* Navigation */}
            <nav className="flex items-center">
              {/* Theme Toggle */}
              <div className="mr-8">
                <button
                  onClick={toggleDarkMode}
                  className="p-2.5 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Toggle dark mode"
                >
                  {isDarkMode ? <FaSun className="w-5 h-5" /> : <FaMoon className="w-5 h-5" />}
                </button>
              </div>

              {/* Notifications */}
              <div className="relative mr-8">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2.5 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 relative"
                  aria-label="Notifications"
                >
                  <FaBell className="w-5 h-5" />
                  {notifications.length > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
                  )}
                </button>
                {showNotifications && notifications.length > 0 && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50 border border-gray-200 dark:border-gray-700">
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h3>
                    </div>
                    {notifications.map((notification, index) => (
                      <div
                        key={index}
                        className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                      >
                        <p className="text-sm text-gray-700 dark:text-gray-300">{notification}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="flex items-center space-x-2 mr-8">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-300">
                    {userRole.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-300">
                  {userRole === 'lecturer' ? 'Lecturer' : 'Student'}
                </span>
              </div>

              {/* Logout Button */}
              <div className="border-l border-gray-200 dark:border-gray-700 pl-8">
                <button
                  onClick={onLogout}
                  className="p-2.5 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Logout"
                >
                  <FaSignOutAlt className="w-5 h-5" />
                </button>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  )
} 