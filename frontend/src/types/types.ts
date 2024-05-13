export interface Action {
  type: string;
}

export interface FormData {
  id: string;
  formTitle: string;
  formOverview: string;
  formEndText: string;
  formEndDate: string;
  isMandatoryAuth: boolean;
  selectedColor: string;
  sections: {
     id: string;
     title: string;
     cards: {
       idQuestion: string;
       selectedComponent: string;
       question: string;
       answer: string[];
       isRequired: boolean;
       addLogic: boolean;
       Logic: string | string[];
       addImg: boolean;
       imageUrl: string | string[];
       addChangeCardsLogic: boolean;
       changeCardsLogic: string | string[];
       subQuestions: SubQuestionFormData[];
     }[];
  }[];
 }

 export interface SubQuestionFormData {
  idSubQuestion: string;
  selectedComponent: string;
  question: string;
  answer: string[];
  isRequired: boolean;
  addLogic: boolean;
  Logic: string | string[];
  addImg: boolean;
  imageUrl: string | string[];
  addChangeCardsLogic: boolean;
  changeCardsLogic: string | string[];
  subQuestion: string | string[];
};


export interface ActionForm {
  type: string;
  payload?: any;
}

export interface Section {
  title: string;
  cards: Card[];
}

export interface SubQuestion {
  selectedComponent: string;
  question: string;
  isRequired: boolean;
  answer: string | string[];
  addLogic: boolean;
  Logic: string | string[];
  addImg: boolean,
  imageUrl: string[];
  addChangeCardsLogic: boolean;
  changeCardsLogic: string | string[];
  subQuestions: SubQuestion[];
};


export interface Card {
  selectedComponent: string;
  question: string;
  isRequired: boolean;
  answer: string | string[];
  addLogic: boolean;
  Logic: string | string[];
  addImg: boolean,
  imageUrl: string[];
  addChangeCardsLogic: boolean;
  changeCardsLogic: string | string[];
  subQuestions: SubQuestion[];
}

export interface FormState {
  selectedComponent: string;
}

export interface NavigationState {
  currentPage: string;
}

export interface CardsState {
  cards: any;
}

export interface RootState {
  form: FormState;
  navigation: NavigationState;
  cards: CardsState;
}