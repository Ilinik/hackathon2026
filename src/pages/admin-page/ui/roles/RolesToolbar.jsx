import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

/**
 * Панель поиска для ролей
 */
export function RolesToolbar({ roleQuery, onRoleQueryChange }) {
  return (
    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
      <div className="relative w-full sm:w-[320px]">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          value={roleQuery}
          onChange={e => onRoleQueryChange(e.target.value)}
          placeholder="Поиск по ролям и правам…"
          className="h-10 rounded pl-9 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-blue-500"
          aria-label="Поиск ролей"
        />
      </div>
    </div>
  );
}