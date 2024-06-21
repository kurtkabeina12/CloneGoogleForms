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

export interface TestData {
  id: string;
  testTitle: string;
  testOverview: string;
  testEndText: string;
  testEndDate: string;
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
      addImg: boolean;
      imageUrl: string | string[];
      addChangeCardsLogic: boolean;
      changeCardsLogic: string | string[];
      points: number | string;
      correctAnswer: string | string[];
      subQuestions: SubQuestionTestData[];
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


export interface SubQuestionTestData {
  idSubQuestion: string;
  selectedComponent: string;
  question: string;
  answer: string[];
  addImg: boolean;
  imageUrl: string | string[];
  addChangeCardsLogic: boolean;
  changeCardsLogic: string | string[];
  subQuestion: string | string[];
  points: number | string;
  correctAnswer: string | string[];
};

export interface ActionForm {
  type: string;
  payload?: any;
}

export interface SectionForTest {
  title: string;
  cards: CardForTest[];
}

export interface CardForTest {
  selectedComponent: string;
  question: string;
  isRequired: boolean;
  answer: string | string[];
  addImg: boolean,
  imageUrl: string[];
  addChangeCardsLogic: boolean;
  changeCardsLogic: string | string[];
  points: number | string;
  correctAnswer: string | string[];
  subQuestions: SubQuestionForTest[];
}

export interface SubQuestionForTest {
  selectedComponent: string;
  question: string;
  answer: string | string[];
  addImg: boolean,
  imageUrl: string[];
  addChangeCardsLogic: boolean;
  changeCardsLogic: string | string[];
  points: number | string;
  correctAnswer: string | string[];
  subQuestions: SubQuestionForTest[];
};

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