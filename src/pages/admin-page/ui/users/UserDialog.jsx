import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const API_ROLES = [
  { id: 'USER', name: 'Пользователь' },
  { id: 'ADMIN', name: 'Администратор' },
];

/**
 * Диалог редактирования пользователя
 */
export function UserDialog({
  open,
  onOpenChange,
  editingUser,
  userForm,
  setUserForm,
  onSave,
  onCancel,
}) {
  const age = Number(userForm.age);
  const needsParent = age > 0 && age < 14;

  const isValid =
    userForm.email.trim() &&
    userForm.name.trim() &&
    userForm.surname.trim() &&
    userForm.age !== '' &&
    userForm.role &&
    (!needsParent || (userForm.parentFullName.trim() && userForm.parentPhone.trim()));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="rounded max-h-[90vh] overflow-y-auto"
        aria-label="Редактирование пользователя"
      >
        <DialogHeader>
          <DialogTitle>Редактировать пользователя</DialogTitle>
          <DialogDescription>Измените данные пользователя и назначьте роль доступа.</DialogDescription>
        </DialogHeader>

        <form
          className="grid gap-4"
          onSubmit={e => {
            e.preventDefault();
            onSave();
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="user-surname">Фамилия</Label>
              <Input
                id="user-surname"
                value={userForm.surname}
                onChange={e => setUserForm(s => ({ ...s, surname: e.target.value }))}
                placeholder="Петров"
                className="rounded transition-all duration-200 focus-visible:ring-2 focus-visible:ring-blue-500"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="user-name">Имя</Label>
              <Input
                id="user-name"
                value={userForm.name}
                onChange={e => setUserForm(s => ({ ...s, name: e.target.value }))}
                placeholder="Пётр"
                className="rounded transition-all duration-200 focus-visible:ring-2 focus-visible:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="user-patronymic">Отчество</Label>
              <Input
                id="user-patronymic"
                value={userForm.patronymic}
                onChange={e => setUserForm(s => ({ ...s, patronymic: e.target.value }))}
                placeholder="Петрович (необязательно)"
                className="rounded transition-all duration-200 focus-visible:ring-2 focus-visible:ring-blue-500"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="user-age">Возраст</Label>
              <Input
                id="user-age"
                type="number"
                min="1"
                max="120"
                value={userForm.age}
                onChange={e => setUserForm(s => ({ ...s, age: e.target.value }))}
                placeholder="13"
                className="rounded transition-all duration-200 focus-visible:ring-2 focus-visible:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="user-email">Email</Label>
            <Input
              id="user-email"
              type="email"
              value={userForm.email}
              onChange={e => setUserForm(s => ({ ...s, email: e.target.value }))}
              placeholder="name@example.com"
              className="rounded transition-all duration-200 focus-visible:ring-2 focus-visible:ring-blue-500"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label>Роль</Label>
            <Select value={userForm.role} onValueChange={v => setUserForm(s => ({ ...s, role: v }))}>
              <SelectTrigger className="h-10 rounded transition-all duration-200 focus:ring-2 focus:ring-blue-500">
                <SelectValue placeholder="Выберите роль" />
              </SelectTrigger>
              <SelectContent>
                {API_ROLES.map(r => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {needsParent && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="user-parent-name">ФИО родителя</Label>
                <Input
                  id="user-parent-name"
                  value={userForm.parentFullName}
                  onChange={e => setUserForm(s => ({ ...s, parentFullName: e.target.value }))}
                  placeholder="Петров Пётр Петрович"
                  className="rounded transition-all duration-200 focus-visible:ring-2 focus-visible:ring-blue-500"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="user-parent-phone">Телефон родителя</Label>
                <Input
                  id="user-parent-phone"
                  value={userForm.parentPhone}
                  onChange={e => setUserForm(s => ({ ...s, parentPhone: e.target.value }))}
                  placeholder="+79991234567"
                  className="rounded transition-all duration-200 focus-visible:ring-2 focus-visible:ring-blue-500"
                  required
                />
              </div>
            </>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onCancel} className="rounded transition-all duration-200 hover:shadow-lg">
              Отмена
            </Button>
            <Button
              type="submit"
              variant="default"
              className="rounded bg-blue-500 transition-all duration-200 hover:bg-blue-600 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-blue-500"
              disabled={!isValid}
            >
              Сохранить
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
