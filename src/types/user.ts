export interface ProfileUser {
    id: string;
    email: string;
    name: string;
    image: string | undefined;
    nim: string;
    jurusan: string;
    angkatan: string;
    isEligible: boolean;
    hasVoted: boolean;
  }