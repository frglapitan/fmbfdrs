import { useEffect, useState } from "react";
import refreshToken from "../../utils/refreshToken";
import { Box, Button, Card, CardContent, Container, Typography } from "@mui/material";
import ExpiredTokenAlert from "../../components/ExpiredTokenAlert";

const MyProfile = () => {
    
    const [fetched, setFetched] = useState(false);
    const [user, setUser] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    
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
                
                setUser(data);
                setFetched(true);

            } else if (res.status === 401) {    // Refreshing Access Token
                
                try {
                    accessToken = await refreshToken();
                
                    localStorage.setItem('accessToken', accessToken);
                    fetchOwnProfile();

                } catch (error) {
                    console.log('Error in refreshing token')
                    setShowAlert(true);
                }
            
            } else {
                console.log("Error in fetching data")
            }
            
        } catch (error) {
            console.log(error);
        }
    }

    useEffect( () => {
        fetchOwnProfile();
    }, [fetched, user])

    return (
        
        <Box sx={{ p:2, justifyContent: "center", alignItems: 'center', height: '70vh' }}>

            {showAlert && <ExpiredTokenAlert />}

            <Card sx={{ p:2, width: '50%' }}>
                <CardContent>
                    <Typography variant="h4" >My Profile</Typography>
            {
                user && (
                    <>
                        <br />
                        <Typography variant="h5">Name: {user.fullname}</Typography>
                        <Typography variant="body1" >Email: {user.email}</Typography>
                        <Typography variant="body2" >Department: {user.department}</Typography>
                        <Typography variant="body2" >Role: {user.role}</Typography>
                        <br />
                        <Button variant="contained" href="/administration/myprofile/changepwd" color="secondary">
                            Change Password
                        </Button>
                        
                        <br /><br />
                        <Typography variant="body2" >Last updated: {new Date(user.updatedAt).toLocaleString()}</Typography>
                        
                        <Container sx={{ display: 'flex', justifyContent: 'center', marginTop: '15px' }}>
                            <Button variant="contained" href="/administration/myprofile/edit">Edit Profile</Button>
                        </Container>
                        
                    </>
                )
            }
                </CardContent>
            
            </Card>
        </Box>
            
    )
}

export default MyProfile;