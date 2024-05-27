import { Box, Paper } from '@mui/material';
import React from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

interface PieChartData {
	answer: string;
	count: number;
	AllAnswers: string[] | string;
}

interface PieChartProps {
	data: PieChartData[];
}

const COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#f43f5e'];
const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
	cx,
	cy,
	midAngle,
	innerRadius,
	outerRadius,
	percent,
	index,
}: any) => {
	const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
	const x = cx + radius * Math.cos(-midAngle * RADIAN);
	const y = cy + radius * Math.sin(-midAngle * RADIAN);
	return (
		<text
			x={x}
			y={y}
			fill="white"
			textAnchor={x > cx ? 'start' : 'end'}
			dominantBaseline="central"
		>
			{`${(percent * 100).toFixed()}%`}
		</text>
	);
};

const CustomShedule: React.FC<PieChartProps> = ({ data }) => {
	console.log(data, 'dataForShedule');

	const processedData = data
		.filter(item => item.answer!== 'null') 
		.map(item => {
			if (Array.isArray(item.AllAnswers)) {
				const uniqueAnswers = new Set([...item.AllAnswers]);
				const counts = Array.from(uniqueAnswers).map(answer => {
					const foundItem = data.find(dataItem => dataItem.answer === answer);
					return foundItem? foundItem.count : 0;
				});
				return {
					...item,
					count: counts.reduce((acc, curr) => acc + curr, 0),
				};
			} else {
				throw new Error('Invalid data format. AllAnswers must be an array.');
			}
		});

	const totalCount = processedData.reduce((total, item) => total + item.count, 0);

	const answerPercentages = processedData.map(item => ({
		...item,
		percentage: ((item.count / totalCount) * 100).toFixed(),
	}));

	return (
		<>
			<Box sx={{ display: 'flex', alignItems: 'center' }}>
				<PieChart width={400} height={400}>
					<Pie
						data={answerPercentages}
						cx={200}
						cy={200}
						labelLine={false}
						label={renderCustomizedLabel}
						outerRadius={80}
						fill="#8884d8"
						dataKey="count"
					>
						{processedData.map((entry, index) => (
							<Cell
								key={`cell-${index}`}
								fill={COLORS[index % COLORS.length]}
								name={entry.answer}
							/>
						))}
					</Pie>
					<Tooltip />
				</PieChart>
				<Paper style={{ padding: '16px', marginTop: '16px' }}>
					{answerPercentages.map((item, index) => (
						<div key={index}>
							<span>{item.answer}: {item.percentage}%</span><br />
						</div>
					))}
				</Paper>
			</Box>
		</>
	);
};

export default CustomShedule;
