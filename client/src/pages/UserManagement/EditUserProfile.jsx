import { Alert, Box, Button, FormControl, FormControlLabel, FormLabel, Link, Radio, RadioGroup, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import refreshToken from "../../utils/refreshToken";
import ExpiredTokenAlert from "../../components/ExpiredTokenAlert";

const EditUserProfile = () => {

    const params = useParams();
    const id = params.id;
    const navigate = useNavigate();

    const [showAlert, setShowAlert] = useState(false);

    const [fetched, setFetched] = useState(false);
    const [formData, setFormData ] = useState({
        fullname: '',
        email: '',
        department: '',
        role: 'user'
    });

    const [alertSuccess, setAlertSuccess] = useState(false);
    const [alertReset, setAlertReset] = useState(false);
    const [error, setError] = useState(null);
    const [errorValidation, setErrorValidation] = useState({});

    const fetchUserProfile = async () => {
        try {
            
            if (fetched) { return; }

            let accessToken = localStorage.getItem('accessToken');

            const res = await fetch(`/api/user/u/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if  ( res.ok ) {
                
                const data = await res.json();
                
                setFormData({
                    fullname: data.fullname, 
                    email: data.email,
                    department: data.department,
                    role: data.role
                });
                setFetched(true);

            } else if (res.status === 401) {    // Refreshing Access Token
             
                try {
                    accessToken = await refreshToken();
                    localStorage.setItem('accessToken', accessToken);
                    fetchUserProfile();

                } catch (error) {
                    //console.log('Error in refreshing token')
                    setShowAlert(true);                  
                }
            
            } else {
                //console.log("Error in fetching data")
                setError(data.error)
            }
            
        } catch (error) {
            //console.log(error);
            setError(error)
        }
    }

    useEffect( () => {
        fetchUserProfile();
    }, [fetched, formData])

    
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
            
            let res = await fetch(`/api/user/u/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    email: formData.email,
                    fullname: formData.fullname,
                    department: formData.department,
                    role: formData.role,
                })
            });

            let data = await res.json();

            if ( res.ok) {
                console.log("success", data)
                setError(null);
                setAlertReset(false);
                setAlertSuccess(true);

            } else if (res.status === 401) {
                
                try {
                    accessToken = await refreshToken();
                    localStorage.setItem('accessToken', accessToken);

                    res = await fetch(`/api/user/u/${id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken}`
                        },
                        body: JSON.stringify({
                            email: formData.email,
                            fullname: formData.fullname,
                            department: formData.department,
                            role: formData.role,
                        })                        
                    });

                    data = await res.json();
                    
                    if ( res.ok) {
                        setError(null);
                        setAlertReset(false);
                        setAlertSuccess(true);
                    }

                } catch (error) {
                    //console.log('Error in refreshing token')
                    setShowAlert(true);
                }

            } else {
                //console.log("Error in updating user profile")
                setError(data.error)
            }

        } catch (error) {
            //console.log("Error:", error)
            setError(data.error)
        }
    }

    // Send Reset Password link to the registered email
    const handleResetPassword = async(e) => {
        if ( !formData.email ) {
            return;
        }

        try {
            const res = await fetch('/api/auth/forgot-password', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email:formData.email }),
            });
      
            const data = await res.json();
      
            if (res.ok) {
              
              setError(null);
              setAlertReset(true);
      
            } else {
              setError(data.error);
            }
          } catch (error) {
            setError('An error occurred during sending reset password email. Please try again.');
            //console.error('Error:', error);
          }

    }


    return (
        <Box sx={{ p:2, justifyContent: "center", alignItems: 'center', height: '70vh' }}>
            {showAlert && <ExpiredTokenAlert />}
            <Typography variant="h4">
                Update User Profile
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
                                    { formData.role === 'sysadmin' && 
                                        <FormControlLabel value="sysadmin" control={<Radio />} label="System Admin" />
                                    }
                                    <FormControlLabel value="admin" control={<Radio />} label="Admin" />
                                    <FormControlLabel value="user" control={<Radio />} label="User" />
                                </RadioGroup>
                        </div>
                    </FormControl>
                </Stack>

                <Button variant="contained" sx={{width: '400px'}} color="secondary" onClick={handleResetPassword}>
                    Send Reset Password Email
                </Button>

                <br />
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
                            Successfully updated user profile. View updated <Link href={`/administration/users/${id}`}>profile</Link>
                        </Alert>
                    }
                    { alertReset &&
                        <Alert severity="success">
                            Reset password link sent to the registered email.
                        </Alert>
                    }
                </Stack>

            </Stack>
        </Box>

    )
}

export default EditUserProfile;