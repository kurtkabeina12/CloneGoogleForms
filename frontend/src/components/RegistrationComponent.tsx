import { Box, TextField, Typography } from "@mui/material";
import { useFormContext } from "react-hook-form";

function RegistrationComponent() {
  const { register, formState: { errors }, trigger, setValue, watch } = useFormContext();

  // функция для валидации номера телефона
  const validatePhoneNumber = (value: string) => {
    const regex = /^\+7\(?\d{3}\)?\d{3}-\d{2}-\d{2}$/;
    if (!regex.test(value)) {
      return "Неверный формат ввода";
    }
    return true;
  };

  // отслеживание +7 что бы обязательно было
  const phoneNumber = watch("registerPhone", '+7');

  const handlePhoneNumberChange = (event: { target: { value: string; }; }) => {
    let val = event.target.value.replace(/\D/g, "");
    let formattedVal = "+7" + val.slice(1, 11);

    // маска для телефона
    let matrix = "+7(___)___-__-__";
    let i = 0;
    formattedVal = matrix.replace(/./g, function (a) {
      if (/[_\d]/.test(a) && i < val.length) {
        return val.charAt(i++);
      } else if (i >= val.length) {
        return "";
      } else {
        return a;
      }
    });

    setValue("registerPhone", formattedVal);
    trigger("registerPhone");
  };

  return (
    <>
      <Box sx={{ mt: 3 }}>
        <Typography variant="h5" gutterBottom>Зарегистрируйтесь</Typography>
        <TextField
          variant="standard"
          {...register("registerPhone", {
            required: "Регистрация обязательна",
            validate: validatePhoneNumber,
          })}
          onChange={handlePhoneNumberChange}
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
