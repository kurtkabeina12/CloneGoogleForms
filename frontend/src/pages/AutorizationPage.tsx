import React, { useState } from 'react';
import { Box, Button, Card, CardContent, TextField, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

function AutorizationPage() {
	const { formId } = useParams();
	const LogoImage = require('../img/LogoVita.png');
	const [phoneNumber, setPhoneNumber] = useState('+7');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const navigate = useNavigate();
	
	const handlePhoneChange = (event: { target: { value: any; }; }) => {
		const value = event.target.value;
		if (/^\+7(\d*)?$/.test(value)) {
			setPhoneNumber(value);
			setError('');
		} else {
			setError('Неверный формат номера');
		}
	};

	const handlePasswordChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
		setPassword(event.target.value);
	};

	const handleSubmit = async () => {
		if (!error && password) {
			try {
				const response = await fetch('/api/login', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						login: phoneNumber,
						password: password,
					}),
				});

				if (response.ok) {
					const responseData = await response.json();
					if (responseData === true) {
						navigate(`/form/${formId}`, { state: { formId } });
					} else {
						setError('Некоректные данные');
					}
					console.log('Успешная авторизация, данные от сервера:', responseData);
				} else {
					throw new Error('Ошибка авторизации');
				}
			} catch (err) {
				console.error(err);
				setError('Ошибка при отправке данных');
			}
		}
	};


	return (
		<>
			<Box sx={{ mt: 3 }}>
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
					<Card sx={{
						maxWidth: "500px",
						mt: 3,
						backgroundColor: '#F5F5F5',
						borderRadius: '10px',
						boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
					}}>
						<CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
							<div style={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'left',
							}}>
								<Typography gutterBottom variant="h5" component="div">
									Зарегистрируйтесь
								</Typography>
								<Typography gutterBottom variant="body1" component="div">
									Введите номер телефона
								</Typography>
								<TextField
									variant="standard"
									sx={{ mb: 3, marginTop: "1rem" }}
									placeholder="+7(999)999-99-99"
									value={phoneNumber}
									onChange={handlePhoneChange}
									error={!!error}
									helperText={error}
									inputProps={{ maxLength: 12 }}
								/>
								<Typography gutterBottom variant="body1" component="div">
									Введите пароль
								</Typography>
								<TextField
									variant="standard"
									type="password"
									sx={{ mb: 3, marginTop: "1rem" }}
									value={password}
									onChange={handlePasswordChange}
									required
								/>
							</div>
							<Button variant="contained" color="success" onClick={handleSubmit}>
								Войти
							</Button>
						</CardContent>
					</Card>
					{error && (
						<Typography variant='body1' component="div"> {error} </Typography>
					)}
				</Box>
			</Box>
		</>
	);
}

export default AutorizationPage;
