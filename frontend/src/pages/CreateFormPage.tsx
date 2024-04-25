/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from 'react';
import { AppBar, Box, Button, Fab, FormControl, FormControlLabel, Grid, IconButton, InputLabel, MenuItem, Paper, Switch, TextField, Toolbar, Tooltip, Typography } from '@mui/material';
import '../styles/main.css';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
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
import { Card } from '../types/types';
import { sendCardAsync } from '../store/action/actionSendForm';
import { AppDispatch } from '../store/reducers/reducerRoot';
import { useNavigate } from 'react-router-dom';
import ConstructionIcon from '@mui/icons-material/Construction';
import { FormProvider, useForm } from 'react-hook-form';
import { CustomSwitch } from '../components/CustomSwitch';
import ImageIcon from '@mui/icons-material/Image';

const CreateFormPage: React.FC = () => {
	const [cards, setCards] = useState<Card[]>([{ selectedComponent: 'Input', question: '', isRequired: false, answer: "", addLogic: false, Logic: '', addImg: false, imageUrl: '' }]);
	const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null);
	// const [value, setValue] = React.useState('Questions');
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();
	const [title, setTitle] = useState('');
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
	const handleQuestionChange = (index: number, newQuestion: string) => {
		const newCards = [...cards];
		newCards[index].question = newQuestion;
		setCards(newCards);
	};

	//изменения типа компонента ответа в карточке
	const handleSelectChange = (event: SelectChangeEvent<string>, index: number) => {
		const newCards = [...cards];
		newCards[index].selectedComponent = event.target.value;
		setCards(newCards);
	};

	//удаление карточки 
	const handleDeleteCard = (index: number) => {
		const newCards = cards.filter((_, cardIndex) => cardIndex !== index); // Убираем карточку с поля
		setCards(newCards); // Обновляем сосояние 
	};

	const handleColorChange = (color: string) => {
		setSelectedColor(color);
		setShowTooltip(false);
	};

	//дублирование карточки
	const handleDuplicateCard = (index: number) => {
		const newCards = [...cards]; // Создаем копию массива
		const duplicatedCard = { ...newCards[index] }; // Создаем копию карточки
		newCards.splice(index + 1, 0, duplicatedCard); // Вставляем дублированную карточку сразу после текущей
		setCards(newCards); // Обновляем состояние с новым массивом
	};

	//обновления ответов в карточке
	const updateCardAnswers = (index: number, answers: string[]) => {
		const newCards = [...cards];
		newCards[index].answer = answers;
		setCards(newCards);
	};

	//переключения статуса обязательности карточки
	const handleSwitchChange = (index: number, isRequired: boolean) => {
		const newCards = [...cards];
		newCards[index].isRequired = isRequired;
		setCards(newCards);
	};

	//перетаскивания карточек для их переупорядочивания
	const handleDragEnd = (result: any) => {
		if (!result.destination) return;
		const items = [...cards];
		const [reorderedItem] = items.splice(result.source.index, 1);
		items.splice(result.destination.index, 0, reorderedItem);
		setCards(items);
	};

	//отслеживания активной карточки
	const handleCardClick = (index: number) => {
		setActiveCardIndex(index);
	};

	//добавить логику в карточку
	const handleAddLogicClick = (index: number) => {
		const newCards = [...cards];
		newCards[index].addLogic = !newCards[index].addLogic;

		//обнуляем switch обязательного поля
		if (newCards[index].addLogic) {
			newCards[index].isRequired = false;
		}

		setCards(newCards);
	};

	//обновить логику в карточке
	const updateCardLogic = (index: number, logic: string) => {
		const newCards = [...cards];
		newCards[index].Logic = logic;
		setCards(newCards);
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

	const handleAddImage = (index: number) => {
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
						const newCards = [...cards];
						newCards[index].imageUrl = reader.result as string;
						newCards[index].addImg = true;
						setCards(newCards);
					};
					reader.readAsDataURL(compressedFile);
				} catch (error) {
					console.error('Ошибка при сжатии изображения:', error);
				}
			}
		};
		fileInput.click();
	};

	//отправка данных о карточках с redux
	const SendCards = async () => {
		try {
			const actionResult = await dispatch(sendCardAsync({ cards, title, isMandatoryAuth, selectedColor }));
			console.log(isMandatoryAuth)
			const formId = actionResult.payload.formId;
			navigate(`/form/${formId.formId}`, { state: { formId } });
		} catch (error) {
			console.log('Error get Id forms');
		}
		console.log(cards, "cards");
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
								<Typography variant='body2' color="black">Анонимный <br /> опрос</Typography>
								<CustomSwitch onChange={handleAuthTypeChange} />
								<Typography variant='body1' color="black">Авторизация <br /> обязательная</Typography>
							</Box>
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
										<div style={{ width: '20px', height: '20px', borderRadius: '50%',  border: '1px solid #ccc', backgroundColor: 'rgb(255 0 0 / 34%)', cursor: 'pointer' }} onClick={() => handleColorChange('rgb(255 0 0 / 34%)')}></div>
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
				<form style={{ marginTop: 15, }}>
					<Grid container spacing={3} className='FormCenter'  >
						<Grid item xs={12} sm={8} md={6}>
							<Box sx={{ mb: 3 }}>
								<Paper className="header-paper" elevation={2} sx={{ p: 3, borderTop: "8px solid #00862b" }}>
									<TextField
										variant="standard"
										placeholder="Название опроса"
										name="title"
										value={title}
										onChange={(event) => setTitle(event.target.value)}
										sx={{ mb: 3 }}
										fullWidth
									/>
								</Paper>
							</Box>
						</Grid>
						<DragDropContext onDragEnd={handleDragEnd}>
							<Droppable droppableId="droppable">
								{(provided) => (
									<Grid container spacing={3} className='FormCenter' ref={provided.innerRef} {...provided.droppableProps} >
										{cards.map((card, index) => (
											<Draggable key={index} draggableId={index.toString()} index={index}>
												{(provided) => (
													<Grid item xs={12} sm={8} md={6} className='body-card' onClick={() => handleCardClick(index)} ref={provided.innerRef} {...provided.draggableProps}>
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
																<div {...provided.dragHandleProps} style={{ display: 'flex', alignItems: 'center', cursor: 'move' }}>
																	<DragIndicatorIcon style={{ transform: "rotate(90deg)", marginBottom: '10px' }} />
																</div>
																<Box sx={{ display: 'flex', flexDirection: "row", width: "-webkit-fill-available", gap: 1 }}>
																	<TextField
																		variant="standard"
																		placeholder="Напишите вопрос"
																		name="title"
																		value={card.question}
																		onChange={(event) => handleQuestionChange(index, event.target.value)}
																		sx={{ mb: 3 }}
																		fullWidth
																	/>
																	<IconButton aria-label="addImage" size='small' onClick={() => handleAddImage(index)}>
																		<ImageIcon />
																	</IconButton>
																	<FormControl fullWidth>
																		<InputLabel id="demo-simple-select-label">Тип ответа</InputLabel>
																		<Select
																			labelId="demo-simple-select-label"
																			id="demo-simple-select"
																			value={card.selectedComponent}
																			label="Тип ответа"
																			onChange={(event) => handleSelectChange(event, index)}
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
																<img src={card.imageUrl} style={{ maxWidth: "-webkit-fill-available", marginTop: 5 }}></img>
																{card.selectedComponent === 'Input' && <InputCopmponent disabled={true} />}
																{card.selectedComponent === 'Textarea' && <TextareaComponent disabled={true} />}
																{card.selectedComponent === 'Radio' && <RadioComponent cardIndex={index} updateCardAnswers={updateCardAnswers} disabled={true} />}
																{card.selectedComponent === 'Checkbox' && <CheckboxesComponent cardIndex={index} updateCardAnswers={updateCardAnswers} addLogic={card.addLogic} disabled={true} updateCardLogic={updateCardLogic} />}
																{card.selectedComponent === 'Slider' && <SliderComponent disabled={true} onSliderValuesChange={(values) => updateCardAnswers(index, [values])} />}
																{card.selectedComponent === 'Data' && <DataComponent disabled={true} />}
																<Grid item xs={12}>
																	<Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', borderTopColor: "black", alignItems: 'center' }}>
																		{card.selectedComponent === 'Checkbox' && card.addLogic && (
																			<Typography variant="body1">
																				Вопрос будет обязательным*
																			</Typography>
																		)}
																		{((card.selectedComponent !== 'Checkbox') || (!card.addLogic)) && (
																			<FormControlLabel control={<Switch color='success' onChange={(event) => handleSwitchChange(index, event.target.checked)} checked={card.isRequired} />} style={{ whiteSpace: 'nowrap' }} label="Обязательный вопрос*" />
																		)}
																		<Tooltip title="Удалить карточку">
																			<IconButton aria-label="delete" color="warning" size="small" onClick={() => handleDeleteCard(index)}>
																				<DeleteIcon style={{ color: "red" }} />
																			</IconButton>
																		</Tooltip>
																		<Tooltip title="Дублировать карточку">
																			<IconButton aria-label="duplicate" color="success" size="small" onClick={() => handleDuplicateCard(index)}>
																				<FileCopyIcon />
																			</IconButton>
																		</Tooltip>
																		{(card.selectedComponent === 'Checkbox') && (
																			<Tooltip title="Добавить условия">
																				<IconButton aria-label="addLogic" size='small' onClick={() => handleAddLogicClick(index)}>
																					<ConstructionIcon />
																				</IconButton>
																			</Tooltip>
																		)}
																	</Box>
																</Grid>
															</Paper>
														</Box>
													</Grid>
												)}
											</Draggable>
										))}
										{provided.placeholder}
									</Grid>
								)}
							</Droppable>
						</DragDropContext>
						<div>
							<Fab
								size="medium"
								color="success"
								aria-label="add"
								onClick={() => setCards([...cards, { selectedComponent: 'Input', question: '', isRequired: false, answer: "", addLogic: false, Logic: '', addImg: false, imageUrl: '' }])}
							>
								<AddIcon />
							</Fab>
						</div>
					</Grid>
				</form >
			</FormProvider>
		</>
	);
}

export default CreateFormPage;
