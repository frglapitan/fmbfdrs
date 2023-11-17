import { useState } from "react";
import { Alert, Box, Button, LinearProgress, Typography } from "@mui/material";
import refreshToken from "../../utils/refreshToken";
import ExpiredTokenAlert from "../../components/ExpiredTokenAlert";


const UploadCSVFireIndex = () => {

    const [selectedFile, setSelectedFile] = useState();
    const [alertSuccess, setAlertSuccess] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false)

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        if (alertSuccess) { 
            setAlertSuccess(false)
        };
    };

    const handleFileUpload = async () => {
        setLoading(true);
        const formData = new FormData();
        formData.append('csvfile', selectedFile);

        try {

            let accessToken = localStorage.getItem('accessToken');

            let response = await fetch('/api/fire_index/csv_upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                },
                body: formData,
            });

            if (!response.ok) {

                if (response.status === 401) {
                    try {
                        accessToken = await refreshToken();
                        localStorage.setItem('accessToken', accessToken);

                        response = await fetch('/api/fire_index/csv_upload', {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${accessToken}`
                            },
                            body: formData,
                        });

                        if (!response.ok) {
                            throw new Error('Error uploading file');
                        }

                    } catch (error) {
                        console.error('Error in refreshing token')
                        setShowAlert(true);
                    }
                } else {
                    throw new Error('Error uploading file');
                }
            }

            const data = await response.json();

            console.log(data.message);
            setError(null);
            setAlertSuccess(true);

        } catch (error) {
            console.error('Error:', error);
            setError(error)
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p:2, justifyContent: "center", alignItems: 'center', height: '70vh' }}>
            {showAlert && <ExpiredTokenAlert />}
            <Typography variant="h4">
                Upload CSV File for Fire Index Data
            </Typography>
            <Box display="flex" alignItems="center" mt={2}>
            <input
                accept=".csv"
                style={{ display: 'none' }}
                id="contained-button-file"
                type="file"
                onChange={handleFileChange}
            />

            <label htmlFor="contained-button-file">
            <Button variant="contained" color="primary" component="span" disabled={loading}>
                Select File
            </Button>
            </label>

            {selectedFile && <Typography variant="subtitle1" style={{ marginLeft: '10px' }} > {`${selectedFile.name}`}</Typography>}

            </Box>
            <Box mt={2}>
                <Button variant="contained" color="secondary" onClick={handleFileUpload} disabled={!selectedFile || loading}>
                    Upload
                </Button>
                { loading &&  <Box sx={{width: '50%', paddingTop: '5px', paddingBottom: '5px', marginLeft: 'auto', marginRight: 'auto'}}>Processing... <LinearProgress />  </Box>}
            </Box>

            {error && 
                <Box mt={2}>
                    <Alert severity="error">
                        {error}
                    </Alert>
                </Box>
            }
            { alertSuccess &&
                <Box mt={2}>
                    <Alert severity="success">
                        Successfully processed <b>{selectedFile.name}</b>. 
                    </Alert>
                </Box>
                
            }
        </Box>
    )
}

export default UploadCSVFireIndex;