import React from 'react';
import { Users, Shield, CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function AdminStats({ stats }) {
  return (
    <section aria-label="Сводка" className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="rounded shadow transition-all duration-200 hover:shadow-lg">
        <CardHeader className="p-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="h-4 w-4 text-blue-500" aria-hidden="true" />
            Пользователи
          </CardTitle>
          <CardDescription>Всего в системе</CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="text-2xl font-semibold">{stats.usersTotal}</div>
        </CardContent>
      </Card>

      <Card className="rounded shadow transition-all duration-200 hover:shadow-lg">
        <CardHeader className="p-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <CheckCircle2 className="h-4 w-4 text-blue-500" aria-hidden="true" />
            Активные
          </CardTitle>
          <CardDescription>Доступ разрешён</CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="text-2xl font-semibold">{stats.usersActive}</div>
        </CardContent>
      </Card>

      <Card className="rounded shadow transition-all duration-200 hover:shadow-lg">
        <CardHeader className="p-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <XCircle className="h-4 w-4 text-blue-500" aria-hidden="true" />
            Заблокированные
          </CardTitle>
          <CardDescription>Доступ запрещён</CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="text-2xl font-semibold">{stats.usersBlocked}</div>
        </CardContent>
      </Card>

      <Card className="rounded shadow transition-all duration-200 hover:shadow-lg">
        <CardHeader className="p-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield className="h-4 w-4 text-blue-500" aria-hidden="true" />
            Роли
          </CardTitle>
          <CardDescription>Всего ролей</CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="text-2xl font-semibold">{stats.rolesTotal}</div>
        </CardContent>
      </Card>
    </section>
  );
}