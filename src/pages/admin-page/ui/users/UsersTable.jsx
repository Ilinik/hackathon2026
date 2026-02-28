import React from 'react';
import { MoreVertical, Pencil, Trash2, KeyRound, UserCog } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

/**
 * Таблица пользователей + действия
 */
export function UsersTable({
                             users, // filteredUsers
                             rolesMap,
                             getStatusBadge,
                             onEditUser,
                             onToggleUserStatus,
                             onDeleteUser,
                           }) {
  return (
    <Card className="rounded shadow transition-all duration-200">
      <CardHeader className="p-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <UserCog className="h-4 w-4 text-blue-500" aria-hidden="true" />
          Управление пользователями
        </CardTitle>
        <CardDescription>Просмотр, редактирование, назначение ролей и блокировка.</CardDescription>
      </CardHeader>

      <CardContent className="p-4">
        <div className="overflow-x-auto rounded">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">Пользователь</TableHead>
                <TableHead className="whitespace-nowrap">Роль</TableHead>
                <TableHead className="whitespace-nowrap">Статус</TableHead>
                <TableHead className="whitespace-nowrap">Создан</TableHead>
                <TableHead className="whitespace-nowrap">Последний вход</TableHead>
                <TableHead className="w-[72px] text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">
                    Ничего не найдено. Измените фильтры или запрос.
                  </TableCell>
                </TableRow>
              ) : (
                users.map(u => {
                  const role = rolesMap.get(u.roleId);
                  return (
                    <TableRow key={u.id} className="transition-colors duration-200 hover:bg-muted/40">
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{u.fullName}</span>
                          <span className="text-sm text-muted-foreground">{u.email}</span>
                        </div>
                      </TableCell>

                      <TableCell className="whitespace-nowrap">
                        <Badge variant="outline" className="rounded">
                          {role?.name || '—'}
                        </Badge>
                      </TableCell>

                      <TableCell className="whitespace-nowrap">{getStatusBadge(u.status)}</TableCell>

                      <TableCell className="whitespace-nowrap text-sm text-muted-foreground">{u.createdAt}</TableCell>

                      <TableCell className="whitespace-nowrap text-sm text-muted-foreground">{u.lastLoginAt}</TableCell>

                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              className="rounded transition-all duration-200 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-blue-500"
                              aria-label={`Открыть меню действий для ${u.fullName}`}
                            >
                              <MoreVertical className="h-4 w-4" aria-hidden="true" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>Действия</DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            <DropdownMenuItem onSelect={() => onEditUser(u)}>
                              <Pencil className="mr-2 h-4 w-4" aria-hidden="true" />
                              Редактировать
                            </DropdownMenuItem>

                            <DropdownMenuItem onSelect={() => onToggleUserStatus(u)}>
                              <KeyRound className="mr-2 h-4 w-4" aria-hidden="true" />
                              {u.status === 'active' ? 'Заблокировать' : 'Разблокировать'}
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              onSelect={() => onDeleteUser(u)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" aria-hidden="true" />
                              Удалить
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}