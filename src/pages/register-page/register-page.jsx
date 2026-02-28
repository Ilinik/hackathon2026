import { Container } from '@/components/layouts/container';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { useNavigate } from 'react-router';

export const RegisterPage = () => {
  const { isLoading, registration } = useAuth();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [middleName, setMiddleName] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registration({
        email,
        password,
        firstName,
        lastName,
        middleName,
      });
      navigate('/');
    } catch (error) {
      console.log('Registration failed: ', error);
    }
  };

  const isStep1Valid = firstName && lastName && middleName;
  const isStep2Valid = email && password;

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-250px)]">
      <Container className="flex items-center justify-center">
        <Card className="w-full max-w-sm">
          <form onSubmit={handleSubmit}>
            <FieldSet className="w-full max-w-xs mx-auto">
              <FieldGroup className="gap-3">
                <CardTitle>Регистрация аккаунта</CardTitle>
                <FieldGroup>
                  <CardDescription>
                    {currentStep === 1
                      ? 'Шаг 1: Введите ваши данные'
                      : 'Шаг 2: Введите email и пароль'}
                  </CardDescription>
                  <Progress value={progress} className="h-2" />
                  <div className="text-xs text-muted-foreground text-center">
                    Шаг {currentStep} из {totalSteps}
                  </div>
                </FieldGroup>
              </FieldGroup>

              <FieldGroup className="gap-3">
                {currentStep === 1 && (
                  <>
                    <Field>
                      <FieldLabel htmlFor="lastName">Фамилия</FieldLabel>
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Иванов"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="firstName">Имя</FieldLabel>
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="Иван"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="middleName">Отчество</FieldLabel>
                      <Input
                        id="middleName"
                        type="text"
                        placeholder="Иванович"
                        value={middleName}
                        onChange={(e) => setMiddleName(e.target.value)}
                      />
                    </Field>
                  </>
                )}

                {currentStep === 2 && (
                  <>
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
                  </>
                )}

                <Field orientation="horizontal" className="justify-between">
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBack}
                      disabled={isLoading}
                    >
                      Назад
                    </Button>
                  )}
                  {currentStep < totalSteps ? (
                    <Button
                      type="button"
                      onClick={handleNext}
                      disabled={!isStep1Valid}
                      className={currentStep === 1 ? '' : 'ml-auto'}
                    >
                      Далее
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={!isStep2Valid || isLoading}
                      className="ml-auto"
                    >
                      {isLoading ? 'Загрузка...' : 'Зарегистрироваться'}
                    </Button>
                  )}
                </Field>
              </FieldGroup>
            </FieldSet>
          </form>
        </Card>
      </Container>
    </div>
  );
};
