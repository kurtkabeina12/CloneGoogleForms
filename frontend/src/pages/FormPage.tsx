import { Box, Grid, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface FormData {
   formHeader: string;
   cards: {
      question: string;
      answer: string[];
      isRequired: boolean;
      selectedComponent: string;
      id: string;
   }[];
}

export default function FormPage() {
   const location = useLocation();
   const params = location.state?.formId;
   const formId = params.formId;

   const [formData, setFormData] = useState<FormData | null>(null);

   useEffect(() => {
      const fetchForm = async () => {
         try {
            const response = await fetch(`http://localhost:8888/forms/${formId}`);
            if (!response.ok) {
               throw new Error('Failed to fetch form');
            }
            const data = await response.json();
            console.log(data, 'ответ с сервера в formPage');
            setFormData(data);
         } catch (error) {
            console.error('Failed to fetch form:', error);
         }
      };

      fetchForm();
   }, [formId]);

   return (
      <>
         <Grid container spacing={3} className='FormCenter'  >
            <Grid item xs={12} sm={8} md={6}>
               <Box sx={{ mb: 3 }}>
                  <Paper className="header-paper" elevation={2} sx={{ p: 3, borderTop: "8px solid #00862b", textAlign:'center' }}>
                     <Typography variant="h3" gutterBottom>
                        {formData?.formHeader}
                     </Typography>
                  </Paper>
               </Box>
            </Grid>
         </Grid>
         {formData ? (
            <div>
               {formData.cards.map((card, index) => {
                  return (
                     <div key={index}>
                        <p>{card.question}</p>
                     </div>
                  );
               })}
            </div>
         ) : (
            <p>Loading form data...</p>
         )}
      </>
   );
}
