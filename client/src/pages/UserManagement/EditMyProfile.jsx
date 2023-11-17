import { Alert, Box, Button, Link, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import refreshToken from "../../utils/refreshToken";
import ExpiredTokenAlert from "../../components/ExpiredTokenAlert";

const EditMyProfile = () => {

    const [showAlert, setShowAlert] = useState(false);

    const [fetched, setFetched] = useState(false);
    const [formData, setFormData ] = useState({
        fullname: '',
        email: '',
        department: '',
    });
    const [alertSuccess, setAlertSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [errorValidation, setErrorValidation] = useState({});
    const navigate = useNavigate();

    const fetchOwnProfile = async () => {
        try {
            
            if (fetched) { return; }

            let accessToken = localStorage.getItem('accessToken');

            const res = await fetch('/api/user/me', {
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
                });
                setFetched(true);

            } else if (res.status === 401) {    // Refreshing Access Token
                
                try {
                    accessToken = await refreshToken();
                    localStorage.setItem('accessToken', accessToken);
                    fetchOwnProfile();

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
        fetchOwnProfile();
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
            
            let res = await fetch('/api/user/me', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    email: formData.email,
                    fullname: formData.fullname,
                    department: formData.department,
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

                    res = await fetch('/api/user/me', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken}`
                        },
                        body: JSON.stringify({
                            email: formData.email,
                            fullname: formData.fullname,
                            department: formData.department,
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
                Update My Profile
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
                            Successfully updated own profile. View updated <Link href="/administration/myprofile">profile</Link>
                        </Alert>
                    }
                </Stack>

            </Stack>
        </Box>

    )
}

export default EditMyProfile;