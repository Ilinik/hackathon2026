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
  FieldError,
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
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, calculateAge } from '@/lib/validation';
import { Eye, EyeOff } from 'lucide-react';

export const RegisterPage = () => {
  const { isLoading, registration } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      surname: '',
      name: '',
      patronymic: '',
      dateOfBirth: undefined,
      email: '',
      password: '',
      parentFullName: '',
      parentPhone: '',
      terms: false,
    },
    mode: 'onChange',
  });

  const dateOfBirth = watch('dateOfBirth');
  const age = calculateAge(dateOfBirth);
  const isUnder14 = !!dateOfBirth && age < 14;

  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (isStep1Valid) {
      setCurrentStep(s => s + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data) => {
    try {
      await registration({
        email: data.email,
        password: data.password,
        name: data.name,
        surname: data.surname,
        patronymic: data.patronymic,
        age: calculateAge(data.dateOfBirth),
        parentFullName: isUnder14 ? data.parentFullName : undefined,
        parentPhone: isUnder14 ? data.parentPhone : undefined,
      });
      navigate('/');
    } catch (error) {
      console.log('Registration failed: ', error);
    }
  };

  const isStep1Valid =
    watch('surname') &&
    watch('name') &&
    watch('patronymic') &&
    dateOfBirth &&
    (!isUnder14 || (watch('parentFullName') && watch('parentPhone')));

  const isStep2Valid =
    watch('email') &&
    watch('password') &&
    watch('terms') &&
    !errors.email &&
    !errors.password;

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-250px)]">
      <Container className="flex items-center justify-center">
        <Card className="w-full max-w-lg mx-4 sm:mx-6 lg:mx-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldSet className="w-full max-w-md sm:max-w-lg mx-auto px-4 sm:px-6 py-2">
              <FieldGroup className="gap-3">
                <CardTitle>Регистрация аккаунта</CardTitle>
              </FieldGroup>

              <FieldGroup className="gap-3">
                {currentStep === 1 && (
                  <>
                    <Field data-invalid={!!errors.surname}>
                      <FieldLabel htmlFor="surname">Фамилия</FieldLabel>
                      <Input
                        id="surname"
                        type="text"
                        placeholder="Иванов"
                        {...register('surname')}
                      />
                      <FieldError
                        errors={errors.surname ? [errors.surname] : []}
                      />
                    </Field>

                    <Field data-invalid={!!errors.name}>
                      <FieldLabel htmlFor="name">Имя</FieldLabel>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Иван"
                        {...register('name')}
                      />
                      <FieldError errors={errors.name ? [errors.name] : []} />
                    </Field>

                    <Field data-invalid={!!errors.patronymic}>
                      <FieldLabel htmlFor="patronymic">Отчество</FieldLabel>
                      <Input
                        id="patronymic"
                        type="text"
                        placeholder="Иванович"
                        {...register('patronymic')}
                      />
                      <FieldError
                        errors={errors.patronymic ? [errors.patronymic] : []}
                      />
                    </Field>

                    <Field
                      className="w-full"
                      data-invalid={!!errors.dateOfBirth}
                    >
                      <FieldLabel htmlFor="date">Дата рождения</FieldLabel>
                      <Controller
                        name="dateOfBirth"
                        control={control}
                        render={({ field }) => (
                          <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                id="date"
                                className="justify-start font-normal w-full"
                              >
                                {field.value
                                  ? field.value.toLocaleDateString()
                                  : 'Выбрать дату'}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto overflow-hidden p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                defaultMonth={field.value}
                                captionLayout="dropdown"
                                onSelect={(date) => {
                                  field.onChange(date);
                                  setOpen(false);
                                }}
                              />
                            </PopoverContent>
                          </Popover>
                        )}
                      />
                      <FieldError
                        errors={errors.dateOfBirth ? [errors.dateOfBirth] : []}
                      />
                    </Field>

                    {isUnder14 && (
                      <>
                        <Field data-invalid={!!errors.parentFullName}>
                          <FieldLabel htmlFor="parentFullName">
                            ФИО родителя
                          </FieldLabel>
                          <Input
                            id="parentFullName"
                            type="text"
                            placeholder="Иванов Иван Иванович"
                            {...register('parentFullName')}
                          />
                          <FieldError
                            errors={
                              errors.parentFullName
                                ? [errors.parentFullName]
                                : []
                            }
                          />
                        </Field>

                        <Field data-invalid={!!errors.parentPhone}>
                          <FieldLabel htmlFor="parentPhone">
                            Телефон родителя
                          </FieldLabel>
                          <Input
                            id="parentPhone"
                            type="tel"
                            placeholder="+7 (555) 123-4567"
                            {...register('parentPhone')}
                          />
                          <FieldError
                            errors={
                              errors.parentPhone ? [errors.parentPhone] : []
                            }
                          />
                        </Field>
                      </>
                    )}
                  </>
                )}

                {currentStep === 2 && (
                  <>
                    <Field data-invalid={!!errors.email}>
                      <FieldLabel htmlFor="email">Email</FieldLabel>
                      <Input
                        id="email"
                        type="email"
                        placeholder="yourmail@gmail.com"
                        {...register('email')}
                      />
                      <FieldError errors={errors.email ? [errors.email] : []} />
                    </Field>

                    <Field data-invalid={!!errors.password}>
                      <FieldLabel htmlFor="password">Пароль</FieldLabel>

                      <div className="relative">
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          type={showPassword ? 'text' : 'password'}
                          {...register('password', {
                            required: 'Пароль обязателен',
                            minLength: {
                              value: 8,
                              message:
                                'Пароль должен содержать минимум 8 символов',
                            },
                          })}
                        />
                        <Button
                          className="absolute top-0 right-0 h-full px-3 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                          size="icon"
                          type="button"
                          variant="ghost"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                      <FieldError
                        errors={errors.password ? [errors.password] : []}
                      />
                    </Field>

                    <Field
                      orientation="horizontal"
                      className="mb-3 mt-2"
                      data-invalid={!!errors.terms}
                    >
                      <Controller
                        name="terms"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            id="terms-checkbox-2"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
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
                    {errors.terms && (
                      <div className="text-sm text-destructive">
                        {errors.terms.message}
                      </div>
                    )}
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
