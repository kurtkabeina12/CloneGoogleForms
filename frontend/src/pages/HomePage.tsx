import React from 'react';
import '../styles/main.css';
import DescriptionIcon from '@mui/icons-material/Description';
import { Box, CardActionArea, CardContent, CardMedia, Divider, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
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
        <Card sx={{ maxWidth: 345 }}>
          <CardActionArea>
            <CardMedia
              component="img"
              height="140"
              image={BackgroundImage}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Lizard
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Lizards are a widespread group of squamate reptiles, with over 6,000
                species, ranging across all continents except Antarctica
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Box>
    </div>
  );
};

export default HomePage;
