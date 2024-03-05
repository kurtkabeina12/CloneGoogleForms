import React from 'react';
import { Button, FormGroup, FormControlLabel, Input, Radio } from '@mui/material';
import useList from '../hooks/UseList';

interface RadioComponentProps {
  cardIndex: number;
  updateCardAnswers: (index: number, answers: string[]) => void;
}

const RadioComponent: React.FC<RadioComponentProps> = ({ cardIndex, updateCardAnswers }) => {
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
          control={<Radio color='success' />}
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
        control={<Radio color='success' />}
        label={
          <Button color='success' variant="text" onClick={handleAddAnswer}>
            Добавить вариант
          </Button>
        }
      />
    </FormGroup>
  );
};

export default RadioComponent;
