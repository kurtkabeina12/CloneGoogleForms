/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from 'react';
import { AppBar, Box, Button, Fab, FormControl, FormControlLabel, Grid, IconButton, InputLabel, MenuItem, Paper, Switch, TextField, Toolbar, Tooltip, Typography } from '@mui/material';
import '../styles/main.css';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import SubjectIcon from '@mui/icons-material/Subject';
import ShortTextIcon from '@mui/icons-material/ShortText';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import LinearScaleIcon from '@mui/icons-material/LinearScale';
import EventIcon from '@mui/icons-material/Event';
import InputCopmponent from '../components/InputCopmponent';
import TextareaComponent from '../components/TextareaComponent';
import RadioComponent from '../components/RadioComponent';
import CheckboxesComponent from '../components/CheckboxesComponent';
import DataComponent from '../components/DataComponent';
import DescriptionIcon from '@mui/icons-material/Description';
import SliderComponent from '../components/SliderComponent';
import { useDispatch } from 'react-redux';
import { Card, Section, SubQuestion } from '../types/types';
import { sendCardAsync } from '../store/action/actionSendForm';
import { AppDispatch } from '../store/reducers/reducerRoot';
import { useNavigate } from 'react-router-dom';
import ConstructionIcon from '@mui/icons-material/Construction';
import { FormProvider, useForm } from 'react-hook-form';
import { CustomSwitch } from '../components/CustomSwitch';
import ImageIcon from '@mui/icons-material/Image';
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import { styled } from '@mui/system';
import SplitscreenIcon from '@mui/icons-material/Splitscreen';
import SettingsIcon from '@mui/icons-material/Settings';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ClearIcon from '@mui/icons-material/Clear';

const green = {
	100: '#DCF8C6',
	200: '#A5D6A7',
	400: '#38B2AC',
	500: '#319795',
	600: '#2B7A78',
	900: '#145A64',
};

const grey = {
	50: '#F3F6F9',
	100: '#E5EAF2',
	200: '#DAE2ED',
	300: '#C7D0DD',
	400: '#B0B8C4',
	500: '#9DA8B7',
	600: '#6B7A90',
	700: '#434D5B',
	800: '#303740',
	900: '#1C2025',
};

const Textarea = styled(BaseTextareaAutosize)(
	({ theme }) => `
 box-sizing: border-box;
 font-size: 0.875rem;
 font-weight: 400;
 line-height: 1.5;
 padding: 8px 12px;
 border-radius: 8px;
 color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
 background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
 border: 1px solid rgba(0, 0, 0, 0.23);
 box-shadow: 0px 2px 2px ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};

 &:hover {
    border-color: ${green[400]};
 }

 &:focus {
    border-color: ${green[400]};
    box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? green[600] : green[200]};
 }

 // firefox
 &:focus-visible {
    outline: 0;
 }
`,
);

