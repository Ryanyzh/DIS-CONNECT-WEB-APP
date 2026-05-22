// A HrOfficer object, represents a HR officer in the system, can contain info like name, email, etc.
export interface HrOfficer {
  id: string;
  name: string;
  email: string;
  department: string;
  avatarUrl?: string; // optional field for profile picture
}