import { Container } from '@/components/layouts/container';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

export const LoginPage = () => {
  const { isLoading, login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async data => {
    try {
      await login(data);
      navigate('/');
      toast.success('Вы вошли в аккаунт!');
    } catch (error) {
      const message = error.response?.data?.message || 'Произошла ошибка при входе';
      toast.error(message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-250px)]">
      <Container className="flex items-center justify-center ">
        <Card className="w-full max-w-sm ">
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldSet className="w-full max-w-xs mx-auto">
              <FieldGroup className="gap-3">
                <CardTitle>Войдите в ваш аккаунт</CardTitle>
                <CardDescription>Укажите данные для входа в аккаунт</CardDescription>
              </FieldGroup>
              <FieldGroup className="gap-3">
                <Field data-invalid={!!errors.email}>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="yourmail@gmail.com"
                    {...register('email', {
                      required: 'Email обязателен',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Введите корректный email',
                      },
                    })}
                  />
                  <FieldError errors={errors.email ? [errors.email] : []} />
                </Field>
                <Field data-invalid={!!errors.password}>
                  <FieldLabel htmlFor="password">Пароль</FieldLabel>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    {...register('password', {
                      required: 'Пароль обязателен',
                      minLength: {
                        value: 8,
                        message: 'Пароль должен содержать минимум 8 символов',
                      },
                    })}
                  />
                  <FieldError errors={errors.password ? [errors.password] : []} />
                </Field>
                <Field orientation="horizontal">
                  <Button
                    type="submit"
                    disabled={isLoading}
                  >
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
