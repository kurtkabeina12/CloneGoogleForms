import { TextField, Typography } from '@mui/material';
import React from 'react';
import { useFormContext } from 'react-hook-form';

interface InputComponentProps {
  disabled?: boolean;
  required?: boolean;
  quest?: string;
}

const InputComponent: React.FC<InputComponentProps> = ({ disabled = false, required = false, quest }) => {
  const { register, formState: { errors } } = useFormContext();

  const questName = quest || 'ИмяВопросаНеБылоЗадано';

  const { ref, onChange, onBlur } = register(questName, { required: required ? "Заполните поле" : false });

  return (
    <>
      {disabled &&
        <TextField
          variant="standard"
          placeholder="Напишите ответ"
          name="title"
          sx={{ mb: 3, marginTop: "1rem" }}
          fullWidth
          disabled
        />
      }
      {!disabled &&
        <>
          <TextField
            variant="standard"
            placeholder="Напишите ответ"
            name={quest}
            sx={{ mb: 3, marginTop: "1rem" }}
            fullWidth
            required={required}
            inputRef={ref}
            onChange={onChange}
            onBlur={onBlur}
          />
          {errors[questName] && (
            <Typography color="error">
              {errors[questName]?.message?.toString() || ''}
            </Typography>
          )}
        </>
      }
    </>
  );
};

export default InputComponent;
