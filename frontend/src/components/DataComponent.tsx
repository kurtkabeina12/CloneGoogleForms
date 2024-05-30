import React from 'react';
import { FormGroup, TextField } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

interface DataComponentProps {
  disabled?: boolean;
  required?: boolean;
  quest?: string;
  idQuestion?: string;
  cardFormPageType?: string;
}

const DataComponent: React.FC<DataComponentProps> = ({ disabled = false, required = false, quest, idQuestion, cardFormPageType }) => {
  const { control, formState: { errors } } = useFormContext(); // Исправлено использование register, так как оно не используется напрямую

  const inputName = (idQuestion || 'defaultIdQuestion') + ':' + cardFormPageType;

  // Функция для кастомной валидации
  const validateDate = (value: string) => {
    if (!value) return true; // Если значение пустое, считаем его валидным
    const regex = /^\d{4}-\d{2}-\d{2}$/; // Регулярное выражение для проверки формата даты YYYY-MM-DD
    return regex.test(value) || "Введите корректную дату";
  };

  return (
    <FormGroup sx={{ width: "-webkit-fill-available", marginTop: "1rem" }}>
      {disabled &&
        <TextField
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
          disabled
          color='success'
        />
      }
      {!disabled &&
       <Controller
       name={inputName}
       control={control}
       defaultValue=""
       rules={{ 
         required: required? "Заполните поле" : false,
         validate: validateDate // Применяем кастомную валидацию
       }}
       render={({ field }) => (
         <TextField
           {...field}
           type="date"
           InputLabelProps={{
             shrink: true,
           }}
           disabled={disabled}
           color='success'
           required={required}
           error={!!errors[inputName]}
           helperText={errors[inputName]?.message?.toString() || ''}
         />
       )}
     />
      }
    </FormGroup>
  );
};

export default DataComponent;
