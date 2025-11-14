import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, Role, Scholarship } from '../types';
import { USERS, SCHOLARSHIPS } from '../constants';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<User | null>;
  logout: () => void;
  signup: (details: Pick<User, 'username' | 'password'>) => Promise<boolean>;
  updatePassword: (oldPassword: string, newPassword: string) => Promise<'success' | 'invalid_password' | 'error'>;
  updateProfile: (details: { fullName: string; phone?: string; organization?: string }) => Promise<boolean>;
  isScholarshipSaved: (scholarshipId: string) => boolean;
  toggleSaveScholarship: (scholarshipId: string) => void;
  addCommentToScholarship: (scholarshipId: string, commentText: string) => void;
  toggleCommentVisibility: (scholarshipId: string, commentId: string) => void;
  createScholarship: (data: Omit<Scholarship, 'id' | 'comments' | 'dateUploaded' | 'commentsLocked'>) => Scholarship | null;
  updateScholarship: (id: string, data: Partial<Omit<Scholarship, 'id' | 'comments' | 'dateUploaded' | 'commentsLocked'>>) => Scholarship | null;
  deleteScholarship: (id: string) => boolean;
  getAllUsers: () => Omit<User, 'password'>[];
  toggleUserLock: (userId: string) => void;
  toggleScholarshipCommentLock: (scholarshipId: string) => void;
  getAllScholarships: () => Scholarship[];
  getScholarshipById: (id: string) => Scholarship | undefined;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Use state for mock data to make it reactive and persistent
  const [mockUsers, setMockUsers] = useState<User[]>(() => {
    try {
      const stored = localStorage.getItem('mockUsers');
      if (stored) return JSON.parse(stored);
    } catch (e) { console.error("Failed to parse mockUsers from localStorage", e); }
    return [...USERS]; // Fallback to constants
  });

  const [mockScholarships, setMockScholarships] = useState<Scholarship[]>(() => {
    try {
      const stored = localStorage.getItem('mockScholarships');
      if (stored) return JSON.parse(stored);
    } catch (e) { console.error("Failed to parse mockScholarships from localStorage", e); }
    return [...SCHOLARSHIPS];
  });

  // Persist mock data changes to localStorage
  useEffect(() => {
    localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
  }, [mockUsers]);

  useEffect(() => {
    localStorage.setItem('mockScholarships', JSON.stringify(mockScholarships));
  }, [mockScholarships]);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('user');
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
  }, []);

  // This effect keeps the logged-in user's state in sync with the master user list.
  // For example, if an admin locks the user's account, this will update the user object
  // in the state and localStorage, effectively propagating the change to the active session.
  useEffect(() => {
    if (user) {
        const latestUserData = mockUsers.find(u => u.id === user.id);
        if (latestUserData) {
            const userToStore = { ...latestUserData };
            delete userToStore.password;
            // Only update if there's an actual change to avoid infinite loops
            if (JSON.stringify(user) !== JSON.stringify(userToStore)) {
                setUser(userToStore);
                localStorage.setItem('user', JSON.stringify(userToStore));
            }
        } else {
            // User might have been deleted, so log them out
            logout();
        }
    }
  }, [mockUsers, user, logout]);

  const login = useCallback(async (username: string, password: string): Promise<User | null> => {
    const foundUser = mockUsers.find(
      (u) => u.username === username && u.password === password
    );
    if (foundUser && !foundUser.isLocked) {
      const userToStore = { ...foundUser };
      delete userToStore.password; // Don't store password in state/localStorage
      setUser(userToStore);
      localStorage.setItem('user', JSON.stringify(userToStore));
      return userToStore;
    }
    return null;
  }, [mockUsers]);

  const signup = useCallback(async (details: Pick<User, 'username' | 'password'>): Promise<boolean> => {
    if (mockUsers.some((u) => u.username === details.username)) {
      return false; // Username already exists
    }
    const newUser: User = {
      id: `user-${Date.now()}`,
      username: details.username,
      password: details.password,
      fullName: details.username, // Default fullName to username
      role: Role.USER,
      savedScholarshipIds: [],
      optionalInfo: {},
      isLocked: false,
    };
    setMockUsers(prev => [...prev, newUser]);
    
    // Auto-login after signup
    const userToStore = { ...newUser };
    delete userToStore.password;
    setUser(userToStore);
    localStorage.setItem('user', JSON.stringify(userToStore));
    return true;
  }, [mockUsers]);
  
  const updatePassword = useCallback(async (oldPassword: string, newPassword: string): Promise<'success' | 'invalid_password' | 'error'> => {
    if (!user) return 'error';
    const userIndex = mockUsers.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
        const currentUser = mockUsers[userIndex];
        if (currentUser.password !== oldPassword) {
            return 'invalid_password';
        }
        setMockUsers(prev => prev.map((u, index) => index === userIndex ? { ...u, password: newPassword } : u));
        return 'success';
    }
    return 'error';
  }, [user, mockUsers]);

  const updateProfile = useCallback(async (details: { fullName: string; phone?: string; organization?: string }) => {
    if (!user) return false;

    // We need to find the full user object including password to update mockUsers
    const fullUser = mockUsers.find(u => u.id === user.id);
    if (!fullUser) return false;

    const updatedFullUser: User = {
        ...fullUser,
        fullName: details.fullName,
        optionalInfo: {
            ...fullUser.optionalInfo,
            phone: details.phone,
            organization: details.organization,
        }
    };
    
    setMockUsers(prev => prev.map(u => u.id === user.id ? updatedFullUser : u));
    
    // Update the user state without the password
    const userToStore = { ...updatedFullUser };
    delete userToStore.password;
    setUser(userToStore);
    localStorage.setItem('user', JSON.stringify(userToStore));

    return true;
  }, [user, mockUsers]);

  const isScholarshipSaved = useCallback((scholarshipId: string) => {
    return user?.savedScholarshipIds.includes(scholarshipId) ?? false;
  }, [user]);
  
  const toggleSaveScholarship = useCallback((scholarshipId: string) => {
    if (!user) return;
    
    let updatedSavedIds;
    if (user.savedScholarshipIds.includes(scholarshipId)) {
      updatedSavedIds = user.savedScholarshipIds.filter(id => id !== scholarshipId);
    } else {
      updatedSavedIds = [...user.savedScholarshipIds, scholarshipId];
    }
    
    setMockUsers(prev => prev.map(u => u.id === user.id ? { ...u, savedScholarshipIds: updatedSavedIds } : u));
  }, [user]);

  const addCommentToScholarship = useCallback((scholarshipId: string, commentText: string): void => {
    if (!user || user.isLocked) return;

    setMockScholarships(prev => prev.map(s => {
      if (s.id === scholarshipId && !s.commentsLocked) {
        const newComment = {
          id: `comment-${Date.now()}`,
          userId: user.id,
          userFullName: user.fullName,
          text: commentText,
          timestamp: new Date().toISOString()
        };
        return { ...s, comments: [...s.comments, newComment] };
      }
      return s;
    }));
  }, [user]);
  
  const toggleCommentVisibility = useCallback((scholarshipId: string, commentId: string): void => {
    if (user?.role !== Role.ADMIN) return;
    
    setMockScholarships(prev => prev.map(s => {
        if (s.id === scholarshipId) {
            const updatedComments = s.comments.map(c => {
                if (c.id === commentId) {
                    return { ...c, isHidden: !c.isHidden };
                }
                return c;
            });
            return { ...s, comments: updatedComments };
        }
        return s;
    }));
  }, [user]);

  const createScholarship = useCallback((data: Omit<Scholarship, 'id' | 'comments' | 'dateUploaded' | 'commentsLocked'>): Scholarship | null => {
    if (user?.role !== Role.ADMIN) return null;
    const newScholarship: Scholarship = {
      ...data,
      id: `scholarship-${Date.now()}`,
      dateUploaded: new Date().toISOString(),
      comments: [],
      commentsLocked: false,
    };
    setMockScholarships(prev => [newScholarship, ...prev]);
    return newScholarship;
  }, [user]);

  const updateScholarship = useCallback((id: string, data: Partial<Omit<Scholarship, 'id' | 'comments' | 'dateUploaded' | 'commentsLocked'>>): Scholarship | null => {
    if (user?.role !== Role.ADMIN) return null;
    
    let updatedScholarship: Scholarship | null = null;
    setMockScholarships(prev => prev.map(s => {
      if (s.id === id) {
        updatedScholarship = { ...s, ...data };
        return updatedScholarship;
      }
      return s;
    }));
    return updatedScholarship;
  }, [user]);

  const deleteScholarship = useCallback((id: string): boolean => {
    if (user?.role !== Role.ADMIN) return false;
    setMockScholarships(prev => prev.filter(s => s.id !== id));
    return true;
  }, [user]);
  
  const getAllUsers = useCallback((): Omit<User, 'password'>[] => {
      if (user?.role !== Role.ADMIN) return [];
      return mockUsers.map(({ password, ...rest }) => rest);
  }, [user, mockUsers]);

  const toggleUserLock = useCallback((userId: string): void => {
    if (user?.role !== Role.ADMIN || user.id === userId) return;
    
    setMockUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, isLocked: !u.isLocked } : u
    ));
  }, [user]);

  const toggleScholarshipCommentLock = useCallback((scholarshipId: string): void => {
    if (user?.role !== Role.ADMIN) return;

    setMockScholarships(prev => prev.map(s => {
        if (s.id === scholarshipId) {
            return { ...s, commentsLocked: !s.commentsLocked };
        }
        return s;
    }));
  }, [user]);

  const getAllScholarships = useCallback((): Scholarship[] => {
    return mockScholarships;
  }, [mockScholarships]);
  
  const getScholarshipById = useCallback((id: string): Scholarship | undefined => {
    return mockScholarships.find(s => s.id === id);
  }, [mockScholarships]);


  return (
    <AuthContext.Provider value={{ user, login, logout, signup, updatePassword, updateProfile, isScholarshipSaved, toggleSaveScholarship, addCommentToScholarship, toggleCommentVisibility, createScholarship, updateScholarship, deleteScholarship, getAllUsers, toggleUserLock, toggleScholarshipCommentLock, getAllScholarships, getScholarshipById }}>
      {children}
    </AuthContext.Provider>
  );
};