import React, { useEffect } from 'react';
import { Button, FormControlLabel, FormGroup, Input } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import useList from '../hooks/UseList';

interface CheckboxesComponentProps{
  cardIndex: number;
  updateCardAnswers: (index: number, answers: string[]) => void;
}

const CheckboxesComponent: React.FC<CheckboxesComponentProps> = ({ cardIndex, updateCardAnswers }) => {
  const { list, addItem, updateItem } = useList<string[]>([['']]);

  const handleAddAnswer = () => {
    addItem(['']);
  };
  
  //Добавляем ответы
  const handleUpdateAnswer = (index: number, value: string) => {
    const newAnswers = [...list];
    newAnswers[index] = [value];
    updateItem(index, newAnswers[index]);
    updateCardAnswers(cardIndex, newAnswers.map(answer => answer[0]));
  };

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
              value={item[0] || ''}
              onChange={(e) => handleUpdateAnswer(index, e.target.value)}
            />
          }
        />
      ))}
      <FormControlLabel
        disabled
        control={<Checkbox />}
        label={
          <Button color='success' variant="text" onClick={handleAddAnswer}>
            Добавить вариант
          </Button>
        }
      />
    </FormGroup>
  );
};

export default CheckboxesComponent;
