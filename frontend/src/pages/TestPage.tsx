import { Box, Button, Divider, Grid, Snackbar, Alert, Paper, Typography, IconButton } from '@mui/material';
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
import { unwrapResult } from '@reduxjs/toolkit';
import SendIcon from '@mui/icons-material/Send';
import '../styles/main.css';
import { fetchGetTest } from '../store/action/actionGetTest';
import { TestData } from '../types/types';
import RegistratioEmailComponent from '../components/RegistrationEmailComponent';
import { sendTestData } from '../store/action/actionSendPassedTest';
import CloseIcon from '@mui/icons-material/Close';

export default function TestPage() {
	const { testId } = useParams();
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();
	const [currentSection, setCurrentSection] = useState(0);
	const methods = useForm({
		mode: 'all',
	});
	const [testData, setTestData] = useState<TestData | null>(null);
	const [selectedSubQuestionIndexForSlider, setSelectedSubQuestionIndexForSlider] = useState<number | null>(null);
	const [selectedSubQuestionIndexForCheckbox, setSelectedSubQuestionIndexForCheckbox] = useState<number | null>(null);
	const [valueSliderNow, setValueSliderNow] = useState<number | null>(null)
	const [valueSliderForSubQuestion, setValueSliderForSubQuestion] = useState<number | null>(null)
	const [checkboxChooseNow, setChecboxChooseNow] = useState<number | null>(null)
	const [checkboxChooseForSubQuestion, setCheckboxChooseForSubQuestion] = useState<number | null>(null)
	const [dateForEndTest, setDateForEndTest] = useState<string | null>(null);
	const LogoImage = require('../img/LogoVita.png');
	const [openSnackbar, setOpenSnackbar] = useState(false);

	useEffect(() => {
		const fetchFormData = async () => {
			try {
				const actionResult = await dispatch(fetchGetTest({ testId: testId ?? '' }));
				const testData = unwrapResult(actionResult);
				setDateForEndTest(testData?.testEndDate);
				setTestData(testData);
				console.log(testData)
				const selectedColor = testData.selectedColor
				document.body.style.backgroundColor = selectedColor;
			} catch (error) {
				console.log(error, 'оштбка')
				console.error('Failed to fetch form:', error);
			}
		};
		fetchFormData();
	}, [dispatch, testId]);

	const convertLocalPathToUrl = (localPath: string | string[]) => {
		const baseUrl = 'http://172.20.15.13:8888/UsersImage/';
		// Используем регулярное выражение с двойным обратным слешем для экранирования
		const regex = /UsersImage\/(.*)/;
		const result: string[] = [];

		if (typeof localPath === 'string') {
			// Заменяем обратные слеши на прямые слеши перед разделением строки
			const processedPath = localPath.replace(/\\/g, '/');
			localPath = processedPath;
			localPath.split(',').forEach((path: string) => {
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
				const match = path.match(regex);
				if (match) {
					result.push(`${baseUrl}${match[1]}`);
				} else {
					console.log(`No match found for path: ${path}`);
				}
			});
		}

		return result;
	};

	const handleSliderValueChange = (value: number, changeCardsLogic: string | string[]) => {
		if (Array.isArray(changeCardsLogic) && changeCardsLogic.length > 0) {
			setValueSliderNow(value);
			changeCardsLogic.forEach(logicString => {
				const logic = logicString.split(':')[0] === value.toString();
				if (logic) {
					const [indexValue, indexQuestion] = logicString.split(':');
					setValueSliderForSubQuestion(parseInt(indexValue));
					setSelectedSubQuestionIndexForSlider(parseInt(indexQuestion));
				}
			});
		} else {
			console.error('Invalid changeCardsLogic:', changeCardsLogic);
		}
	};

	const handleCheckboxChooseChange = (value: string, changeCardsLogic: string | any[]) => {
		if (Array.isArray(changeCardsLogic) && changeCardsLogic.length > 0) {
			console.log(value, 'valueCheckboxInFormPage')
			const valueArray = value.split("").filter(char => /^\d$/.test(char));
			if (valueArray.length === 1) {
				const checkboxIndexInPage = Number(valueArray[0]) + 1;
				setChecboxChooseNow(checkboxIndexInPage);
				changeCardsLogic.forEach(logicString => {
					const logic = logicString.split(':')[0] === checkboxIndexInPage.toString();
					if (logic) {
						const [indexValue, indexQuestion] = logicString.split(':');
						setCheckboxChooseForSubQuestion(parseInt(indexValue));
						setSelectedSubQuestionIndexForCheckbox(parseInt(indexQuestion));
					}
				});
			} else {
				setChecboxChooseNow(null);
				setCheckboxChooseForSubQuestion(null);
				setSelectedSubQuestionIndexForCheckbox(null);
			}
		} else {
			console.error('Invalid changeCardsLogic:', changeCardsLogic);
		}
	};

	const handleCloseSnackbar = () => {
		setOpenSnackbar(false);
	};

	const moveToNextSection = (data: any) => {
		setCurrentSection(currentSection + 1);
	};

	const isSurveyEnded = () => {
		if (!dateForEndTest) return false;
		const endDate = new Date(dateForEndTest);
		const today = new Date();
		return endDate.toDateString() === today.toDateString();
	};

	const onSubmit = async (data: any) => {
		console.log(data, 'данные для отправки на сервер')
		try {
			const rezultSendData = await dispatch(sendTestData({ testData: data, testId: testId ?? '' }));
			const totalRezult = unwrapResult(rezultSendData);
			console.log(totalRezult, 'результат отправки на сервер')
			const totalPoints = totalRezult.totalPoints;
			const userEmail = totalRezult.userEmail;
			const userId = totalRezult.userId;
			navigate(`/stubTest/${testId}`, { state: { testId: testId, totalPoints: totalPoints, userEmail: userEmail, userId: userId } });
			// navigate(`/form/${formId.formId}`, { state: { formId } });
		} catch (error) {
			console.error('Failed to send form data:', error);
			const err = error as { error?: string };
			if (err.error === 'User already exists') {
				setOpenSnackbar(true);
			}
		}
	};

	const action = (
		<React.Fragment>
			<Button color="secondary" size="small" onClick={handleCloseSnackbar}>
				UNDO
			</Button>
			<IconButton
				size="small"
				aria-label="close"
				color="inherit"
				onClick={handleCloseSnackbar}
			>
				<CloseIcon fontSize="small" />
			</IconButton>
		</React.Fragment>
	);

	return (
		<>
			{isSurveyEnded() ? (
				<Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
					<Typography sx={{ mt: 3 }} variant='h3'>Тест недоступен</Typography>
				</Box>
			) : (
				<>
					<FormProvider {...methods}>
						<form onSubmit={methods.handleSubmit(onSubmit)} style={{ marginTop: 15 }} >
							<Grid container spacing={3} className='FormCenter' >
								<Paper className="header-paper" elevation={2} sx={{ p: 3, borderTop: "8px solid #00862b", mt: 3, maxWidth: "400px" }}>
									<Typography variant="h4" gutterBottom>
										{testData?.testTitle}
										<Divider />
										<Typography variant="h6" gutterBottom> {testData?.testOverview} </Typography>
									</Typography>
									<Divider />
									<RegistratioEmailComponent />
								</Paper>
								{testData ? (
									<>
										<Box sx={{ marginTop: 1 }}>
											{testData?.sections[currentSection].title &&
												<Paper elevation={2} sx={{ p: 3, paddingTop: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start" }}>
													<Box sx={{ display: 'flex', flexDirection: "row", gap: 1, textAlign: 'center' }}>
														<Typography variant='h6' gutterBottom> {testData.sections[currentSection].title} </Typography>
													</Box>
												</Paper>
											}
											{testData.sections[currentSection].cards.map((card, index) => {
												const imageUrl = convertLocalPathToUrl(card.imageUrl);
												return (
													<Box key={index} sx={{ mb: 3, mt: 2, minWidth: "300px" }}>
														<Paper elevation={2} sx={{ p: 3, paddingTop: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", }}>
															<Box sx={{ display: 'flex', flexDirection: "row", gap: 1, textAlign: 'center' }}>
																<Typography variant='h6' gutterBottom> {card.question} </Typography>
															</Box>
															{card.addImg && (
																<>
																	{imageUrl.map((imgUrl, index) => (
																		// eslint-disable-next-line jsx-a11y/alt-text
																		<img key={index} src={imgUrl} style={{ maxWidth: "-webkit-fill-available", marginTop: 5 }} />
																	))}
																</>
															)}
															{card.selectedComponent === 'Input' && <InputCopmponent idQuestion={card.idQuestion} disabled={false} quest={card.question} required={card.isRequired} cardPoints={card.points} cardCorrectAnswer={card.correctAnswer} cardFormPageType={'card'} />}
															{card.selectedComponent === 'Textarea' && <TextareaComponent idQuestion={card.idQuestion} disabled={false} quest={card.question} required={card.isRequired} cardFormPageType={'card'} />}
															{card.selectedComponent === 'Radio' && <RadioComponent idQuestion={card.idQuestion} disabled={false} answers={card.answer} quest={card.question} required={card.isRequired} cardFormPageType={'card'} />}
															{card.selectedComponent === 'Checkbox' && <CheckboxesComponent idQuestion={card.idQuestion} disabled={false} answers={card.answer} quest={card.question} required={card.isRequired} nowCheckboxChoose={handleCheckboxChooseChange} changeCardsLogic={card.changeCardsLogic} cardFormPageType={'card'} isTest={true} />}
															{card.selectedComponent === 'Slider' && <SliderComponent idQuestion={card.idQuestion} disabled={false} answers={card.answer} quest={card.question} required={card.isRequired} nowSliderValue={handleSliderValueChange} changeCardsLogic={card.changeCardsLogic} cardFormPageType={'card'} />}
															{card.selectedComponent === 'Data' && <DataComponent idQuestion={card.idQuestion} disabled={false} quest={card.question} required={card.isRequired} cardFormPageType={'card'} />}
														</Paper>
														{card.subQuestions && card.subQuestions.map((subQuestion, subIndex) => {
															return (
																<Box sx={{ mt: 3 }} key={subIndex}>
																	{card.selectedComponent === 'Slider' && selectedSubQuestionIndexForSlider && ((valueSliderNow === valueSliderForSubQuestion)) && (selectedSubQuestionIndexForSlider - 1) === subIndex && (
																		<Paper elevation={2} sx={{ p: 3, paddingTop: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", height: '100%' }}>
																			<Box sx={{ display: 'flex', flexDirection: "row", width: "-webkit-fill-available", gap: 1, textAlign: 'center' }}>
																				<Typography variant='subtitle1' gutterBottom> {subQuestion.question} </Typography>
																			</Box>
																			{subQuestion.addImg && (
																				// eslint-disable-next-line jsx-a11y/alt-text
																				<img src={Array.isArray(subQuestion.imageUrl) ? subQuestion.imageUrl[0] : subQuestion.imageUrl} style={{ maxWidth: "-webkit-fill-available", marginTop: 5 }} />
																			)}
																			{subQuestion.selectedComponent === 'Input' && <InputCopmponent idQuestion={subQuestion.idSubQuestion} disabled={false} quest={subQuestion.question} cardFormPageType={'subCard'} />}
																			{subQuestion.selectedComponent === 'Textarea' && <TextareaComponent idQuestion={subQuestion.idSubQuestion} disabled={false} quest={subQuestion.question} cardFormPageType={'subCard'} />}
																			{subQuestion.selectedComponent === 'Radio' && <RadioComponent idQuestion={subQuestion.idSubQuestion} disabled={false} answers={subQuestion.answer} quest={subQuestion.question} cardFormPageType={'subCard'} />}
																			{subQuestion.selectedComponent === 'Checkbox' && <CheckboxesComponent idQuestion={subQuestion.idSubQuestion} disabled={false} answers={subQuestion.answer} quest={subQuestion.question} cardFormPageType={'subCard'} isTest={true} />}
																			{subQuestion.selectedComponent === 'Slider' && <SliderComponent idQuestion={subQuestion.idSubQuestion} disabled={false} answers={subQuestion.answer} quest={subQuestion.question} nowSliderValue={handleSliderValueChange} changeCardsLogic={subQuestion.changeCardsLogic} cardFormPageType={'subCard'} />}
																			{subQuestion.selectedComponent === 'Data' && <DataComponent idQuestion={subQuestion.idSubQuestion} disabled={false} quest={subQuestion.question} cardFormPageType={'subCard'} />}
																		</Paper>
																	)}
																	{card.selectedComponent === 'Checkbox' && selectedSubQuestionIndexForCheckbox && ((checkboxChooseNow === checkboxChooseForSubQuestion)) && (selectedSubQuestionIndexForCheckbox - 1) === subIndex && (
																		<Paper elevation={2} sx={{ p: 3, paddingTop: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", height: '100%' }}>
																			<Box sx={{ display: 'flex', flexDirection: "row", width: "-webkit-fill-available", gap: 1, textAlign: 'center' }}>
																				<Typography variant='subtitle1' gutterBottom> {subQuestion.question} </Typography>
																			</Box>
																			{subQuestion.addImg && (
																				// eslint-disable-next-line jsx-a11y/alt-text
																				<img src={Array.isArray(subQuestion.imageUrl) ? subQuestion.imageUrl[0] : subQuestion.imageUrl} style={{ maxWidth: "-webkit-fill-available", marginTop: 5 }} />
																			)}
																			{subQuestion.selectedComponent === 'Input' && <InputCopmponent idQuestion={subQuestion.idSubQuestion} disabled={false} quest={subQuestion.question} cardFormPageType={'subCard'} />}
																			{subQuestion.selectedComponent === 'Textarea' && <TextareaComponent idQuestion={subQuestion.idSubQuestion} disabled={false} quest={subQuestion.question} cardFormPageType={'subCard'} />}
																			{subQuestion.selectedComponent === 'Radio' && <RadioComponent idQuestion={subQuestion.idSubQuestion} disabled={false} answers={subQuestion.answer} quest={subQuestion.question} cardFormPageType={'subCard'} />}
																			{subQuestion.selectedComponent === 'Checkbox' && <CheckboxesComponent idQuestion={subQuestion.idSubQuestion} disabled={false} answers={subQuestion.answer} quest={subQuestion.question} cardFormPageType={'subCard'} isTest={true} />}
																			{subQuestion.selectedComponent === 'Slider' && <SliderComponent idQuestion={subQuestion.idSubQuestion} disabled={false} answers={subQuestion.answer} quest={subQuestion.question} nowSliderValue={handleSliderValueChange} changeCardsLogic={subQuestion.changeCardsLogic} cardFormPageType={'subCard'} />}
																			{subQuestion.selectedComponent === 'Data' && <DataComponent idQuestion={subQuestion.idSubQuestion} disabled={false} quest={subQuestion.question} cardFormPageType={'subCard'} />}
																		</Paper>
																	)}
																</Box>
															)
														})}
													</Box>
												);
											})}

											<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
												{currentSection > 0 && (
													<Button onClick={() => setCurrentSection(currentSection - 1)} color="success" variant="contained">
														Назад
													</Button>
												)}

												{currentSection !== testData.sections.length - 1 && (
													<Button onClick={() => methods.handleSubmit(moveToNextSection)()} color="success" variant="contained">
														Далее
													</Button>
												)}

												{currentSection === testData.sections.length - 1 && (
													<Button type="submit" variant="contained" endIcon={<SendIcon />} color="success">
														Отправить
													</Button>
												)}

											</Box>

										</Box>

										{/* <Box>
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
												</Box> */}
									</>
								) : (
									<p>Загружаем конечный вид формы...</p>
								)}
							</Grid>
						</form >
					</FormProvider>
				</>
			)
			}

			<Snackbar
				open={openSnackbar}
				autoHideDuration={6000}
				onClose={handleCloseSnackbar}
				action={action}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
			>
				<Alert
					severity="error"
					variant="filled"
					sx={{ width: '100%' }}
				>
					Пользователь уже существует
				</Alert>
			</Snackbar>

		</>
	);
}
