import React, { useState } from 'react';
import { Button, FormControlLabel, FormGroup, Input } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import useList from '../hooks/UseList';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import CloseIcon from '@mui/icons-material/Close';
import { Controller, useFormContext } from 'react-hook-form';

interface CheckboxesComponentProps {
  cardIndex?: number;
  updateCardAnswers?: (index: number, answers: string[]) => void;
  disabled: boolean;
  answers?: string[];
  required?: boolean;
  quest?: string;
}

const CheckboxesComponent: React.FC<CheckboxesComponentProps> = ({
  cardIndex,
  updateCardAnswers,
  disabled = false,
  answers = [],
  quest,
  required = false,
}) => {
  const { list, addItem, updateItem, setList } = useList<string[]>([['']]);


  const { register, control, setValue, getValues } = useFormContext();

  const questName = quest || 'ИмяВопросаНеБылоЗадано';

  const { ref, onChange, onBlur } = register(questName, { required });

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
  const handleUpdateAnswer = (index: number, value: string) => {
    const newAnswers = [...list];
    newAnswers[index] = [value];
    updateItem(index, newAnswers[index]);
    if (updateCardAnswers) {
      updateCardAnswers(cardIndex || 0, newAnswers.map(answer => answer[0]));
    }
  };

  const handleRemoveAnswer = (index: number) => {
    if (list.length > 1) {
      const newList = list.filter((_, i) => i !== index);
      setList(newList);
      if (updateCardAnswers) {
        updateCardAnswers(cardIndex || 0, newList.map(answer => answer[0]));
      }
    }
  };

  return (
    <FormGroup sx={{ width: '-webkit-fill-available', marginTop: '1rem' }}>
      {!disabled && answers.length > 0 && (
        <FormGroup>
          {answers.map((answer, index) => (
            <FormControlLabel
            key={index}
            control={
              <Controller
               name={`${questName}[${index}]`}
               control={control}
               defaultValue={false}
               render={({ field }) => (
                  <Checkbox
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setValue(`${questName}[${index}]`, e.target.checked);
                    }}
                    color='success'
                  />
               )}
              />
            }
            label={answer}
          />
            ))}
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
                                  onChange={(e) => handleUpdateAnswer(index, e.target.value)}
                                />
                              }
                            />
                            {list.length > 1 && (
                              <CloseIcon style={{ color: "rgb(0 0 0 / 42%)" }} onClick={() => handleRemoveAnswer(index)} />
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
        </>
      )}
    </FormGroup>
  );
};

export default CheckboxesComponent;

