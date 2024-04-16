import { Box, TextField, Typography } from "@mui/material";
import { useFormContext } from "react-hook-form";

function RegistrationComponent() {
 const { register, formState: { errors }, trigger, setValue, watch } = useFormContext();

 // Функция валидации для номера телефона
 const validatePhoneNumber = (value: string) => {
    const regex = /^\+7\d{10}$/;
    if (!regex.test(value)) {
      return "Неправильный формат телефона";
    }
    return true; 
 };

 // Получаем текущее значение поля "registerPhone"
 const phoneNumber = watch("registerPhone", '+7');

 return (
    <>
      <Box sx={{ mt: 3 }}>
        <Typography variant="h5" gutterBottom>
          Зарегистрируйтесь
        </Typography>
        <TextField
          variant="standard"
          {...register("registerPhone", {
            required: "Регистрация обязательна",
            validate: validatePhoneNumber, 
          })}
          onChange={(event) => {
            let val = event.target.value.replace(/\D/g, "");
            let formattedVal = "+7" + val.slice(1, 11); 
            setValue("registerPhone", formattedVal);
            trigger("registerPhone");
          }}
          value={phoneNumber}
          error={Boolean(errors.registerPhone)}
          helperText={errors.registerPhone?.message?.toString() || ''}
          sx={{ mb: 3, marginTop: "1rem" }}
          required
        />
      </Box>
    </>
 );
}

export default RegistrationComponent;
