import { TextField, Typography } from '@mui/material';
import React from 'react';
import { useFormContext } from 'react-hook-form';

interface InputComponentProps {
 disabled?: boolean;
 required?: boolean;
 quest?: string;
 idQuestion?: string; 
 cardFormPageType?: string;
}

const InputComponent: React.FC<InputComponentProps> = ({ disabled = false, required = false, quest, idQuestion, cardFormPageType }) => {
 const { register, formState: { errors } } = useFormContext();

 const inputName = (idQuestion || 'defaultIdQuestion') + ':' + cardFormPageType;
console.log(inputName);
 const { ref, onChange, onBlur } = register(inputName, { required: required ? "Заполните поле" : false });

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
            name={inputName}
            sx={{ mb: 3, marginTop: "1rem" }}
            fullWidth
            required={required}
            inputRef={ref}
            onChange={onChange}
            onBlur={onBlur}
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
