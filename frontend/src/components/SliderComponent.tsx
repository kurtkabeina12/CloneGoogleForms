import React, { useEffect, useState } from 'react';
import { Box, FormGroup, MenuItem, Select, Slider, Typography } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { Controller, useFormContext } from 'react-hook-form';

interface SliderComponentProps {
	disabled: boolean;
	onSliderValuesChange?: (values: string) => void;
	answers?: string[];
	required?: boolean;
	quest?: string;
}

const SliderComponent: React.FC<SliderComponentProps> = ({ disabled = false, onSliderValuesChange, answers, required = false, quest }) => {
	const [startValue, setStartValue] = useState<number>(answers ? parseInt(answers[0], 10) : 0);
	const [lengthValue, setLengthValue] = useState<number>(answers ? parseInt(answers[1], 10) : 2);

	const { register, control, formState: { errors } } = useFormContext();

	const questName = quest || 'ИмяВопросаНеБылоЗадано';

	const { ref, onChange, onBlur } = register(questName, { required });

	useEffect(() => {
		if (onSliderValuesChange) {
			onSliderValuesChange(`${startValue},${lengthValue}`);
		}
	}, [startValue, lengthValue, onSliderValuesChange]);

	const handleStartChange = (event: SelectChangeEvent<number>) => {
		setStartValue(Number(event.target.value));
	};

	console.log(answers)

	const handleLengthChange = (event: SelectChangeEvent<number>) => {
		setLengthValue(Number(event.target.value));
	};

	const marks: Array<{ value: number; label: string }> = [];
	for (let i = startValue; i <= lengthValue; i++) {
		marks.push({ value: i, label: i.toString() });
	}

	return (
		<>
			{!disabled && answers && (
				<FormGroup sx={{ width: "-webkit-fill-available", marginTop: "1rem" }}>
					<Controller
						name={questName}
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
							/>
						)}
					/>
					{errors[questName] && <Typography color="error">{errors[questName]?.message?.toString() || ''}</Typography>}
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
					</FormGroup>
				</>
			)}
		</>
	);
};

export default SliderComponent;
