import { Link } from "react-router-dom";
import Container from '@mui/material/Container';
import { Grid, Typography } from "@mui/material";

const NoPage = () => {
    return (

        <Container component="main" maxWidth="md">
            <Grid container spacing={2} sx={{marginTop:"55px" }} direction="column">
                <Grid item>
                    <Typography variant="h4">
                        Oops.. The page you are looking for does not exist.
                    </Typography>
                </Grid>

                <Grid item>
                    <Typography variant="body2">
                        Go back to <Link to="/">Home</Link>
                    </Typography>    
                </Grid> 
                
            </Grid>
        </Container>
        
    )

}

export default NoPage;