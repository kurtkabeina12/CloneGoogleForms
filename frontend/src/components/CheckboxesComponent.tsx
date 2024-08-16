import React, { useEffect, useState } from 'react';
import { Box, Button, FormControlLabel, FormGroup, IconButton, Input, TextField, Tooltip, Typography } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import useList from '../hooks/UseList';
import CloseIcon from '@mui/icons-material/Close';
import { useFormContext } from 'react-hook-form';
import { CustomSelect } from './CustomOptions';
import AddIcon from '@mui/icons-material/Add';

interface CheckboxState {
  [key: number]: boolean;
}

interface CheckboxesComponentProps {
  sectionIndex?: number,
  cardIndex?: number;
  updateCardAnswers?: (sectionIndex: number, index: number, answers: string[], cardType: string, subQuestionIndex?: number) => void;
  disabled: boolean;
  answers?: string[];
  required?: boolean;
  quest?: string;
  idQuestion?: string;
  addLogic?: boolean;
  updateCardLogic?: (sectionIndex: number, index: number, logic: string, cardType: string, subQuestionIndex?: number) => void;
  GetLogic?: string | string[];
  cardType?: string;
  addChangeCardsLogic?: boolean;
  subQuestionIndex?: number;
  onChangeCardsLogic?: (logic: string | string[]) => void;
  nowCheckboxChoose?: (value: string, changeCardsLogic: string | string[]) => void;
  changeCardsLogic?: string | string[];
  cardFormPageType?: string;
  points?: number | string;
  updateCorrectAnswer?: (sectionIndex: number, index: number, correctAnswer: string | string[], cardType: string, subQuestionIndex?: number) => void;
  isTest?: boolean;
  resetStateOnOpen?: boolean;
}

