import React, { useEffect, useState } from 'react';
import '../styles/main.css';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchGetReportForm } from '../store/action/actionGetReportForm';
import { AppDispatch } from '../store/reducers/reducerRoot';
import { unwrapResult } from '@reduxjs/toolkit';
import { Box, Paper, Typography } from '@mui/material';

interface ReportItem {
	question: string;
	answers: { answers: string | string[] }[];
}

const SurveyReportPage: React.FC = () => {
	const { formId } = useParams();
	const dispatch = useDispatch<AppDispatch>();
	const [reportData, setReportData] = useState<ReportItem[]>([]);

	useEffect(() => {
		const fetchReportForm = async () => {
			try {
				const actionResult = await dispatch(fetchGetReportForm({ formId: formId ?? '' }));
				const formData = unwrapResult(actionResult);
				console.log(formData, 'данные с сервера');

				// Подготовка данных для вопросов и ответов
				const reportData = formData.questions.map((question: { question: string; idQuestion: string; }) => ({
					question: question.question,
					answers: formData.answers.filter((answer: { idQuestion: string; }) => answer.idQuestion === question.idQuestion),
				}));

				setReportData(reportData);

			} catch (error) {
				console.error('Failed to fetch form:', error);
			}
		};

		fetchReportForm();
	}, [dispatch, formId]);

	return (
		<Box>
			{reportData.map((item: ReportItem, index: number) => (
				<Box key={index}>
					<Paper elevation={2} sx={{ p: 3, m:4 }}>
						<Typography variant='h4'>{item.question}</Typography>
						<ul>
							{item.answers.map((answer, answerIndex) => (
								<li key={answerIndex}>
									{Array.isArray(answer.answers) ? answer.answers.join(', ') : answer.answers}
								</li>
							))}
						</ul>
					</Paper>
				</Box>
			))}
		</Box>
	);
};

export default SurveyReportPage;
