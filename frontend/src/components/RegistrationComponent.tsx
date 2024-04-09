import { Box, TextField, Typography } from "@mui/material";
import { useState } from "react";

function RegistrationComponent() {
    const [phoneNumber, setPhoneNumber] = useState('+7');
    const [error, setError] = useState(false);

    const handlePhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let val = event.target.value.replace(/\D/g, "");
        let matrix_def = "+7(___)___-__-__";
        let matrix = matrix_def;
        let i = 0;

        if (!val.startsWith("7")) {
            val = "7" + val;
        }

        let formattedVal = matrix.replace(/./g, function (a: string) {
            if (/[_\d]/.test(a) && i < val.length) {
                return val.charAt(i++);
            } else if (i >= val.length) {
                return "";
            } else {
                return a;
            }
        });

        if (!formattedVal.startsWith("+7")) {
            formattedVal = "+7" + formattedVal.slice(2);
        }

        setPhoneNumber(formattedVal);

        const regex = /^\+7\d{10}$/;
        if (!regex.test(formattedVal)) {
            setError(true);
        } else {
            setError(false);
        }
    };

    return (
        <>
            <Box sx={{ mt: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Зарегистрируйтесь
                </Typography>
                <TextField
                    variant="standard"
                    name="registerPhone"
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    error={error}
                    sx={{ mb: 3, marginTop: "1rem" }}
                />
            </Box>
        </>
    );
}

export default RegistrationComponent;
