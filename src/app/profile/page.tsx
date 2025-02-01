import React from 'react'
import { getServerSession } from 'next-auth/next'
import ProfileCard from '~/components/profile-card'
import { authOptions } from "~/app/api/auth/[...nextauth]";
import { ProfileUser } from '~/types/user';

const Profile = async () => {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    throw new Error("User email not found")
  }
  
  const nim = session.user.email?.split('@')[0] ?? "defaultNIM";
  
  const getJurusan = (kodeJurusan: string) => {
    switch (kodeJurusan) {
      case '135':
        return 'IF'
      case '182':
        return 'STI'
      default:
        return 'Unknown'
    }
  }

  const userImage = session.user.image
  const kodeJurusan = nim.substring(0, 3)
  const angkatan = nim.substring(3, 5)
  const nama = session.user.name.substring(8)
  
  const userProfile: ProfileUser = {
    id: session.user.id ?? '',
    email: session.user.email,
    name: nama,
    image: userImage,
    nim: nim,
    jurusan: getJurusan(kodeJurusan),
    angkatan: '20' + angkatan,
    isEligible: true,
    hasVoted: false,
  }

  return (
    <div className="pt-20 min-h-screen flex flex-col items-center justify-center">
      <div className='mt-16 flex items-center justify-center sm:justify-center text-white'>
        <h1 className='font-sloop text-7xl sm:text-9xl'>P</h1>
        <h1 className='font-playfair text-6xl sm:text-8xl'>rofil</h1>
      </div>
      <ProfileCard user={userProfile} />
    </div>
  )
}

export default Profile;