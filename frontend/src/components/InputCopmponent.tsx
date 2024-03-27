import { TextField } from '@mui/material';
import React from 'react';
import { useFormContext } from 'react-hook-form';

interface InputComponentProps {
  disabled?: boolean;
  required?: boolean;
  quest?: string;
}

const InputCopmponent: React.FC<InputComponentProps> = ({ disabled = false, required = false, quest }) => {
  const { register } = useFormContext();

  const questName = quest || 'ИмяВопросаНеБылоЗадано';

  const { ref, onChange, onBlur } = register(questName, { required });

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
      }
    </>
  );
};

export default InputCopmponent;
