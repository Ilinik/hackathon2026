export function canDeleteRole(role, users) {
  if (role.protected) return { ok: false, reason: 'Защищённая роль' };

  const inUse = users.some(u => u.roleId === role.id);
  if (inUse) return { ok: false, reason: 'Роль используется пользователями' };

  return { ok: true, reason: '' };
}