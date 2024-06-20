import { combineReducers } from 'redux';
import formReducer from './reducers/reducersForm';
import navigationReducer from './reducers/reducerNavigation';
import { sendCardAsync } from './action/actionSendForm';
import { fetchGetForm } from './action/actionGetForm';
import { sendFormData } from './action/actionSendPassedForm';
import { GetAllForms } from './action/actionGetAllForms';
import { fetchGetReportForm } from './action/actionGetReportForm';
import { fetchGetStubInfo } from './action/actionGetInfoStub';
import { sendCardTest } from './action/actionSendTest';
import { fetchGetTest } from './action/actionGetTest';

const rootReducer = combineReducers({
  form: formReducer,
  navigation: navigationReducer,
  cards: sendCardAsync,
  getForm: fetchGetForm,
  sendFormData: sendFormData,
  getAllForms: GetAllForms,
  getReportForm: fetchGetReportForm,
  getStubInfo: fetchGetStubInfo,
  test: sendCardTest,
  getTest: fetchGetTest
});

export default rootReducer;
