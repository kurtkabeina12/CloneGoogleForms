import { Button, FormGroup, FormControlLabel, Input, Radio } from '@mui/material';
import React from 'react'
import useList from '../hooks/UseList';

interface RadioComponent {

}

const RadioComponent: React.FC<RadioComponent> = () => {
  const { list, addItem, updateItem } = useList<string>('');

  return (
    <FormGroup sx={{ width: '-webkit-fill-available', marginTop: '1rem' }}>
      {list.map((item, index) => (
        <FormControlLabel
          key={index}
          disabled
          control={<Radio color='success' />}
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
        control={<Radio color='success' />}
        label={
          <Button color='success' variant="text" onClick={addItem}>
            Добавить вариант
          </Button>
        }
      />
    </FormGroup>
  )
}

export default RadioComponent;
