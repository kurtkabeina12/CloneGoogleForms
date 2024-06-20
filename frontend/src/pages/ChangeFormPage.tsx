import { AppBar, Box, Card, Fab, Fade, FormControl, FormControlLabel, Grid, IconButton, InputLabel, MenuItem, Paper, Select, Switch, Tabs, TextField, Toolbar, Tooltip, Typography } from '@mui/material';
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
import { sendFormData } from '../store/action/actionSendPassedForm';
import { FormData, Section, SubQuestion } from '../types/types';
import '../styles/main.css';
import { styled } from '@mui/system';
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import { CustomSwitch } from '../components/CustomSwitch';
import DescriptionIcon from '@mui/icons-material/Description';
import { CustomTab } from '../components/CustomTab';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import SubjectIcon from '@mui/icons-material/Subject';
import ShortTextIcon from '@mui/icons-material/ShortText';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import LinearScaleIcon from '@mui/icons-material/LinearScale';
import EventIcon from '@mui/icons-material/Event';
import ImageIcon from '@mui/icons-material/Image';
import ConstructionIcon from '@mui/icons-material/Construction';
import SplitscreenIcon from '@mui/icons-material/Splitscreen';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ClearIcon from '@mui/icons-material/Clear';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { TransitionProps } from '@mui/material/transitions';
import SettingsIcon from '@mui/icons-material/Settings';

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

export default function FormPage() {
	const { formId } = useParams();
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();
	const [currentSection, setCurrentSection] = useState(0);
	const methods = useForm({
		mode: 'all',
	});
	const [formData, setFormData] = useState<FormData | null>(null);
	const [selectedSubQuestionIndexForSlider, setSelectedSubQuestionIndexForSlider] = useState<number | null>(null);
	const [selectedSubQuestionIndexForCheckbox, setSelectedSubQuestionIndexForCheckbox] = useState<number | null>(null);
	const [valueSliderNow, setValueSliderNow] = useState<number | null>(null)
	const [valueSliderForSubQuestion, setValueSliderForSubQuestion] = useState<number | null>(null)
	const [checkboxChooseNow, setChecboxChooseNow] = useState<number | null>(null)
	const [checkboxChooseForSubQuestion, setCheckboxChooseForSubQuestion] = useState<number | null>(null)
	const [dateForEndForm, setDateForEndForm] = useState<string | null>(null);
	const [title, setTitle] = useState('');
	const [titleOverview, setTitleOverview] = useState('');
	const [textForEndForm, setTextForEndForm] = useState('');
	const [dateEndForm, setDateEndForm] = useState('');
	const [isMandatoryAuth, setIsMandatoryAuth] = useState(false);
	const [selectedColor, setSelectedColor] = useState('#9fe5ae87');
	const [value, setValue] = React.useState('Questions');
	const [showTooltip, setShowTooltip] = useState(false);
	const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null);
	const [sections, setSections] = useState<Section[]>([{ title: '', cards: [{ selectedComponent: 'Input', question: '', isRequired: false, answer: "", addLogic: false, Logic: '', addImg: false, imageUrl: [], addChangeCardsLogic: false, changeCardsLogic: '', subQuestions: [] as SubQuestion[], }] }]);
	const [activeSectionIndex, setActiveSectionIndex] = useState<number | null>(null);
	const [showAlertDialog, setShowAlertDialog] = useState(false);
	const [formLink, setFormLink] = useState('');
	const [stateSnackbar, setStateSnackbar] = React.useState<{
		open: boolean;
		vertical: 'bottom';
		horizontal: 'right';
		Transition: React.ComponentType<
			TransitionProps & {
				children: React.ReactElement<any, any>;
			}
		>;
	}>({
		open: false,
		Transition: Fade,
		vertical: 'bottom',
		horizontal: 'right',
	});
	useEffect(() => {
		const fetchFormData = async () => {
			try {
				const actionResult = await dispatch(fetchGetForm({ formId: formId ?? '' }));
				const formData = unwrapResult(actionResult);
				console.log(formData, 'данные с сервера');
				setDateForEndForm(formData?.formEndDate);
				setFormData(formData);
				setTitle(formData?.formTitle);
				setTitleOverview(formData?.formOverview);
				setTextForEndForm(formData?.formEndText);
				setDateEndForm(formData?.formEndDate);
				setIsMandatoryAuth(formData?.isMandatoryAuth)
				const selectedColor = formData.selectedColor
				document.body.style.backgroundColor = selectedColor;
			} catch (error) {
				console.error('Failed to fetch form:', error);
			}
		};

		fetchFormData();
	}, [dispatch, formId]);

	//изменения выбора элемента для карточки
	const handleChange = (event: React.SyntheticEvent, newValue: string) => {
		setValue(newValue);
	};


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

	const handleOnDragEnd = (result: any) => {
		if (!result.destination) return; // Ensure there's a valid drop target

		const items = Array.from(sections);
		const [reorderedSection] = items.splice(result.source.sectionIndex, 1);

		const draggedCard = reorderedSection.cards.splice(result.source.index, 1)[0];

		reorderedSection.cards.splice(result.destination.index, 0, draggedCard);

		items.splice(result.destination.sectionIndex, 0, reorderedSection);

		setSections(items);
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
	// const handleSelectChange = (
	// 	event: SelectChangeEvent<string>,
	// 	index: number,
	// 	sectionIndex: number,
	// 	cardType: string,
	// 	subQuestionIndex?: number,
	// ) => {
	// 	const newSections = [...sections];
	// 	if (cardType === "subQuestion") {
	// 		if (subQuestionIndex !== undefined) {
	// 			newSections[sectionIndex].cards[index].subQuestions[subQuestionIndex].selectedComponent = event.target.value;
	// 		} else {
	// 			console.log("subQuestionIndex underfind function handleSelectChange")
	// 		}
	// 	} else {
	// 		newSections[sectionIndex].cards[index].selectedComponent = event.target.value;
	// 	}
	// 	setSections(newSections);
	// };

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
		console.log(sectionIndex, newTitle);
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


	const handleCopyFormLink = async () => {
		try {
			await navigator.clipboard.writeText(formLink);
			console.log('Текст успешно скопирован в буфер обмена!');
		} catch (err) {
			console.error('Ошибка:', err);
		}
	};

	//Добавление логики со сменой карточек
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

	//функция для закрытия Модального окна при клике за модальным окном
	const handleClickOutside = (event: any) => {
		if (event.target.id === 'dialog-background') {
			setShowAlertDialog(false);
		}
	};

	//функция закрытия уведомления
	const handleCloseScnackbar = () => {
		setStateSnackbar({
			...stateSnackbar,
			open: false,
		});
	};

	const onSubmit = async (data: any) => {
		console.log(data, 'данные для отправки на сервер')
		try {
			const rezultSendData = await dispatch(sendFormData({ formData: data, formId: formId ?? '' }));
			console.log(rezultSendData);
			navigate(`/stub/${formId}`, { state: { formId: formId } });
			// navigate(`/form/${formId.formId}`, { state: { formId } });
		} catch (error) {
			console.error('Failed to send form data:', error);
		}
	};

	return (
		<>
			<Box sx={{ flexGrow: 1 }}>
				<AppBar position="static" sx={{ backgroundColor: "white" }}>
					<Toolbar sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
						<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
								<DescriptionIcon fontSize='large' sx={{ color: '#00862b' }} />
								<Typography variant='h5' color="black">Изменяем форму</Typography>
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
					</Toolbar>
					<Toolbar sx={{ justifyContent: 'center', backgroundColor: "white" }}>
						<Tabs
							value={value}
							onChange={handleChange}
							aria-label="secondary tabs example"
						>
							<CustomTab label="Вопросы" value="Questions" />
							<CustomTab label="Ответы" value="Answers" />
						</Tabs>
					</Toolbar>
				</AppBar>
			</Box>
			<FormProvider {...methods}>
				<form onSubmit={methods.handleSubmit(onSubmit)} style={{ marginTop: 50 }} >
					<Grid container spacing={3} className='FormCenter' >
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
						{formData ? (
							<>
								<Box sx={{ marginTop: 1 }}>
									<Paper elevation={2} sx={{ p: 3, paddingTop: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start" }}>
										<Box sx={{ display: 'flex', flexDirection: "row", gap: 1, textAlign: 'center' }}>
											<Typography variant='h6' gutterBottom> {formData.sections[currentSection].title} </Typography>
										</Box>
									</Paper>
									{formData.sections.map((section, sectionIndex) => (
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
												<Grid container spacing={3} className='FormCenter'>
										
												</Grid>
											</Paper>
										</Box>
									))}
									{formData.sections[currentSection].cards.map((card, index) => {
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
																<img key={index} src={imgUrl} style={{ maxWidth: "-webkit-fill-available", marginTop: 5 }} />
															))}
														</>
													)}
													{card.selectedComponent === 'Input' && <InputCopmponent idQuestion={card.idQuestion} disabled={true} quest={card.question} required={card.isRequired} cardFormPageType={'card'} />}
													{card.selectedComponent === 'Textarea' && <TextareaComponent idQuestion={card.idQuestion} disabled={false} quest={card.question} required={card.isRequired} cardFormPageType={'card'} />}
													{card.selectedComponent === 'Radio' && <RadioComponent idQuestion={card.idQuestion} disabled={false} answers={card.answer} quest={card.question} required={card.isRequired} cardFormPageType={'card'} />}
													{card.selectedComponent === 'Checkbox' && <CheckboxesComponent idQuestion={card.idQuestion} disabled={false} answers={card.answer} quest={card.question} required={card.isRequired} addLogic={card.addLogic} GetLogic={card.Logic} nowCheckboxChoose={handleCheckboxChooseChange} changeCardsLogic={card.changeCardsLogic} cardFormPageType={'card'} />}
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
																		<img src={Array.isArray(subQuestion.imageUrl) ? subQuestion.imageUrl[0] : subQuestion.imageUrl} style={{ maxWidth: "-webkit-fill-available", marginTop: 5 }} />
																	)}
																	{subQuestion.selectedComponent === 'Input' && <InputCopmponent idQuestion={subQuestion.idSubQuestion} disabled={false} quest={subQuestion.question} required={subQuestion.isRequired} cardFormPageType={'subCard'} />}
																	{subQuestion.selectedComponent === 'Textarea' && <TextareaComponent idQuestion={subQuestion.idSubQuestion} disabled={false} quest={subQuestion.question} required={subQuestion.isRequired} cardFormPageType={'subCard'} />}
																	{subQuestion.selectedComponent === 'Radio' && <RadioComponent idQuestion={subQuestion.idSubQuestion} disabled={false} answers={subQuestion.answer} quest={subQuestion.question} required={subQuestion.isRequired} cardFormPageType={'subCard'} />}
																	{subQuestion.selectedComponent === 'Checkbox' && <CheckboxesComponent idQuestion={subQuestion.idSubQuestion} disabled={false} answers={subQuestion.answer} quest={subQuestion.question} required={subQuestion.isRequired} addLogic={subQuestion.addLogic} GetLogic={subQuestion.Logic} cardFormPageType={'subCard'} />}
																	{subQuestion.selectedComponent === 'Slider' && <SliderComponent idQuestion={subQuestion.idSubQuestion} disabled={false} answers={subQuestion.answer} quest={subQuestion.question} required={subQuestion.isRequired} nowSliderValue={handleSliderValueChange} changeCardsLogic={subQuestion.changeCardsLogic} cardFormPageType={'subCard'} />}
																	{subQuestion.selectedComponent === 'Data' && <DataComponent idQuestion={subQuestion.idSubQuestion} disabled={false} quest={subQuestion.question} required={subQuestion.isRequired} cardFormPageType={'subCard'} />}
																</Paper>
															)}
															{card.selectedComponent === 'Checkbox' && selectedSubQuestionIndexForCheckbox && ((checkboxChooseNow === checkboxChooseForSubQuestion)) && (selectedSubQuestionIndexForCheckbox - 1) === subIndex && (
																<Paper elevation={2} sx={{ p: 3, paddingTop: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", height: '100%' }}>
																	<Box sx={{ display: 'flex', flexDirection: "row", width: "-webkit-fill-available", gap: 1, textAlign: 'center' }}>
																		<Typography variant='subtitle1' gutterBottom> {subQuestion.question} </Typography>
																	</Box>
																	{subQuestion.addImg && (
																		<img src={Array.isArray(subQuestion.imageUrl) ? subQuestion.imageUrl[0] : subQuestion.imageUrl} style={{ maxWidth: "-webkit-fill-available", marginTop: 5 }} />
																	)}
																	{subQuestion.selectedComponent === 'Input' && <InputCopmponent idQuestion={subQuestion.idSubQuestion} disabled={false} quest={subQuestion.question} required={subQuestion.isRequired} cardFormPageType={'subCard'} />}
																	{subQuestion.selectedComponent === 'Textarea' && <TextareaComponent idQuestion={subQuestion.idSubQuestion} disabled={false} quest={subQuestion.question} required={subQuestion.isRequired} cardFormPageType={'subCard'} />}
																	{subQuestion.selectedComponent === 'Radio' && <RadioComponent idQuestion={subQuestion.idSubQuestion} disabled={false} answers={subQuestion.answer} quest={subQuestion.question} required={subQuestion.isRequired} cardFormPageType={'subCard'} />}
																	{subQuestion.selectedComponent === 'Checkbox' && <CheckboxesComponent idQuestion={subQuestion.idSubQuestion} disabled={false} answers={subQuestion.answer} quest={subQuestion.question} required={subQuestion.isRequired} addLogic={subQuestion.addLogic} GetLogic={subQuestion.Logic} cardFormPageType={'subCard'} />}
																	{subQuestion.selectedComponent === 'Slider' && <SliderComponent idQuestion={subQuestion.idSubQuestion} disabled={false} answers={subQuestion.answer} quest={subQuestion.question} required={subQuestion.isRequired} nowSliderValue={handleSliderValueChange} changeCardsLogic={subQuestion.changeCardsLogic} cardFormPageType={'subCard'} />}
																	{subQuestion.selectedComponent === 'Data' && <DataComponent idQuestion={subQuestion.idSubQuestion} disabled={false} quest={subQuestion.question} required={subQuestion.isRequired} cardFormPageType={'subCard'} />}
																</Paper>
															)}
														</Box>
													)
												})}
											</Box>
										);
									})}
								</Box>
							</>
						) : (
							<p>Загружаем конечный вид формы...</p>
						)}
					</Grid>
				</form >
			</FormProvider>
		</>
	);
}
