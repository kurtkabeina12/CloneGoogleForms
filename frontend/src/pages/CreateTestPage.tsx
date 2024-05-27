/* eslint-disable jsx-a11y/alt-text */

import { Box, Typography } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';

const CreateTestPage: React.FC = () => {
	const LogoImage = require('../img/LogoVita.png');

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
					<Typography variant="h4" sx={{ mt: "5rem" }}>
						Данный сервис пока недоступен!
						<FavoriteIcon color="error" />
					</Typography>
				</Box>
			</Box>
		</>
	);
}

export default CreateTestPage;
