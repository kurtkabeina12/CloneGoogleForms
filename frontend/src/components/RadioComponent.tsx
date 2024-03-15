import React from 'react';
import { Button, FormGroup, FormControlLabel, Input, Radio, RadioGroup } from '@mui/material';
import useList from '../hooks/UseList';

interface RadioComponentProps {
 cardIndex?: number;
 updateCardAnswers?: (index: number, answers: string[]) => void; 
 disabled: boolean;
 answers?: string[];
}

const RadioComponent: React.FC<RadioComponentProps> = ({
 cardIndex,
 updateCardAnswers,
 disabled = false,
 answers = [],
}) => {
 const { list, addItem, updateItem } = useList<string[]>([['']]);

 const handleAddAnswer = () => {
    addItem(['']);
 };

 //Добавить ответ
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
        <RadioGroup>
          {answers.map((answer, index) => (
            <FormControlLabel key={index} value={answer} control={<Radio color='success' />} label={answer} />
          ))}
        </RadioGroup>
      )}
      {disabled && (
        <>
          {list.map((item, index) => (
            <FormControlLabel
              key={index}
              disabled={disabled}
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
            disabled={disabled}
            control={<Radio color='success' />}
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

export default RadioComponent;
