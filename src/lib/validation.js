import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email обязателен')
    .email('Введите корректный email'),
  password: z.string().min(1, 'Пароль обязателен'),
});

export const registerSchema = z
  .object({
    surname: z.string().min(1, 'Фамилия обязательна'),
    name: z.string().min(1, 'Имя обязательно'),
    patronymic: z.string().min(1, 'Отчество обязательно'),
    dateOfBirth: z.date({
      required_error: 'Дата рождения обязательна',
      invalid_type_error: 'Выберите дату рождения',
    }),
    parentFullName: z.string().optional(),
    parentPhone: z.string().optional(),
    email: z
      .string()
      .min(1, 'Email обязателен')
      .email('Введите корректный email'),
    password: z
      .string()
      .min(8, 'Пароль должен содержать минимум 8 символов'),
    terms: z.boolean().refine((val) => val === true, {
      message: 'Необходимо принять условия',
    }),
  })
  .refine(
    (data) => {
      const age = calculateAge(data.dateOfBirth);
      if (age < 14) {
        return data.parentFullName && data.parentFullName.length > 0;
      }
      return true;
    },
    {
      message: 'ФИО родителя обязательно для пользователей младше 14 лет',
      path: ['parentFullName'],
    }
  )
  .refine(
    (data) => {
      const age = calculateAge(data.dateOfBirth);
      if (age < 14) {
        return data.parentPhone && data.parentPhone.length > 0;
      }
      return true;
    },
    {
      message: 'Телефон родителя обязателен для пользователей младше 14 лет',
      path: ['parentPhone'],
    }
  );

export const calculateAge = (date) => {
  if (!date) return 0;
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
  return age;
};
