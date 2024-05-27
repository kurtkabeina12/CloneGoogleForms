/* eslint-disable jsx-a11y/alt-text */

import { Box, Typography } from "@mui/material";
import { useParams } from "react-router-dom";


const ChangeFormPage: React.FC = () => {
	const { formId } = useParams();

	return (
		<>
		<Box>
			<Typography variant="h2">
				Данный сервис пока недоступен!
			</Typography>
		</Box>
		</>
	);
}

export default ChangeFormPage;
