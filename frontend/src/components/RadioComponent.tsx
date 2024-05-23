import React from 'react';
import { Button, FormGroup, FormControlLabel, Input, Radio, RadioGroup, Typography } from '@mui/material';
import useList from '../hooks/UseList';
import CloseIcon from '@mui/icons-material/Close';
import { useFormContext } from 'react-hook-form';

interface RadioComponentProps {
  sectionIndex?: number;
  cardIndex?: number;
  updateCardAnswers?: (sectionIndex: number, index: number, answers: string[], cardType: string, subQuestionIndex?: number) => void;
  disabled: boolean;
  answers?: string[];
  required?: boolean;
  quest?: string;
  idQuestion?: string;
  cardType?: string;
  subQuestionIndex?: number;
 cardFormPageType?: string;
}

const RadioComponent: React.FC<RadioComponentProps> = ({
  sectionIndex,
  cardIndex,
  updateCardAnswers,
  disabled = false,
  quest,
  idQuestion,
  required = false,
  answers = [],
  cardType = 'card',
  subQuestionIndex,
  cardFormPageType
}) => {
  const { list, addItem, updateItem, setList } = useList<string[]>([['']]);
  const { register, formState: { errors } } = useFormContext();
  const inputName = (idQuestion || 'defaultIdQuestion') + ':' + cardFormPageType;
  const { ref } = register(inputName, { required });

  const handleAddAnswer = () => {
    addItem(['']);
  };

  const handleUpdateAnswer = (sectionIndex: number, index: number, value: string) => {
    console.log('Updating answer:', sectionIndex, index, value);
    const newAnswers = [...list];
    if (cardType === 'subQuestion' && subQuestionIndex !== undefined) {
        console.log('Updating subQuestion answer:', sectionIndex, cardIndex || 0, subQuestionIndex, value);
        newAnswers[index][subQuestionIndex] = value;
        console.log('New answers:', newAnswers);
        updateItem(index, [newAnswers[index][subQuestionIndex]]);
        if (updateCardAnswers) {
            updateCardAnswers(sectionIndex, cardIndex || 0, newAnswers.map(answer => answer[0]), cardType, subQuestionIndex);
        }
    } else {
        newAnswers[index] = [value];
        updateItem(index, [newAnswers[index][0]]);
        if (updateCardAnswers) {
            updateCardAnswers(sectionIndex, cardIndex || 0, newAnswers.map(answer => answer[0]), cardType);
        }
    }
};
   

  const handleRemoveAnswer = (sectionIndex: number, index: number) => {
    if (list.length > 1) {
      if(cardType ==='subQuestion' && subQuestionIndex!== undefined) {
        const newList = list.filter((_, i) => i !== subQuestionIndex);
        setList(newList);
        if (updateCardAnswers) {
          updateCardAnswers(sectionIndex, cardIndex || 0, newList.map(answer => answer[0]), cardType, subQuestionIndex);
        }
      }else{
        const newList = list.filter((_, i) => i !== index);
        setList(newList);
        if (updateCardAnswers) {
          updateCardAnswers(sectionIndex, cardIndex || 0, newList.map(answer => answer[0]), cardType);
        }
      }
    }
  };

  return (
    <FormGroup sx={{ width: '-webkit-fill-available', marginTop: '1rem' }}>
      {!disabled && answers.length > 0 && (
        <RadioGroup {...register(inputName, { required })}>
          {answers.map((answer, index) => (
            <FormControlLabel key={index} value={answer} control={
              <Radio color='success' inputRef={ref} onChange={(e) => handleUpdateAnswer(sectionIndex || 0, index, e.target.value)} />
            } label={answer} />
          ))}
          {errors[inputName] && <Typography color="error">Выберите ответ</Typography>}
        </RadioGroup>
      )}
      {disabled && (
        <>
          {list.map((item, index) => (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <FormControlLabel key={index} disabled={disabled} control={<Radio color='success' />} label={
                <Input placeholder='Ответ' value={item[0] || ''} onChange={(e) => handleUpdateAnswer(sectionIndex || 0, index, e.target.value)} />
              } />
              {list.length > 1 && (
                <CloseIcon style={{ color: "rgb(0 0 0 / 42%)" }} onClick={() => handleRemoveAnswer(sectionIndex || 0, index)} />
              )}
            </div>
          ))}
          <FormControlLabel disabled={disabled} sx={{ marginLeft: "0.8rem" }} control={<Radio color='success' />} label={
            <Button color='success' variant="text" onClick={handleAddAnswer}> Добавить вариант </Button>
          } />
        </>
      )}
    </FormGroup>
  );
};

export default RadioComponent;
