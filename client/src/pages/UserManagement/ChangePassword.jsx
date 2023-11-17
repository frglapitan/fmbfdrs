import { Alert, Box, Button, IconButton, InputAdornment, Link, Stack, TextField, Tooltip, Typography } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { Visibility, VisibilityOff} from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import refreshToken from "../../utils/refreshToken";
import ExpiredTokenAlert from "../../components/ExpiredTokenAlert";

const ChangePassword = () => {

    const [showAlert, setShowAlert] = useState(false);

    const [formData, setFormData ] = useState({
        oldpassword: '',
        newpassword: '',
        newpasswordconfirm: '',
    });
    const [alertSuccess, setAlertSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [errorValidation, setErrorValidation] = useState({});

    const [showPassword, setShowPassword] = useState({
        oldpassword: false,
        newpassword: false,
        newpasswordconfirm: false,
    });

    const navigate = useNavigate();

    
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

        if (formData.oldpassword.trim() === '') {
            updatedErrors.oldpassword = "Old password is required"
            isValid = false;
        }

        if (formData.newpassword.trim() === '') {
            updatedErrors.newpassword = "New password is required"
            isValid = false;
        }

        if (formData.newpasswordconfirm.trim() === '') {
            updatedErrors.newpasswordconfirm = "Confirm new password is required"
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

        if ( !validateForm() ) {
            return;
        }

        try {
            let accessToken = localStorage.getItem('accessToken');
            
            let res = await fetch('/api/user/mypasswd', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    oldpassword: formData.oldpassword,
                    newpassword: formData.newpassword
                })
            });

            let data = await res.json();

            if ( res.ok) {
                setError(null);
                setAlertSuccess(true)

            } else if (res.status === 401) {
                try {
                    accessToken = await refreshToken();
                    localStorage.setItem('accessToken', accessToken);

                    res = await fetch('/api/user/mypasswd', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken}`
                        },
                        body: JSON.stringify({
                            oldpassword: formData.oldpassword,
                            newpassword: formData.newpassword
                        })                        
                    });

                    data = await res.json();
                    
                    if ( res.ok) {
                        setError(null);
                        setAlertSuccess(true)
                    }

                } catch (error) {
                    //console.log('Error in refreshing token')
                    setShowAlert(true);
                }

            } else {
                //console.log("Error in updating own profile")
                setError(data.error)
            }


        } catch (error) {
            //console.log("Error:", error)
            setError(data.error)
        }
    }

    return (
        <Box sx={{ p:2, justifyContent: "center", alignItems: 'center', height: '70vh' }}>
            {showAlert && <ExpiredTokenAlert />}
            <Typography variant="h4">
                Update My Password
            </Typography>
            <Stack spacing={1} sx={{p:1}}>
              
                <TextField fullWidth variant="filled" sx={{width: '400px'}} 
                    name="oldpassword"
                    label="Old Password"
                    type={showPassword.oldpassword ? "text" : "password"}
                    onChange={handleChange}
                    value={formData.oldpassword}
                    error={!!errorValidation.oldpassword}
                    helperText={errorValidation.oldpassword}
                    required
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => handleClickShowPassword('oldpassword')}>
                                    {showPassword.oldpassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

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
                
                <Stack direction="row" spacing={2} sx={{ alignItems: 'center'}} >
                <Button variant="contained" onClick={handleSubmit}>
                    Submit
                </Button>
                <Button variant="contained" onClick={() => navigate(-1)}>
                    Cancel
                </Button>
                </Stack>
                
                <Stack>
                    { error && 
                        <Alert severity="error">
                            {error}
                        </Alert>
                    }
                    { alertSuccess &&
                        <Alert severity="success">
                            Successfully updated password. Back to <Link href="/administration/myprofile">profile</Link>
                        </Alert>
                    }
                </Stack>

            </Stack>
        </Box>

    )
}

export default ChangePassword;