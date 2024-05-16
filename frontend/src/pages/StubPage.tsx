import React, { useEffect, useState } from 'react';
import '../styles/main.css';
import { Box, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/reducers/reducerRoot';
import { unwrapResult } from '@reduxjs/toolkit';
import { fetchGetStubInfo } from '../store/action/actionGetInfoStub';

interface FormDataStub{
  formEndText:string;
  selectedColor:string;
}

const StubPage: React.FC = () => {
  const LogoImage = require('../img/LogoVita.png');
  const { formId } = useParams();
	const [formData, setFormData] = useState<FormDataStub | null>(null);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const actionResult = await dispatch(fetchGetStubInfo({ formId: formId ?? '' }));
        const formData = unwrapResult(actionResult);
        setFormData(formData);
        document.body.style.backgroundColor = formData.selectedColor;
        console.log(formData, 'данные с сервера');
      } catch (error) {
        console.error('Failed to fetch form:', error);
      }
    };

    fetchFormData();
  }, [dispatch, formId]);

  console.log(formId);
  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box
          component="img"
          src={LogoImage}
          alt='Logo'
          sx={{
            marginTop: "5rem",
            height: { xs: "50%", sm: "40%", md: "30%", lg: "20%", xl: "15%" },
            width: { xs: "50%", sm: "40%", md: "30%", lg: "20%", xl: "15%" },
          }}
        />
        <Typography variant="h4" component="h2" sx={{ mt: "5rem" }}>
          {formData?.formEndText}
        </Typography>
      </Box>
    </>
  );
};

export default StubPage;
