import { Box, Grid, Paper, Typography, Checkbox, Radio, Slider } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import TextareaComponent from '../components/TextareaComponent';
import InputCopmponent from '../components/InputCopmponent';
import DataComponent from '../components/DataComponent';
import RadioComponent from '../components/RadioComponent';
import CheckboxesComponent from '../components/CheckboxesComponent';

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
			<form style={{ marginTop: 15 }}>
			<Grid container spacing={3} className='FormCenter' style={{ paddingLeft: 0 }}>
				<Grid item xs={12} sm={8} md={6}>
					<Box sx={{ mb: 3 }}>
						<Paper className="header-paper" elevation={2} sx={{ p: 3, borderTop: "8px solid #00862b" }}>
							<Typography variant="h4" gutterBottom>
								{formData?.formHeader}
							</Typography>
						</Paper>
					</Box>
				</Grid>
				<Grid container spacing={3} style={{ marginTop: "0.5rem" }} >
					{
						formData ? (
							<Grid container spacing={3} className='FormCenter' >
								{formData.cards.map((card, index) => {
									return (
										<Grid key={index} item xs={12} sm={8} md={6} className='body-card'>
											<Box sx={{ mb: 3 }}>
												<Paper elevation={2} sx={{ p: 3, paddingTop: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start" }}>
													<Box sx={{ display: 'flex', flexDirection: "row", width: "-webkit-fill-available", gap: 1, textAlign: 'center' }}>
														<Typography variant='h6' gutterBottom> {card.question} </Typography>
													</Box>
													{card.selectedComponent === 'Input' && <InputCopmponent disabled={false} />}
													{card.selectedComponent === 'Textarea' && <TextareaComponent disabled={false} />}
													{card.selectedComponent === 'Radio' && <RadioComponent disabled={false} answers={card.answer} />}
													{card.selectedComponent === 'Checkbox' && <CheckboxesComponent disabled={false} answers={card.answer} />}
													{card.selectedComponent === 'Slider' && <Slider />}
													{card.selectedComponent === 'Data' && <DataComponent disabled={false} />}
												</Paper>
											</Box>
										</Grid>
									);
								})}
							</Grid>
						) : (
							<p>Загружаем конечный вид формы...</p>
						)
					}
				</Grid>
			</Grid>
		</form >
		</>
	);
}
