"use client"
import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import type { ProfileUser } from '../types/user';

interface ProfileCardProps {
  user: ProfileUser;
}

const ProfileCard = ({ user }: ProfileCardProps) => {
  
  const initial = user.name?.trim().charAt(0).toUpperCase();

  return (
    <div className="max-w-3xl mx-4 mt-8 mb-8 sm:py-16 py-8 px-8 rounded-3xl bg-black/20 backdrop-blur-sm text-white border-4 border-[#227C49]">
      <div className="flex flex-col md:flex-row gap-8 items-center">
        <div className="sm:w-56 sm:h-56 w-36 h-36 rounded-full flex items-center justify-center bg-black text-white text-[5rem] text-center font-bold">
          {initial}
        </div>

        <div className="flex-1 space-y-2 overflow-hidden">
          <div className="grid sm:grid-cols-2 grid-cols-1 gap-x-2 gap-y-2 font-satoshi">
            <span className="text-white">Nama</span>
            <span className='font-semibold'>{user.name}</span>

            <span className="text-white">Email</span>
            <span className='font-semibold'>{user.email}</span>

            <span className="text-white">NIM</span>
            <span className='font-semibold'>{user.nim}</span>

            <span className="text-white">Jurusan</span>
            <span className='font-semibold'>{user.jurusan}</span>

            <span className="text-white">Angkatan</span>
            <span className='font-semibold'>{user.angkatan}</span>

            <span className="text-white">Status Pemilih</span>
            <span className={`font-semibold ${user.isEligible ? 'text-yellow-400' : 'text-red-400'}`}>
              {user.isEligible ? 'Eligible' : 'Not Eligible'}
            </span>
            
            <span className="text-white">Sudah Coblos</span>
            <span className={`font-semibold ${user.hasVoted ? 'text-yellow-400' : 'text-red-400'}`}>
              {user.hasVoted ? 'Sudah' : 'Belum'}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={() => signOut({ callbackUrl: '/auth/login' })}
        className="w-full mt-8 py-3 px-4 bg-red-500 hover:bg-red-600 rounded-xl flex items-center justify-center gap-2 transition-colors"
      >
        <LogOut size={20} />
        <span>Log out</span>
      </button>
    </div>
  )
}

export default ProfileCard