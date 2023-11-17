import { Alert, Box, Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import refreshToken from "../../utils/refreshToken";
import ExpiredTokenAlert from "../../components/ExpiredTokenAlert";

const AddUser = () => {

    const [showAlert, setShowAlert] = useState(false);

    const [ formData, setFormData ] = useState({
        email: '',
        fullname: '',
        password: '',
        password2: '',
        department: '',
        role: 'user'
    });
    const [alertSuccess, setAlertSuccess] = useState(false)
    const [error, setError] = useState(null);
    const [errorValidation, setErrorValidation] = useState({});

    // set the values on input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({...formData, [name]:value});
    }


    const validateForm = () => {
        let isValid = true;
        const updatedErrors = {};

        if (formData.email.trim() === '') {
            updatedErrors.email = "Email is required"
            isValid = false;
        }

        if (formData.fullname.trim() === '') {
            updatedErrors.fullname = "Fullname is required"
            isValid = false;
        }

        if (formData.password.trim() === '') {
            updatedErrors.password = "Password is required"
            isValid = false;
        }

        if (formData.password2.trim() === '') {
            updatedErrors.password2 = "Please confirm your password"
            isValid = false;
        }

        if (formData.password !== formData.password2 ) {
            updatedErrors.password2 = "Confirm password does not match"
            isValid = false;
        }

        setErrorValidation(updatedErrors);
        return isValid
    }

    // Reset Form
    const handleReset = () => {
        setFormData({
            email: '',
            fullname: '',
            password: '',
            password2: '',
            department: '',
            role: 'user'
        })

        setAlertSuccess(false);
    }



    const handleSubmit = async(e) => {
        e.preventDefault();

        if ( !validateForm() ) {
            return;
        }

        try {
            let accessToken = localStorage.getItem('accessToken');
            
            let res = await fetch('/api/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    email: formData.email,
                    fullname: formData.fullname,
                    password: formData.password,
                    department: formData.department,
                    role: formData.role
                })
            });

            let data = await res.json();

            if ( res.ok) {
                console.log("success", data)
                setError(null);
                setAlertSuccess(true)

            } else if (res.status === 401) {
                //console.log("Creating failed due to old token: ",  accessToken)        
                try {
                    accessToken = await refreshToken();
                    //console.log("New Access Token: ", accessToken);
                    localStorage.setItem('accessToken', accessToken);

                    res = await fetch('/api/user', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken}`
                        },
                        body: JSON.stringify({
                            email: formData.email,
                            fullname: formData.fullname,
                            password: formData.password,
                            department: formData.department,
                            role: formData.role
                        })                        
                    });

                    data = await res.json();
                    
                    if ( res.ok) {
                        console.log("success", data)
                        setError(null);
                        setAlertSuccess(true)
                    }

                } catch (error) {
                    console.error('Error in refreshing token')
                    setShowAlert(true);
                }

            } else {
                console.error("Error in creating user")
                setError(data.error)
            }


        } catch (error) {
            console.error("Error:", error)
            setError(data.error)
        }
    }

    return (
        <Box sx={{ p:2, justifyContent: "center", alignItems: 'center', height: '70vh' }}>
            {showAlert && <ExpiredTokenAlert />}
            <Typography variant="h4">
                Add User
            </Typography>
            <Stack spacing={1} sx={{p:1}}>
                <TextField fullWidth variant="filled" sx={{width: '400px'}} 
                    name="email"
                    label="Email"
                    onChange={handleChange}
                    value={formData.email}
                    error={!!errorValidation.email}
                    helperText={errorValidation.email}
                    required
                />
                <TextField fullWidth variant="filled" sx={{width: '400px'}} 
                    name="fullname"
                    label="Full name"
                    onChange={handleChange}
                    value={formData.fullname}
                    error={!!errorValidation.fullname}
                    helperText={errorValidation.fullname}
                    required
                />
                <TextField fullWidth variant="filled" sx={{width: '400px'}} 
                    name="password"
                    label="Password"
                    type="password"
                    onChange={handleChange}
                    value={formData.password}
                    error={!!errorValidation.password}
                    helperText={errorValidation.password}
                    required
                />
                <TextField fullWidth variant="filled" sx={{width: '400px'}} 
                    name="password2"
                    label="Confirm password"
                    type="password"
                    onChange={handleChange}
                    value={formData.password2}
                    error={!!errorValidation.password2}
                    helperText={errorValidation.password2}
                    required
                />
                <TextField fullWidth variant="filled" sx={{width: '400px'}} 
                    name="department"
                    label="Department"
                    onChange={handleChange}
                    value={formData.department}
                />
                
                <Stack direction="row" spacing={1} sx={{p:1}}>
                    <FormControl >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <FormLabel id="role-radio-button">Role* &nbsp;&nbsp;&nbsp;&nbsp;</FormLabel>
                                <RadioGroup row
                                    name="role"
                                    aria-labelledby="role-radio-button"
                                    onChange={handleChange}
                                    value={formData.role}
                                >
                                    <FormControlLabel value="admin" control={<Radio />} label="Admin" />
                                    <FormControlLabel value="user" control={<Radio />} label="User" />
                                </RadioGroup>
                        </div>
                    </FormControl>
                </Stack>

                <Stack sx={{ alignItems: 'flex-start'}} >
                <Button variant="contained" onClick={handleSubmit}>
                    Submit
                </Button>
                
                { error && 
                <>
                    <Box mt={2}>
                        <Alert severity="error">
                            {error}
                        </Alert>
                    </Box>
                </>    
                }

                { alertSuccess &&
                <>
                    <Box mt={2}>
                        <Alert severity="success">
                            Successfully added new user
                        </Alert>
                        <Button onClick={handleReset}>Reset Form?</Button>
                    </Box>
                </>
                }
                
                </Stack>

            </Stack>
        </Box>

    )
}

export default AddUser;