import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

/**
 * Панель поиска/фильтров для пользователей
 */
export function UsersToolbar({
                               userQuery,
                               onUserQueryChange,
                               userRoleFilter,
                               onUserRoleFilterChange,
                               userStatusFilter,
                               onUserStatusFilterChange,
                               roles,
                             }) {
  return (
    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
      <div className="relative w-full sm:w-[280px]">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          value={userQuery}
          onChange={e => onUserQueryChange(e.target.value)}
          placeholder="Поиск по имени, email, роли…"
          className="h-10 rounded pl-9 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-blue-500"
          aria-label="Поиск пользователей"
        />
      </div>

      <Select value={userRoleFilter} onValueChange={onUserRoleFilterChange}>
        <SelectTrigger
          className="h-10 w-full rounded sm:w-[200px] transition-all duration-200 focus:ring-2 focus:ring-blue-500"
          aria-label="Фильтр по роли"
        >
          <SelectValue placeholder="Роль" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Все роли</SelectItem>
          {roles.map(r => (
            <SelectItem key={r.id} value={r.id}>
              {r.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={userStatusFilter} onValueChange={onUserStatusFilterChange}>
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
  );
}