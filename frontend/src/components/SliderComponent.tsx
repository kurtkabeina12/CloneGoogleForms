import React, { useState } from 'react';
import { Box, FormGroup, MenuItem, Select, Slider, Typography } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';

interface SliderComponentProps { }

const SliderComponent: React.FC<SliderComponentProps> = () => {
	const [startValue, setStartValue] = useState<number>(0);
	const [lengthValue, setLengthValue] = useState<number>(2);

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

	return (
		<>
			<Box sx={{marginTop:"1rem", display:"flex", alignItems:"center", textAlign:"center"}}>
				<Typography sx={{marginRight:"0.5rem"}}>От </Typography>
				<Select variant='standard' color='success' value={startValue} onChange={handleStartChange}>
					<MenuItem value={0}>0</MenuItem>
					<MenuItem value={1}>1</MenuItem>
				</Select>
				<Typography sx={{marginRight:"0.5rem", marginLeft:"0.5rem"}} >До</Typography>
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
	);
};

export default SliderComponent;
