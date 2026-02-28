import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

/**
 * Диалог удаления пользователя
 */
export function DeleteUserDialog({ open, onOpenChange, user, onCancel, onConfirm }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded" aria-label="Удаление пользователя">
        <DialogHeader>
          <DialogTitle>Удалить пользователя?</DialogTitle>
          <DialogDescription>Это действие нельзя отменить. Пользователь будет удалён из системы.</DialogDescription>
        </DialogHeader>

        <div className="rounded border p-4 text-sm">
          <p className="font-medium">{user?.fullName}</p>
          <p className="text-muted-foreground">{user?.email}</p>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={onCancel} className="rounded transition-all duration-200 hover:shadow-lg">
            Отмена
          </Button>

          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            className="rounded bg-red-500 transition-all duration-200 hover:bg-red-600 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-red-500"
          >
            Удалить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}