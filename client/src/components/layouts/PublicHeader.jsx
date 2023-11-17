import { AppBar, Toolbar, Stack, Button } from '@mui/material';
import { Link } from "react-router-dom"

const PublicHeader = () => {

    return (
        <AppBar component='nav' position='sticky' style={{backgroundColor:'lightgray'}}>
            <Toolbar>
                <Stack direction='row' spacing={2}>
                    <Button color='primary' component={Link} to="https://forestry.denr.gov.ph/">DENR - FMB </Button>
                    <Button style={{color: 'black'}} color='primary' component={Link} to="/">Forest Fire Danger Rating System</Button>
                </Stack>
            </Toolbar>
        </AppBar>
    );
}

export default PublicHeader;