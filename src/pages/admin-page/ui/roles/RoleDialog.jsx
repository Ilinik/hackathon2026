import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

/**
 * Диалог создания/редактирования роли
 */
export function RoleDialog({
                             open,
                             onOpenChange,
                             editingRole,
                             roleForm,
                             setRoleForm,
                             onSave,
                             onCancel,
                           }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded" aria-label={editingRole?.id ? 'Редактирование роли' : 'Создание роли'}>
        <DialogHeader>
          <DialogTitle>{editingRole?.id ? 'Редактировать роль' : 'Новая роль'}</DialogTitle>
          <DialogDescription>Укажите название, описание и список прав (по одному на строку).</DialogDescription>
        </DialogHeader>

        <form
          className="grid gap-4"
          onSubmit={e => {
            e.preventDefault();
            onSave();
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
            />
            <p className="text-xs text-muted-foreground">
              Пример: <span className="font-mono">users.read</span>, <span className="font-mono">roles.write</span>
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onCancel} className="rounded transition-all duration-200 hover:shadow-lg">
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
  );
}