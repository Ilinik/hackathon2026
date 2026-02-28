import { Container } from '@/components/layouts/container';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { useNavigate } from 'react-router';

export const RegisterPage = () => {
  const { isLoading, registration } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registration({ username, email, password });
      navigate('/');
    } catch (error) {
      console.log('Registration failed: ', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-250px)]">
      <Container className="flex items-center justify-center ">
        <Card className="w-full max-w-sm ">
          <form onSubmit={handleSubmit}>
            <FieldSet className="w-full max-w-xs mx-auto">
              <FieldGroup className="gap-3">
                <CardTitle>Регистрация аккаунта</CardTitle>
                <CardDescription>
                  Введите свои данные для регистрации аккаунта
                </CardDescription>
              </FieldGroup>

              <FieldGroup className="gap-3">
                <Field>
                  <FieldLabel htmlFor="username">Имя пользователя</FieldLabel>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Иван"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </Field>
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
                    {isLoading ? 'Loading...' : 'Зарегистрироваться'}
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
