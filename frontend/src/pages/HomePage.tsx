import React, { useEffect, useState } from 'react';
import '../styles/main.css';
import DescriptionIcon from '@mui/icons-material/Description';
import { Box, CardActionArea, CardContent, CardMedia, Divider, Grid, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { GetAllForms } from '../store/action/actionGetAllForms';
import { AppDispatch } from '../store/reducers/reducerRoot';
import { unwrapResult } from '@reduxjs/toolkit';

interface Forms {
  id: string,
  formHeader: string,
}

const HomePage: React.FC = () => {
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

  const handleAddClick = () => {
    navigate('/create-form');
  };

  const BackgroundImage = require('../img/background.png');

  return (
    <div className="home-page">
      <div className='home-header'>
        <DescriptionIcon fontSize='large' sx={{ color: '#00862b' }} />
        <Typography variant='h5'>
          Формы
        </Typography>
      </div>
      <div className='home-body'>
        <Box sx={{ backgroundColor: "#cbd5e1" }}>
          <Card sx={{ width: '4rem', height: "4rem", display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={handleAddClick}>
            <AddIcon />
          </Card>
        </Box>
      </div>
      <Divider sx={{ mt: 4 }} />
      <Box sx={{ mt: 2, ml: 2 }}>
        <Typography variant='h4'>
          Ваши формы
        </Typography>
        <Grid container spacing={2}>
          {forms.map((form, index) => {
            return (
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
                        {form.formHeader}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Дата окончания опроса
                        {/* Add more form details here */}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            )
          })}
        </Grid>
      </Box>
    </div>
  );
};

export default HomePage;
