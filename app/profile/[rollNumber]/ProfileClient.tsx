'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import BackButton from '../../components/BackButton'

interface StudentProfile {
  rollNumber: string
  name: string
  email: string
  phone: string
  dateOfBirth: string
  address: string
  parentName: string
  parentPhone: string
  bloodGroup: string
  photo: string
  department: string
  semester: string
  academicYear: string
}

interface ProfileClientProps {
  params: {
    rollNumber: string
  }
}

export default function ProfileClient({ params }: ProfileClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [profile, setProfile] = useState<StudentProfile | null>(null)
  const [userRole, setUserRole] = useState<string>('')

  useEffect(() => {
    const role = localStorage.getItem('userRole')
    setUserRole(role || '')

    const rollNumber = searchParams?.get('rollNumber') || params.rollNumber
    if (rollNumber) {
      const savedProfiles = localStorage.getItem('studentProfiles')
      if (savedProfiles) {
        const profiles = JSON.parse(savedProfiles)
        const studentProfile = profiles.find((p: StudentProfile) => p.rollNumber === rollNumber)
        if (studentProfile) {
          setProfile(studentProfile)
        }
      }
    }
  }, [searchParams, params.rollNumber])

  if (!profile) {
    return <div className="p-8 text-center">Profile not found</div>
  }

  if (userRole !== 'lecturer' && userRole !== 'student') {
    return <div className="p-8 text-center">Access denied</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <BackButton />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Student Profile</h1>
          <div className="w-24"></div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/3">
                {profile.photo ? (
                  <div className="relative w-full aspect-square rounded-lg overflow-hidden">
                    <Image
                      src={profile.photo}
                      alt={profile.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400 dark:text-gray-500">No photo</span>
                  </div>
                )}
              </div>

              <div className="w-full md:w-2/3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</h3>
                    <p className="mt-1 text-lg text-gray-900 dark:text-white">{profile.name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Roll Number</h3>
                    <p className="mt-1 text-lg text-gray-900 dark:text-white">{profile.rollNumber}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Department</h3>
                    <p className="mt-1 text-lg text-gray-900 dark:text-white">{profile.department}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Semester</h3>
                    <p className="mt-1 text-lg text-gray-900 dark:text-white">{profile.semester}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Academic Year</h3>
                    <p className="mt-1 text-lg text-gray-900 dark:text-white">{profile.academicYear}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</h3>
                    <p className="mt-1 text-lg text-gray-900 dark:text-white">{profile.email}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</h3>
                    <p className="mt-1 text-lg text-gray-900 dark:text-white">{profile.phone}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Date of Birth</h3>
                    <p className="mt-1 text-lg text-gray-900 dark:text-white">{profile.dateOfBirth}</p>
                  </div>
                  <div className="col-span-2">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</h3>
                    <p className="mt-1 text-lg text-gray-900 dark:text-white">{profile.address}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Parent Name</h3>
                    <p className="mt-1 text-lg text-gray-900 dark:text-white">{profile.parentName}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Parent Phone</h3>
                    <p className="mt-1 text-lg text-gray-900 dark:text-white">{profile.parentPhone}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Blood Group</h3>
                    <p className="mt-1 text-lg text-gray-900 dark:text-white">{profile.bloodGroup}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 