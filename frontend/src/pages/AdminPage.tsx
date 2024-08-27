import React, { useEffect, useState } from 'react';
import '../styles/main.css';
import { Box, CardActionArea, CardContent, CardMedia, Grid, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { GetAllForms } from '../store/action/actionGetAllForms';
import { AppDispatch } from '../store/reducers/reducerRoot';
import { unwrapResult } from '@reduxjs/toolkit';

interface Forms {
  id: string,
  formTitle: string,
  formEndDate: string,
}

const AdminPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [forms, setForms] = useState<Forms[]>([]);

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const actionResult = await dispatch(GetAllForms());
        const formData = unwrapResult(actionResult);
        setForms(formData);
        console.log(formData, 'данные с сервера');
      } catch (error) {
        console.error('Failed to fetch form:', error);
      }
    };

    fetchFormData();
  }, [dispatch]);

  const navigate = useNavigate();

  const BackgroundImage = require('../img/background.png');

  function formatDate(dateString: string): string {
    const date = new Date(dateString);

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }


  return (
    <div className="home-page">
      <Box sx={{ mt: 2, ml: 2 }}>
        <Typography variant='h4'>
          Ваши формы
        </Typography>
        <Grid container spacing={2}>
          {(forms === null || forms === undefined || forms.length === 0) ? (
            <Typography variant="h6">Нет доступных форм</Typography>
          ) : (
            forms.map((form, index) => (
              <Grid item xs={12} sm={6} md={4} key={index} onClick={() => navigate(`/report/${form.id}`)}>
                <Card sx={{ maxWidth: 345 }}>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      height="140"
                      image={BackgroundImage}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {form.formTitle}
                      </Typography>
                      {form.formEndDate && (
                        <Typography variant="body2" color="text.secondary">
                          Дата окончания опроса:
                          {formatDate(form.formEndDate)}
                        </Typography>
                      )}
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Box>
    </div>
  );
};

export default AdminPage;
