export function buildRolesMap(roles) {
  const map = new Map();
  roles.forEach(r => map.set(r.id, r));
  return map;
}

export function selectFilteredUsers({ users, rolesMap, userQuery, userRoleFilter, userStatusFilter }) {
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
}

export function selectFilteredRoles({ roles, roleQuery }) {
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
}

export function selectStats({ users, roles }) {
  const usersActive = users.filter(u => u.status === 'active').length;
  const usersBlocked = users.filter(u => u.status === 'blocked').length;

  return {
    usersTotal: users.length,
    usersActive,
    usersBlocked,
    rolesTotal: roles.length,
  };
}