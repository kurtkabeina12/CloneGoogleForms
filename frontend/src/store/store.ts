import { combineReducers } from 'redux';
import formReducer from './reducers/reducersForm';
import navigationReducer from './reducers/reducerNavigation';
import { sendCardAsync } from './action/actionSendForm';
import { fetchGetForm } from './action/actionGetForm';
import { sendFormData } from './action/actionSendPassedForm';
import { GetAllForms } from './action/actionGetAllForms';
import { fetchGetReportForm } from './action/actionGetReportForm';

const rootReducer = combineReducers({
  form: formReducer,
  navigation: navigationReducer,
  cards: sendCardAsync,
  getForm: fetchGetForm,
  sendFormData: sendFormData,
  getAllForms: GetAllForms,
  getReportForm: fetchGetReportForm,
});

export default rootReducer;
