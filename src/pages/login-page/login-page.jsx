import { Container } from '@/components/layouts/container';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { useNavigate } from 'react-router';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { isLoading, login } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });
      navigate('/');
    } catch (error) {
      console.log('Login failed: ', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-250px)]">
      <Container className="flex items-center justify-center ">
        <Card className="w-full max-w-sm ">
          <form onSubmit={handleSubmit}>
            <FieldSet className="w-full max-w-xs mx-auto">
              <FieldGroup className="gap-3">
                <CardTitle>Войдите в ваш аккаунт</CardTitle>
                <CardDescription>
                  Укажите данные для входа в аккаунт
                </CardDescription>
              </FieldGroup>
              <FieldGroup className="gap-3">
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="yourmail@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="password">Пароль</FieldLabel>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Field>
                <Field orientation="horizontal">
                  <Button type="submit">
                    {isLoading ? 'Loading...' : 'Войти'}
                  </Button>
                </Field>
              </FieldGroup>
            </FieldSet>
          </form>
        </Card>
      </Container>
    </div>
  );
};
