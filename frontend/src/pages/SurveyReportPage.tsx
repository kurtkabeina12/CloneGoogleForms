import React, { useEffect, useState } from 'react';
import '../styles/main.css';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchGetReportForm } from '../store/action/actionGetReportForm';
import { AppDispatch } from '../store/reducers/reducerRoot';
import { unwrapResult } from '@reduxjs/toolkit';
import { Box, Paper, Typography } from '@mui/material';

interface SubQuestion {
	question: string;
	answers: { answers: string | string[] }[];
}

interface ReportItem {
	question: string;
	subQuestions?: SubQuestion[];
	answers: { answers: string | string[] }[];
}

interface formReportInfo {
	formTitle: string;
	formEndDate: string;
	selectedColor: string;
}

const SurveyReportPage: React.FC = () => {
	const { formId } = useParams();
	const dispatch = useDispatch<AppDispatch>();
	const [reportData, setReportData] = useState<ReportItem[]>([]);
	const [formReportInfo, setFormReportInfo] = useState<formReportInfo>();

	useEffect(() => {
		const fetchReportForm = async () => {
			try {
				const actionResult = await dispatch(fetchGetReportForm({ formId: formId ?? '' }));
				const formData = unwrapResult(actionResult);
				console.log(formData, 'данные с сервера');
				const selectedColor = formData.form[0].selectedColor;
				document.body.style.backgroundColor = selectedColor;

				// Обработка информации о форме
				const formInfo = formData.form[0];

				setFormReportInfo(formInfo);
				// Обработка основных вопросов
				const mainQuestions = formData.questions.map((question: { question: string; idQuestion: string; }) => ({
					question: question.question,
					answers: formData.answers.filter((answer: { idQuestion: string; }) => answer.idQuestion === question.idQuestion),
				}));

				// Обработка подзапросов
				const subQuestions = formData.subQuestions.map((subQuestion: { question: string; idSubQuestion: string; }) => ({
					question: subQuestion.question,
					answers: formData.answers.filter((answer: { idSubQuestion: string; }) => answer.idSubQuestion === subQuestion.idSubQuestion),
				}));

				// Комбинирование основных вопросов и подзапросов
				const combinedQuestions = mainQuestions.concat(subQuestions);

				setReportData(combinedQuestions);

			} catch (error) {
				console.error('Failed to fetch form:', error);
			}
		};

		fetchReportForm();
	}, [dispatch, formId]);

	function formatDate(dateString: string): string {
		const date = new Date(dateString);

		const day = date.getDate().toString().padStart(2, '0');
		const month = (date.getMonth() + 1).toString().padStart(2, '0');
		const year = date.getFullYear();

		return `${day}/${month}/${year}`;
	}

	return (
		<Box>
			{formReportInfo && (
				<Box>
					<Paper elevation={2} sx={{ p: 3, m: 4 }}>
						<Typography variant='h3'>{formReportInfo.formTitle}</Typography>
					</Paper>
					<Paper elevation={2} sx={{ p: 3, m: 4 }}>
						<Typography variant='h5'>{formatDate(formReportInfo.formEndDate)}</Typography>
					</Paper>
				</Box>
			)}
			{reportData.map((item: ReportItem, index: number) => (
				<Box key={index}>
					<Paper elevation={2} sx={{ p: 3, m: 4 }}>
						<Typography variant='h4'>{item.question}</Typography>
						<ul>
							{item.answers.map((answer, answerIndex) => (
								<li key={answerIndex}>
									{Array.isArray(answer.answers) ? answer.answers.join(', ') : answer.answers}
								</li>
							))}
						</ul>
						{item.subQuestions && item.subQuestions.map((subQuestion, subIndex) => (
							<div key={subIndex}>
								<Typography variant='h6'>{subQuestion.question}</Typography>
								<ul>
									{subQuestion.answers.map((answer, answerIndex) => (
										<li key={answerIndex}>
											{Array.isArray(answer.answers) ? answer.answers.join(', ') : answer.answers}
										</li>
									))}
								</ul>
							</div>
						))}
					</Paper>
				</Box>
			))}
		</Box>
	);
};

export default SurveyReportPage;
