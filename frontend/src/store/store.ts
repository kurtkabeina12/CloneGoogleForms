import { combineReducers } from 'redux';
import formReducer from './reducers/reducersForm';
import navigationReducer from './reducers/reducerNavigation';
import { sendCardAsync } from './action/actionSendForm';
import { fetchGetForm } from './action/actionGetForm';
import { sendFormData } from './action/actionSendPassedForm';

const rootReducer = combineReducers({
  form: formReducer,
  navigation: navigationReducer,
  cards: sendCardAsync,
  getForm: fetchGetForm,
  sendFormData: sendFormData,
});

export default rootReducer;
