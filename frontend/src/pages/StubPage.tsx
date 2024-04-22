import React from 'react';
import '../styles/main.css';
import { Box, Typography } from '@mui/material';

const StubPage: React.FC = () => {
 const LogoImage = require('../img/LogoVita.png');

 return (
    <>
      <Box sx={{display:'flex', flexDirection:'column', alignItems:'center'}}>
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
        <Typography variant="h4" component="h2" sx={{mt:"5rem"}}>
          Ваши ответы записаны
        </Typography>
      </Box>
    </>
 );
};

export default StubPage;
