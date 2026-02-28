import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

/**
 * Диалог создания/редактирования пользователя
 */
export function UserDialog({
                             open,
                             onOpenChange,
                             editingUser, // {id|null} или null
                             userForm,
                             setUserForm,
                             roles,
                             onSave,
                             onCancel,
                           }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="rounded"
        aria-label={editingUser?.id ? 'Редактирование пользователя' : 'Создание пользователя'}
      >
        <DialogHeader>
          <DialogTitle>{editingUser?.id ? 'Редактировать пользователя' : 'Новый пользователь'}</DialogTitle>
          <DialogDescription>Измените данные пользователя и назначьте роль доступа.</DialogDescription>
        </DialogHeader>

        <form
          className="grid gap-4"
          onSubmit={e => {
            e.preventDefault();
            onSave();
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
              <Select value={userForm.status} onValueChange={v => setUserForm(s => ({ ...s, status: v }))}>
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
              <Select value={userForm.roleId} onValueChange={v => setUserForm(s => ({ ...s, roleId: v }))}>
                <SelectTrigger className="h-10 rounded transition-all duration-200 focus:ring-2 focus:ring-blue-500">
                  <SelectValue placeholder="Выберите роль" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map(r => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onCancel} className="rounded transition-all duration-200 hover:shadow-lg">
              Отмена
            </Button>

            <Button
              type="submit"
              variant="default"
              className="rounded bg-blue-500 transition-all duration-200 hover:bg-blue-600 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-blue-500"
              disabled={!userForm.fullName.trim() || !userForm.email.trim() || !userForm.roleId}
            >
              Сохранить
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}