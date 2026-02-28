// Импорты в начале файла
import React, { useCallback, useMemo, useState } from 'react';
import {
  Shield,
  Users,
  UserCog,
  Plus,
  Search,
  MoreVertical,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
  KeyRound,
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Container } from '@/components/layouts/container/index.js';

/**
 * Админ-панель: просмотр/редактирование пользователей + просмотр/администрирование ролей.
 * Важно: это UI-компонент (MVP). Интеграция с API предполагается через пропсы/хуки.
 */

export const AdminPage = ({
  initialUsers = [
    {
      id: 'u_1',
      fullName: 'Иван Петров',
      email: 'ivan.petrov@example.com',
      status: 'active',
      roleId: 'r_admin',
      createdAt: '2025-02-01',
      lastLoginAt: '2026-02-15',
    },
    {
      id: 'u_2',
      fullName: 'Мария Соколова',
      email: 'm.sokolova@example.com',
      status: 'blocked',
      roleId: 'r_moder',
      createdAt: '2025-11-12',
      lastLoginAt: '2026-01-30',
    },
    {
      id: 'u_3',
      fullName: 'Алексей Смирнов',
      email: 'a.smirnov@example.com',
      status: 'active',
      roleId: 'r_user',
      createdAt: '2026-01-09',
      lastLoginAt: '2026-02-20',
    },
  ],
  initialRoles = [
    {
      id: 'r_admin',
      name: 'Администратор',
      description: 'Полный доступ к управлению системой',
      permissions: ['users.read', 'users.write', 'roles.read', 'roles.write', 'audit.read'],
      protected: true, // Защищённая роль (нельзя удалить)
    },
    {
      id: 'r_moder',
      name: 'Модератор',
      description: 'Управление пользователями и контентом',
      permissions: ['users.read', 'users.write', 'roles.read'],
      protected: false,
    },
    {
      id: 'r_user',
      name: 'Пользователь',
      description: 'Базовый доступ к платформе',
      permissions: ['users.read'],
      protected: false,
    },
  ],
  // Коллбеки — удобная точка интеграции с бэкендом (опционально)
  onUsersChange,
  onRolesChange,
} = {}) => {
  // Локальное состояние через useState
  const [tab, setTab] = useState('users');
  const [users, setUsers] = useState(initialUsers);
  const [roles, setRoles] = useState(initialRoles);

  // Фильтры/поиск
  const [userQuery, setUserQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [userStatusFilter, setUserStatusFilter] = useState('all');

  const [roleQuery, setRoleQuery] = useState('');

  // Выбранные сущности для модалок
  const [editingUser, setEditingUser] = useState(null);
  const [editingRole, setEditingRole] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [deletingRole, setDeletingRole] = useState(null);

  // Формы
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

  // Мемоизация вычислений через useMemo
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

  // Доп. метрики для карточек
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

  // =========================
  // Обработчики событий (handle*)
  // =========================

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

  const handleOpenEditUser = useCallback(
    user => {
      setEditingUser(user);
      setUserForm({
        fullName: user.fullName,
        email: user.email,
        status: user.status,
        roleId: user.roleId,
      });
    },
    [setEditingUser, setUserForm]
  );

  const handleOpenCreateUser = useCallback(() => {
    setEditingUser({ id: null }); // id=null -> режим создания
    setUserForm({
      fullName: '',
      email: '',
      status: 'active',
      roleId: roles[0]?.id || '',
    });
  }, [roles]);

  const handleSaveUser = useCallback(() => {
    // Простая валидация на клиенте (MVP)
    const name = userForm.fullName.trim();
    const email = userForm.email.trim();

    if (!name || !email || !userForm.roleId) return;

    // Важно: в реальном проекте здесь будет запрос к API
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

  const handleOpenEditRole = useCallback(role => {
    setEditingRole(role);
    setRoleForm({
      name: role.name,
      description: role.description,
      // Для удобства редактирования — строка, по одному разрешению на строку
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

    // Важно: в реальном проекте здесь будет запрос к API
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

    // Запрещаем удалять защищённые роли
    if (deletingRole.protected) {
      setDeletingRole(null);
      return;
    }

    // Запрещаем удалять роль, если она назначена пользователям (MVP-ограничение)
    const inUse = users.some(u => u.roleId === deletingRole.id);
    if (inUse) {
      setDeletingRole(null);
      return;
    }

    const next = roles.filter(r => r.id !== deletingRole.id);
    emitRolesChange(next);
    setDeletingRole(null);
  }, [deletingRole, roles, users, emitRolesChange]);

  // =========================
  // UI-хелперы
  // =========================

  const getStatusBadge = useCallback(status => {
    if (status === 'active') {
      return (
        <Badge
          className="rounded transition-colors"
          variant="secondary"
        >
          <span className="inline-flex items-center gap-2">
            <CheckCircle2
              className="h-4 w-4"
              aria-hidden="true"
            />
            Активен
          </span>
        </Badge>
      );
    }
    return (
      <Badge
        className="rounded transition-colors"
        variant="destructive"
      >
        <span className="inline-flex items-center gap-2">
          <XCircle
            className="h-4 w-4"
            aria-hidden="true"
          />
          Заблокирован
        </span>
      </Badge>
    );
  }, []);

  const canDeleteRole = useCallback(
    role => {
      if (role.protected) return { ok: false, reason: 'Защищённая роль' };
      const inUse = users.some(u => u.roleId === role.id);
      if (inUse) return { ok: false, reason: 'Роль используется пользователями' };
      return { ok: true, reason: '' };
    },
    [users]
  );

  // =========================
  // Разметка (семантика + доступность)
  // =========================

  return (
    <Container>
      <main className="w-full leading-relaxed">
        {/* Шапка */}
        <header className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold tracking-tight">Админ-панель</h1>
            <p className="text-sm text-muted-foreground">Управление пользователями, ролями и правами доступа (MVP).</p>
          </div>

          {/* Быстрые действия */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Button
              type="button"
              variant="default"
              onClick={handleOpenCreateUser}
              className="rounded bg-blue-500 transition-all duration-200 hover:bg-blue-600 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <Plus
                className="mr-2 h-4 w-4"
                aria-hidden="true"
              />
              Добавить пользователя
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleOpenCreateRole}
              className="rounded border-blue-500 text-blue-600 transition-all duration-200 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <Shield
                className="mr-2 h-4 w-4"
                aria-hidden="true"
              />
              Создать роль
            </Button>
          </div>
        </header>

        {/* Карточки метрик */}
        <section
          aria-label="Сводка"
          className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <Card className="rounded shadow transition-all duration-200 hover:shadow-lg">
            <CardHeader className="p-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <Users
                  className="h-4 w-4 text-blue-500"
                  aria-hidden="true"
                />
                Пользователи
              </CardTitle>
              <CardDescription>Всего в системе</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-semibold">{stats.usersTotal}</div>
            </CardContent>
          </Card>

          <Card className="rounded shadow transition-all duration-200 hover:shadow-lg">
            <CardHeader className="p-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <CheckCircle2
                  className="h-4 w-4 text-blue-500"
                  aria-hidden="true"
                />
                Активные
              </CardTitle>
              <CardDescription>Доступ разрешён</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-semibold">{stats.usersActive}</div>
            </CardContent>
          </Card>

          <Card className="rounded shadow transition-all duration-200 hover:shadow-lg">
            <CardHeader className="p-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <XCircle
                  className="h-4 w-4 text-blue-500"
                  aria-hidden="true"
                />
                Заблокированные
              </CardTitle>
              <CardDescription>Доступ запрещён</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-semibold">{stats.usersBlocked}</div>
            </CardContent>
          </Card>

          <Card className="rounded shadow transition-all duration-200 hover:shadow-lg">
            <CardHeader className="p-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <Shield
                  className="h-4 w-4 text-blue-500"
                  aria-hidden="true"
                />
                Роли
              </CardTitle>
              <CardDescription>Всего ролей</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-semibold">{stats.rolesTotal}</div>
            </CardContent>
          </Card>
        </section>

        {/* Табы навигации */}
        <section aria-label="Разделы администрирования">
          <Tabs
            value={tab}
            onValueChange={setTab}
            className="w-full"
          >
            <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <TabsList className="w-full sm:w-auto">
                <TabsTrigger
                  value="users"
                  className="rounded"
                >
                  Пользователи
                </TabsTrigger>
                <TabsTrigger
                  value="roles"
                  className="rounded"
                >
                  Роли и права
                </TabsTrigger>
              </TabsList>

              {/* Поиск/фильтры — контекстно для активной вкладки */}
              {tab === 'users' ? (
                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
                  <div className="relative w-full sm:w-[280px]">
                    <Search
                      className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <Input
                      value={userQuery}
                      onChange={e => setUserQuery(e.target.value)}
                      placeholder="Поиск по имени, email, роли…"
                      className="h-10 rounded pl-9 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-blue-500"
                      aria-label="Поиск пользователей"
                    />
                  </div>

                  <Select
                    value={userRoleFilter}
                    onValueChange={setUserRoleFilter}
                  >
                    <SelectTrigger
                      className="h-10 w-full rounded sm:w-[200px] transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                      aria-label="Фильтр по роли"
                    >
                      <SelectValue placeholder="Роль" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все роли</SelectItem>
                      {roles.map(r => (
                        <SelectItem
                          key={r.id}
                          value={r.id}
                        >
                          {r.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={userStatusFilter}
                    onValueChange={setUserStatusFilter}
                  >
                    <SelectTrigger
                      className="h-10 w-full rounded sm:w-[200px] transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                      aria-label="Фильтр по статусу"
                    >
                      <SelectValue placeholder="Статус" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все статусы</SelectItem>
                      <SelectItem value="active">Активные</SelectItem>
                      <SelectItem value="blocked">Заблокированные</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
                  <div className="relative w-full sm:w-[320px]">
                    <Search
                      className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <Input
                      value={roleQuery}
                      onChange={e => setRoleQuery(e.target.value)}
                      placeholder="Поиск по ролям и правам…"
                      className="h-10 rounded pl-9 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-blue-500"
                      aria-label="Поиск ролей"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Вкладка: Пользователи */}
            <TabsContent value="users">
              <Card className="rounded shadow transition-all duration-200">
                <CardHeader className="p-4">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <UserCog
                      className="h-4 w-4 text-blue-500"
                      aria-hidden="true"
                    />
                    Управление пользователями
                  </CardTitle>
                  <CardDescription>Просмотр, редактирование, назначение ролей и блокировка.</CardDescription>
                </CardHeader>

                <CardContent className="p-4">
                  <div className="overflow-x-auto rounded">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="whitespace-nowrap">Пользователь</TableHead>
                          <TableHead className="whitespace-nowrap">Роль</TableHead>
                          <TableHead className="whitespace-nowrap">Статус</TableHead>
                          <TableHead className="whitespace-nowrap">Создан</TableHead>
                          <TableHead className="whitespace-nowrap">Последний вход</TableHead>
                          <TableHead className="w-[72px] text-right">Действия</TableHead>
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        {filteredUsers.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={6}
                              className="py-8 text-center text-sm text-muted-foreground"
                            >
                              Ничего не найдено. Измените фильтры или запрос.
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredUsers.map(u => {
                            const role = rolesMap.get(u.roleId);
                            return (
                              <TableRow
                                key={u.id}
                                className="transition-colors duration-200 hover:bg-muted/40"
                              >
                                <TableCell>
                                  <div className="flex flex-col">
                                    <span className="font-medium">{u.fullName}</span>
                                    <span className="text-sm text-muted-foreground">{u.email}</span>
                                  </div>
                                </TableCell>

                                <TableCell className="whitespace-nowrap">
                                  <Badge
                                    variant="outline"
                                    className="rounded"
                                  >
                                    {role?.name || '—'}
                                  </Badge>
                                </TableCell>

                                <TableCell className="whitespace-nowrap">{getStatusBadge(u.status)}</TableCell>

                                <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                                  {u.createdAt}
                                </TableCell>

                                <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                                  {u.lastLoginAt}
                                </TableCell>

                                <TableCell className="text-right">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        className="rounded transition-all duration-200 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-blue-500"
                                        aria-label={`Открыть меню действий для ${u.fullName}`}
                                      >
                                        <MoreVertical
                                          className="h-4 w-4"
                                          aria-hidden="true"
                                        />
                                      </Button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent
                                      align="end"
                                      className="w-56"
                                    >
                                      <DropdownMenuLabel>Действия</DropdownMenuLabel>
                                      <DropdownMenuSeparator />

                                      <DropdownMenuItem onSelect={() => handleOpenEditUser(u)}>
                                        <Pencil
                                          className="mr-2 h-4 w-4"
                                          aria-hidden="true"
                                        />
                                        Редактировать
                                      </DropdownMenuItem>

                                      <DropdownMenuItem onSelect={() => handleToggleUserStatus(u)}>
                                        <KeyRound
                                          className="mr-2 h-4 w-4"
                                          aria-hidden="true"
                                        />
                                        {u.status === 'active' ? 'Заблокировать' : 'Разблокировать'}
                                      </DropdownMenuItem>

                                      <DropdownMenuSeparator />

                                      <DropdownMenuItem
                                        onSelect={() => setDeletingUser(u)}
                                        className="text-red-600 focus:text-red-600"
                                      >
                                        <Trash2
                                          className="mr-2 h-4 w-4"
                                          aria-hidden="true"
                                        />
                                        Удалить
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            );
                          })
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Вкладка: Роли */}
            <TabsContent value="roles">
              <Card className="rounded shadow transition-all duration-200">
                <CardHeader className="p-4">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Shield
                      className="h-4 w-4 text-blue-500"
                      aria-hidden="true"
                    />
                    Администрирование ролей
                  </CardTitle>
                  <CardDescription>
                    Создание, редактирование и контроль прав. Удаление ограничено правилами безопасности.
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-4">
                  <div className="overflow-x-auto rounded">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="whitespace-nowrap">Роль</TableHead>
                          <TableHead className="min-w-[240px]">Описание</TableHead>
                          <TableHead className="whitespace-nowrap">Права</TableHead>
                          <TableHead className="w-[72px] text-right">Действия</TableHead>
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        {filteredRoles.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={4}
                              className="py-8 text-center text-sm text-muted-foreground"
                            >
                              Роли не найдены. Попробуйте другой запрос.
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredRoles.map(r => {
                            const del = canDeleteRole(r);
                            return (
                              <TableRow
                                key={r.id}
                                className="transition-colors duration-200 hover:bg-muted/40"
                              >
                                <TableCell className="whitespace-nowrap">
                                  <div className="flex items-center gap-2">
                                    <Badge
                                      variant={r.protected ? 'secondary' : 'default'}
                                      className={`rounded ${
                                        r.protected ? '' : 'bg-blue-500 hover:bg-blue-600'
                                      } transition-colors`}
                                    >
                                      {r.name}
                                    </Badge>
                                    {r.protected ? (
                                      <Badge
                                        variant="outline"
                                        className="rounded"
                                      >
                                        Защищённая
                                      </Badge>
                                    ) : null}
                                  </div>
                                </TableCell>

                                <TableCell className="text-sm text-muted-foreground">{r.description || '—'}</TableCell>

                                <TableCell className="whitespace-nowrap">
                                  <Badge
                                    variant="outline"
                                    className="rounded"
                                  >
                                    {r.permissions.length} шт.
                                  </Badge>
                                </TableCell>

                                <TableCell className="text-right">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        className="rounded transition-all duration-200 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-blue-500"
                                        aria-label={`Открыть меню действий для роли ${r.name}`}
                                      >
                                        <MoreVertical
                                          className="h-4 w-4"
                                          aria-hidden="true"
                                        />
                                      </Button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent
                                      align="end"
                                      className="w-56"
                                    >
                                      <DropdownMenuLabel>Действия</DropdownMenuLabel>
                                      <DropdownMenuSeparator />

                                      <DropdownMenuItem onSelect={() => handleOpenEditRole(r)}>
                                        <Pencil
                                          className="mr-2 h-4 w-4"
                                          aria-hidden="true"
                                        />
                                        Редактировать
                                      </DropdownMenuItem>

                                      <DropdownMenuSeparator />

                                      <DropdownMenuItem
                                        onSelect={() => setDeletingRole(r)}
                                        className="text-red-600 focus:text-red-600"
                                        disabled={!del.ok}
                                        aria-disabled={!del.ok}
                                      >
                                        <Trash2
                                          className="mr-2 h-4 w-4"
                                          aria-hidden="true"
                                        />
                                        Удалить
                                      </DropdownMenuItem>

                                      {!del.ok ? (
                                        <>
                                          <DropdownMenuSeparator />
                                          <div className="px-2 py-2 text-xs text-muted-foreground">
                                            {/* Подсказка по ограничению удаления */}
                                            Нельзя удалить: {del.reason}.
                                          </div>
                                        </>
                                      ) : null}
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            );
                          })
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Подсказка по правилам безопасности */}
                  <div className="mt-4 rounded border p-4 text-sm text-muted-foreground">
                    <p className="flex items-start gap-2">
                      <KeyRound
                        className="mt-0.5 h-4 w-4 text-blue-500"
                        aria-hidden="true"
                      />
                      <span>
                        Для MVP удаление роли запрещено, если роль защищена или назначена хотя бы одному пользователю.
                      </span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        {/* =========================
            Диалог: создание/редактирование пользователя
            ========================= */}
        <Dialog
          open={!!editingUser}
          onOpenChange={open => !open && setEditingUser(null)}
        >
          <DialogContent
            className="rounded"
            aria-label={editingUser?.id ? 'Редактирование пользователя' : 'Создание пользователя'}
          >
            <DialogHeader>
              <DialogTitle>{editingUser?.id ? 'Редактировать пользователя' : 'Новый пользователь'}</DialogTitle>
              <DialogDescription>
                {/* Комментарий: минимум полей для MVP */}
                Измените данные пользователя и назначьте роль доступа.
              </DialogDescription>
            </DialogHeader>

            <form
              className="grid gap-4"
              onSubmit={e => {
                e.preventDefault();
                handleSaveUser();
              }}
            >
              <div className="grid gap-2">
                <Label htmlFor="user-fullname">ФИО</Label>
                <Input
                  id="user-fullname"
                  value={userForm.fullName}
                  onChange={e => setUserForm(s => ({ ...s, fullName: e.target.value }))}
                  placeholder="Например: Анна Иванова"
                  className="rounded transition-all duration-200 focus-visible:ring-2 focus-visible:ring-blue-500"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="user-email">Email</Label>
                <Input
                  id="user-email"
                  type="email"
                  value={userForm.email}
                  onChange={e => setUserForm(s => ({ ...s, email: e.target.value }))}
                  placeholder="name@company.ru"
                  className="rounded transition-all duration-200 focus-visible:ring-2 focus-visible:ring-blue-500"
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Статус</Label>
                  <Select
                    value={userForm.status}
                    onValueChange={v => setUserForm(s => ({ ...s, status: v }))}
                  >
                    <SelectTrigger className="h-10 rounded transition-all duration-200 focus:ring-2 focus:ring-blue-500">
                      <SelectValue placeholder="Выберите статус" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Активен</SelectItem>
                      <SelectItem value="blocked">Заблокирован</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>Роль</Label>
                  <Select
                    value={userForm.roleId}
                    onValueChange={v => setUserForm(s => ({ ...s, roleId: v }))}
                  >
                    <SelectTrigger className="h-10 rounded transition-all duration-200 focus:ring-2 focus:ring-blue-500">
                      <SelectValue placeholder="Выберите роль" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map(r => (
                        <SelectItem
                          key={r.id}
                          value={r.id}
                        >
                          {r.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingUser(null)}
                  className="rounded transition-all duration-200 hover:shadow-lg"
                >
                  Отмена
                </Button>

                <Button
                  type="submit"
                  variant="default"
                  className="rounded bg-blue-500 transition-all duration-200 hover:bg-blue-600 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-blue-500"
                  // Комментарий: кнопка блокируется при минимально некорректных данных
                  disabled={!userForm.fullName.trim() || !userForm.email.trim() || !userForm.roleId}
                >
                  Сохранить
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* =========================
            Диалог: удаление пользователя (опасное действие)
            ========================= */}
        <Dialog
          open={!!deletingUser}
          onOpenChange={open => !open && setDeletingUser(null)}
        >
          <DialogContent
            className="rounded"
            aria-label="Удаление пользователя"
          >
            <DialogHeader>
              <DialogTitle>Удалить пользователя?</DialogTitle>
              <DialogDescription>Это действие нельзя отменить. Пользователь будет удалён из системы.</DialogDescription>
            </DialogHeader>

            <div className="rounded border p-4 text-sm">
              <p className="font-medium">{deletingUser?.fullName}</p>
              <p className="text-muted-foreground">{deletingUser?.email}</p>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDeletingUser(null)}
                className="rounded transition-all duration-200 hover:shadow-lg"
              >
                Отмена
              </Button>

              <Button
                type="button"
                variant="destructive"
                onClick={handleConfirmDeleteUser}
                className="rounded bg-red-500 transition-all duration-200 hover:bg-red-600 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-red-500"
              >
                Удалить
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* =========================
            Диалог: создание/редактирование роли
            ========================= */}
        <Dialog
          open={!!editingRole}
          onOpenChange={open => !open && setEditingRole(null)}
        >
          <DialogContent
            className="rounded"
            aria-label={editingRole?.id ? 'Редактирование роли' : 'Создание роли'}
          >
            <DialogHeader>
              <DialogTitle>{editingRole?.id ? 'Редактировать роль' : 'Новая роль'}</DialogTitle>
              <DialogDescription>
                {/* Комментарий: права вводятся строками для простоты (MVP) */}
                Укажите название, описание и список прав (по одному на строку).
              </DialogDescription>
            </DialogHeader>

            <form
              className="grid gap-4"
              onSubmit={e => {
                e.preventDefault();
                handleSaveRole();
              }}
            >
              <div className="grid gap-2">
                <Label htmlFor="role-name">Название роли</Label>
                <Input
                  id="role-name"
                  value={roleForm.name}
                  onChange={e => setRoleForm(s => ({ ...s, name: e.target.value }))}
                  placeholder="Например: Аналитик"
                  className="rounded transition-all duration-200 focus-visible:ring-2 focus-visible:ring-blue-500"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="role-desc">Описание</Label>
                <Input
                  id="role-desc"
                  value={roleForm.description}
                  onChange={e => setRoleForm(s => ({ ...s, description: e.target.value }))}
                  placeholder="Коротко опишите назначение роли"
                  className="rounded transition-all duration-200 focus-visible:ring-2 focus-visible:ring-blue-500"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="role-perms">Права (по одному на строку)</Label>
                <Input
                  id="role-perms"
                  value={roleForm.permissions}
                  onChange={e => setRoleForm(s => ({ ...s, permissions: e.target.value }))}
                  placeholder={`users.read\nusers.write\nroles.read`}
                  className="rounded transition-all duration-200 focus-visible:ring-2 focus-visible:ring-blue-500"
                  // Комментарий: используем Input вместо Textarea по ограничению "только перечисленные компоненты"
                />
                <p className="text-xs text-muted-foreground">
                  Пример: <span className="font-mono">users.read</span>, <span className="font-mono">roles.write</span>
                </p>
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingRole(null)}
                  className="rounded transition-all duration-200 hover:shadow-lg"
                >
                  Отмена
                </Button>

                <Button
                  type="submit"
                  variant="default"
                  className="rounded bg-blue-500 transition-all duration-200 hover:bg-blue-600 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-blue-500"
                  disabled={!roleForm.name.trim()}
                >
                  Сохранить
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* =========================
            Диалог: удаление роли
            ========================= */}
        <Dialog
          open={!!deletingRole}
          onOpenChange={open => !open && setDeletingRole(null)}
        >
          <DialogContent
            className="rounded"
            aria-label="Удаление роли"
          >
            <DialogHeader>
              <DialogTitle>Удалить роль?</DialogTitle>
              <DialogDescription>
                Роль можно удалить только если она не защищена и не назначена пользователям.
              </DialogDescription>
            </DialogHeader>

            <div className="rounded border p-4 text-sm">
              <p className="font-medium">{deletingRole?.name}</p>
              <p className="text-muted-foreground">{deletingRole?.description || '—'}</p>

              <div className="mt-3 flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className="rounded"
                >
                  Права: {deletingRole?.permissions?.length ?? 0}
                </Badge>
                {deletingRole?.protected ? (
                  <Badge
                    variant="secondary"
                    className="rounded"
                  >
                    Защищённая
                  </Badge>
                ) : null}
              </div>
            </div>

            {/* Комментарий: отображаем причину, если удаление невозможно */}
            {deletingRole
              ? (() => {
                  const del = canDeleteRole(deletingRole);
                  return !del.ok ? (
                    <div
                      className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                      role="alert"
                      aria-live="polite"
                    >
                      Нельзя удалить: {del.reason}.
                    </div>
                  ) : null;
                })()
              : null}

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDeletingRole(null)}
                className="rounded transition-all duration-200 hover:shadow-lg"
              >
                Отмена
              </Button>

              <Button
                type="button"
                variant="destructive"
                onClick={handleConfirmDeleteRole}
                className="rounded bg-red-500 transition-all duration-200 hover:bg-red-600 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-red-500"
                disabled={deletingRole ? !canDeleteRole(deletingRole).ok : true}
              >
                Удалить
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </Container>
  );
};
