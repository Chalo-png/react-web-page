import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

export const logout = () => signOut(auth);
export const isAuthenticated = () => {
  return !!auth.currentUser;
};
