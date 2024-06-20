import { TextField, Typography } from '@mui/material';
import React from 'react';
import { useFormContext } from 'react-hook-form';

interface InputComponentProps {
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

const InputComponent: React.FC<InputComponentProps> = ({ disabled = false, required = false, quest, idQuestion, cardFormPageType, points, sectionIndex, cardIndex, cardType, updateCorrectAnswer }) => {
  const { register, formState: { errors } } = useFormContext();
  const inputName = (idQuestion || 'defaultIdQuestionInput') + ':' + cardFormPageType;
  const { ref, onChange, onBlur } = register(inputName, { required: required ? "Заполните поле" : false });

  const handleUpdateCorrectAnswer = (e: { target: { value: any; }; }) => {
    const correctAnswer = e.target.value;
    if (updateCorrectAnswer) {
      updateCorrectAnswer(sectionIndex!, cardIndex!, correctAnswer, cardType!, undefined); 
    }
  };

  console.log(points)
  return (
    <>
      {disabled && !points && points !== 0 &&
        <TextField
          variant="standard"
          placeholder="Напишите ответ"
          name="title"
          type='text'
          sx={{ mb: 3, marginTop: "1rem" }}
          fullWidth
          disabled
        />
      }
      {disabled && (points === 0 || points) &&
        <>
          <TextField
            variant="standard"
            placeholder="Напишите правильный ответ"
            name="title"
            type='text'
            sx={{ mb: 3, marginTop: "1rem" }}
            fullWidth
            onChange={handleUpdateCorrectAnswer}
          />
        </>
      }
      {!disabled &&
        <>
          <TextField
            type='text'
            variant="standard"
            placeholder="Напишите ответ"
            name={inputName}
            sx={{ mb: 3, marginTop: "1rem" }}
            fullWidth
            required={required}
            inputRef={ref}
            onChange={onChange}
            onBlur={onBlur}
            inputProps={{
              maxLength: 250,
            }}
          />
          {errors[inputName] && (
            <Typography color="error">
              {errors[inputName]?.message?.toString() || ''}
            </Typography>
          )}
        </>
      }
    </>
  );
};

export default InputComponent;
