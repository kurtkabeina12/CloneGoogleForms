import React, { useEffect, useState } from 'react';
import '../styles/main.css';
import { Box, Typography } from '@mui/material';
import { useLocation, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/reducers/reducerRoot';
import { unwrapResult } from '@reduxjs/toolkit';
import { fetchGetStubInfoTest } from '../store/action/actionGetInfoStubTest';

interface FormDataStub {
	testEndText: string;
	selectedColor: string;
}

const StubPage: React.FC = () => {
	const LogoImage = require('../img/LogoVita.png');
	const { testId } = useParams();
	const [formData, setFormData] = useState<FormDataStub | null>(null);
	const dispatch = useDispatch<AppDispatch>();
	const location = useLocation();
	const totalPoints = location.state.totalPoints;
	const userEmail = location.state.userEmail;
	const userId = location.state.userId;
	console.log(testId, totalPoints, userEmail, userId)

	useEffect(() => {
		const fetchFormData = async () => {
			try {
				const actionResult = await dispatch(fetchGetStubInfoTest({ testId: testId ?? '' }));
				const formData = unwrapResult(actionResult);
				setFormData(formData);
				document.body.style.backgroundColor = formData.selectedColor;
				console.log(formData, 'данные с сервера');
			} catch (error) {
				console.error('Failed to fetch form:', error);
			}
		};

		fetchFormData();
	}, [dispatch, testId]);

	return (
		<>
			<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
				<Typography variant="h4" component="h2" sx={{ mt: "5rem" }}>
					{formData?.testEndText}
				</Typography>
				<Typography variant="h5" component="h2" sx={{ mt: "2rem" }}>
					Вы набрали: {totalPoints} баллов
				</Typography>
				<Typography variant="h5" component="h2" sx={{ mt: "1rem" }}>
					Точные результаты тестирования отправлены на вашу почту: {userEmail}
				</Typography>
			</Box>
		</>
	);
};

export default StubPage;
