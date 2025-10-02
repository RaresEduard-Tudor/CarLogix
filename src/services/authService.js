// Firebase Authentication service for CarLogix
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { firebaseService } from './firebaseService';

class AuthService {
  constructor() {
    this.currentUser = null;
    this.authStateCallbacks = [];
    
    // Listen for auth state changes
    onAuthStateChanged(auth, (user) => {
      this.currentUser = user;
      this.authStateCallbacks.forEach(callback => callback(user));
    });
  }

  // ==================== AUTHENTICATION ====================

  async signUp(email, password, displayName) {
    try {
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update profile with display name
      if (displayName) {
        await updateProfile(user, { displayName });
      }

      // Create user document in Firestore
      const userResult = await firebaseService.createUser(user.uid, {
        uid: user.uid,
        email: user.email,
        displayName: displayName || null,
        photoURL: user.photoURL || null,
        subscription: {
          plan: 'free',
          features: ['basic_tracking']
        },
        preferences: {
          theme: 'light',
          notifications: {
            maintenance_reminders: true,
            error_alerts: true,
            email_reports: false
          }
        }
      });

      if (!userResult.success) {
        console.error('Failed to create user document:', userResult.error);
      }

      return { success: true, user };
    } catch (error) {
      console.error('Error signing up:', error);
      return { success: false, error: error.message };
    }
  }

  async signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Update last login time
      await firebaseService.updateUser(userCredential.user.uid, {
        lastLoginAt: new Date()
      });

      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error('Error signing in:', error);
      return { success: false, error: error.message };
    }
  }

  async signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      // Check if this is a new user
      const userDoc = await firebaseService.getUser(user.uid);
      
      if (!userDoc.success) {
        // Create user document for new Google users
        await firebaseService.createUser(user.uid, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          subscription: {
            plan: 'free',
            features: ['basic_tracking']
          },
          preferences: {
            theme: 'light',
            notifications: {
              maintenance_reminders: true,
              error_alerts: true,
              email_reports: false
            }
          }
        });
      } else {
        // Update last login time for existing users
        await firebaseService.updateUser(user.uid, {
          lastLoginAt: new Date()
        });
      }

      return { success: true, user };
    } catch (error) {
      console.error('Error signing in with Google:', error);
      return { success: false, error: error.message };
    }
  }

  async signOut() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error('Error signing out:', error);
      return { success: false, error: error.message };
    }
  }

  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      console.error('Error sending password reset email:', error);
      return { success: false, error: error.message };
    }
  }

  // ==================== USER STATE ====================

  getCurrentUser() {
    return this.currentUser;
  }

  isAuthenticated() {
    return !!this.currentUser;
  }

  onAuthStateChange(callback) {
    this.authStateCallbacks.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.authStateCallbacks.indexOf(callback);
      if (index > -1) {
        this.authStateCallbacks.splice(index, 1);
      }
    };
  }

  async updateUserProfile(updates) {
    try {
      if (!this.currentUser) {
        throw new Error('No user logged in');
      }

      // Update Firebase Auth profile
      await updateProfile(this.currentUser, updates);

      // Update Firestore user document
      await firebaseService.updateUser(this.currentUser.uid, updates);

      return { success: true };
    } catch (error) {
      console.error('Error updating user profile:', error);
      return { success: false, error: error.message };
    }
  }

  // ==================== UTILITIES ====================

  getErrorMessage(errorCode) {
    const errorMessages = {
      'auth/user-not-found': 'No account found with this email address.',
      'auth/wrong-password': 'Incorrect password.',
      'auth/email-already-in-use': 'An account with this email already exists.',
      'auth/weak-password': 'Password should be at least 6 characters.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/user-disabled': 'This account has been disabled.',
      'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
      'auth/network-request-failed': 'Network error. Please check your connection.',
      'auth/popup-closed-by-user': 'Sign-in was cancelled.',
      'auth/cancelled-popup-request': 'Sign-in was cancelled.',
    };

    return errorMessages[errorCode] || 'An unexpected error occurred. Please try again.';
  }
}

// Export singleton instance
export const authService = new AuthService();