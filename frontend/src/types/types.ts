export interface Action {
  type: string;
}

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
	imageUrl:  string[];
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