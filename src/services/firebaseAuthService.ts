import { 
  signInWithPopup,
  signInWithRedirect,
  signOut as firebaseSignOut, 
  onAuthStateChanged as firebaseOnAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

/**
 * Sign in with Google using a popup
 * @returns Promise that resolves with the user credentials
 */
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

/**
 * Sign out the current user
 * @returns Promise that resolves when sign-out is complete
 */
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

/**
 * Get the current authenticated user
 * @returns The current Firebase user or null if not authenticated
 */
export const getCurrentUser = (): FirebaseUser | null => {
  return auth.currentUser;
};

/**
 * Listen for authentication state changes
 * @param callback Function to call when auth state changes
 * @returns Unsubscribe function
 */
export const onAuthStateChanged = (
  callback: (user: FirebaseUser | null) => void
) => {
  return firebaseOnAuthStateChanged(auth, callback);
};

/**
 * Check if a user is a new user (first time sign-in)
 * This is a helper function that can be used to determine if a user needs to complete onboarding
 * @param user Firebase user object
 * @returns Boolean indicating if this is likely a new user
 */
export const isNewUser = (user: FirebaseUser | null): boolean => {
  if (!user) return false;
  
  console.log("Checking if user is new:", user.email);
  console.log("Creation time:", user.metadata.creationTime);
  console.log("Last sign-in time:", user.metadata.lastSignInTime);
  
  // Firebase provides metadata about when the user was created
  // We can use this to determine if this is a new user
  const creationTime = user.metadata.creationTime;
  const lastSignInTime = user.metadata.lastSignInTime;
  
  // If creation time and last sign-in time are very close, it's likely a new user
  if (creationTime && lastSignInTime) {
    const creationDate = new Date(creationTime);
    const lastSignInDate = new Date(lastSignInTime);
    
    // If the account was created less than 1 minute before the last sign-in
    // We can assume this is a new user's first sign-in
    const diffInMs = Math.abs(lastSignInDate.getTime() - creationDate.getTime());
    const diffInMinutes = diffInMs / (1000 * 60);
    
    console.log("Time difference between creation and last sign-in (minutes):", diffInMinutes);
    
    return diffInMinutes < 1;
  }
  
  return false;
};