const CheckboxesComponent: React.FC<CheckboxesComponentProps> = ({
  sectionIndex,
  cardIndex,
  updateCardAnswers,
  disabled = false,
  answers = [],
  quest,
  idQuestion,
  required = false,
  addLogic = false,
  updateCardLogic,
  GetLogic,
  cardType = 'card',
  addChangeCardsLogic = false,
  subQuestionIndex,
  onChangeCardsLogic,
  nowCheckboxChoose,
  changeCardsLogic = [],
  cardFormPageType,
  points,
  updateCorrectAnswer,
  isTest = false,
  resetStateOnOpen = false
}) => {
  const { list, addItem, updateItem, setList } = useList<string[]>([['']]);

  const { register, formState: { errors }, setValue, getValues } = useFormContext();

  const inputName = (idQuestion || 'defaultIdQuestionCheckbox') + ':' + cardFormPageType;

  const { ref, onBlur } = register(inputName, { required });

  const [selectValue, setSelectValue] = useState<string | string[] | null>('smooth');

  const [inputLogicValue, setInputLogicValue] = useState('');

  const [selectedCheckboxes, setSelectedCheckboxes] = useState(new Array(answers.length).fill(false));

  const [errorMessageNoLogic, setErrorMessageNoLogic] = useState('Выберите ответ');

  const [errorMessageAddLogic, setErrorMessageAddLogic] = useState('');

  const [isValidLogicInput, setIsValidLogicInput] = useState(true)

  const [logicChangeBlocks, setLogicChangeBlocks] = useState<{ answer: string; cardIndex: string }[]>([]);

  const [nowSelectCheckbox, setNowSelectCheckbox] = useState<CheckboxState>({});

  const [checkboxIndex, setCheckboxIndex] = useState<string>('');

  const [selectedTestCheckboxes, setSelectedTestCheckboxes] = useState<CheckboxState>({});

  const [correctAnswer, setCorrectAnswer] = useState([]);


  useEffect(() => {
    if (resetStateOnOpen) {
      // Сбрасываем состояние выбранных чекбоксов при изменении subQuestionIndexForCheckbox
      resetSelectedCheckboxes();

      console.log(selectedCheckboxes, 'выбор чекбоксов после смены подкарточки')
    }
  }, [resetStateOnOpen]);

  useEffect(() => {
    if (nowCheckboxChoose) {
      let selectedIndices = '';
      Object.entries(nowSelectCheckbox).forEach(([key, value]) => {
        if (value) {
          selectedIndices += key + ', ';
        }
      });
      // Удалить последнюю запятая и пробел из строки
      if (selectedIndices.endsWith(',')) {
        selectedIndices = selectedIndices.slice(0, -2);
      }

      setCheckboxIndex(selectedIndices);
      nowCheckboxChoose(String(checkboxIndex), changeCardsLogic);
    }
  }, [changeCardsLogic, checkboxIndex, nowCheckboxChoose, nowSelectCheckbox]);

  useEffect(() => {
    console.log(selectedTestCheckboxes, 'selected UseEffect');
  }, [selectedTestCheckboxes]);

  //отслеживаем кол-во ответов и число в input 
  useEffect(() => {
    const numValue = parseInt(inputLogicValue, 10);
    if (numValue > list.length) {
      setIsValidLogicInput(false);
    } else {
      setIsValidLogicInput(true);
    }
  }, [list, inputLogicValue]);

  useEffect(() => {
    if (addChangeCardsLogic) {
      if (onChangeCardsLogic) {
        const logic = logicChangeBlocks.map(block => `${block.answer}:${block.cardIndex}`).join(',');
        onChangeCardsLogic(logic);
      }
    } else {
      if (onChangeCardsLogic) {
        setLogicChangeBlocks([]);
        onChangeCardsLogic([]);
      }
    }
  }, [logicChangeBlocks, onChangeCardsLogic, addChangeCardsLogic]);

  const handleAddAnswer = () => {
    addItem(['']);
  };

  const resetSelectedCheckboxes = () => {
    setSelectedCheckboxes(new Array(answers.length).fill(false));
  };

  const handleCheckboxChangeValue = (index: number, checked: boolean) => {
    setSelectedCheckboxes(prevState => ({
      ...prevState,
      [index]: checked,
    }));

    if (nowCheckboxChoose) {
      const selectedIndices = Object.entries(selectedCheckboxes)
        .filter(([_, value]) => value)
        .map(([key]) => key)
        .join(', ');

      nowCheckboxChoose(selectedIndices, changeCardsLogic);
    }
  };

  //Добавить ответ
  const handleUpdateAnswer = (sectionIndex: number, index: number, value: string) => {
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

  //если меняется Select обновляем значение
  const handleSelectChange = (event: React.MouseEvent<Element, MouseEvent> | React.KeyboardEvent<Element> | React.FocusEvent<Element, Element> | null, value: string | string[] | null) => {
    if (value) {
      setSelectValue(value);
      const newLogic = `${value} ${inputLogicValue}`;
      if (cardType === 'subQuestion' && subQuestionIndex !== undefined) {
        if (updateCardLogic && cardIndex && sectionIndex !== undefined) {
          console.log(sectionIndex, cardIndex, subQuestionIndex, "subQuestion")
          updateCardLogic(sectionIndex, cardIndex, newLogic, cardType, subQuestionIndex);
        }
      } else {
        if (updateCardLogic && cardIndex && sectionIndex !== undefined) {
          updateCardLogic(sectionIndex, cardIndex, newLogic, cardType);
        }
      }
      setValue('addLogic', newLogic);
    }
  };

  //если меняется input Logic обновляем значение
  const handleInputLogicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputLogicValue(value);
    const newLogic = `${selectValue} ${value}`;
    if (cardType === 'subQuestion' && subQuestionIndex !== undefined) {
      if (updateCardLogic && cardIndex && sectionIndex !== undefined) {
        console.log(sectionIndex, cardIndex, subQuestionIndex, "subQuestion")

        updateCardLogic(sectionIndex, cardIndex, newLogic, cardType, subQuestionIndex);
      }
    } else {
      if (updateCardLogic && cardIndex && sectionIndex !== undefined) {
        updateCardLogic(sectionIndex, cardIndex, newLogic, cardType);
      }
    }
    setValue('addLogic', newLogic);
  };

  //удалить ответ
  const handleRemoveAnswer = (sectionIndex: number, index: number) => {
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

  // Функция обработки изменения состояния чекбокса
  const handleCheckboxChange = (index: number) => {
    // Создаем новый массив выбранных чекбоксов, инвертируя состояние выбранного
    const newSelectedCheckboxes = [...selectedCheckboxes];
    newSelectedCheckboxes[index] = !newSelectedCheckboxes[index];
    setSelectedCheckboxes(newSelectedCheckboxes);

    // Определяем логику и максимальное количество выбранных элементов
    let maxSelections = 0;
    let errorMessage = '';

    if (GetLogic?.[0]?.startsWith('no more')) {
      maxSelections = parseInt(GetLogic?.[0]?.split(' ')[2] ?? '0');
      const selectedCount = newSelectedCheckboxes.filter(Boolean).length;
      if (selectedCount > maxSelections) {
        errorMessage = `Вы можете выбрать не более ${maxSelections} вариантов`;
      }
    } else if (GetLogic?.[0]?.startsWith('no less')) {
      maxSelections = parseInt(GetLogic?.[0]?.split(' ')[2] ?? '0');
      const selectedCount = newSelectedCheckboxes.filter(Boolean).length;
      if (selectedCount < maxSelections) {
        errorMessage = `Вы можете выбрать не менее ${maxSelections} вариантов`;
      }
    } else if (GetLogic?.[0]?.startsWith('smooth')) {
      maxSelections = parseInt(GetLogic?.[0]?.split(' ')[1] ?? '0');
      const selectedCount = newSelectedCheckboxes.filter(Boolean).length;
      if (selectedCount !== maxSelections) {
        errorMessage = `Вы можете выбрать ровно ${maxSelections} вариантов`;
      }
    }

    // Обновляем сообщение об ошибке
    setErrorMessageAddLogic(errorMessage);

    // Обновляем значения в форме
    const newValues = newSelectedCheckboxes.map((isChecked, i) => isChecked ? answers[i] : null).filter(Boolean);
    setValue(inputName, newValues);
  };

  const handleAddNewLogicChange = () => {
    setLogicChangeBlocks([...logicChangeBlocks, { answer: '', cardIndex: '' }]);
  };

  const handleRemoveNewLogicChange = (index: number) => {
    if (logicChangeBlocks.length > 1) {
      setLogicChangeBlocks(logicChangeBlocks.filter((_, i) => i !== index));
    }
  };



  const handleToggleSelection = (sectionIndex: number, index: number) => {
    setSelectedTestCheckboxes(prevState => {
      const newState = { ...prevState, [index]: !prevState[index] };
      // Construct selectedAnswers here, ensuring it uses the updated state
      const selectedAnswers: string | string[] = [];
      list.forEach((answer, i) => {
        if (newState[i]) {
          selectedAnswers.push(answer[0]);
        }
      });
      // Log and perform actions with selectedAnswers here
      console.log(selectedAnswers, 'selectedAnswers');
      if (selectedAnswers.length > 0 && updateCorrectAnswer) {
        updateCorrectAnswer(sectionIndex, cardIndex || 0, selectedAnswers, cardType);
      }
      return newState;
    });
  };


  const handleAddCorrectAnswer = (sectionIndex: number, index: number, value: string) => {
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

  const handleCheckboxChangeForTest = (index: number) => {
    setSelectedCheckboxes(prevState => {
      const newState = [...prevState];
      newState[index] = !newState[index];

      const newValues = newState.map((isChecked, i) => isChecked ? answers[i] : null).filter(Boolean);
      setValue(inputName, newValues);

      setNowSelectCheckbox(prevState => ({
        ...prevState,
        [index]: !newState[index]
      }));

      console.log(newState, nowSelectCheckbox);

      return newState;
    });
  };

  return (
    <FormGroup sx={{ width: '-webkit-fill-available', marginTop: '1rem' }}>
      {!disabled && answers.length > 0 && (
        <FormGroup {...register(inputName, { required })}>
          <>
            {!addLogic && !required && !isTest && (
              <>
                {answers.map((answer, index) => (
                  <FormControlLabel key={index} value={answer} control={
                    <Checkbox
                      color='success'
                      defaultChecked={false}
                      inputRef={ref}
                      // onChange={(e) => {
                      //   console.log([index], e.target.checked, 'checked');
                      //   setValue(`${inputName}[${index}]`, answer);

                      //   setNowSelectCheckbox(prevState => ({
                      //     ...prevState,
                      //     [index]: e.target.checked
                      //   }));

                      //   if (e.target.checked) {
                      //     setValue(`${inputName}[${index}]`, answer);
                      //     console.log(e.target.checked, 'checked');

                      //     // Проверяем, были ли выбраны какие-либо чекбоксы, и обновляем состояние ошибки
                      //     const selectedAnswers = getValues()[inputName] || [];
                      //     // console.log(selectedAnswers.length)
                      //     if (selectedAnswers.length > 0) {
                      //       setErrorMessageNoLogic('  ');
                      //     }
                      //   }
                      //   console.log(nowSelectCheckbox, 'nowSelectCheck in OChange')
                      // }}
                      onChange={(e) => handleCheckboxChangeValue(index, e.target.checked)}
                      onBlur={onBlur}
                    />
                  }
                    label={answer}
                  />
                ))}
              </>
            )}
            {!addLogic && !required && isTest && (
              <>
                {answers.map((answer, index) => (
                  <FormControlLabel key={index} value={answer} control={
                    <Checkbox
                      color='success'
                      defaultChecked={false}
                      inputRef={ref}
                      checked={selectedCheckboxes[index]}
                      onChange={() => handleCheckboxChangeForTest(index)}
                      onBlur={onBlur}
                    />
                  }
                    label={answer}
                  />
                ))}
              </>
            )}
            {!addLogic && required && (
              <>
                {answers.map((answer, index) => (
                  <FormControlLabel key={index} value={answer} control={
                    <Checkbox
                      color='success'
                      defaultChecked={false}
                      inputRef={ref}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        console.log([index], isChecked, 'checked');
                        setValue(`${inputName}[${index}]`, answer);

                        setNowSelectCheckbox(prevState => ({
                          ...prevState,
                          [index]: isChecked
                        }));

                        if (isChecked) {
                          setValue(`${inputName}[${index}]`, answer);
                          console.log(e.target.checked, 'checked');

                          // Проверяем, были ли выбраны какие-либо чекбоксы, и обновляем состояние ошибки
                          const selectedAnswers = getValues()[inputName] || [];
                          // console.log(selectedAnswers.length)
                          if (selectedAnswers.length > 0) {
                            setErrorMessageNoLogic('  ');
                          }
                        } else {
                          const values = getValues();
                          const newValues = values[inputName].filter((_: any, i: any) => i !== index);
                          setValue(inputName, newValues);
                          setErrorMessageNoLogic('Выберите ответ');
                        }

                        console.log(nowSelectCheckbox, 'nowSelectCheck in OChange')
                      }}

                      onBlur={onBlur}
                    />
                  }
                    label={answer}
                  />
                ))}
                {errors[inputName] && <Typography color="error">{errorMessageNoLogic}</Typography>}
              </>
            )}
            {addLogic && (
              <>
                <FormGroup>
                  {answers.map((answer, index) => (
                    <FormControlLabel
                      key={index}
                      value={answer}
                      control={
                        <Checkbox
                          color='success'
                          defaultChecked={false}
                          inputRef={ref}
                          {...register(inputName, {
                            required: required || addLogic || (addLogic && required),
                            validate: () => {
                              if (GetLogic?.[0]?.startsWith('no more')) {
                                const maxSelections = parseInt(GetLogic?.[0]?.split(' ')[2] ?? '0');
                                console.log(maxSelections, 'no more')
                                if (selectedCheckboxes.filter(Boolean).length > maxSelections) {
                                  console.log('условие действует no more')
                                  return `Вы можете выбрать не более ${maxSelections} вариантов`;
                                } else if (selectedCheckboxes.filter(Boolean).length === 0) {
                                  return `Вы можете выбрать не более ${maxSelections} вариантов`;
                                }
                              } else if (GetLogic?.[0]?.startsWith('no less')) {
                                const maxSelections = parseInt(GetLogic?.[0]?.split(' ')[2] ?? '0');
                                if (selectedCheckboxes.filter(Boolean).length < maxSelections) {
                                  console.log('условие действует no less')
                                  return `Вы можете выбрать не менее ${maxSelections} вариантов`;
                                }
                              } else if (GetLogic?.[0]?.startsWith('smooth')) {
                                const maxSelections = parseInt(GetLogic?.[0]?.split(' ')[1] ?? '0');
                                if (selectedCheckboxes.filter(Boolean).length !== maxSelections) {
                                  console.log('условие действует smooth')
                                  return `Вы можете выбрать ровно ${maxSelections} вариантов`;
                                }
                              }
                              return true;
                            }
                          })}
                          checked={selectedCheckboxes[index]}
                          onChange={() => handleCheckboxChange(index)}
                        />
                      }
                      label={answer}
                    />
                  ))}
                  {errors[inputName] && <Typography color="error">{errors[inputName]?.message as String}</Typography>}
                </FormGroup>
              </>
            )}
          </>
        </FormGroup>
      )}
      {disabled && (points === 0 || points) && (
        <>
          <Typography variant='body1' color="black">Выберите правильные ответы:</Typography>
          {list.map((item, index) => (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    color='success'
                    checked={selectedTestCheckboxes[index] || false} // Track selection status
                    onChange={() => handleToggleSelection(sectionIndex || 0, index)} // Handle checkbox click
                  />
                }
                label={
                  <Input
                    placeholder='Ответ'
                    value={item[0] || ''}
                    onChange={(e) => handleAddCorrectAnswer(sectionIndex || 0, index, e.target.value)}
                  />
                }
              />
              {list.length > 1 && (
                <CloseIcon style={{ color: "rgb(0 0 0 / 42%)" }} onClick={() => handleRemoveAnswer(sectionIndex || 0, index)} />
              )}
            </div>
          ))}
          <FormControlLabel
            disabled={true}
            sx={{ marginLeft: "0.8rem" }}
            control={<Checkbox color='success' />}
            label={
              <Button color='success' variant="text" onClick={handleAddAnswer}>
                Добавить вариант
              </Button>
            }
          />
          {/* <Box sx={{display:"contents"}}>
            <Input
              placeholder='Впишите номера правильных ответов'
            />
          </Box> */}
          {addChangeCardsLogic && (
            <>
              {logicChangeBlocks.map((block, index) => (
                <Box key={index} sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', mt: 2 }}>
                  <Typography variant='body1' color='black' sx={{ mr: 2 }}>При выборе ответа:</Typography>
                  <TextField
                    variant="standard"
                    value={block.answer}
                    onChange={(e) => {
                      const newLogicChangeBlocks = [...logicChangeBlocks];
                      newLogicChangeBlocks[index].answer = e.target.value;
                      setLogicChangeBlocks(newLogicChangeBlocks);
                    }}
                  />
                  <Typography variant='body1' color='black' sx={{ mr: 2 }}>открыть карточку:</Typography>
                  <TextField
                    variant="standard"
                    value={block.cardIndex}
                    onChange={(e) => {
                      const newLogicChangeBlocks = [...logicChangeBlocks];
                      newLogicChangeBlocks[index].cardIndex = e.target.value;
                      setLogicChangeBlocks(newLogicChangeBlocks);
                    }}
                  />
                  {logicChangeBlocks.length > 1 && (
                    <IconButton aria-label="removeNewLogicChange" size='small' onClick={() => handleRemoveNewLogicChange(index)}>
                      <CloseIcon />
                    </IconButton>
                  )}
                </Box>
              ))}
              <Box sx={{ marginTop: "1rem", display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <Tooltip title="Добавить условие">
                  <IconButton aria-label="addNewLogicChange" size='small' onClick={handleAddNewLogicChange}>
                    <AddIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </>
          )}
        </>
      )}
      {disabled && !points && points !== 0 && (
        <>
          {list.map((item, index) => (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <FormControlLabel
                key={index}
                disabled={disabled}
                control={<Checkbox color='success' />}
                label={
                  <Input
                    placeholder='Ответ'
                    value={item[0] || ''}
                    onChange={(e) => handleUpdateAnswer(sectionIndex || 0, index, e.target.value)}
                  />
                }
              />
              {list.length > 1 && (
                <CloseIcon style={{ color: "rgb(0 0 0 / 42%)" }} onClick={() => handleRemoveAnswer(sectionIndex || 0, index)} />
              )}
            </div>
          ))}
          <FormControlLabel
            disabled={disabled}
            sx={{ marginLeft: "0.8rem" }}
            control={<Checkbox color='success' />}
            label={
              <Button color='success' variant="text" onClick={handleAddAnswer}>
                Добавить вариант
              </Button>
            }
          />
          {addLogic && !addChangeCardsLogic && (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 3 }}>
              <CustomSelect value={selectValue} onChange={handleSelectChange} />
              <TextField
                variant="standard"
                placeholder="Введите число"
                name="addLogic"
                type='number'
                fullWidth
                sx={{ ml: 1 }}
                onChange={handleInputLogicChange}
              />
            </Box>
          )}
          {!isValidLogicInput && <Typography color="error">Число больше чем колличество ответов.</Typography>}
          {addChangeCardsLogic && (
            <>
              {logicChangeBlocks.map((block, index) => (
                <Box key={index} sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', mt: 2 }}>
                  <Typography variant='body1' color='black' sx={{ mr: 2 }}>При выборе ответа:</Typography>
                  <TextField
                    variant="standard"
                    value={block.answer}
                    onChange={(e) => {
                      const newLogicChangeBlocks = [...logicChangeBlocks];
                      newLogicChangeBlocks[index].answer = e.target.value;
                      setLogicChangeBlocks(newLogicChangeBlocks);
                    }}
                  />
                  <Typography variant='body1' color='black' sx={{ mr: 2 }}>открыть карточку:</Typography>
                  <TextField
                    variant="standard"
                    value={block.cardIndex}
                    onChange={(e) => {
                      const newLogicChangeBlocks = [...logicChangeBlocks];
                      newLogicChangeBlocks[index].cardIndex = e.target.value;
                      setLogicChangeBlocks(newLogicChangeBlocks);
                    }}
                  />
                  {logicChangeBlocks.length > 1 && (
                    <IconButton aria-label="removeNewLogicChange" size='small' onClick={() => handleRemoveNewLogicChange(index)}>
                      <CloseIcon />
                    </IconButton>
                  )}
                </Box>
              ))}
              <Box sx={{ marginTop: "1rem", display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <Tooltip title="Добавить условие">
                  <IconButton aria-label="addNewLogicChange" size='small' onClick={handleAddNewLogicChange}>
                    <AddIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </>
          )}
        </>
      )}
    </FormGroup>
  );
};

export default CheckboxesComponent;

