import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { User, Role } from '../types';
import { useTranslations } from '../hooks/useTranslations';
import { db } from '../firebase/config.js';
import { collection, onSnapshot, query } from 'https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js';

const AdminPortalPage: React.FC = () => {
    const { 
        user: adminUser,
        toggleUserLock,
        updateUserRole,
    } = useAuth();
    const { t } = useTranslations();
    
    const [users, setUsers] = useState<Omit<User, 'password'>[]>([]);
    
    useEffect(() => {
        // Fetch all users for the admin portal.
        const usersQuery = query(collection(db, 'users'));
        const unsubscribe = onSnapshot(usersQuery, (snapshot) => {
            const usersData = snapshot.docs
                .map(doc => {
                    const { password, ...rest } = doc.data();
                    // Ensure role exists and is a valid Role enum value, default to USER
                    const role = Object.values(Role).includes(rest.role) ? rest.role : Role.USER;
                    return { id: doc.data().id, ...rest, role }; // Use the ID from the doc data (UID)
                })
                // Filter out the current admin user and any other admins from the list
                .filter(u => u.role !== Role.ADMIN) as Omit<User, 'password'>[];
            setUsers(usersData);
        }, (error) => {
            console.error("Failed to fetch users:", error);
        });

        return () => unsubscribe();
    }, [adminUser]);

    const handleToggleUserLock = (username: string) => {
        const userToUpdate = users.find(u => u.username === username);
        if (!userToUpdate) return;
        const confirmAction = window.confirm(
            userToUpdate.isLocked ? t('unlockUserConfirm') as string : t('lockUserConfirm') as string
        );
        if (confirmAction) {
            toggleUserLock(username);
        }
    };
    
    const handleRoleChange = async (username: string, newRole: Role) => {
        if (newRole === Role.USER || newRole === Role.MODDER) {
            const success = await updateUserRole(username, newRole);
            if (!success) {
                alert('Failed to update role. Please try again.');
            }
        }
    };
    
    const headerClass = "p-4 font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-sm";
    const cellClass = "p-4 text-slate-600 dark:text-slate-300";

    const getRoleTranslation = (role: Role) => {
        switch (role) {
            case Role.ADMIN:
                return t('roleAdmin');
            case Role.MODDER:
                return t('roleModder');
            case Role.USER:
                return t('roleUser');
            case Role.GUEST:
                 return t('roleGuest');
            default:
                return role;
        }
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">{t('adminPortal')}</h1>
            </div>
            
             <div className="mb-6 border-b border-slate-300 dark:border-slate-700">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button className="px-1 py-4 text-sm font-medium border-b-2 whitespace-nowrap border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-300">
                        {t('userManagement')}
                    </button>
                </nav>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-x-auto">
                <table className="w-full text-left min-w-[600px]">
                    <thead className="bg-slate-50 dark:bg-slate-700">
                        <tr>
                            <th className={headerClass}>{t('username')}</th>
                            <th className={headerClass}>{t('fullName')}</th>
                            <th className={headerClass}>{t('role')}</th>
                            <th className={headerClass}>{t('accountStatus')}</th>
                            <th className={`${headerClass} text-right`}>{t('actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.id} className="border-b border-slate-200 dark:border-slate-700">
                                <td className={cellClass}>{u.username}</td>
                                <td className={cellClass}>{u.fullName}</td>
                                <td className={cellClass}>
                                    <select
                                        value={u.role}
                                        onChange={(e) => handleRoleChange(u.username, e.target.value as Role)}
                                        aria-label={t('setRole') as string}
                                        className="py-1 px-2 text-sm rounded-md bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value={Role.USER}>{t('roleUser')}</option>
                                        <option value={Role.MODDER}>{t('roleModder')}</option>
                                    </select>
                                </td>
                                <td className={cellClass}>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                        u.isLocked
                                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                    }`}>
                                        {u.isLocked ? t('locked') : t('active')}
                                    </span>
                                </td>
                                <td className={`${cellClass} text-right`}>
                                    <button onClick={() => handleToggleUserLock(u.username)} className={`hover:underline ${u.isLocked ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                        {u.isLocked ? t('unlock') : t('lock')}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminPortalPage;