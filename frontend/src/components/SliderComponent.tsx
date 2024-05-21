import React, { useEffect, useState } from 'react';
import { Box, FormGroup, IconButton, MenuItem, Select, Slider, TextField, Tooltip, Typography } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { Controller, useFormContext } from 'react-hook-form';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

interface SliderComponentProps {
	sectionIndex?: number,
	cardIndex?: number,
	disabled: boolean;
	onSliderValuesChange?: (values: string) => void;
	answers?: string[];
	required?: boolean;
	quest?: string;
	idQuestion?: string;
	addChangeCardsLogic?: boolean;
	onChangeCardsLogic?: (logic: string | string[]) => void;
	nowSliderValue?: (value: number, changeCardsLogic: string | string[]) => void;
	changeCardsLogic?: string | string[];
}

const SliderComponent: React.FC<SliderComponentProps> = ({
	sectionIndex,
	cardIndex,
	disabled = false,
	onSliderValuesChange,
	answers,
	required = false,
	quest,
	idQuestion,
	addChangeCardsLogic = false,
	onChangeCardsLogic,
	nowSliderValue,
	changeCardsLogic = []
}) => {
	const [startValue, setStartValue] = useState<number>(answers ? parseInt(answers[0], 10) : 0);
	const [lengthValue, setLengthValue] = useState<number>(answers ? parseInt(answers[1], 10) : 2);
	const [logicChangeBlocks, setLogicChangeBlocks] = useState<{ answer: string; cardIndex: string }[]>([]);
	const [sliderValue, setSliderValue] = useState<number>(startValue);
	const { register, control, formState: { errors } } = useFormContext();

	const inputName = idQuestion || 'defaultIdQuestion';

	register(inputName, { required });
	useEffect(() => {
		if (nowSliderValue) {
			nowSliderValue(sliderValue, changeCardsLogic);
		}
	}, [sliderValue, nowSliderValue, changeCardsLogic]);

	useEffect(() => {
		if (onSliderValuesChange) {
			onSliderValuesChange(`${startValue},${lengthValue}`);
		}
	}, [startValue, lengthValue, onSliderValuesChange]);

	useEffect(() => {
		if (addChangeCardsLogic) {
			if (onChangeCardsLogic) {
				const logic = logicChangeBlocks.map(block => `${block.answer}:${block.cardIndex}`).join(',');
				onChangeCardsLogic(logic);
			}
		} else {
			if (onChangeCardsLogic) {
				setLogicChangeBlocks([]);
				onChangeCardsLogic([]);
			}
		}
	}, [logicChangeBlocks, onChangeCardsLogic, addChangeCardsLogic]);

	useEffect(() => {
		if (addChangeCardsLogic  && !disabled && Array.isArray(changeCardsLogic)) {
			const parsedLogic = changeCardsLogic.map((logic: string) => {
				const [answer, cardIndex] = logic.split(':');
				return { answer, cardIndex };
			});
			setLogicChangeBlocks(parsedLogic);
		}
	}, [changeCardsLogic, addChangeCardsLogic, disabled]);



	const handleStartChange = (event: SelectChangeEvent<number>) => {
		setStartValue(Number(event.target.value));
	};

	const handleLengthChange = (event: SelectChangeEvent<number>) => {
		setLengthValue(Number(event.target.value));
	};

	const marks: Array<{ value: number; label: string }> = [];
	for (let i = startValue; i <= lengthValue; i++) {
		marks.push({ value: i, label: i.toString() });
	}

	const handleAddNewLogicChange = () => {
		console.log(1)
		setLogicChangeBlocks([...logicChangeBlocks, { answer: '', cardIndex: '' }]);
		console.log(logicChangeBlocks)
	};

	const handleRemoveNewLogicChange = (index: number) => {
		if (logicChangeBlocks.length > 1) {
			setLogicChangeBlocks(logicChangeBlocks.filter((_, i) => i !== index));
		}
	};
	return (
		<>
			{!disabled && answers && (
				<FormGroup sx={{ width: "-webkit-fill-available", marginTop: "1rem" }}>
					<Controller
						name={inputName}
						control={control}
						defaultValue={`${startValue},${lengthValue}`}
						rules={{ required: required ? "Выберите ответ" : false }}
						render={({ field }) => (
							<Slider
								{...field}
								marks={marks}
								max={Number(answers[1])}
								min={Number(answers[0])}
								color='success'
								valueLabelDisplay="auto"
								onChange={(event, newValue) => {
									field.onChange(newValue);
									setSliderValue(newValue as number);
								}}
							/>
						)}
					/>
					{errors[inputName] && <Typography color="error">{errors[inputName]?.message?.toString() || ''}</Typography>}
				</FormGroup>
			)}
			{disabled && (
				<>
					<Box sx={{ marginTop: "1rem", display: "flex", alignItems: "center", textAlign: "center" }}>
						<Typography sx={{ marginRight: "0.5rem" }}>От </Typography>
						<Select variant='standard' color='success' value={startValue} onChange={handleStartChange}>
							<MenuItem value={0}>0</MenuItem>
							<MenuItem value={1}>1</MenuItem>
						</Select>
						<Typography sx={{ marginRight: "0.5rem", marginLeft: "0.5rem" }} >До</Typography>
						<Select variant='standard' color='success' value={lengthValue} onChange={handleLengthChange}>
							<MenuItem value={2}>2</MenuItem>
							<MenuItem value={3}>3</MenuItem>
							<MenuItem value={4}>4</MenuItem>
							<MenuItem value={5}>5</MenuItem>
							<MenuItem value={6}>6</MenuItem>
							<MenuItem value={7}>7</MenuItem>
							<MenuItem value={8}>8</MenuItem>
							<MenuItem value={9}>9</MenuItem>
							<MenuItem value={10}>10</MenuItem>
						</Select>
					</Box>
					<FormGroup sx={{ width: "-webkit-fill-available", marginTop: "1rem" }}>
						<Slider
							disabled
							marks={marks}
							max={lengthValue}
							min={startValue}
							color='success'
							valueLabelDisplay="auto"
						/>
						{addChangeCardsLogic && (
							<>
								{logicChangeBlocks.map((block, index) => (
									<Box key={index} sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', mt: 2 }}>
										<Typography variant='body1' color='black' sx={{ mr: 2 }}>При выборе ответа:</Typography>
										<TextField
											variant="standard"
											value={block.answer}
											onChange={(e) => {
												const newLogicChangeBlocks = [...logicChangeBlocks];
												newLogicChangeBlocks[index].answer = e.target.value;
												setLogicChangeBlocks(newLogicChangeBlocks);
											}}
										/>
										<Typography variant='body1' color='black' sx={{ mr: 2 }}>открыть карточку:</Typography>
										<TextField
											variant="standard"
											value={block.cardIndex}
											onChange={(e) => {
												const newLogicChangeBlocks = [...logicChangeBlocks];
												newLogicChangeBlocks[index].cardIndex = e.target.value;
												setLogicChangeBlocks(newLogicChangeBlocks);
											}}
										/>
										{logicChangeBlocks.length > 1 && (
											<IconButton aria-label="removeNewLogicChange" size='small' onClick={() => handleRemoveNewLogicChange(index)}>
												<CloseIcon />
											</IconButton>
										)}
									</Box>
								))}
								<Box sx={{ marginTop: "1rem", display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
									<Tooltip title="Добавить условие">
										<IconButton aria-label="addNewLogicChange" size='small' onClick={handleAddNewLogicChange}>
											<AddIcon />
										</IconButton>
									</Tooltip>
								</Box>
							</>
						)}
					</FormGroup>
				</>
			)}
		</>
	);
};

export default SliderComponent;
