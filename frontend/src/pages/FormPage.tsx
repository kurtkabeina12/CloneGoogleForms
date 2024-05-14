import { Box, Button, Divider, Grid, Pagination, Paper, Typography } from '@mui/material';
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
import '../styles/main.css';

export default function FormPage() {
	const { formId } = useParams();
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();
	const [currentSection, setCurrentSection] = useState(0);
	const methods = useForm();
	const [formData, setFormData] = useState<FormData | null>(null);
	const [selectedSubQuestionIndex, setSelectedSubQuestionIndex] = useState<number | null>(null);
	const [valueSliderNow, setValueSliderNow] = useState<number | null>(null)
	const [valueSliderForSubQuestion, setValueSliderForSubQuestion] = useState<number | null>(null)
	const [checkboxChooseNow, setChecboxChooseNow] = useState<number | null>(null)
	const [checkboxChooseForSubQuestion, setCheckboxChooseForSubQuestion] = useState<number | null>(null)


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

	const convertLocalPathToUrl = (localPath: string | string[]) => {
		const baseUrl = 'http://localhost:8888/UsersImage/';
		// Используем регулярное выражение с двойным обратным слешем для экранирования
		const regex = /UsersImage\/(.*)/;
		const result: string[] = [];

		if (typeof localPath === 'string') {
			// Заменяем обратные слеши на прямые слеши перед разделением строки
			const processedPath = localPath.replace(/\\/g, '/');
			localPath = processedPath;
			localPath.split(',').forEach((path: string) => {
				console.log(`Processing path: ${path}`);
				const match = path.match(regex);
				if (match) {
					result.push(`${baseUrl}${match[1]}`);
				} else {
					console.log(`No match found for path: ${path}`);
				}
			});
		} else {
			localPath.forEach((path: string) => {
				// Заменяем обратные слеши на прямые слеши перед обработкой каждого пути
				const processedPath = path.replace(/\\/g, '/');
				path = processedPath;
				console.log(`Processing path: ${path}`);
				const match = path.match(regex);
				if (match) {
					result.push(`${baseUrl}${match[1]}`);
				} else {
					console.log(`No match found for path: ${path}`);
				}
			});
		}

		console.log('Result:', result);
		return result;
	};

	const handleSliderValueChange = (value: number, changeCardsLogic: string | string[]) => {
		if (Array.isArray(changeCardsLogic) && changeCardsLogic.length > 0) {
			setValueSliderNow(value);
			const logicString = changeCardsLogic[0];
			const logic = logicString.split(':')[0] === value.toString();
			if (logic) {
				const [indexValue, indexQuestion] = logicString.split(':');
				setValueSliderForSubQuestion(parseInt(indexValue));
				console.log(setValueSliderForSubQuestion, 'индекс выбранного номера в слайдере')

				setSelectedSubQuestionIndex(parseInt(indexQuestion));
				console.log(selectedSubQuestionIndex, 'индекс выбранного вопроса')
			}
		} else {
			console.error('Invalid changeCardsLogic:', changeCardsLogic);
		}
	};

	const handleCheckboxChooseChange = (value: string, changeCardsLogic: string | string[]) => {
		if (Array.isArray(changeCardsLogic) && changeCardsLogic.length > 0) {
			console.log(value, changeCardsLogic, "formPage")
			// setChecboxChooseNow(value);
			// const logicString = changeCardsLogic[0];
			// const logic = logicString.split(':')[0] === value.toString();
			// if (logic) {
			// 	const [indexValue, indexQuestion] = logicString.split(':');
			// 	setCheckboxChooseForSubQuestion(parseInt(indexValue));
			// 	console.log(setCheckboxChooseForSubQuestion, 'индекс выбранного номера в чекбоксе')

			// 	setSelectedSubQuestionIndex(parseInt(indexQuestion));
			// 	console.log(selectedSubQuestionIndex, 'индекс выбранного вопроса')
			// }
		} else {
			console.error('Invalid changeCardsLogic:', changeCardsLogic);
		}
	};

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
							<Paper className="header-paper" elevation={2} sx={{ p: 3, borderTop: "8px solid #00862b", mt: 3, maxWidth: "400px" }}>
								<Typography variant="h4" gutterBottom> {formData?.formTitle} </Typography>
								<Divider />
								<Typography variant="h6" gutterBottom> {formData?.formOverview} </Typography>
							</Paper>
							{formData ? (
								<>
									<Box sx={{ marginTop: 1 }}>
										<Paper elevation={2} sx={{ p: 3, paddingTop: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start" }}>
											<Box sx={{ display: 'flex', flexDirection: "row", gap: 1, textAlign: 'center' }}>
												<Typography variant='h6' gutterBottom> {formData.sections[currentSection].title} </Typography>
											</Box>
										</Paper>
										{formData.sections[currentSection].cards.map((card, index) => {
											console.log(card, 'карточка')
											const imageUrl = convertLocalPathToUrl(card.imageUrl);
											console.log(imageUrl, 'карточка')
											return (
												<Box key={index} sx={{ mb: 3, mt: 2, minWidth: "300px" }}>
													<Paper elevation={2} sx={{ p: 3, paddingTop: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", }}>
														<Box sx={{ display: 'flex', flexDirection: "row", gap: 1, textAlign: 'center' }}>
															<Typography variant='h6' gutterBottom> {card.question} </Typography>
														</Box>
														{card.addImg && (
															<>
																{imageUrl.map((imgUrl, index) => (
																	<img key={index} src={imgUrl} style={{ maxWidth: "-webkit-fill-available", marginTop: 5 }} />
																))}
															</>
														)}
														{card.selectedComponent === 'Input' && <InputCopmponent idQuestion={card.idQuestion} disabled={false} quest={card.question} required={card.isRequired} />}
														{card.selectedComponent === 'Textarea' && <TextareaComponent idQuestion={card.idQuestion} disabled={false} quest={card.question} required={card.isRequired} />}
														{card.selectedComponent === 'Radio' && <RadioComponent idQuestion={card.idQuestion} disabled={false} answers={card.answer} quest={card.question} required={card.isRequired} />}
														{card.selectedComponent === 'Checkbox' && <CheckboxesComponent idQuestion={card.idQuestion} disabled={false} answers={card.answer} quest={card.question} required={card.isRequired} addLogic={card.addLogic} GetLogic={card.Logic} nowCheckboxChoose={handleCheckboxChooseChange} changeCardsLogic={card.changeCardsLogic} />}
														{card.selectedComponent === 'Slider' && <SliderComponent idQuestion={card.idQuestion} disabled={false} answers={card.answer} quest={card.question} required={card.isRequired} nowSliderValue={handleSliderValueChange} changeCardsLogic={card.changeCardsLogic} />}
														{card.selectedComponent === 'Data' && <DataComponent idQuestion={card.idQuestion} disabled={false} quest={card.question} required={card.isRequired} />}
													</Paper>
													{card.subQuestions && card.subQuestions.map((subQuestion, subIndex) => {
														return (
															<Box sx={{ mt: 3 }} key={subIndex}>
																{selectedSubQuestionIndex && ((valueSliderNow === valueSliderForSubQuestion)) && (selectedSubQuestionIndex - 1) === subIndex && (
																	<Paper elevation={2} sx={{ p: 3, paddingTop: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", height: '100%' }}>
																		<Box sx={{ display: 'flex', flexDirection: "row", width: "-webkit-fill-available", gap: 1, textAlign: 'center' }}>
																			<Typography variant='subtitle1' gutterBottom> {subQuestion.question} </Typography>
																		</Box>
																		{subQuestion.addImg && (
																			<img src={Array.isArray(subQuestion.imageUrl) ? subQuestion.imageUrl[0] : subQuestion.imageUrl} style={{ maxWidth: "-webkit-fill-available", marginTop: 5 }} />
																		)}
																		{subQuestion.selectedComponent === 'Input' && <InputCopmponent idQuestion={subQuestion.idSubQuestion} disabled={false} quest={subQuestion.question} required={subQuestion.isRequired} />}
																		{subQuestion.selectedComponent === 'Textarea' && <TextareaComponent idQuestion={subQuestion.idSubQuestion} disabled={false} quest={subQuestion.question} required={subQuestion.isRequired} />}
																		{subQuestion.selectedComponent === 'Radio' && <RadioComponent idQuestion={subQuestion.idSubQuestion} disabled={false} answers={subQuestion.answer} quest={subQuestion.question} required={subQuestion.isRequired} />}
																		{subQuestion.selectedComponent === 'Checkbox' && <CheckboxesComponent idQuestion={subQuestion.idSubQuestion} disabled={false} answers={subQuestion.answer} quest={subQuestion.question} required={subQuestion.isRequired} addLogic={subQuestion.addLogic} GetLogic={subQuestion.Logic} />}
																		{subQuestion.selectedComponent === 'Slider' && <SliderComponent idQuestion={subQuestion.idSubQuestion} disabled={false} answers={subQuestion.answer} quest={subQuestion.question} required={subQuestion.isRequired} nowSliderValue={handleSliderValueChange} changeCardsLogic={subQuestion.changeCardsLogic} />}
																		{subQuestion.selectedComponent === 'Data' && <DataComponent idQuestion={subQuestion.idSubQuestion} disabled={false} quest={subQuestion.question} required={subQuestion.isRequired} />}
																	</Paper>
																)}
															</Box>
														)
													})}
												</Box>
											);
										})}
									</Box>

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
					</form>
				</FormProvider>
			)}
		</>
	);
}
