import { Box, TextField, Typography } from "@mui/material";
import { useFormContext } from "react-hook-form";

function RegistrationEmailComponent() {
  const { register, formState: { errors }, trigger, setValue, watch } = useFormContext();

  const email = watch("registerEmail", '');

  const handleEmailChange = (event: { target: { value: string; }; }) => {
    setValue("registerEmail", event.target.value);
    trigger("registerEmail");
  };

  return (
    <>
      <Box sx={{ mt: 3 }}>
        <Typography variant="h5" gutterBottom>Зарегестрируйтесь</Typography>
        <TextField
          variant="standard"
          {...register("registerEmail", {
            required: "Регистрация обязательна",
          })}
          onChange={handleEmailChange}
          value={email}
          error={Boolean(errors.registerEmail)}
          helperText={errors.registerEmail?.message?.toString() || ''}
          sx={{ mb: 3, marginTop: "1rem" }}
          required
        />
      </Box>
    </>
  );
}

export default RegistrationEmailComponent;
