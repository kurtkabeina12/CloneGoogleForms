import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CreateFormPage from './pages/CreateFormPage';
import store from './store/reducers/reducerRoot';
import { Provider } from 'react-redux';
import FormPage from './pages/FormPage';
import StubPage from './pages/StubPage';
import SurveyReportPage from './pages/SurveyReportPage';
import ChangeFormPage from './pages/ChangeFormPage';
import AutorizationPage from './pages/AutorizationPage';
import CreateTestPage from './pages/CreateTestPage';
import TestPage from './pages/TestPage';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className='App'>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create-form" element={<CreateFormPage />} />
            <Route path="/create-test" element={<CreateTestPage />} />
            <Route path="/form/:formId" element={<FormPage />} />
            <Route path="/stub/:formId" element={<StubPage />} />
            <Route path="/report/:formId" element={<SurveyReportPage />} />
            <Route path="/changeForm/:formId" element={<ChangeFormPage />} />
            <Route path="/autorization/:formId" element={<AutorizationPage />} />
            <Route path="/test/:testId" element={<TestPage />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
