import { Box, Button, Divider, Grid, Pagination, Paper, Typography, makeStyles } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import RegistrationComponent from '../components/RegistrationComponent';
import SendIcon from '@mui/icons-material/Send';
import { sendFormData } from '../store/action/actionSendPassedForm';
import { FormData } from '../types/types';

export default function FormPage() {
	const { formId } = useParams();
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();
	const [currentSection, setCurrentSection] = useState(0);
	const cardsPerPage = 5; // Количество карточек на странице
	const methods = useForm();
	const [formData, setFormData] = useState<FormData | null>(null);

	useEffect(() => {
		const fetchFormData = async () => {
			try {
				const actionResult = await dispatch(fetchGetForm({ formId: formId ?? '' }));
				const formData = unwrapResult(actionResult);
				setFormData(formData);
				const selectedColor = formData.selectedColor
				document.body.style.backgroundColor = selectedColor;
				console.log(formData, 'данные с сервера')
			} catch (error) {
				console.error('Failed to fetch form:', error);
			}
		};

		fetchFormData();
	}, [dispatch, formId]);

	const isMandatory = formData?.isMandatoryAuth;

	const onSubmit = async (data: any) => {
		console.log(data)
		try {
			const rezultSendData = await dispatch(sendFormData({ formData: data, formId: formId ?? '' }));
			console.log(rezultSendData);
			navigate("/stub")
		} catch (error) {
			console.error('Failed to send form data:', error);
		}
	};

	return (
		<>
			{isMandatory && (
				<>
					<FormProvider {...methods}>
						<form onSubmit={methods.handleSubmit(onSubmit)} style={{ marginTop: 15 }} >
							<Grid container spacing={3} className='FormCenter' >
								<Grid item xs={12} sm={8} md={6} style={{ paddingLeft: 0 }}>
									<Box sx={{ mb: 3 }}>
										<Paper className="header-paper" elevation={2} sx={{ p: 3, borderTop: "8px solid #00862b" }}>
											<Typography variant="h4" gutterBottom>
												{formData?.formTitle}
											</Typography>
											<Divider />
											<RegistrationComponent />
										</Paper>
									</Box>
								</Grid>
								{/* <Grid container spacing={3} style={{ marginTop: "0.5rem" }} >
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
																	{card.addImg && (
																		<img src={card.imageUrl} style={{ maxWidth: "-webkit-fill-available", marginTop: 5 }} />
																	)}
																	{card.selectedComponent === 'Input' && <InputCopmponent idQuestion={card.idQuestion} disabled={false} quest={card.question} required={card.isRequired} />}
																	{card.selectedComponent === 'Textarea' && <TextareaComponent idQuestion={card.idQuestion} disabled={false} quest={card.question} required={card.isRequired} />}
																	{card.selectedComponent === 'Radio' && <RadioComponent idQuestion={card.idQuestion} disabled={false} answers={card.answer} quest={card.question} required={card.isRequired} />}
																	{card.selectedComponent === 'Checkbox' && <CheckboxesComponent idQuestion={card.idQuestion} disabled={false} answers={card.answer} quest={card.question} required={card.isRequired} addLogic={card.addLogic} GetLogic={card.Logic} />}
																	{card.selectedComponent === 'Slider' && <SliderComponent idQuestion={card.idQuestion} disabled={false} answers={card.answer} quest={card.question} required={card.isRequired} />}
																	{card.selectedComponent === 'Data' && <DataComponent idQuestion={card.idQuestion} disabled={false} quest={card.question} required={card.isRequired} />}
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
								</Grid> */}
								<Button type="submit" variant="contained" endIcon={<SendIcon />} color="success">
									Отправить
								</Button>
							</Grid>
						</form >
					</FormProvider>
				</>
			)}
			{!isMandatory && (
				<FormProvider {...methods}>
					<form onSubmit={methods.handleSubmit(onSubmit)} style={{ marginTop: 15 }}>
						<Grid container spacing={3} className='FormCenter'>
							<Grid item xs={12} sm={8} md={6} style={{ paddingLeft: 0 }}>
								<Box sx={{ mb: 3 }}>
									<Paper className="header-paper" elevation={2} sx={{ p: 3, borderTop: "8px solid #00862b" }}>
										<Typography variant="h4" gutterBottom> {formData?.formTitle} </Typography>
										<Divider />
										<Typography variant="h6" gutterBottom> {formData?.formOverview} </Typography>
									</Paper>
								</Box>
							</Grid>
							<Grid container spacing={3} style={{ display: 'flex', justifyContent: 'center' }}>
								{formData ? (
									<>
										<Grid container spacing={3} className='FormCenter' sx={{ marginTop: 1 }}>
											<Paper elevation={2} sx={{ p: 3, paddingTop: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start" }}>
												<Box sx={{ display: 'flex', flexDirection: "row", width: "-webkit-fill-available", gap: 1, textAlign: 'center' }}>
													<Typography variant='h6' gutterBottom> {formData.sections[currentSection].title} </Typography>
												</Box>
											</Paper>
											{formData.sections[currentSection].cards.map((card, index) => {
												console.log(card, 'карточка')
												return (
													<Grid key={index} item xs={12} sm={8} md={6}>
														<Box sx={{ mb: 3 }}>
															<Paper elevation={2} sx={{ p: 3, paddingTop: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start" }}>
																<Box sx={{ display: 'flex', flexDirection: "row", width: "-webkit-fill-available", gap: 1, textAlign: 'center' }}>
																	<Typography variant='h6' gutterBottom> {card.question} </Typography>
																</Box>
																{card.addImg && (
																	<img src={Array.isArray(card.imageUrl) ? card.imageUrl[0] : card.imageUrl} style={{ maxWidth: "-webkit-fill-available", marginTop: 5 }} />
																)}
																{card.selectedComponent === 'Input' && <InputCopmponent idQuestion={card.idQuestion} disabled={false} quest={card.question} required={card.isRequired} />}
																{card.selectedComponent === 'Textarea' && <TextareaComponent idQuestion={card.idQuestion} disabled={false} quest={card.question} required={card.isRequired} />}
																{card.selectedComponent === 'Radio' && <RadioComponent idQuestion={card.idQuestion} disabled={false} answers={card.answer} quest={card.question} required={card.isRequired} />}
																{card.selectedComponent === 'Checkbox' && <CheckboxesComponent idQuestion={card.idQuestion} disabled={false} answers={card.answer} quest={card.question} required={card.isRequired} addLogic={card.addLogic} GetLogic={card.Logic} />}
																{card.selectedComponent === 'Slider' && <SliderComponent idQuestion={card.idQuestion} disabled={false} answers={card.answer} quest={card.question} required={card.isRequired} />}
																{card.selectedComponent === 'Data' && <DataComponent idQuestion={card.idQuestion} disabled={false} quest={card.question} required={card.isRequired} />}
															</Paper>
														</Box>
													</Grid>
												);
											})}
										</Grid>
										<Box>
											<Pagination
												sx={{
													'& .MuiPaginationItem-page.Mui-selected': {
														backgroundColor: '#00862b !important',
														color: '#ffffff !important',
													},
												}}
												count={formData.sections.length}
												page={currentSection + 1}
												onChange={(event, value) => setCurrentSection(value - 1)}
											/>
										</Box>
									</>
								) : (
									<p>Загружаем конечный вид формы...</p>
								)}
							</Grid>
						</Grid>
					</form>
				</FormProvider>
			)}
		</>
	);
}
