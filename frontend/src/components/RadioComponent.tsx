import React, { useEffect, useState } from 'react';
import { Button, FormGroup, FormControlLabel, Input, Radio, RadioGroup, Typography, Box, IconButton } from '@mui/material';
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
  points?: number | string;
  updateCorrectAnswer?: (sectionIndex: number, index: number, correctAnswer: string | string[], cardType: string, subQuestionIndex?: number) => void;
  changeForm?: boolean;
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
  cardFormPageType,
  points,
  updateCorrectAnswer,
  changeForm = false,
}) => {
  const { list, addItem, updateItem, setList } = useList<string[]>([['']]);
  const { register, formState: { errors } } = useFormContext();
  const inputName = (idQuestion || 'defaultIdQuestionRadio') + ':' + cardFormPageType;
  const { ref } = register(inputName, { required });
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState<string[]>([]);
  const [localAnswers, setLocalAnswers] = useState(answers);

  const handleAddAnswer = () => {
    if (localAnswers.length > 0) {
      const newAnswers = [...localAnswers, ''];
      console.log(newAnswers)
      setLocalAnswers(newAnswers);
    } else {
      addItem(['']);
    }
  };

  const handleUpdateAnswer = (sectionIndex: number, index: number, value: string) => {
    if (localAnswers.length > 0) {
      const newAnswers = [...localAnswers];

      if (cardType === 'subQuestion' && subQuestionIndex !== undefined) {
        const newAnswers = [[...localAnswers]];
        console.log('Updating subQuestion answer:', sectionIndex, cardIndex || 0, subQuestionIndex, value);
        newAnswers[index][subQuestionIndex] = value;
        console.log('New answers:', newAnswers);
      } else {
        newAnswers[index] = value; // Обновляем ответ
        console.log('Updated answers:', newAnswers);
      }

      setLocalAnswers(newAnswers);

      if (updateCardAnswers) {
        updateCardAnswers(sectionIndex, cardIndex || 0, newAnswers.map(answer => answer[0]), cardType, subQuestionIndex);
      }
      setSelectedItemIndex(index);
    } else {
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
      setSelectedItemIndex(index);
    }
  };

  const handleRemoveAnswer = (sectionIndex: number, index: number, clearSelectionOnly: boolean = false) => {
    if (localAnswers.length > 0) {
      if (cardType === 'subQuestion' && subQuestionIndex !== undefined) {
        const newList = answers.filter((_, i) => i !== subQuestionIndex);
        setLocalAnswers(newList);
        if (updateCardAnswers) {
          updateCardAnswers(sectionIndex, cardIndex || 0, newList.map(answer => answer[0]), cardType, subQuestionIndex);
        }
      } else {
        const newList = answers.filter((_, i) => i !== index);
        console.log(index, newList[index])
        setLocalAnswers(newList);
        if (updateCardAnswers) {
          updateCardAnswers(sectionIndex, cardIndex || 0, newList.map(answer => answer[0]), cardType);
        }
      }
    } else {
      if (list.length > 1) {
        if (cardType === 'subQuestion' && subQuestionIndex !== undefined) {
          const newList = list.filter((_, i) => i !== subQuestionIndex);
          setList(newList);
          if (updateCardAnswers) {
            updateCardAnswers(sectionIndex, cardIndex || 0, newList.map(answer => answer[0]), cardType, subQuestionIndex);
          }
        } else {
          const newList = list.filter((_, i) => i !== index);
          setList(newList);
          if (updateCardAnswers) {
            updateCardAnswers(sectionIndex, cardIndex || 0, newList.map(answer => answer[0]), cardType);
          }
        }
      }
    }
  };

  const handleUpdateAnswerForTest = (sectionIndex: number, index: number, value: string) => {
    console.log('Before update:', selectedItemIndex, index, value);
    const newAnswers = [...list];
    if (cardType === 'subQuestion' && subQuestionIndex !== undefined) {
      newAnswers[index][subQuestionIndex] = value || userAnswers[index];
      updateItem(index, [newAnswers[index][subQuestionIndex]]);
      if (updateCardAnswers) {
        updateCardAnswers(sectionIndex, cardIndex || 0, newAnswers.map(answer => answer[0]), cardType, subQuestionIndex);
      }
    } else {
      newAnswers[index] = [value || userAnswers[index]];
      updateItem(index, [newAnswers[index][0]]);
      if (updateCardAnswers) {
        updateCardAnswers(sectionIndex, cardIndex || 0, newAnswers.map(answer => answer[0]), cardType);
      }
    }

    if (updateCorrectAnswer) {
      setCorrectAnswers([value]);
      updateCorrectAnswer(sectionIndex, cardIndex || 0, value, cardType);
    }

    setSelectedItemIndex(index);
    console.log('After update:', selectedItemIndex, index, value);
  };

  const handleRemoveAnswerForTest = (sectionIndex: number, index: number, clearSelectionOnly: boolean = false) => {
    if (list.length > 1) {
      if (cardType === 'subQuestion' && subQuestionIndex !== undefined) {
        const newList = list.filter((_, i) => i !== subQuestionIndex);
        setList(newList);
        if (updateCardAnswers) {
          updateCardAnswers(sectionIndex, cardIndex || 0, newList.map(answer => answer[0]), cardType, subQuestionIndex);
        }
      } else {
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
      {disabled && (points === 0 || points) && !changeForm && (
        <>
          <Typography variant='body1' color="black">Выберите правильный ответ:</Typography>
          {list.map((item, index) => (
            <>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <FormControlLabel key={index}
                  control={
                    <Radio
                      color='success'
                      checked={selectedItemIndex === index}
                      onChange={(e) => handleUpdateAnswerForTest(sectionIndex || 0, index, e.target.value)}
                    />
                  }
                  label={
                    <Input
                      placeholder='Ответ'
                      value={item[0] || ''}
                      onChange={(e) => handleUpdateAnswerForTest(sectionIndex || 0, index, e.target.value)}
                    />
                  }
                />
                {list.length > 1 && (
                  <CloseIcon style={{ color: "rgb(0 0 0 / 42%)" }} onClick={() => handleRemoveAnswerForTest(sectionIndex || 0, index)} />
                )}
              </div>
            </>
          ))}
          <Box sx={{ display: 'flex' }}>
            <FormControlLabel disabled={true} sx={{ marginLeft: "0.8rem" }} control={<Radio color='success' />} label={
              <Button color='success' variant="text" onClick={handleAddAnswer}> Добавить вариант </Button>} />
          </Box>
        </>
      )}
      {disabled && !points && points !== 0 && !changeForm && (
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
      {changeForm && disabled && !points && points !== 0 && !answers && (
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
      {changeForm && disabled && answers.length > 0 && (
        <>
          {localAnswers.map((answer, index) => (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <FormControlLabel key={index} disabled={disabled} control={<Radio color='success' />} label={
                <Input placeholder='Ответ' value={answer} onChange={(e) => handleUpdateAnswer(sectionIndex || 0, index, e.target.value)} />
              } />
              <IconButton onClick={() => handleRemoveAnswer(sectionIndex || 0, index)}>
                <CloseIcon style={{ color: "rgb(0 0 0 / 42%)" }} />
              </IconButton>
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
