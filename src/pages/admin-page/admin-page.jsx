import React, { useCallback, useMemo, useState } from 'react';
import { Container } from '@/components/layouts/container/index.js';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { AdminHeader } from './ui/AdminHeader.jsx';
import { AdminStats } from './ui/AdminStats.jsx';

import { UsersToolbar } from './ui/users/UsersToolbar.jsx';
import { UsersTable } from './ui/users/UsersTable.jsx';
import { UserDialog } from './ui/users/UserDialog.jsx';
import { DeleteUserDialog } from './ui/users/DeleteUserDialog.jsx';

import { RolesToolbar } from './ui/roles/RolesToolbar.jsx';
import { RolesTable } from './ui/roles/RolesTable.jsx';
import { RoleDialog } from './ui/roles/RoleDialog.jsx';
import { DeleteRoleDialog } from './ui/roles/DeleteRoleDialog.jsx';
import { initialRolesMock, initialUsersMock } from '@/pages/admin-page/const/admin.mock.js';


/**
 * Админ-панель: UI (MVP).
 * Интеграция с API предполагается через пропсы/хуки.
 */
export const AdminPage = ({
                            initialUsers = initialUsersMock,
                            initialRoles = initialRolesMock,
                            onUsersChange,
                            onRolesChange,
                          } = {}) => {
  // вкладка
  const [tab, setTab] = useState('users');

  // сущности
  const [users, setUsers] = useState(initialUsers);
  const [roles, setRoles] = useState(initialRoles);

  // фильтры/поиск
  const [userQuery, setUserQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [userStatusFilter, setUserStatusFilter] = useState('all');

  const [roleQuery, setRoleQuery] = useState('');

  // модалки
  const [editingUser, setEditingUser] = useState(null);
  const [editingRole, setEditingRole] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [deletingRole, setDeletingRole] = useState(null);

  // формы
  const [userForm, setUserForm] = useState({
    fullName: '',
    email: '',
    status: 'active',
    roleId: '',
  });

  const [roleForm, setRoleForm] = useState({
    name: '',
    description: '',
    permissions: '',
  });

  // ===== вычисления =====
  const rolesMap = useMemo(() => {
    const map = new Map();
    roles.forEach(r => map.set(r.id, r));
    return map;
  }, [roles]);

  const filteredUsers = useMemo(() => {
    const q = userQuery.trim().toLowerCase();
    return users
      .filter(u => {
        const matchesQuery =
          !q ||
          u.fullName.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          (rolesMap.get(u.roleId)?.name || '').toLowerCase().includes(q);

        const matchesRole = userRoleFilter === 'all' ? true : u.roleId === userRoleFilter;
        const matchesStatus = userStatusFilter === 'all' ? true : u.status === userStatusFilter;

        return matchesQuery && matchesRole && matchesStatus;
      })
      .sort((a, b) => a.fullName.localeCompare(b.fullName, 'ru'));
  }, [users, userQuery, userRoleFilter, userStatusFilter, rolesMap]);

  const filteredRoles = useMemo(() => {
    const q = roleQuery.trim().toLowerCase();
    return roles
      .filter(r => {
        if (!q) return true;
        return (
          r.name.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.permissions.join(' ').toLowerCase().includes(q)
        );
      })
      .sort((a, b) => a.name.localeCompare(b.name, 'ru'));
  }, [roles, roleQuery]);

  const stats = useMemo(() => {
    const active = users.filter(u => u.status === 'active').length;
    const blocked = users.filter(u => u.status === 'blocked').length;
    return {
      usersTotal: users.length,
      usersActive: active,
      usersBlocked: blocked,
      rolesTotal: roles.length,
    };
  }, [users, roles]);

  // ===== эмит в коллбеки =====
  const emitUsersChange = useCallback(
    next => {
      setUsers(next);
      onUsersChange?.(next);
    },
    [onUsersChange]
  );

  const emitRolesChange = useCallback(
    next => {
      setRoles(next);
      onRolesChange?.(next);
    },
    [onRolesChange]
  );

  // ===== users handlers =====
  const handleOpenEditUser = useCallback(user => {
    setEditingUser(user);
    setUserForm({
      fullName: user.fullName,
      email: user.email,
      status: user.status,
      roleId: user.roleId,
    });
  }, []);

  const handleOpenCreateUser = useCallback(() => {
    setEditingUser({ id: null });
    setUserForm({
      fullName: '',
      email: '',
      status: 'active',
      roleId: roles[0]?.id || '',
    });
  }, [roles]);

  const handleSaveUser = useCallback(() => {
    const name = userForm.fullName.trim();
    const email = userForm.email.trim();
    if (!name || !email || !userForm.roleId) return;

    if (editingUser?.id) {
      const next = users.map(u =>
        u.id === editingUser.id ? { ...u, fullName: name, email, status: userForm.status, roleId: userForm.roleId } : u
      );
      emitUsersChange(next);
    } else {
      const id = `u_${Math.random().toString(16).slice(2, 8)}`;
      const today = new Date().toISOString().slice(0, 10);
      const next = [
        ...users,
        {
          id,
          fullName: name,
          email,
          status: userForm.status,
          roleId: userForm.roleId,
          createdAt: today,
          lastLoginAt: '—',
        },
      ];
      emitUsersChange(next);
    }

    setEditingUser(null);
  }, [editingUser, emitUsersChange, userForm, users]);

  const handleToggleUserStatus = useCallback(
    user => {
      const next = users.map(u =>
        u.id === user.id ? { ...u, status: u.status === 'active' ? 'blocked' : 'active' } : u
      );
      emitUsersChange(next);
    },
    [users, emitUsersChange]
  );

  const handleConfirmDeleteUser = useCallback(() => {
    if (!deletingUser) return;
    const next = users.filter(u => u.id !== deletingUser.id);
    emitUsersChange(next);
    setDeletingUser(null);
  }, [deletingUser, users, emitUsersChange]);

  // ===== roles handlers =====
  const handleOpenEditRole = useCallback(role => {
    setEditingRole(role);
    setRoleForm({
      name: role.name,
      description: role.description,
      permissions: role.permissions.join('\n'),
    });
  }, []);

  const handleOpenCreateRole = useCallback(() => {
    setEditingRole({ id: null });
    setRoleForm({ name: '', description: '', permissions: '' });
  }, []);

  const handleSaveRole = useCallback(() => {
    const name = roleForm.name.trim();
    const description = roleForm.description.trim();
    const permissions = roleForm.permissions
      .split('\n')
      .map(p => p.trim())
      .filter(Boolean);

    if (!name) return;

    if (editingRole?.id) {
      const next = roles.map(r => (r.id === editingRole.id ? { ...r, name, description, permissions } : r));
      emitRolesChange(next);
    } else {
      const id = `r_${Math.random().toString(16).slice(2, 8)}`;
      const next = [...roles, { id, name, description, permissions, protected: false }];
      emitRolesChange(next);
    }

    setEditingRole(null);
  }, [editingRole, roleForm, roles, emitRolesChange]);

  const handleConfirmDeleteRole = useCallback(() => {
    if (!deletingRole) return;

    if (deletingRole.protected) {
      setDeletingRole(null);
      return;
    }

    const inUse = users.some(u => u.roleId === deletingRole.id);
    if (inUse) {
      setDeletingRole(null);
      return;
    }

    const next = roles.filter(r => r.id !== deletingRole.id);
    emitRolesChange(next);
    setDeletingRole(null);
  }, [deletingRole, roles, users, emitRolesChange]);

  // ===== UI helpers =====
  const getStatusBadge = useCallback(
    status => <UsersTable.StatusBadge status={status} />,
    []
  );

  const canDeleteRole = useCallback(
    role => {
      if (role.protected) return { ok: false, reason: 'Защищённая роль' };
      const inUse = users.some(u => u.roleId === role.id);
      if (inUse) return { ok: false, reason: 'Роль используется пользователями' };
      return { ok: true, reason: '' };
    },
    [users]
  );

  return (
    <Container>
      <main className="w-full leading-relaxed">
        <AdminHeader onCreateUser={handleOpenCreateUser} onCreateRole={handleOpenCreateRole} />
        <AdminStats stats={stats} />

        <section aria-label="Разделы администрирования">
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <TabsList className="w-full sm:w-auto">
                <TabsTrigger value="users" className="rounded">
                  Пользователи
                </TabsTrigger>
                <TabsTrigger value="roles" className="rounded">
                  Роли и права
                </TabsTrigger>
              </TabsList>

              {tab === 'users' ? (
                <UsersToolbar
                  userQuery={userQuery}
                  onUserQueryChange={setUserQuery}
                  userRoleFilter={userRoleFilter}
                  onUserRoleFilterChange={setUserRoleFilter}
                  userStatusFilter={userStatusFilter}
                  onUserStatusFilterChange={setUserStatusFilter}
                  roles={roles}
                />
              ) : (
                <RolesToolbar roleQuery={roleQuery} onRoleQueryChange={setRoleQuery} />
              )}
            </div>

            <TabsContent value="users">
              <UsersTable
                users={filteredUsers}
                rolesMap={rolesMap}
                getStatusBadge={getStatusBadge}
                onEditUser={handleOpenEditUser}
                onToggleUserStatus={handleToggleUserStatus}
                onDeleteUser={setDeletingUser}
              />
            </TabsContent>

            <TabsContent value="roles">
              <RolesTable
                roles={filteredRoles}
                canDeleteRole={canDeleteRole}
                onEditRole={handleOpenEditRole}
                onDeleteRole={setDeletingRole}
              />
            </TabsContent>
          </Tabs>
        </section>

        <UserDialog
          open={!!editingUser}
          onOpenChange={open => !open && setEditingUser(null)}
          editingUser={editingUser}
          userForm={userForm}
          setUserForm={setUserForm}
          roles={roles}
          onSave={handleSaveUser}
          onCancel={() => setEditingUser(null)}
        />

        <DeleteUserDialog
          open={!!deletingUser}
          onOpenChange={open => !open && setDeletingUser(null)}
          user={deletingUser}
          onCancel={() => setDeletingUser(null)}
          onConfirm={handleConfirmDeleteUser}
        />

        <RoleDialog
          open={!!editingRole}
          onOpenChange={open => !open && setEditingRole(null)}
          editingRole={editingRole}
          roleForm={roleForm}
          setRoleForm={setRoleForm}
          onSave={handleSaveRole}
          onCancel={() => setEditingRole(null)}
        />

        <DeleteRoleDialog
          open={!!deletingRole}
          onOpenChange={open => !open && setDeletingRole(null)}
          role={deletingRole}
          canDeleteRole={canDeleteRole}
          onCancel={() => setDeletingRole(null)}
          onConfirm={handleConfirmDeleteRole}
        />
      </main>
    </Container>
  );
};