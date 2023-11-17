import { Box, Container, Grid, Link, Typography } from "@mui/material";
import GovSeal from "./govph-seal-mono-footer.jpg"

const PublicFooter = () => {
    return (
        <Box sx={{backgroundColor:'#efefef'}} component="footer">
            <Grid container spacing={2} alignItems="flex-start" sx={{padding: 1}}>
                <Grid item xs={2} display="flex" justifyContent="center">
                    <img src={GovSeal}  height={100} width={100} alt="PH Government Seal"/>
                </Grid>
                <Grid item xs={3} justifyContent="center">
                    <Typography sx={{fontSize: '0.8rem'}}>REPUBLIC OF THE PHILIPPINES</Typography>
                    <Typography sx={{fontSize: '0.75rem'}}>
                        All content is in the public domain unless otherwise stated
                    </Typography>
                </Grid>
                <Grid item xs={4} justifyContent="center">
                    <Typography sx={{fontSize: '0.8rem'}}>ABOUT GOVPH</Typography>
                    <Typography sx={{fontSize: '0.75rem',  marginBottom: '0.5rem'}}>
                        Learn more about the Philippine Government, its structure, how government works and the people behind it.
                    </Typography>
                    
                    <Link href="http://www.gov.ph" underline="none" sx={{color: 'black', fontSize:'.75rem' }}>GOV.PH</Link><br/>
                    <Link href="http://www.gov.ph/data" underline="none" sx={{color: 'black', fontSize:'.75rem' }}>Open Data Portal</Link><br />
                    <Link href="http://www.officialgazette.gov.ph" underline="none" sx={{color: 'black', fontSize:'.75rem' }}>Official Gazette</Link>
                </Grid>
                <Grid item xs={3} justifyContent="center">
                    <Typography sx={{fontSize: '0.8rem'}}>GOVERNMENT LINKS</Typography>
                    <Link href="http://president.gov.ph" underline="none" sx={{color: 'black', fontSize:'.75rem' }}>Office of the President</Link><br/>
                    <Link href="http://ovp.gov.ph" underline="none" sx={{color: 'black', fontSize:'.7rem' }}>Office of the Vice President</Link><br/>
                    <Link href="http://www.senate.gov.ph" underline="none" sx={{color: 'black', fontSize:'.7rem' }}>Senate of the Philippines</Link><br/>
                    <Link href="http://www.congress.gov.ph" underline="none" sx={{color: 'black', fontSize:'.7rem' }}>House of Representatives</Link><br/>
                    <Link href="http://sc.judiciary.gov.ph" underline="none" sx={{color: 'black', fontSize:'.7rem' }}>Supreme Court</Link><br/>
                    <Link href="http://ca.judiciary.gov.ph" underline="none" sx={{color: 'black', fontSize:'.7rem' }}>Court of Appeals</Link><br/>
                    <Link href="http://sb.judiciary.gov.ph" underline="none" sx={{color: 'black', fontSize:'.7rem' }}>Sandiganbayan</Link><br/>
                </Grid>
            </Grid>
        </Box>
    )
};

export default PublicFooter;