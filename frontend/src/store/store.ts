import { combineReducers } from 'redux';
import formReducer from './reducers/reducersForm';
import navigationReducer from './reducers/reducerNavigation';
import { sendCardAsync } from './action/actionSendForm';

const rootReducer = combineReducers({
  form: formReducer,
  navigation: navigationReducer,
  cards: sendCardAsync,
});

export default rootReducer;
