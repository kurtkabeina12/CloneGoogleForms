import React from 'react';
import { Button, FormControlLabel, FormGroup, Input } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import useList from '../hooks/UseList';

interface CheckboxesComponentProps{
  cardIndex?: number;
  updateCardAnswers?: (index: number, answers: string[]) => void;
  disabled: boolean;
  answers?: string[];
}

const CheckboxesComponent: React.FC<CheckboxesComponentProps> = ({ 
  cardIndex,
  updateCardAnswers,
  disabled = false,
  answers = [],
 }) => {
  const { list, addItem, updateItem } = useList<string[]>([['']]);

  const handleAddAnswer = () => {
    addItem(['']);
  };
  
  //Добавляем ответы
  const handleUpdateAnswer = (index: number, value: string) => {
    const newAnswers = [...list];
    newAnswers[index] = [value];
    updateItem(index, newAnswers[index]);
    if (updateCardAnswers) {
      updateCardAnswers(cardIndex || 0, newAnswers.map(answer => answer[0]));
    }
  };

  return (
    <FormGroup sx={{ width: '-webkit-fill-available', marginTop: '1rem' }}>
    {!disabled && answers.length > 0 && (
      <FormGroup>
        {answers.map((answer, index) => (
          <FormControlLabel key={index} value={answer} control={<Checkbox color='success' />} label={answer} />
        ))}
      </FormGroup>
    )}
    {disabled && (
      <>
        {list.map((item, index) => (
          <FormControlLabel
            key={index}
            disabled={disabled}
            control={<Checkbox color='success' />}
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
          disabled={disabled}
          control={<Checkbox color='success' />}
          label={
            <Button color='success' variant="text" onClick={handleAddAnswer} >
              Добавить вариант
            </Button>
          }
        />
      </>
    )}
  </FormGroup>
  );
};

export default CheckboxesComponent;
