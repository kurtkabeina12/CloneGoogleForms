import React from 'react'
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import { styled } from '@mui/system';
import { Controller, useFormContext } from 'react-hook-form';

interface TextareaComponentProps {
  disabled?: boolean,
  required?: boolean;
  quest?: string;
}

const green = {
  100: '#DCF8C6',
  200: '#A5D6A7',
  400: '#38B2AC',
  500: '#319795',
  600: '#2B7A78',
  900: '#145A64',
};

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
};
const Textarea = styled(BaseTextareaAutosize)(
  ({ theme }) => `
  box-sizing: border-box;
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 8px 12px;
  border-radius: 8px;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 1px solid rgba(0, 0, 0, 0.23);
  box-shadow: 0px 2px 2px ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};

  &:hover {
    border-color: ${green[400]};
  }

  &:focus {
    border-color: ${green[400]};
    box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? green[600] : green[200]};
  }

  // firefox
  &:focus-visible {
    outline: 0;
  }
`,
);
const TextareaComponent: React.FC<TextareaComponentProps> = ({ disabled = false, required = false, quest }) => {

  const { register } = useFormContext();

  const questName = quest || 'ИмяВопросаНеБылоЗадано';

  const { ref, onChange, onBlur } = register(questName, { required });

  return (
    <>
      {disabled &&
        <Textarea sx={{ width: "-webkit-fill-available", marginTop: "1rem" }} aria-label="minimum height" placeholder='Напишите ответ' disabled minRows={5} />
      }
      {!disabled &&
        <Controller
        name={quest || 'ИмяВопросаНеБылоЗадано'}
        rules={{ required }}
        render={({ field }) => (
          <Textarea
            {...field}
            sx={{ width: "-webkit-fill-available", marginTop: "1rem" }}
            aria-label="minimum height"
            placeholder='Напишите ответ'
            minRows={5}
            required={required}
          />
        )}
      />
      }
    </>
  )
}

export default TextareaComponent;
