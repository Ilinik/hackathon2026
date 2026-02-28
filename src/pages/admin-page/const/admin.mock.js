export const initialUsersMock = [
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
];

export const initialRolesMock = [
  {
    id: 'r_admin',
    name: 'Администратор',
    description: 'Полный доступ к управлению системой',
    permissions: ['users.read', 'users.write', 'roles.read', 'roles.write', 'audit.read'],
    protected: true,
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
];