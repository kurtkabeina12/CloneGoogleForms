import { Box, Grid, Paper, Typography, Slider } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import TextareaComponent from '../components/TextareaComponent';
import InputCopmponent from '../components/InputCopmponent';
import DataComponent from '../components/DataComponent';
import RadioComponent from '../components/RadioComponent';
import CheckboxesComponent from '../components/CheckboxesComponent';
import SliderComponent from '../components/SliderComponent';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/reducers/reducerRoot';
import { fetchGetForm } from '../store/action/actionGetForm';
import { unwrapResult } from '@reduxjs/toolkit';

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
	const dispatch = useDispatch<AppDispatch>();

	const methods = useForm();
	const [formData, setFormData] = useState<FormData | null>(null);

	useEffect(() => {
		const fetchFormData = async () => {
			try {
				const actionResult = await dispatch(fetchGetForm({ formId }));
				const formData = unwrapResult(actionResult);
				setFormData(formData);
			} catch (error) {
				console.error('Failed to fetch form:', error);
			}
		};

		fetchFormData();
	}, [dispatch, formId]);



	const onSubmit = methods.handleSubmit((data) => {
		console.log(data);
	});

	return (
		<FormProvider {...methods}>
			<form onSubmit={onSubmit} style={{ marginTop: 15 }} >
				<Grid container spacing={3} className='FormCenter' >
					<Grid item xs={12} sm={8} md={6} style={{ paddingLeft: 0 }}>
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
														{card.selectedComponent === 'Input' && <InputCopmponent disabled={false} quest={card.question} required={card.isRequired} />}
														{card.selectedComponent === 'Textarea' && <TextareaComponent disabled={false} quest={card.question} required={card.isRequired} />}
														{card.selectedComponent === 'Radio' && <RadioComponent disabled={false} answers={card.answer} quest={card.question} required={card.isRequired} />}
														{card.selectedComponent === 'Checkbox' && <CheckboxesComponent disabled={false} answers={card.answer} quest={card.question} required={card.isRequired} />}
														{card.selectedComponent === 'Slider' && <SliderComponent disabled={false} answers={card.answer} />}
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
				<button type="submit" onClick={onSubmit}>Submit</button>
			</form >
		</FormProvider>
	);
}
