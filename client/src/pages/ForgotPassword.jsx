import { useState } from "react";
import { Alert, Box, Button, Container, CssBaseline, Link, TextField, Typography } from "@mui/material";

const ForgotPassword = () => {

    const [err, setError] = useState(null);
    const [alertSuccess, setAlertSuccess] = useState(false)

    const handleSubmit = async(event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        let email = formData.get('email');

        try {
            const res = await fetch('/api/auth/forgot-password', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email }),
            });
      
            const data = await res.json();
      
            if (res.ok) {
              
              setError(null);
              setAlertSuccess(true);
      
            } else {
              setError(data.error);
            }
          } catch (error) {
            setError('An error occurred during sending reset password email. Please try again.');
            //console.error('Error:', error);
          }
    };

    return (
        <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
            <Typography component="h1" variant="h5">
                Forgot Password
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                Send Reset Password Email
                </Button>
                {
                    err &&
                        <Alert severity="error">
                            {err}
                        </Alert>
                }
                {
                    alertSuccess &&
                        <Alert severity="success">
                            Please check your registered email for the reset password link. Go back to <Link href="/login">Login</Link>
                        </Alert>
                }
            </Box>
        </Box>
        </Container>
    )
}

export default ForgotPassword;