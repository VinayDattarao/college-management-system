import ProfileClient from './ProfileClient'

export async function generateStaticParams() {
  // This is a placeholder that will generate an empty array
  // since our data is dynamic and stored in localStorage
  return []
}

export default function ProfilePage({ params }: { params: { rollNumber: string } }) {
  return <ProfileClient params={params} />
} 