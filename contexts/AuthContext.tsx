import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, Role, Scholarship } from '../types';
import { SCHOLARSHIPS } from '../constants';
import { db } from '../firebase/config.js';
import { 
  collection, 
  getDocs, 
  onSnapshot, 
  query, 
  where,
  doc,
  getDoc,
  updateDoc,
  addDoc,
  deleteDoc,
  writeBatch,
  arrayUnion,
  arrayRemove,
  setDoc,
} from 'https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js';


interface SignupResult {
  success: boolean;
  errorCode?: 'username-exists' | 'check-failed' | 'unknown-error' | string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<User | null>;
  logout: () => void;
  signup: (details: { username: string; password: string; }) => Promise<SignupResult>;
  updatePassword: (oldPassword: string, newPassword: string) => Promise<'success' | 'invalid_password' | 'error'>;
  updateProfile: (details: { fullName: string; phone?: string; organization?: string }) => Promise<boolean>;
  isScholarshipSaved: (scholarshipId: string) => boolean;
  toggleSaveScholarship: (scholarshipId: string) => void;
  addCommentToScholarship: (scholarshipId: string, commentText: string) => void;
  toggleCommentVisibility: (scholarshipId: string, commentId: string) => void;
  createScholarship: (data: Omit<Scholarship, 'id' | 'comments' | 'dateUploaded' | 'commentsLocked'>) => Promise<Scholarship | null>;
  updateScholarship: (id: string, data: Partial<Omit<Scholarship, 'id' | 'comments' | 'dateUploaded' | 'commentsLocked'>>) => Promise<Scholarship | null>;
  deleteScholarship: (id: string) => Promise<boolean>;
  getAllScholarships: () => Scholarship[];
  getScholarshipById: (id: string) => Scholarship | undefined;
  toggleUserLock: (username: string) => void;
  toggleScholarshipCommentLock: (scholarshipId: string) => void;
  updateUserRole: (username: string, newRole: Role.USER | Role.MODDER) => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const seedScholarships = async () => {
  if (SCHOLARSHIPS.length === 0) {
    console.log('No seed data provided. Skipping database seeding.');
    return;
  }
  const scholarshipsCollection = collection(db, 'scholarships');
  const snapshot = await getDocs(scholarshipsCollection);
  if (snapshot.empty) {
    console.log('No scholarships found, seeding initial data...');
    const batch = writeBatch(db);
    SCHOLARSHIPS.forEach(scholarship => {
      const docRef = doc(db, 'scholarships', scholarship.id);
      batch.set(docRef, scholarship);
    });
    await batch.commit();
    console.log('Scholarships seeded successfully.');
  } else {
    console.log('Scholarships collection already exists.');
  }
};


export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  
  useEffect(() => {
    seedScholarships();

    const scholarshipsQuery = query(collection(db, 'scholarships'));
    const unsubscribeScholarships = onSnapshot(scholarshipsQuery, (snapshot) => {
      const scholarshipsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Scholarship));
      setScholarships(scholarshipsData);
    });

