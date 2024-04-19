import React from 'react';
import { FormGroup, TextField } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

interface DataComponentProps {
  disabled?: boolean;
  required?: boolean;
  quest?: string;
  idQuestion?: string;
}

const DataComponent: React.FC<DataComponentProps> = ({ disabled = false, required = false, quest, idQuestion }) => {
  const {register, control, formState: { errors } } = useFormContext();

  const inputName = idQuestion || 'defaultIdQuestion';

  register(inputName, { required });

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
       rules={{ required: required ? "Заполните поле" : false }}
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
