import { useState } from 'react';

// Определение типа для элементов списка
type ListType<T> = {
  list: T[];
  addItem: (item: T) => void;
  updateItem: (index: number, value: T) => void;
  setList: (items: T[]) => void; 
};

// Создание кастомного хука
const useList = <T extends string | number | boolean | string[] | number[] | boolean[]>(initialValue: T[]): ListType<T> => {
  // Состояние для списка
  const [list, setList] = useState<T[]>(initialValue); // Добавляем начальное значение в список

  // Функция для добавления нового элемента в список
  const addItem = (item: T) => {
    setList([...list, item]);
  };

  // Функция для обновления значения элемента по индексу
  const updateItem = (index: number, value: T) => {
    const newList = [...list];
    newList[index] = value;
    setList(newList);
  };

  // Возвращаем объект со списком и функциями для работы с ним
  return { list, addItem, updateItem, setList };
};

export default useList;
