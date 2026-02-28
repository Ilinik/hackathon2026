import React from 'react';
import { Plus, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AdminHeader({ onCreateUser, onCreateRole }) {
  return (
    <header className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight">Админ-панель</h1>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        {onCreateUser && (
          <Button
            type="button"
            variant="default"
            onClick={onCreateUser}
            className="rounded bg-blue-500 transition-all duration-200 hover:bg-blue-600 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
            Добавить пользователя
          </Button>
        )}

        <Button
          type="button"
          variant="outline"
          onClick={onCreateRole}
          className="rounded border-blue-500 text-blue-600 transition-all duration-200 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <Shield className="mr-2 h-4 w-4" aria-hidden="true" />
          Создать роль
        </Button>
      </div>
    </header>
  );
}