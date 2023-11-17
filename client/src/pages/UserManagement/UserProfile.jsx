import { useEffect, useState } from "react";
import refreshToken from "../../utils/refreshToken";
import { Box, Button, Card, CardContent, Container, Typography } from "@mui/material";
import ExpiredTokenAlert from "../../components/ExpiredTokenAlert";
import { useParams } from "react-router-dom";

const UserProfile = () => {
    
    const [fetched, setFetched] = useState(false);
    const [user, setUser] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    
    const params = useParams();
    const id = params.id;
    
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
                setUser(data);
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
                //console.error("Error in fetching data")
            }
            
        } catch (error) {
            //console.error(error);
        }
    }

    useEffect( () => {
        fetchUserProfile();
    }, [fetched, user])

    return (
        
        <Box sx={{ p:2, justifyContent: "center", alignItems: 'center', height: '70vh' }}>

            {showAlert && <ExpiredTokenAlert />}

            <Card sx={{ p:2, width: '50%' }}>
                <CardContent>
                    <Typography variant="h4" >User Profile</Typography>
            {
                user && (
                    <>
                        <br />
                        <Typography variant="h5">Name: {user.fullname}</Typography>
                        <Typography variant="body1" >Email: {user.email}</Typography>
                        <Typography variant="body2" >Department: {user.department}</Typography>
                        <Typography variant="body2" >Role: {user.role}</Typography>
                        <br />
                        <Typography variant="body2" >Last updated: {new Date(user.updatedAt).toLocaleString()}</Typography>
                        <Container sx={{ display: 'flex', justifyContent: 'center', marginTop: '15px' }}>
                            <Button variant="contained" href={`/administration/users/${user._id}/edit`}>Edit Profile</Button>
                        </Container>
                        
                    </>
                )
            }
                </CardContent>
            
            </Card>
        </Box>
            
    )
}

export default UserProfile;