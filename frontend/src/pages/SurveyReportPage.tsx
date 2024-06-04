import React, { useEffect, useState } from 'react';
import '../styles/main.css';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchGetReportForm } from '../store/action/actionGetReportForm';
import { AppDispatch } from '../store/reducers/reducerRoot';
import { unwrapResult } from '@reduxjs/toolkit';
import { AppBar, Box, IconButton, Paper, Toolbar, Typography } from '@mui/material';
import CustomShedule from '../components/CustomShedule';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface SubQuestion {
	answers: { answers: string | string[] }[];
	idSubQuestion: string;
	question: string;
	selectedComponent: string;
}

interface ReportItem {
	answers: { answers: string | string[] }[];
	idQuestion: string;
	question: string;
	selectedComponent: string;
	subQuestions?: SubQuestion[];
	chartData?: PieChartData[];
}

interface formReportInfo {
	formTitle: string;
	formEndDate: string;
	selectedColor: string;
}

interface PieChartData {
	answer: string;
	count: number;
	AllAnswers: string[] | string;
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

				const processQuestions = (questions: any[], type: string) => {
					return questions.map(question => {
						const answers = formData.answers.filter((answer: { [x: string]: any; }) => answer[type] === question.idQuestion || answer[type] === question.idSubQuestion);
						let answerCounts: Record<string, number> = {};
						if (question.selectedComponent === 'Radio' || question.selectedComponent === 'Checkbox') {
							answers.forEach((answer: { answers: any[]; }) => {
								const ans = Array.isArray(answer.answers) ? answer.answers.join(', ') : answer.answers;
								answerCounts[ans] = (answerCounts[ans] || 0) + 1;
							});
							const chartDataEntries = Object.entries(answerCounts).map(([answer, count]) => {
								return {
									answer,
									count,
									AllAnswers: question.answer
								};
							});
							return {
								idQuestion: question.idQuestion,
								question: question.question,
								answers: answers,
								selectedComponent: question.selectedComponent,
								chartData: chartDataEntries,
							};
						}
						return {
							idQuestion: question.idQuestion,
							question: question.question,
							answers: answers,
							selectedComponent: question.selectedComponent,
						};
					});
				};

				const mainQuestions = processQuestions(formData.questions, 'idQuestion');
				const subQuestions = processQuestions(formData.subQuestions, 'idSubQuestion');
				const combinedQuestions = mainQuestions.concat(subQuestions);

				setReportData(combinedQuestions);

			} catch (error) {
				console.error('Failed to fetch form:', error);
			}
		};

		fetchReportForm();
	}, [dispatch, formId]);

	//писать какой месяц текстом
	function getMonthName(monthNumber: number): string {
		const monthNames = [
			'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
			'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
		];
		return monthNames[monthNumber - 1];
	}

	// форматировать элементы даты
	function formatDate(dateString: string): string {
		const date = new Date(dateString);

		const day = date.getDate().toString().padStart(2, '0');
		const month = (date.getMonth() + 1).toString().padStart(2, '0');
		// const month = getMonthName(date.getMonth() + 1); 
		const year = date.getFullYear();

		return `${day}/${month}/${year}`;
	}

	function generateExcelFile(data: ReportItem[]) {
		const wb = XLSX.utils.book_new();

		const headers = ["question", ...Object.keys(data[0]?.question || {})];

		const dataRows = data.flatMap(item => {
			const row = [item.question];
			if (item?.answers) {
				const answersRow = item.answers.map(answer => Array.isArray(answer.answers) ? answer.answers.join(', ') : String(answer.answers)).join('; ');
				row.push(answersRow);
			}
			return [row];
		});

		const worksheetData = [headers, ...dataRows];

		const ws_data = XLSX.utils.aoa_to_sheet(worksheetData);

		XLSX.utils.book_append_sheet(wb, ws_data, "DataExcel");

		const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

		const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });

		saveAs(blob, "DataExcel.xlsx");
	}

	const uploadExcelFile = () => {
		generateExcelFile(reportData);
	}

	return (
		<>
			{formReportInfo && (
				<Box sx={{ flexGrow: 1 }}>
					<AppBar position="static" sx={{ backgroundColor: "white" }}>
						<Toolbar sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
							<Box>
								<Typography variant='h6' color="black">Название опроса: {formReportInfo.formTitle}</Typography>
							</Box>
							{formReportInfo.formEndDate &&
								<Box >
									<Typography variant='h6' color="black">Дата окончания опроса: {formatDate(formReportInfo.formEndDate)}</Typography>
								</Box>
							}
							<IconButton aria-label="uploadFile" color="success" size="small" onClick={() => uploadExcelFile()}>
								<UploadFileIcon />
								<Typography variant='h6'>Скачать Excel</Typography>
							</IconButton>
						</Toolbar>
					</AppBar>
				</Box>
			)}
			<Box>
				{reportData.map((item: ReportItem, index: number) => (
					<Box key={index}>
						<Paper elevation={2} sx={{ p: 3, m: 4 }}>
							<Typography variant='h4'>{item.question}</Typography>
							{item.selectedComponent === 'Radio' || item.selectedComponent === 'Checkbox' ? (
								<CustomShedule key={`${index}-custom`} data={item.chartData || []} />
							) : item.selectedComponent === 'Data' ? (
								<>
									<ul>
										{item.answers.map((answer, answerIndex) => (
											<li key={answerIndex}>
												{formatDate(Array.isArray(answer.answers) ? answer.answers.join(', ') : answer.answers)}
											</li>
										))}
									</ul>
									{item.subQuestions && item.subQuestions.map((subQuestion, subIndex) => (
										<div key={subIndex}>
											<Typography variant='h6'>{subQuestion.question}</Typography>
											<ul>
												{subQuestion.answers.map((answer, answerIndex) => (
													<li key={answerIndex}>
														{formatDate(Array.isArray(answer.answers) ? answer.answers.join(', ') : answer.answers)}
													</li>
												))}
											</ul>
										</div>
									))}
								</>
							) : (
								<>
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
								</>
							)}
						</Paper>
					</Box>
				))}
			</Box>
		</>
	);

};

export default SurveyReportPage;
