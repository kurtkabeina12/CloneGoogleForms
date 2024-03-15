import React from 'react';
import { FormGroup, TextField } from '@mui/material';

interface DataComponentProps {
  disabled?:boolean
 }

const DataComponent: React.FC<DataComponentProps> = ({disabled = false}) => {
  return (
    <FormGroup sx={{ width: "-webkit-fill-available", marginTop: "1rem" }}>
      <TextField
        type="date"
        InputLabelProps={{
          shrink: true,
        }}
        color='success'
        disabled = {disabled}
      />
    </FormGroup>
  );
};

export default DataComponent;
