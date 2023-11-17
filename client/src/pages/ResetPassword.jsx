import { useState } from "react";
import { useParams } from "react-router-dom";
import { Alert, Box, Button, Container, CssBaseline, IconButton, InputAdornment, Link, TextField, Tooltip, Typography } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { Visibility, VisibilityOff} from "@mui/icons-material";

const ResetPassword = () => {

    const params = useParams();
    const id = params.id;
    const token = params.token;

    const [err, setError] = useState(null);
    const [alertSuccess, setAlertSuccess] = useState(false);
    const [errorValidation, setErrorValidation] = useState({});
    const [ formData, setFormData ] = useState({
        newpassword: '',
        newpasswordconfirm: ''
    });

    const [showPassword, setShowPassword] = useState({
        newpassword: false,
        newpasswordconfirm: false,
    });

    // set the values on input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({...formData, [name]:value});
    }


    // to show password
    const handleClickShowPassword = (field) => {
        setShowPassword({ ...showPassword, [field]: !showPassword[field] });
    };

    const validateForm = () => {
        let isValid = true;
        const updatedErrors = {};

        if (formData.newpassword.trim() === '') {
            updatedErrors.newpassword = "Password is required"
            isValid = false;
        }

        if (formData.newpasswordconfirm.trim() === '') {
            updatedErrors.newpasswordconfirm = "Please confirm your password"
            isValid = false;
        }

        if (formData.newpassword !== formData.newpasswordconfirm ) {
            updatedErrors.newpasswordconfirm = "Confirm password does not match"
            isValid = false;
        }

        setErrorValidation(updatedErrors);
        return isValid
    }

    const handleSubmit = async(e) => {
        e.preventDefault();

        console.log(`Id: ${id}, token: ${token}`);

        if ( !validateForm() ) {
            return;
        }
    
        try {
            const res = await fetch('/api/auth/reset-password',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, token, password:formData.newpassword }),
            })

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
                Reset Password
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                
                <TextField fullWidth variant="filled" sx={{width: '400px'}} 
                    name="newpassword"
                    label="New Password"
                    type={showPassword.newpassword ? "text" : "password"}
                    onChange={handleChange}
                    value={formData.newpassword}
                    error={!!errorValidation.newpassword}
                    helperText={errorValidation.newpassword}
                    required
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <Tooltip title="Password must be at least 7 characters with an uppercase letter, a lowercase letter and a number">
                                    <IconButton>
                                        <InfoIcon />
                                    </IconButton>
                                </Tooltip>
                                <IconButton onClick={() => handleClickShowPassword('newpassword')}>
                                    {showPassword.newpassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                <TextField fullWidth variant="filled" sx={{width: '400px'}} 
                    name="newpasswordconfirm"
                    label="Confirm new password"
                    type={showPassword.newpasswordconfirm ? "text" : "password"}
                    onChange={handleChange}
                    value={formData.newpasswordconfirm}
                    error={!!errorValidation.newpasswordconfirm}
                    helperText={errorValidation.newpasswordconfirm}
                    required
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => handleClickShowPassword('newpasswordconfirm')}>
                                    {showPassword.newpasswordconfirm ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                
                Reset Password
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
                            Password have been reset. Go back to <Link href="/login">Login</Link>
                        </Alert>
                }
            </Box>
        </Box>
        </Container>
    )
}

export default ResetPassword;