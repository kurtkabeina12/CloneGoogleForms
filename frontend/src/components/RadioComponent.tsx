import React from 'react';
import { Button, FormGroup, FormControlLabel, Input, Radio, RadioGroup } from '@mui/material';
import useList from '../hooks/UseList';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import CloseIcon from '@mui/icons-material/Close';

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
  const { list, addItem, updateItem, setList } = useList<string[]>([['']]);

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

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(list);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setList(items);
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
        <RadioGroup>
          {answers.map((answer, index) => (
            <FormControlLabel key={index} value={answer} control={<Radio color='success' />} label={answer} />
          ))}
        </RadioGroup>
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
                              control={<Radio color='success' />}
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
            control={<Radio color='success' />}
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

export default RadioComponent;
