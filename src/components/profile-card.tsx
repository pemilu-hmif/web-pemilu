"use client"
import { Tooltip } from 'react-tooltip';
import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useState } from 'react';
import type { ProfileUser } from '../types/user';

interface ProfileCardProps {
  user: ProfileUser;
}

const ProfileCard = ({ user }: ProfileCardProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const initial = user.name?.trim().charAt(0).toUpperCase();

  return (
    <div className="max-w-3xl mx-4 mt-8 mb-8 sm:py-16 py-8 px-8 rounded-3xl bg-black/20 backdrop-blur-sm text-white border-4 border-[#227C49] relative">
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
            <span className={`font-semibold ${user.isEligible ? 'text-yellow-400' : 'text-red-400'} flex items-center`}>
              {user.isEligible ? 'Eligible' : 'Not Eligible'}
              {!user.isEligible && (
                <div className="flex items-center relative">
                  <button
                    onClick={() => setShowTooltip(!showTooltip)}
                    className="ml-2 w-6 h-6 rounded-full bg-gray-500 flex items-center justify-center text-white cursor-pointer hover:bg-gray-600 transition-colors"
                  >
                    ?
                  </button>
                </div>
              )}
            </span>
            
            <span className="text-white">Sudah Coblos</span>
            <span className={`font-semibold ${user.hasVoted ? 'text-yellow-400' : 'text-red-400'}`}>
              {user.hasVoted ? 'Sudah' : 'Belum'}
            </span>
          </div>
        </div>
      </div>

      {showTooltip && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-700 text-white text-sm p-4 rounded w-80 whitespace-normal z-10">
          Untuk termasuk dalam DPT anda harus mengikuti minimal 1 rangkaian kegiatan pemilu HMIF ITB 2025 dan mengisi form absensi.
        </div>
      )}

      <button
        onClick={() => signOut({ callbackUrl: '/auth/login' })}
        className="w-full mt-8 py-3 px-4 bg-red-500 hover:bg-red-600 rounded-xl flex items-center justify-center gap-2 transition-colors"
      >
        <LogOut size={20} />
        <span>Log out</span>
      </button>
    </div>
  );
};

export default ProfileCard