    try {
        const storedUser = localStorage.getItem('loggedInUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        localStorage.removeItem('loggedInUser');
    }
    setLoading(false);

    return () => {
      unsubscribeScholarships();
    };
  }, []);
  
  const login = async (username: string, password: string): Promise<User | null> => {
    try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('username', '==', username));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.error("Login failed: User not found.");
            return null;
        }

        const userDoc = querySnapshot.docs[0];
        const firestoreData = userDoc.data();

        if (firestoreData.password !== password) {
            console.error("Login failed: Incorrect password.");
            return null;
        }

        if (firestoreData.isLocked) {
            console.error("Login failed: Account is locked.");
            return null;
        }
        
        const rawRole = firestoreData.role;
        let role: Role = Role.USER;
        if (rawRole === 'administration' || rawRole === Role.ADMIN) {
            role = Role.ADMIN;
        } else if (rawRole === 'modder' || rawRole === 'moderator' || rawRole === Role.MODDER) {
            role = Role.MODDER;
        } else if (rawRole === Role.USER) {
            role = Role.USER;
        }
        
        const { password: _p, ...publicData } = firestoreData;
        
        const finalUser: User = {
            ...(publicData as any),
            id: userDoc.id, 
            role: role,
            username: firestoreData.username
        };
        
        setUser(finalUser);
        localStorage.setItem('loggedInUser', JSON.stringify(finalUser));
        return finalUser;

    } catch (error) {
        console.error("Login failed: ", error);
        return null;
    }
  };


  const logout = async () => {
    setUser(null);
    localStorage.removeItem('loggedInUser');
  };

  const signup = async (details: { username: string; password: string; }): Promise<SignupResult> => {
    const { username, password } = details;

    try {
        const userDocRef = doc(db, 'users', username);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
            console.error("Signup failed: Username is already taken.");
            return { success: false, errorCode: 'username-exists' };
        }
    } catch (error: any) {
        console.error("Error checking for existing username.", error);
        return { success: false, errorCode: 'check-failed' };
    }

    try {
      if (!password) throw new Error("Password is required for signup.");
      
      const newUserDoc = {
        username: username,
        password: password,
        fullName: username,
        role: Role.USER,
        savedScholarshipIds: [],
        optionalInfo: {},
        isLocked: false,
      };
      
      await setDoc(doc(db, "users", username), newUserDoc);
      
      const { password: _, ...userDataForState } = newUserDoc;
      const loggedInUser: User = {
          ...(userDataForState as any),
          id: username
      }
      setUser(loggedInUser);
      localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));

      return { success: true };
    } catch (error: any) {
      console.error("Signup failed: ", error);
      return { success: false, errorCode: error.code || 'unknown-error' };
    }
  };

  const updateProfile = async (details: { fullName: string; phone?: string; organization?: string }): Promise<boolean> => {
    if (!user) return false;
    try {
      const userDocRef = doc(db, 'users', user.username);
      const updateData: any = {
        fullName: details.fullName,
        optionalInfo: {
            ...user.optionalInfo,
            phone: details.phone || '',
            organization: details.organization || ''
        }
      };
      await updateDoc(userDocRef, updateData);
      const updatedUser = { ...user, ...updateData };
      setUser(updatedUser);
      localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));
      return true;
    } catch (error) {
      console.error("Profile update failed:", error);
      return false;
    }
  };
  
  const updatePassword = async (oldPassword: string, newPassword: string): Promise<'success' | 'invalid_password' | 'error'> => {
    if (!user) {
        console.error("User not logged in.");
        return 'error';
    }

    try {
        const userDocRef = doc(db, 'users', user.username);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            console.error("User document not found.");
            return 'error';
        }

        const userData = userDoc.data();
        if (userData.password !== oldPassword) {
            return 'invalid_password';
        }

        await updateDoc(userDocRef, { password: newPassword });
        return 'success';
    } catch (error: any) {
        console.error("Password update failed:", error);
        return 'error';
    }
};


  const isScholarshipSaved = useCallback((scholarshipId: string): boolean => {
    return user?.savedScholarshipIds.includes(scholarshipId) || false;
  }, [user]);

  const toggleSaveScholarship = useCallback(async (scholarshipId: string) => {
    if (!user) return;
    const userDocRef = doc(db, 'users', user.username);
    const isCurrentlySaved = isScholarshipSaved(scholarshipId);
    try {
      let updatedUser;
      if (isCurrentlySaved) {
        await updateDoc(userDocRef, {
          savedScholarshipIds: arrayRemove(scholarshipId)
        });
        updatedUser = { ...user, savedScholarshipIds: user.savedScholarshipIds.filter(id => id !== scholarshipId) };
      } else {
        await updateDoc(userDocRef, {
          savedScholarshipIds: arrayUnion(scholarshipId)
        });
        updatedUser = { ...user, savedScholarshipIds: [...user.savedScholarshipIds, scholarshipId] };
      }
      setUser(updatedUser);
      localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));
    } catch (error) {
        console.error("Failed to toggle save scholarship:", error);
    }
  }, [user, isScholarshipSaved]);
  
  const addCommentToScholarship = async (scholarshipId: string, commentText: string) => {
    if (!user) return;
    const scholarshipDocRef = doc(db, 'scholarships', scholarshipId);
    const newComment = {
      id: `comment-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      userId: user.id,
      userFullName: user.fullName,
      text: commentText,
      timestamp: new Date().toISOString()
    };
    await updateDoc(scholarshipDocRef, {
      comments: arrayUnion(newComment)
    });
  };
  
  const toggleCommentVisibility = async (scholarshipId: string, commentId: string) => {
    if (user?.role !== Role.MODDER) return;
    const scholarshipDocRef = doc(db, 'scholarships', scholarshipId);
    const scholarshipDoc = await getDoc(scholarshipDocRef);
    if (scholarshipDoc.exists()) {
        const scholarshipData = scholarshipDoc.data() as Scholarship;
        const updatedComments = scholarshipData.comments.map(comment => {
            if (comment.id === commentId) {
                return { ...comment, isHidden: !comment.isHidden };
            }
            return comment;
        });
        await updateDoc(scholarshipDocRef, { comments: updatedComments });
    }
  };

  const createScholarship = async (data: Omit<Scholarship, 'id' | 'comments' | 'dateUploaded' | 'commentsLocked'>): Promise<Scholarship | null> => {
     if (user?.role !== Role.MODDER) return null;
     try {
       const newScholarship: Omit<Scholarship, 'id'> = {
         ...data,
         dateUploaded: new Date().toISOString(),
         comments: [],
         commentsLocked: false,
       };
       const docRef = await addDoc(collection(db, 'scholarships'), newScholarship);
       return { id: docRef.id, ...newScholarship };
     } catch (error) {
       console.error("Error creating scholarship:", error);
       return null;
     }
  };

  const updateScholarship = async (id: string, data: Partial<Omit<Scholarship, 'id'>>): Promise<Scholarship | null> => {
    if (user?.role !== Role.MODDER) return null;
    try {
        const scholarshipDocRef = doc(db, 'scholarships', id);
        await updateDoc(scholarshipDocRef, data);
        const updatedDoc = await getDoc(scholarshipDocRef);
        return { id: updatedDoc.id, ...updatedDoc.data() } as Scholarship;
    } catch(error) {
        console.error("Error updating scholarship: ", error);
        return null;
    }
  };
  
  const deleteScholarship = async (id: string): Promise<boolean> => {
    if (user?.role !== Role.MODDER) return false;
    try {
        await deleteDoc(doc(db, 'scholarships', id));
        return true;
    } catch (error) {
        console.error("Error deleting scholarship: ", error);
        return false;
    }
  };
  
  const toggleUserLock = async (username: string) => {
    if (user?.role !== Role.ADMIN) return;
    const userDocRef = doc(db, 'users', username);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      await updateDoc(userDocRef, {
        isLocked: !userDoc.data().isLocked
      });
    }
  };
  
  const toggleScholarshipCommentLock = async (scholarshipId: string) => {
    if (user?.role !== Role.MODDER) return;
    const scholarshipDocRef = doc(db, 'scholarships', scholarshipId);
    const scholarshipDoc = await getDoc(scholarshipDocRef);
     if (scholarshipDoc.exists()) {
      await updateDoc(scholarshipDocRef, {
        commentsLocked: !scholarshipDoc.data().commentsLocked
      });
    }
  };
  
  const updateUserRole = async (username: string, newRole: Role.USER | Role.MODDER): Promise<boolean> => {
    if (user?.role !== Role.ADMIN) return false;
    
    try {
      const userDocRef = doc(db, 'users', username);
      await updateDoc(userDocRef, { role: newRole });
      return true;
    } catch (error) {
      console.error("Error updating user role:", error);
      return false;
    }
  };

  const getAllScholarships = useCallback(() => scholarships, [scholarships]);
  const getScholarshipById = useCallback((id: string) => scholarships.find(s => s.id === id), [scholarships]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout, 
      signup, 
      updatePassword,
      updateProfile,
      isScholarshipSaved,
      toggleSaveScholarship,
      addCommentToScholarship,
      toggleCommentVisibility,
      createScholarship,
      updateScholarship,
      deleteScholarship,
      getAllScholarships,
      getScholarshipById,
      toggleUserLock,
      toggleScholarshipCommentLock,
      updateUserRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};