import { Container } from '@/components/layouts/container';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldContent,
  FieldDescription,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

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

  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(undefined);
  const [parentFullName, setParentFullName] = useState('');
  const [parentPhoneNumber, setParentPhoneNumber] = useState('');

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
        dateOfBirth: date,
        parentFullName: isUnder14() ? parentFullName : undefined,
      });
      navigate('/');
    } catch (error) {
      console.log('Registration failed: ', error);
    }
  };

  const isUnder14 = () => {
    if (!date) return false;
    const today = new Date();
    const birthDate = new Date(date);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age < 14;
  };

  const isStep1Valid =
    firstName &&
    lastName &&
    middleName &&
    date &&
    (!isUnder14() || parentFullName);
  const isStep2Valid = email && password;

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-250px)]">
      <Container className="flex items-center justify-center">
        <Card className="w-full max-w-lg mx-4 sm:mx-6 lg:mx-8">
          <form onSubmit={handleSubmit}>
            <FieldSet className="w-full max-w-md sm:max-w-lg mx-auto px-4 sm:px-6 py-2">
              <FieldGroup className="gap-3">
                <CardTitle>Регистрация аккаунта</CardTitle>
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

                    <Field className="w-44">
                      <FieldLabel htmlFor="date">Дата рождения</FieldLabel>
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            id="date"
                            className="justify-start font-normal"
                          >
                            {date ? date.toLocaleDateString() : 'Выбрать дату'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-auto overflow-hidden p-0"
                          align="start"
                        >
                          <Calendar
                            mode="single"
                            selected={date}
                            defaultMonth={date}
                            captionLayout="dropdown"
                            onSelect={(date) => {
                              setDate(date);
                              setOpen(false);
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    </Field>

                    {isUnder14() && (
                      <>
                        <Field>
                          <FieldLabel htmlFor="parentFullName">
                            ФИО родителя
                          </FieldLabel>
                          <Input
                            id="parentFullName"
                            type="text"
                            placeholder="Иванов Иван Иванович"
                            value={parentFullName}
                            onChange={(e) => setParentFullName(e.target.value)}
                          />
                        </Field>

                        <Field>
                          <FieldLabel htmlFor="form-phone">
                            Телефон родителя
                          </FieldLabel>
                          <Input
                            id="form-phone"
                            type="tel"
                            placeholder="+7 (555) 123-4567"
                            value={parentPhoneNumber}
                            onChange={(e) =>
                              setParentPhoneNumber(e.target.value)
                            }
                          />
                        </Field>
                      </>
                    )}
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

                    <Field orientation="horizontal" className="mb-3 mt-2">
                      <Checkbox id="terms-checkbox-2" name="terms-checkbox-2" />
                      <FieldContent>
                        <FieldLabel htmlFor="terms-checkbox-2">
                          Принять условия и положения
                        </FieldLabel>
                        <FieldDescription>
                          Нажав на эту галочку, вы соглашаетесь с{' '}
                          <Link
                            className="underline"
                            to="https://normativ.kontur.ru/document?moduleId=1&documentId=501173"
                          >
                            условиями.
                          </Link>
                        </FieldDescription>
                      </FieldContent>
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

              <div className="pt-4 border-t border-border">
                <FieldGroup className="gap-2">
                  <CardDescription className="text-center text-xs">
                    {currentStep === 1
                      ? 'Шаг 1: Введите ваши данные'
                      : 'Шаг 2: Введите email и пароль'}
                  </CardDescription>
                  <Progress value={progress} className="h-1.5" />
                  <div className="text-[10px] text-muted-foreground text-center font-medium">
                    Шаг {currentStep} из {totalSteps}
                  </div>
                </FieldGroup>
              </div>
            </FieldSet>
          </form>
        </Card>
      </Container>
    </div>
  );
};
