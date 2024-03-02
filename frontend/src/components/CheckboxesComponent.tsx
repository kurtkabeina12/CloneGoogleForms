import React, { useEffect } from 'react';
import { Button, FormControlLabel, FormGroup, Input } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import useList from '../hooks/UseList';

const CheckboxesComponent: React.FC = () => {
  const { list, addItem, updateItem } = useList<string>('');

  return (
    <FormGroup sx={{ width: '-webkit-fill-available', marginTop: '1rem' }}>
      {list.map((item, index) => (
        <FormControlLabel
          key={index}
          disabled
          control={<Checkbox />}
          label={
            <Input
              placeholder='Ответ'
              value={item || ''}
              onChange={(e) => updateItem(index, e.target.value)}
            />
          }
        />
      ))}
      <FormControlLabel
        disabled
        control={<Checkbox />}
        label={
          <Button color='success' variant="text" onClick={addItem}>
            Добавить вариант
          </Button>
        }
      />
    </FormGroup>
  );
};

export default CheckboxesComponent;
