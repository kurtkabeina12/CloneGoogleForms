export interface Action {
  type: string;
}

export interface ActionForm {
  type: string;
  payload?: any;
}

export interface Card {
  selectedComponent: string;
  question: string;
  isRequired: boolean;
  answer: string | string[];
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