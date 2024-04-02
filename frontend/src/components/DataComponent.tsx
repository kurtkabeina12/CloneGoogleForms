import React from 'react';
import { FormGroup, TextField } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

interface DataComponentProps {
  disabled?: boolean;
  required?: boolean;
  quest?: string;
}

const DataComponent: React.FC<DataComponentProps> = ({ disabled = false, required = false, quest }) => {
  const {register, control, formState: { errors } } = useFormContext();

  const questName = quest || 'ИмяВопросаНеБылоЗадано';

  register(questName, { required });

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
       name={questName}
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
           error={!!errors[questName]}
           helperText={errors[questName]?.message?.toString() || ''}
         />
       )}
     />
      }
    </FormGroup>
  );
};

export default DataComponent;