const CreateFormPage: React.FC = () => {
	const [cards, setCards] = useState<Card[]>([{ selectedComponent: 'Input', question: '', isRequired: false, answer: "", addLogic: false, Logic: '', addImg: false, imageUrl: [], addChangeCardsLogic: false,  changeCardsLogic: '', subQuestions: [] as SubQuestion[], }]);
	const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null);
	const [sections, setSections] = useState<Section[]>([{ title: '', cards: [{ selectedComponent: 'Input', question: '', isRequired: false, answer: "", addLogic: false, Logic: '', addImg: false, imageUrl: [], addChangeCardsLogic: false, changeCardsLogic: '', subQuestions: [] as SubQuestion[], }] }]);
	const [activeSectionIndex, setActiveSectionIndex] = useState<number | null>(null);
	// const [value, setValue] = React.useState('Questions');
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();
	const [title, setTitle] = useState('');
	const [titleOverview, setTitleOverview] = useState('');
	const [textForEndForm, setTextForEndForm] = useState('');
	const [dateEndForm, setDateEndForm] = useState('');
	const methods = useForm();
	const [isMandatoryAuth, setIsMandatoryAuth] = useState(false);
	const [selectedColor, setSelectedColor] = useState('#9fe5ae87');
	const [showTooltip, setShowTooltip] = useState(false);

	useEffect(() => {
		document.body.style.backgroundColor = selectedColor;
	}, [selectedColor]);

	// //изменения выбора элемента для карточки
	// const handleChange = (event: React.SyntheticEvent, newValue: string) => {
	// 	setValue(newValue);
	// };

	//обновления текста вопроса в карточке
	const handleQuestionChange = (index: number, newQuestion: string, sectionIndex: number, cardType: string, subQuestionIndex?: number) => {
		const newSections = [...sections];
		if (cardType === "subQuestion") {
			if (subQuestionIndex !== undefined) {
				console.log(sectionIndex, index, subQuestionIndex);
				newSections[sectionIndex].cards[index].subQuestions[subQuestionIndex].question = newQuestion;
			} else {
				console.log("subQuestionIndex underfind function handleQuestionChange")
			}
		} else {
			newSections[sectionIndex].cards[index].question = newQuestion;
		}
		setSections(newSections);
	};


	//изменения типа компонента ответа в карточке
	const handleSelectChange = (
		event: SelectChangeEvent<string>,
		index: number,
		sectionIndex: number,
		cardType: string,
		subQuestionIndex?: number,
	) => {
		const newSections = [...sections];
		if (cardType === "subQuestion") {
			if (subQuestionIndex !== undefined) {
				newSections[sectionIndex].cards[index].subQuestions[subQuestionIndex].selectedComponent = event.target.value;
			} else {
				console.log("subQuestionIndex underfind function handleSelectChange")
			}
		} else {
			newSections[sectionIndex].cards[index].selectedComponent = event.target.value;
		}
		setSections(newSections);
	};

	const handleDeleteCard = (sectionIndex: number, index: number, cardType: string, subQuestionIndex?: number) => {
		const newSections = [...sections];
		if (cardType === "subQuestion") {
			if (subQuestionIndex !== undefined) {
				newSections[sectionIndex].cards[index].subQuestions.splice(subQuestionIndex, 1);
			}
		} else {
			//проверка в 1 разделе что бы всегда была 1 карточка
			if (sectionIndex === 0 && newSections[sectionIndex].cards.length === 1) {
				return;
			}
			newSections[sectionIndex].cards.splice(index, 1);
		}

		//удаление раздела, если он в нем нет карточек
		if (newSections[sectionIndex].cards.length === 0 && sectionIndex !== 0) {
			newSections.splice(sectionIndex, 1);
		}

		setSections(newSections);
	};

	const handleDuplicateCard = (sectionIndex: number, index: number, cardType: string, subQuestionIndex?: number) => {
		const newSections = [...sections];
		let duplicatedCard;
		if (cardType === "subQuestion") {
			if (subQuestionIndex !== undefined) {
				duplicatedCard = JSON.parse(JSON.stringify(newSections[sectionIndex].cards[index].subQuestions[subQuestionIndex]));
				newSections[sectionIndex].cards[index].subQuestions.splice(index + 1, 0, duplicatedCard);
			}
		} else {
			duplicatedCard = JSON.parse(JSON.stringify(newSections[sectionIndex].cards[index]));
			newSections[sectionIndex].cards.splice(index + 1, 0, duplicatedCard);
		}
		setSections(newSections);
	};


	// Функция для добавления нового раздела
	const handleAddSection = () => {
		setSections([...sections, { title: '', cards: [{ selectedComponent: 'Input', question: '', isRequired: false, answer: "", addLogic: false, Logic: '', addImg: false, imageUrl: [], addChangeCardsLogic: false, changeCardsLogic: '', subQuestions: [] as SubQuestion[] }] }]);
		setActiveSectionIndex(sections.length - 1);
	};

	// Функция для добавления нового вопроса в раздел
	const handleAddQuestion = (sectionIndex: number) => {
		const newSections = [...sections];
		newSections[sectionIndex].cards.push({ selectedComponent: 'Input', question: '', isRequired: false, answer: "", addLogic: false, Logic: '', addImg: false, imageUrl: [], addChangeCardsLogic: false, changeCardsLogic: '', subQuestions: [] as SubQuestion[] });
		setSections(newSections);
	};

	// Функция для изменения названия раздела
	const handleSectionTitleChange = (sectionIndex: number, newTitle: string) => {
		const newSections = [...sections];
		newSections[sectionIndex].title = newTitle;
		setSections(newSections);
	};

	const handleColorChange = (color: string) => {
		setSelectedColor(color);
		setShowTooltip(false);
	};

	//обновления ответов в карточке
	const updateCardAnswers = (sectionIndex: number, cardIndex: number, answers: string[], cardType: string, subQuestionIndex?: number) => {
		const newSections = [...sections];
		if (cardType === "subQuestion") {
			if (subQuestionIndex !== undefined) {
				console.log(`Updating subQuestion answer at sectionIndex ${sectionIndex}, cardIndex ${cardIndex}, subQuestionIndex ${subQuestionIndex}`);
				newSections[sectionIndex].cards[cardIndex].subQuestions[subQuestionIndex].answer = answers;
			} else {
				console.log("subQuestionIndex undefined in updateCardAnswers");
			}
		} else {
			newSections[sectionIndex].cards[cardIndex].answer = answers;
		}
		setSections(newSections);
	};


	//переключения статуса обязательности карточки
	const handleSwitchChange = (sectionIndex: number, index: number, isRequired: boolean, cardType: string, subQuestionIndex?: number) => {
		const newSections = [...sections];
		if (cardType === "subQuestion") {
			if (subQuestionIndex !== undefined) {
				newSections[sectionIndex].cards[index].subQuestions[subQuestionIndex].isRequired = isRequired;
			} else {
				console.log("subQuestion underfind function handleSwitchChange")
			}
		} else {
			newSections[sectionIndex].cards[index].isRequired = isRequired;
		}
		setSections(newSections);
	};

	//отслеживания активной карточки
	const handleCardClick = (sectionIndex: number, index: number) => {
		console.log(sectionIndex, index);
		setActiveCardIndex(index);
	};

	//добавить логику в карточку
	const handleAddLogicClick = (sectionIndex: number, index: number, cardType: string, subQuestionIndex?: number) => {
		const newSections = [...sections];
		if (cardType === "subQuestion") {
			if (subQuestionIndex !== undefined) {
				newSections[sectionIndex].cards[index].subQuestions[subQuestionIndex].addLogic = !newSections[sectionIndex].cards[index].subQuestions[subQuestionIndex].addLogic;

				// Обнуляем switch обязательного поля
				if (newSections[sectionIndex].cards[index].subQuestions[subQuestionIndex].addLogic) {
					newSections[sectionIndex].cards[index].subQuestions[subQuestionIndex].isRequired = false;
				}
			} else {
				console.log("subQuestionIndex underfind function handleAddLogicClick")
			}
		} else {
			newSections[sectionIndex].cards[index].addLogic = !newSections[sectionIndex].cards[index].addLogic;

			// Обнуляем switch обязательного поля
			if (newSections[sectionIndex].cards[index].addLogic) {
				newSections[sectionIndex].cards[index].isRequired = false;
			}
		}

		setSections(newSections);
	};

	//обновить логику в карточке
	const updateCardLogic = (sectionIndex: number, index: number, logic: string, cardType: string, subQuestionIndex?: number) => {
		const newSections = [...sections];
		console.log(sectionIndex, index, subQuestionIndex, "subQuestion")
		if (cardType === "subQuestion") {
			if (subQuestionIndex !== undefined) {
				newSections[sectionIndex].cards[index].subQuestions[subQuestionIndex].Logic = logic;
			} else {
				console.log("subQuestionIndex underfind function updateCardLogic")
			}
		} else {
			newSections[sectionIndex].cards[index].Logic = logic;
		}
		setSections(newSections);
	};

	//отслеживаем какую авторизацию выбрал пользователь
	const handleAuthTypeChange = (event: { target: { checked: boolean | ((prevState: boolean) => boolean); }; }) => {
		setIsMandatoryAuth(event.target.checked);
	};

	const compressImage = (file: Blob, maxSize: number) => {
		return new Promise<Blob>((resolve, reject) => {
			const img = new Image();
			img.src = URL.createObjectURL(file);
			img.onload = () => {
				const canvas = document.createElement('canvas');
				const ctx = canvas.getContext('2d')!;
				let width = img.width;
				let height = img.height;

				if (width > height) {
					if (width > maxSize) {
						height *= maxSize / width;
						width = maxSize;
					}
				} else {
					if (height > maxSize) {
						width *= maxSize / height;
						height = maxSize;
					}
				}
				canvas.width = width;
				canvas.height = height;
				ctx.drawImage(img, 0, 0, width, height);

				canvas.toBlob(blob => {
					if (blob) {
						resolve(blob);
					} else {
						reject(new Error('Не удалось сжать изображение'));
					}
				}, file.type);
			};
			img.onerror = reject;
		});
	};

	const handleAddImage = (sectionIndex: number, index: number, cardType: string, subQuestionIndex?: number) => {
		const fileInput = document.createElement('input');
		fileInput.type = 'file';
		fileInput.accept = 'image/*';
		fileInput.onchange = async (event) => {
			const target = event.target as HTMLInputElement;
			if (target && target.files && target.files.length > 0) {
				const file = target.files[0];
				try {
					const compressedBlob = await compressImage(file, 500);
					const compressedFile = new File([compressedBlob], file.name, { type: file.type });
					const reader = new FileReader();
					reader.onloadend = () => {
						const newSections = [...sections];
						if (cardType === "subQuestion") {
							if (subQuestionIndex !== undefined) {
								const subQuestion = newSections[sectionIndex].cards[index].subQuestions[subQuestionIndex];
								if (!Array.isArray(subQuestion.imageUrl)) {
									subQuestion.imageUrl = [subQuestion.imageUrl]; // Преобразование в массив, если это еще не массив
								}
								subQuestion.imageUrl.push(reader.result as string); // Добавление нового изображения в массив
								subQuestion.addImg = true;
							} else {
								console.log("subQuestionIndex undefined in handleAddImage");
							}
						} else {
							console.log(sectionIndex, index);
							const card = newSections[sectionIndex].cards[index];
							if (!Array.isArray(card.imageUrl)) {
								card.imageUrl = [card.imageUrl]; // Преобразование в массив, если это еще не массив
							}
							card.imageUrl.push(reader.result as string); // Добавление нового изображения в массив
							card.addImg = true;
						}
						setSections(newSections);
					};
					reader.readAsDataURL(compressedFile);
				} catch (error) {
					console.error('Ошибка при сжатии изображения:', error);
				}
			}
		};
		fileInput.click();
	};

	const handleDeleteImage = (sectionIndex: number, index: number, cardType: string, imageIndex: number, subQuestionIndex?: number) => {
		const newSections = [...sections];
		if (cardType === "subQuestion" && subQuestionIndex !== undefined) {
			const subCard = newSections[sectionIndex].cards[index].subQuestions[subQuestionIndex];
			if (Array.isArray(subCard.imageUrl)) {
				subCard.imageUrl.splice(imageIndex, 1);
				setSections(newSections);
			}
		} else {
			const card = newSections[sectionIndex].cards[index];
			if (Array.isArray(card.imageUrl)) {
				card.imageUrl.splice(imageIndex, 1);
				setSections(newSections);
			}
		}
	};

	const handleСhangeCardsLogic = (sectionIndex: number, cardIndex: number, logic: string | string[]) => {
		const newSections = [...sections];
		newSections[sectionIndex].cards[cardIndex].changeCardsLogic = logic;
		setSections(newSections);
	};

	const handleAddAdditionalQuestions = (sectionIndex: number, cardIndex: number) => {
		console.log(`Adding sub-question to cardIndex: ${cardIndex}`);
		const newSections = [...sections];
		newSections[sectionIndex].cards[cardIndex].subQuestions.push({
			selectedComponent: 'Input',
			question: '',
			isRequired: false,
			answer: "",
			addLogic: false,
			Logic: '',
			addImg: false,
			imageUrl: [],
			addChangeCardsLogic: false,
			changeCardsLogic: '',
			subQuestions: [] as SubQuestion[],
		});
		console.log(`New sections state:`, newSections);
		setSections(newSections);
	};

	//отправка данных о карточках с redux
	const SendCards = async () => {
		try {
			const formData = {
				title: title,
				titleOverview: titleOverview,
				textForEndForm: textForEndForm,
				dateEndForm: dateEndForm,
				isMandatoryAuth: isMandatoryAuth,
				selectedColor: selectedColor,
				sections: sections
			};
			console.log(formData)
			const actionResult = await dispatch(sendCardAsync({ title, titleOverview, textForEndForm, dateEndForm, isMandatoryAuth, selectedColor, sections }));
			console.log(isMandatoryAuth)
			// const formId = actionResult.payload.formId;
			// navigate(`/form/${formId.formId}`, { state: { formId } });
		} catch (error) {
			console.log('Error get Id forms');
		}
		console.log(cards, "cards");
	};

	const handleAddChangeCardsLogic = (sectionIndex: number, index: number, cardType: string, subQuestionIndex?: number) => {
		const newSections = [...sections];
		if (cardType === "subQuestion") {
			if (subQuestionIndex !== undefined) {
				newSections[sectionIndex].cards[index].subQuestions[subQuestionIndex].addChangeCardsLogic = !newSections[sectionIndex].cards[index].subQuestions[subQuestionIndex].addChangeCardsLogic;
			} else {
				console.log("subQuestionIndex underfind function handleAddChangeCardsLogic")
			}
		} else {
			const currentCard = newSections[sectionIndex].cards[index];
			currentCard.addChangeCardsLogic = !currentCard.addChangeCardsLogic;
			// Если addChangeCardsLogic установлено в false, очищаем и удаляем все подкарточки
			if (!currentCard.addChangeCardsLogic) {
				currentCard.subQuestions = []; // Очищаем подкарточки 
			}
		}
		setSections(newSections);
	};

	return (
		<>
			<Box sx={{ flexGrow: 1 }}>
				<AppBar position="static" sx={{ backgroundColor: "white" }}>
					<Toolbar sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
						<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
								<DescriptionIcon fontSize='large' sx={{ color: '#00862b' }} />
								<Typography variant='h5' color="black">Новая форма</Typography>
							</Box>
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
								<Typography variant='body1' color="black">Анонимный <br /> опрос</Typography>
								<CustomSwitch onChange={handleAuthTypeChange} />
								<Typography variant='body1' color="black">Авторизация <br /> обязательная</Typography>
							</Box>
						</Box>
						<Box >
							<Typography sx={{ display: 'flex', alignItems: 'center' }} variant='body1' color="black">Дата окончания опроса:
								<TextField
									sx={{ ml: 1 }}
									type="date"
									InputLabelProps={{
										shrink: true,
									}}
									name='dateEndForm'
									value={dateEndForm}
									onChange={(event) => setDateEndForm(event.target.value)}
									color='success'
								/>
							</Typography>
						</Box>
						<div style={{ display: 'inline-block', cursor: 'pointer' }} onClick={() => setShowTooltip(!showTooltip)}>
							<div style={{
								width: '50px',
								height: '50px',
								borderRadius: '50%',
								backgroundColor: selectedColor,
								border: "1px solid rgba(0, 0, 0, 0.26)"
							}}></div>
							{showTooltip && (
								<div style={{ position: 'absolute', zIndex: 2, backgroundColor: 'white', border: '1px solid #ccc', padding: '10px', marginTop: '10px' }}>
									<div style={{ display: 'flex', justifyContent: 'space-around' }}>
										<div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '1px solid #ccc', backgroundColor: 'rgb(255 0 0 / 34%)', cursor: 'pointer' }} onClick={() => handleColorChange('rgb(255 0 0 / 34%)')}></div>
										<div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '1px solid #ccc', backgroundColor: '#9fe5ae87', cursor: 'pointer' }} onClick={() => handleColorChange('#9fe5ae87')}></div>
										<div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '1px solid #ccc', backgroundColor: '#0072ff47', cursor: 'pointer' }} onClick={() => handleColorChange('#0072ff47')}></div>
										<div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '1px solid #ccc', backgroundColor: '#ffa50040', cursor: 'pointer' }} onClick={() => handleColorChange('#ffa50040')}></div>
										<div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '1px solid #ccc', backgroundColor: '#0000003d', cursor: 'pointer' }} onClick={() => handleColorChange('#0000003d')}></div>
										<div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '1px solid #ccc', backgroundColor: '#fff', cursor: 'pointer' }} onClick={() => handleColorChange('#fff')}></div>
									</div>
								</div>
							)}
						</div>
						<Button variant="contained" onClick={SendCards} color="success">Отправить</Button>
					</Toolbar>
					{/* <Toolbar sx={{ justifyContent: 'center', backgroundColor: "white" }}>
						<Tabs
							value={value}
							onChange={handleChange}
							aria-label="secondary tabs example"
						>
							<CustomTab label="Вопросы" value="Questions" />
							<CustomTab label="Ответы" value="Answers" />
						</Tabs>
					</Toolbar> */}
				</AppBar>
			</Box>
			<FormProvider {...methods}>
				<form style={{ marginTop: 50 }}>
					<Grid container spacing={3} className='FormCenter'>
						<Paper className="header-paper" elevation={2} sx={{ p: 3, borderTop: "8px solid #00862b", maxWidth: "400px" }}>
							<TextField
								variant="standard"
								placeholder="Название опроса"
								sx={{ mb: 3 }}
								name='title'
								value={title}
								onChange={(event) => setTitle(event.target.value)}
								fullWidth
							/>
							<Textarea
								sx={{ width: "-webkit-fill-available", marginTop: "1rem" }}
								aria-label="minimum height"
								placeholder='Описание опроса'
								name='titleOverview'
								value={titleOverview}
								onChange={(event) => setTitleOverview(event.target.value)}
								minRows={5}
							/>
							<Textarea
								sx={{ width: "-webkit-fill-available", marginTop: "1rem" }}
								aria-label="minimum height"
								placeholder='Текст после прохождения опроса'
								name='textForEndForm'
								value={textForEndForm}
								onChange={(event) => setTextForEndForm(event.target.value)}
								minRows={5}
							/>
						</Paper>
						{sections.map((section, sectionIndex) => (
							<Box key={sectionIndex} sx={{ mb: 3, mt: 5 }}>
								<Paper className="header-paper" elevation={2} sx={{ p: 3, borderTop: "8px solid #00862b" }}>
									<TextField
										variant="standard"
										placeholder="Название раздела"
										name="sectionTitle"
										value={section.title}
										onChange={(event) => handleSectionTitleChange(sectionIndex, event.target.value)}
										sx={{ mb: 3 }}
										fullWidth
									/>
								</Paper>
								<Grid container spacing={3} className='FormCenter'>
									{section.cards.map((card, index) => (
										<Grid item xs={12} sm={8} md={6} className='body-card' onClick={() => handleCardClick(sectionIndex, index)} >
											<Box sx={{ mb: 3 }}>
												<Paper elevation={2} sx={{
													p: 3,
													paddingTop: 0,
													display: "flex",
													flexDirection: "column",
													alignItems: "center",
													justifyContent: "flex-start",
													borderLeft: activeCardIndex === index ? "8px solid #00862b" : "none",
													// backgroundImage: `url(${backgroundImageUrl})`,
													// backgroundSize: 'cover',
													// backgroundPosition: 'center',
													// backgroundRepeat: 'no-repeat'
												}}>
													<Box sx={{ display: 'flex', flexDirection: "row", width: "-webkit-fill-available", gap: 1, mt: 3 }}>
														<TextField
															variant="standard"
															placeholder="Напишите вопрос"
															name="title"
															value={card.question}
															onChange={(event) => handleQuestionChange(index, event.target.value, sectionIndex, 'card')}
															sx={{ mb: 3 }}
															fullWidth
														/>
														<IconButton aria-label="addImage" size='small' onClick={() => handleAddImage(sectionIndex, index, 'card')}>
															<ImageIcon />
														</IconButton>
														<FormControl fullWidth>
															<InputLabel id="demo-simple-select-label">Тип ответа</InputLabel>
															<Select
																labelId="demo-simple-select-label"
																id="demo-simple-select"
																value={card.selectedComponent}
																label="Тип ответа"
																onChange={(event) => handleSelectChange(event, index, sectionIndex, "card")}
																color='success'
															>
																<MenuItem value="Input">
																	<ShortTextIcon
																		sx={{
																			color: "#6b6b6b",
																			marginRight: "5px",
																		}}
																	/>
																	Короткий текст
																</MenuItem>
																<MenuItem value="Textarea">
																	<SubjectIcon
																		sx={{
																			color: "#6b6b6b",
																			marginRight: "5px",
																		}}
																	/>
																	Длинный текст
																</MenuItem>
																<MenuItem value="Radio">
																	<RadioButtonCheckedIcon
																		sx={{
																			color: "#6b6b6b",
																			marginRight: "5px",
																		}}
																	/>
																	Один из списка
																</MenuItem>
																<MenuItem value="Checkbox">
																	<CheckBoxOutlinedIcon
																		sx={{
																			color: "#6b6b6b",
																			marginRight: "5px",
																		}}
																	/>
																	Множество из списка
																</MenuItem>
																<MenuItem value="Slider">
																	<LinearScaleIcon
																		sx={{
																			color: "#6b6b6b",
																			marginRight: "5px",
																		}}
																	/>
																	Шкала
																</MenuItem>
																<MenuItem value="Data">
																	<EventIcon
																		sx={{
																			color: "#6b6b6b",
																			marginRight: "5px",
																		}}
																	/>
																	Дата
																</MenuItem>
															</Select>
														</FormControl>
													</Box>
													{card.addImg && card.imageUrl.map((image: string, imageIndex: number) => {
														console.log(imageIndex)
														return (
															<div key={imageIndex}>
																<img src={image} style={{ maxWidth: "-webkit-fill-available", marginTop: 5 }} />
																<IconButton aria-label="removeImage" size='small' onClick={() => handleDeleteImage(sectionIndex, index, 'card', imageIndex)}>
																	<ClearIcon />
																</IconButton>
															</div>
														)
													})}
													{card.selectedComponent === 'Input' && <InputCopmponent disabled={true} />}
													{card.selectedComponent === 'Textarea' && <TextareaComponent disabled={true} />}
													{card.selectedComponent === 'Radio' && <RadioComponent sectionIndex={sectionIndex} cardIndex={index} updateCardAnswers={updateCardAnswers} disabled={true} cardType='card' />}
													{card.selectedComponent === 'Checkbox' && <CheckboxesComponent sectionIndex={sectionIndex} cardIndex={index} updateCardAnswers={updateCardAnswers} addLogic={card.addLogic} disabled={true} updateCardLogic={updateCardLogic} cardType='card' addChangeCardsLogic={card.addChangeCardsLogic}  onChangeCardsLogic={(logic) => handleСhangeCardsLogic(sectionIndex, index, logic)}/>}
													{card.selectedComponent === 'Slider' && <SliderComponent sectionIndex={sectionIndex} cardIndex={index} disabled={true} onSliderValuesChange={(values) => updateCardAnswers(sectionIndex, index, [values], 'card')} addChangeCardsLogic={card.addChangeCardsLogic}  onChangeCardsLogic={(logic) => handleСhangeCardsLogic(sectionIndex, index, logic)} />}
													{card.selectedComponent === 'Data' && <DataComponent disabled={true} />}
													<Grid item xs={12}>
														<Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', borderTopColor: "black", alignItems: 'center' }}>
															{card.selectedComponent === 'Checkbox' && card.addLogic && (
																<Typography variant="body1">
																	Вопрос будет обязательным*
																</Typography>
															)}
															{((card.selectedComponent !== 'Checkbox') || (!card.addLogic)) && (
																<FormControlLabel control={<Switch color='success' onChange={(event) => handleSwitchChange(sectionIndex, index, event.target.checked, 'card')} checked={card.isRequired} />} style={{ whiteSpace: 'nowrap' }} label="Обязательный вопрос*" />
															)}
															<Tooltip title="Удалить карточку">
																<IconButton aria-label="delete" color="warning" size="small" onClick={() => handleDeleteCard(sectionIndex, index, 'card')}>
																	<DeleteIcon style={{ color: "red" }} />
																</IconButton>
															</Tooltip>
															<Tooltip title="Дублировать карточку">
																<IconButton aria-label="duplicate" color="success" size="small" onClick={() => handleDuplicateCard(sectionIndex, index, 'card')}>
																	<FileCopyIcon />
																</IconButton>
															</Tooltip>
															{(card.selectedComponent === 'Checkbox' && !card.addChangeCardsLogic) && (
																<Tooltip title="Добавить условия">
																	<IconButton aria-label="addLogic" size='small' onClick={() => handleAddLogicClick(sectionIndex, index, 'card')}>
																		<ConstructionIcon />
																	</IconButton>
																</Tooltip>
															)}
															{(card.selectedComponent === 'Checkbox' || card.selectedComponent === 'Slider') && (
																<Tooltip title="Добавить логику">
																	<IconButton aria-label="addChangeCardsLogic" size='small' onClick={() => handleAddChangeCardsLogic(sectionIndex, index, 'card')}>
																		<SettingsIcon />
																	</IconButton>
																</Tooltip>
															)}
															{card.addChangeCardsLogic && (
																<Tooltip title="Добавить подвопрос">
																	<IconButton aria-label="addAdditionalQuestions" size='small' onClick={() => handleAddAdditionalQuestions(sectionIndex, index)} >
																		<AddCircleIcon color='success' />
																	</IconButton>
																</Tooltip>
															)}
														</Box>
													</Grid>
												</Paper>
												<>
													<Grid sx={{ display: 'flex', gap: 1, mt: 1 }}>
														{card.subQuestions.map((subQuestion, subQuestionIndex) => {
															return (
																<Grid item xs={12} sm={8} md={6} className='body-subquestion' onClick={() => handleCardClick(sectionIndex, subQuestionIndex)}>
																	<Paper elevation={2} sx={{
																		p: 3,
																		paddingTop: 0,
																		display: "flex",
																		flexDirection: "column",
																		alignItems: "center",
																		justifyContent: "flex-start",
																		borderLeft: activeCardIndex === index ? "8px solid #00862b" : "none",
																	}}>
																		<Box sx={{ display: 'flex', flexDirection: "row", width: "-webkit-fill-available", gap: 1, mt: 3 }}>
																			<TextField
																				variant="standard"
																				placeholder="Напишите вопрос"
																				name="title"
																				value={subQuestion.question}
																				onChange={(event) => handleQuestionChange(index, event.target.value, sectionIndex, "subQuestion", subQuestionIndex)}
																				sx={{ mb: 3 }}
																				fullWidth
																			/>
																			<IconButton aria-label="addImage" size='small' onClick={() => handleAddImage(sectionIndex, index, "subQuestion", subQuestionIndex)}>
																				<ImageIcon />
																			</IconButton>
																			<FormControl fullWidth>
																				<InputLabel id="demo-simple-select-label">Тип ответа</InputLabel>
																				<Select
																					labelId="demo-simple-select-label"
																					id="demo-simple-select"
																					value={subQuestion.selectedComponent}
																					label="Тип ответа"
																					onChange={(event) => handleSelectChange(event, index, sectionIndex, "subQuestion", subQuestionIndex)}
																					color='success'
																				>
																					<MenuItem value="Input">
																						<ShortTextIcon
																							sx={{
																								color: "#6b6b6b",
																								marginRight: "5px",
																							}}
																						/>
																						Короткий текст
																					</MenuItem>
																					<MenuItem value="Textarea">
																						<SubjectIcon
																							sx={{
																								color: "#6b6b6b",
																								marginRight: "5px",
																							}}
																						/>
																						Длинный текст
																					</MenuItem>
																					<MenuItem value="Radio">
																						<RadioButtonCheckedIcon
																							sx={{
																								color: "#6b6b6b",
																								marginRight: "5px",
																							}}
																						/>
																						Один из списка
																					</MenuItem>
																					<MenuItem value="Checkbox">
																						<CheckBoxOutlinedIcon
																							sx={{
																								color: "#6b6b6b",
																								marginRight: "5px",
																							}}
																						/>
																						Множество из списка
																					</MenuItem>
																					<MenuItem value="Slider">
																						<LinearScaleIcon
																							sx={{
																								color: "#6b6b6b",
																								marginRight: "5px",
																							}}
																						/>
																						Шкала
																					</MenuItem>
																					<MenuItem value="Data">
																						<EventIcon
																							sx={{
																								color: "#6b6b6b",
																								marginRight: "5px",
																							}}
																						/>
																						Дата
																					</MenuItem>
																				</Select>
																			</FormControl>
																		</Box>
																		{subQuestion.addImg && subQuestion.imageUrl.map((image: string, imageIndex: number) => {
																			console.log(imageIndex)
																			return (
																				<div key={imageIndex}>
																					<img src={image} style={{ maxWidth: "50%", marginTop: 5 }} />
																					<IconButton aria-label="removeImage" size='small' onClick={() => handleDeleteImage(sectionIndex, index, 'subQuestion', imageIndex, subQuestionIndex)}>
																						<ClearIcon />
																					</IconButton>
																				</div>
																			)
																		})}
																		{subQuestion.selectedComponent === 'Input' && <InputCopmponent disabled={true} />}
																		{subQuestion.selectedComponent === 'Textarea' && <TextareaComponent disabled={true} />}
																		{subQuestion.selectedComponent === 'Radio' && <RadioComponent sectionIndex={sectionIndex} cardIndex={index} updateCardAnswers={updateCardAnswers} disabled={true} cardType='subQuestion' subQuestionIndex={subQuestionIndex} />}
																		{subQuestion.selectedComponent === 'Checkbox' && <CheckboxesComponent sectionIndex={sectionIndex} cardIndex={index} updateCardAnswers={updateCardAnswers} addLogic={subQuestion.addLogic} disabled={true} updateCardLogic={updateCardLogic} cardType='subQuestion' addChangeCardsLogic={subQuestion.addChangeCardsLogic} subQuestionIndex={subQuestionIndex} />}
																		{subQuestion.selectedComponent === 'Slider' && <SliderComponent sectionIndex={sectionIndex} cardIndex={index} disabled={true} onSliderValuesChange={(values) => updateCardAnswers(sectionIndex, index, [values], "subQuestion", subQuestionIndex)} addChangeCardsLogic={subQuestion.addChangeCardsLogic} />}
																		{subQuestion.selectedComponent === 'Data' && <DataComponent disabled={true} />}
																		<Grid item xs={12}>
																			<Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', borderTopColor: "black", alignItems: 'center' }}>
																				<Tooltip title="Удалить карточку">
																					<IconButton aria-label="delete" color="warning" size="small" onClick={() => handleDeleteCard(sectionIndex, index, "subQuestion", subQuestionIndex)}>
																						<DeleteIcon style={{ color: "red" }} />
																					</IconButton>
																				</Tooltip>
																				<Tooltip title="Дублировать карточку">
																					<IconButton aria-label="duplicate" color="success" size="small" onClick={() => handleDuplicateCard(sectionIndex, index, "subQuestion", subQuestionIndex)}>
																						<FileCopyIcon />
																					</IconButton>
																				</Tooltip>
																			</Box>
																		</Grid>
																	</Paper>
																</Grid>
															)
														})}
													</Grid>
												</>
											</Box>
										</Grid>
									))}
								</Grid>
								<div>
									<Fab
										size="medium"
										color="success"
										aria-label="add"
										onClick={() => handleAddQuestion(sectionIndex)}
									>
										<AddIcon />
									</Fab>
								</div>
							</Box>
						))}
						<div>
							<Fab
								size="medium"
								color="success"
								aria-label="add"
								onClick={handleAddSection}
							>
								<SplitscreenIcon />
							</Fab>
						</div>
					</Grid>
				</form>
			</FormProvider>
		</>
	);
}

export default CreateFormPage;
