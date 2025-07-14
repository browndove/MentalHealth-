
export type User = {
    uid: string;
    email: string;
    fullName: string;
    universityId: string;
    role: 'student' | 'counselor';
    createdAt: string; // ISO string
    avatarUrl?: string;
    phoneNumber?: string;
    bio?: string;
    aiHint?: string;
};
