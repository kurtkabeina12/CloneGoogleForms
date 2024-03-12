import { TextField } from '@mui/material';
import React from 'react'

interface InputComponent {

}

const InputCopmponent: React.FC<InputComponent> = () => {
  return (
    <TextField
      variant="standard"
      placeholder="Напишите ответ"
      name="title"
      sx={{ mb: 3, marginTop:"1rem" }}
      fullWidth
    />
  )
}

export default InputCopmponent;
