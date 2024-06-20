import React from 'react';
import { FormGroup, TextField } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

interface DataComponentProps {
  disabled?: boolean;
  required?: boolean;
  quest?: string;
  idQuestion?: string;
  cardFormPageType?: string;
  points?: number | string;
  sectionIndex?: number;
  cardIndex?: number;
  cardType?: string;
	updateCorrectAnswer?: (sectionIndex: number, index: number, correctAnswer: string | string[], cardType: string, subQuestionIndex?: number) => void;
}

const DataComponent: React.FC<DataComponentProps> = ({ disabled = false, required = false, quest, idQuestion, cardFormPageType, points, sectionIndex, cardIndex, cardType, updateCorrectAnswer }) => {
  const { control, formState: { errors } } = useFormContext(); // Исправлено использование register, так как оно не используется напрямую

  const inputName = (idQuestion || 'defaultIdQuestionData') + ':' + cardFormPageType;

  // Функция для кастомной валидации
  const validateDate = (value: string) => {
    if (!value) return true; // Если значение пустое, считаем его валидным
    const regex = /^\d{4}-\d{2}-\d{2}$/; // Регулярное выражение для проверки формата даты YYYY-MM-DD
    return regex.test(value) || "Введите корректную дату";
  };

  const handleUpdateCorrectAnswer = (e: { target: { value: any; }; }) => {
    const correctAnswer = e.target.value;
    if (updateCorrectAnswer) {
      updateCorrectAnswer(sectionIndex!, cardIndex!, correctAnswer, cardType!, undefined); 
    }
  };

  return (
    <FormGroup sx={{ width: "-webkit-fill-available", marginTop: "1rem" }}>
      {disabled && !points && points !== 0 &&
        <TextField
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
          disabled
          color='success'
        />
      }
      {disabled && (points === 0 || points) &&
        <TextField
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={handleUpdateCorrectAnswer}
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
