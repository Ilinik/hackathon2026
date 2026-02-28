import React from 'react';
import { MoreVertical, Pencil, Trash2, Shield, KeyRound } from 'lucide-react';
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
 * Таблица ролей + правила удаления (подсказка)
 */
export function RolesTable({ roles, canDeleteRole, onEditRole, onDeleteRole }) {
  return (
    <Card className="rounded shadow transition-all duration-200">
      <CardHeader className="p-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <Shield className="h-4 w-4 text-blue-500" aria-hidden="true" />
          Администрирование ролей
        </CardTitle>
        <CardDescription>Создание, редактирование и контроль прав. Удаление ограничено правилами безопасности.</CardDescription>
      </CardHeader>

      <CardContent className="p-4">
        <div className="overflow-x-auto rounded">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">Роль</TableHead>
                <TableHead className="min-w-[240px]">Описание</TableHead>
                <TableHead className="whitespace-nowrap">Права</TableHead>
                <TableHead className="w-[72px] text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {roles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-8 text-center text-sm text-muted-foreground">
                    Роли не найдены. Попробуйте другой запрос.
                  </TableCell>
                </TableRow>
              ) : (
                roles.map(r => {
                  const del = canDeleteRole(r);

                  return (
                    <TableRow key={r.id} className="transition-colors duration-200 hover:bg-muted/40">
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={r.protected ? 'secondary' : 'default'}
                            className={`rounded ${r.protected ? '' : 'bg-blue-500 hover:bg-blue-600'} transition-colors`}
                          >
                            {r.name}
                          </Badge>

                          {r.protected ? (
                            <Badge variant="outline" className="rounded">
                              Защищённая
                            </Badge>
                          ) : null}
                        </div>
                      </TableCell>

                      <TableCell className="text-sm text-muted-foreground">{r.description || '—'}</TableCell>

                      <TableCell className="whitespace-nowrap">
                        <Badge variant="outline" className="rounded">
                          {r.permissions.length} шт.
                        </Badge>
                      </TableCell>

                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              className="rounded transition-all duration-200 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-blue-500"
                              aria-label={`Открыть меню действий для роли ${r.name}`}
                            >
                              <MoreVertical className="h-4 w-4" aria-hidden="true" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>Действия</DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            <DropdownMenuItem onSelect={() => onEditRole(r)}>
                              <Pencil className="mr-2 h-4 w-4" aria-hidden="true" />
                              Редактировать
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              onSelect={() => onDeleteRole(r)}
                              className="text-red-600 focus:text-red-600"
                              disabled={!del.ok}
                              aria-disabled={!del.ok}
                            >
                              <Trash2 className="mr-2 h-4 w-4" aria-hidden="true" />
                              Удалить
                            </DropdownMenuItem>

                            {!del.ok ? (
                              <>
                                <DropdownMenuSeparator />
                                <div className="px-2 py-2 text-xs text-muted-foreground">Нельзя удалить: {del.reason}.</div>
                              </>
                            ) : null}
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

        <div className="mt-4 rounded border p-4 text-sm text-muted-foreground">
          <p className="flex items-start gap-2">
            <KeyRound className="mt-0.5 h-4 w-4 text-blue-500" aria-hidden="true" />
          </p>
        </div>
      </CardContent>
    </Card>
  );
}