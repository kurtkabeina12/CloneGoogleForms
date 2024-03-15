import { TextField } from '@mui/material';
import React from 'react';

interface InputComponentProps {
 disabled?: boolean;
}

const InputCopmponent: React.FC<InputComponentProps> = ({ disabled = false }) => {
 return (
    <TextField
      variant="standard"
      placeholder="Напишите ответ"
      name="title"
      sx={{ mb: 3, marginTop:"1rem" }}
      fullWidth
      disabled={disabled}
    />
 );
};

export default InputCopmponent;
