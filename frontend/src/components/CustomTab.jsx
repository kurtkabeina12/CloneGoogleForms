import { styled } from '@mui/system';
import { Tab } from '@mui/material';

export const CustomTab = styled(Tab)({
 textTransform: "none",
 color: "#00862b", // Текст вкладки
 "&.Mui-selected": {
    color: "#00862b", // Текст выбранной вкладки
 },
 '& .MuiTabs-indicator': {
    backgroundColor: '#00862b',
  },
});