import React, { useEffect, useState } from 'react';
import { Box, Button, FormControlLabel, FormGroup, Input, TextField, Typography } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import useList from '../hooks/UseList';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import CloseIcon from '@mui/icons-material/Close';
import { useFormContext } from 'react-hook-form';
import { CustomSelect } from './CustomOptions';

interface CheckboxesComponentProps {
  sectionIndex?: number,
  cardIndex?: number;
  updateCardAnswers?: (sectionIndex:number, index: number, answers: string[]) => void;
  disabled: boolean;
  answers?: string[];
  required?: boolean;
  quest?: string;
  idQuestion?: string;
  addLogic?: boolean;
  updateCardLogic?: (sectionIndex: number, index: number, logic: string) => void;
  GetLogic?: string | string[];
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
}) => {
  const { list, addItem, updateItem, setList } = useList<string[]>([['']]);

  const { register, formState: { errors }, setValue, getValues } = useFormContext();

  const inputName = idQuestion || 'defaultIdQuestion';

  const { ref, onBlur } = register(inputName, { required });

  const [selectValue, setSelectValue] = useState<string | string[] | null>('smooth');

  const [inputLogicValue, setInputLogicValue] = useState('');

  const [selectedCheckboxes, setSelectedCheckboxes] = useState(new Array(answers.length).fill(false));

  const [errorMessageNoLogic, setErrorMessageNoLogic] = useState('Выберите ответ');

  const [errorMessageAddLogic, setErrorMessageAddLogic] = useState('');

  const [isValidLogicInput, setIsValidLogicInput] = useState(true)

  //отслеживаем кол-во ответов и число в input 
  useEffect(() => {
    const numValue = parseInt(inputLogicValue, 10);
    if (numValue > list.length) {
      setIsValidLogicInput(false);
    } else {
      setIsValidLogicInput(true);
    }
  }, [list, inputLogicValue]);

  const handleAddAnswer = () => {
    addItem(['']);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(list);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setList(items);
  };

  //Добавить ответ
  const handleUpdateAnswer = (sectionIndex:number ,index: number, value: string) => {
    const newAnswers = [...list];
    newAnswers[index] = [value];
    updateItem(index, newAnswers[index]);
    if (updateCardAnswers) {
      updateCardAnswers(sectionIndex, cardIndex || 0, newAnswers.map(answer => answer[0]));
    }
  };

  //если меняется Select обновляем значение
  const handleSelectChange = (event: React.MouseEvent<Element, MouseEvent> | React.KeyboardEvent<Element> | React.FocusEvent<Element, Element> | null, value: string | string[] | null) => {
    if (value) {
      setSelectValue(value);
      const newLogic = `${value} ${inputLogicValue}`;
      if (updateCardLogic && cardIndex && sectionIndex !== undefined) {
        updateCardLogic(sectionIndex, cardIndex, newLogic);
      }
      setValue('addLogic', newLogic);
    }
  };

  //если меняется input Logic обновляем значение
  const handleInputLogicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputLogicValue(value);
    const newLogic = `${selectValue} ${value}`;
    if (updateCardLogic && cardIndex && sectionIndex !== undefined) {
      updateCardLogic(sectionIndex, cardIndex, newLogic);
    }
    setValue('addLogic', newLogic);
  };

  //удалить ответ
  const handleRemoveAnswer = (sectionIndex:number, index: number) => {
    if (list.length > 1) {
      const newList = list.filter((_, i) => i !== index);
      setList(newList);
      if (updateCardAnswers) {
        updateCardAnswers(sectionIndex, cardIndex || 0, newList.map(answer => answer[0]));
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

  return (
    <FormGroup sx={{ width: '-webkit-fill-available', marginTop: '1rem' }}>
      {!disabled && answers.length > 0 && (
        <FormGroup {...register(inputName, { required })}>
          <>
            {!addLogic && (
              <>
                {answers.map((answer, index) => (
                  <FormControlLabel key={index} value={answer} control={
                    <Checkbox
                      color='success'
                      defaultChecked={false}
                      inputRef={ref}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setValue(`${inputName}[${index}]`, answer);
                          // Проверяем, были ли выбраны какие-либо чекбоксы, и обновляем состояние ошибки
                          const selectedAnswers = getValues()[inputName] || [];
                          console.log(selectedAnswers.length)
                          if (selectedAnswers.length > 0) {
                            setErrorMessageNoLogic('');
                          }
                        } else {
                          const values = getValues();
                          const newValues = values[inputName].filter((_: any, i: any) => i !== index);
                          setValue(inputName, newValues);
                          setErrorMessageNoLogic('Выберите ответ');
                        }
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

      {disabled && (
        <>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="droppable">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {list.map((item, index) => (
                    <Draggable key={index} draggableId={index.toString()} index={index}>
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.draggableProps}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div {...provided.dragHandleProps} style={{ display: 'flex', alignItems: 'center', cursor: 'move' }}>
                              <DragIndicatorIcon style={{ color: "rgb(0 0 0 / 42%)" }} />
                            </div>
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
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
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
          {addLogic && (
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
        </>
      )}
    </FormGroup>
  );
};

export default CheckboxesComponent;

