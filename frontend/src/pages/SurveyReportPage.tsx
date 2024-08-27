import React, { useEffect, useState } from 'react';
import '../styles/main.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchGetReportForm } from '../store/action/actionGetReportForm';
import { AppDispatch } from '../store/reducers/reducerRoot';
import { unwrapResult } from '@reduxjs/toolkit';
import { AppBar, Box, IconButton, Paper, Toolbar, Typography } from '@mui/material';
import CustomShedule from '../components/CustomShedule';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

interface SubQuestion {
	answers: { answers: string | string[] }[];
	idSubQuestion: string;
	question: string;
	selectedComponent: string;
}

interface ReportItem {
	answers: Answer[];
	idQuestion: string;
	idSubQuestion: string;
	question: string;
	selectedComponent: string;
	subQuestions?: SubQuestion[];
	chartData?: PieChartData[];
}

interface Answer {
	answers: string | string[];
	idQuestion: string;
	idSubQuestion: string;
	phoneNumber?: string;
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
  const navigate = useNavigate();

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
								idSubQuestion: question.idSubQuestion,
								selectedComponent: question.selectedComponent,
								chartData: chartDataEntries,
							};
						}
						return {
							idQuestion: question.idQuestion,
							question: question.question,
							answers: answers,
							idSubQuestion: question.idSubQuestion,
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
		console.log(data, 'data');


		const uniquePhoneNumbers = Array.from(new Set(data.flatMap(item => item.answers.map(answer => answer.phoneNumber))));
		console.log(uniquePhoneNumbers, 'uniquePhoneNumbers');
		if (uniquePhoneNumbers.every(element => element === null)) {
			const questions = Array.from(new Set(data.map(item => item.question)));

			const headersWithoutMandatory = [...questions];
			console.log(2)

			const dataRows = questions.map(question => {
				console.log(question)
				const answersForQuestion = data.filter(item => item.question === question)
					.flatMap(item => item.answers)
					.map(answer => Array.isArray(answer.answers) ? answer.answers.join(', ') : String(answer.answers));
				return [...answersForQuestion];
			});
			console.log(dataRows)
			const transposedDataRows = dataRows[0].map((_, colIndex) => dataRows.map(row => row[colIndex]));

			const worksheetData = [headersWithoutMandatory, ...transposedDataRows];

			const ws_data = XLSX.utils.aoa_to_sheet(worksheetData);
			XLSX.utils.book_append_sheet(wb, ws_data, "DataExcel");

			const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
			const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
			saveAs(blob, "DataExcel.xlsx");

		} else {
			const questionsWithIds = Array.from(
				new Set(data.map(item => ({
					question: item.question,
					idQuestion: item.idQuestion,
					idSubQuestion: item.idSubQuestion,
				})))
			).map(({ question, idQuestion, idSubQuestion }: { question: string; idQuestion: string; idSubQuestion: string }) => ({ question, idQuestion, idSubQuestion }));
			const headers = ["Users", ...questionsWithIds.map(item => item.question)];
			const dataRows = uniquePhoneNumbers.map(phoneNumber => {
				const userAnswers = data.flatMap(item =>
					item.answers.filter(answer => answer.phoneNumber === phoneNumber)
				);
				console.log(userAnswers, "userAnswers");
				return [phoneNumber, ...questionsWithIds.map(questionItem => {
					console.log(questionItem, 'questionItem');
					const answer = userAnswers.find(userAnswer => 
						userAnswer.idQuestion === questionItem.idQuestion ||
						userAnswer.idSubQuestion === questionItem.idSubQuestion
				)?.answers || '';
					return Array.isArray(answer) ? answer.join(', ') : String(answer);
				})];
			});
			const worksheetData = [headers, ...dataRows];
			const ws_data = XLSX.utils.aoa_to_sheet(worksheetData);
			XLSX.utils.book_append_sheet(wb, ws_data, "DataExcel");

			const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
			const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
			saveAs(blob, "DataExcel.xlsx");
			console.log(dataRows, "userDataRows");
		}
	}

	const uploadExcelFile = () => {
		generateExcelFile(reportData);
	}

	const goHomePage = () => {
		document.body.style.backgroundColor = "white";
		navigate(-1);
	}

	return (
		<>
			{formReportInfo && (
				<Box sx={{ flexGrow: 1 }}>
					<AppBar position="static" sx={{ backgroundColor: "white" }}>
						<Toolbar sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
						<IconButton aria-label="goBack" color="default" size="small" onClick={() => goHomePage()}>
								<KeyboardBackspaceIcon />
								{/* <Typography variant='h6'>Назад</Typography> */}
							</IconButton>
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
