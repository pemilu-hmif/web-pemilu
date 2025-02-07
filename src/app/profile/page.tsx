"use client"
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import React from 'react'
import ProfileCard from '~/components/profile-card'
import { ProfileUser } from '~/types/user';
import DialogBox from '~/components/DialogBox'
import LoadingSpinner from '~/components/LoadingSpinner'

const Profile =() => {
  
  const { data: session, status } = useSession()
  const [showDialog, setShowDialog] = useState(false)
  if (status === 'loading') {
    return <LoadingSpinner />
  }
  if (status === 'unauthenticated' && !showDialog) {
    return (
        <DialogBox
            title='Unauthorized'
            message='You are not authenticated. Please log in to continue.'
            onConfirm={() => (window.location.href = '/auth/login')}
            onCancel={() => setShowDialog(true)} // Menutup dialog
        />
    )
  }

  const user = session?.user || {
    id: 'defaultId',
    email: 'default@example.com',
    image: 'defaultImageUrl',
    name: 'Default Name',
  };
  const nim = user.email?.split('@')[0] ?? "defaultNIM";
  
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

  const userImage = user.image;
  const kodeJurusan = nim.substring(0, 3);
  const angkatan = nim.substring(3, 5);
  const nama = user.name.substring(8);
  
  const userProfile: ProfileUser = {
    id: user.id ?? '',
    email: user.email,
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