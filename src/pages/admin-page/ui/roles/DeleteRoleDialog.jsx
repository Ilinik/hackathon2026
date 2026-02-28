import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

/**
 * Диалог удаления роли (с проверками)
 */
export function DeleteRoleDialog({ open, onOpenChange, role, canDeleteRole, onCancel, onConfirm }) {
  const del = role ? canDeleteRole(role) : { ok: false, reason: '' };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded" aria-label="Удаление роли">
        <DialogHeader>
          <DialogTitle>Удалить роль?</DialogTitle>
          <DialogDescription>Роль можно удалить только если она не защищена и не назначена пользователям.</DialogDescription>
        </DialogHeader>

        <div className="rounded border p-4 text-sm">
          <p className="font-medium">{role?.name}</p>
          <p className="text-muted-foreground">{role?.description || '—'}</p>

          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant="outline" className="rounded">
              Права: {role?.permissions?.length ?? 0}
            </Badge>
            {role?.protected ? (
              <Badge variant="secondary" className="rounded">
                Защищённая
              </Badge>
            ) : null}
          </div>
        </div>

        {role && !del.ok ? (
          <div className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert" aria-live="polite">
            Нельзя удалить: {del.reason}.
          </div>
        ) : null}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={onCancel} className="rounded transition-all duration-200 hover:shadow-lg">
            Отмена
          </Button>

          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            className="rounded bg-red-500 transition-all duration-200 hover:bg-red-600 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-red-500"
            disabled={role ? !del.ok : true}
          >
            Удалить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}