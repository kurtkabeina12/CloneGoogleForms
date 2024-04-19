import React from 'react';
import '../styles/main.css';
import DescriptionIcon from '@mui/icons-material/Description';
import { Box } from '@mui/material';
import Card from '@mui/material/Card';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

const StubPage: React.FC = () => {
 const navigate = useNavigate();

 const handleAddClick = () => {
    navigate('/create-form');
 };
  
 return (
    <div className="home-page">
      <div className='home-header'>
        <DescriptionIcon fontSize='large' sx={{ color: '#00862b' }} />
        <h4>Формы</h4>
      </div>
      <div className='home-body'>
        <Box sx={{ backgroundColor: "#cbd5e1" }}>
          <Card sx={{width:'4rem', height:"4rem", display:'flex', justifyContent:'center', alignItems:'center'}} onClick={handleAddClick}>
            <AddIcon />
          </Card>
        </Box>
      </div>
    </div>
 );
};

export default StubPage;
