import { useEffect, useState } from "react";
import refreshToken from "../../utils/refreshToken";
import { Box, Link, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableSortLabel, TablePagination } from '@mui/material';
import ExpiredTokenAlert from "../../components/ExpiredTokenAlert";


const ViewUsers = () => {
  const [fetched, setFetched] = useState(false);
  const [users, setUsers] = useState([]);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showAlert, setShowAlert] = useState(false);

  const fetchUsers = async () => {
      try {

          if (fetched) { return; }

          let accessToken = localStorage.getItem('accessToken');

          const res = await fetch('/api/user', {
              method: 'GET',
              headers: {
                  Authorization: `Bearer ${accessToken}`
              }
          });

          if  ( res.ok ) {
              
              const data = await res.json();
              setUsers(data);
              setFetched(true);

          } else if (res.status === 401) {    // Refreshing Access Token
              
              try {

                  accessToken = await refreshToken();
                  localStorage.setItem('accessToken', accessToken);
                  fetchUsers();

              } catch (error) {
                  //console.log('Error in refreshing token')
                  setShowAlert(true);
              }
          
          } else {
              //console.log("Error in fetching data")
          }
          
      } catch (error) {
          //console.log(error);
      }
  }

  useEffect( () => {
      fetchUsers();
  }, [fetched, users])

  const handleSort = (field) => {
    const isAsc = sortField === field && sortDirection === 'asc';
    setSortField(field);
    setSortDirection(isAsc ? 'desc' : 'asc');
  };

  const sortedData = [...users].sort((a, b) => {
    if (a[sortField] < b[sortField]) {
      return sortDirection === 'asc' ? -1 : 1;
    }
    if (a[sortField] > b[sortField]) {
      return sortDirection === 'asc' ? 1 : -1;
    }
    return 0;
  });


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
 

  return (
  <Box >
     {showAlert && <ExpiredTokenAlert />}
    <TableContainer component={Paper}>
      <Table>
        <TableHead sx={{ bgcolor: 'secondary.main' }}>
          <TableRow>
            <TableCell>
              <TableSortLabel
                active={sortField === 'email'}
                direction={sortField === 'email' ? sortDirection : 'asc'}
                onClick={() => handleSort('email')}
                style={{ color: 'white' }}
              >
                Email
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortField === 'fullname'}
                direction={sortField === 'fullname' ? sortDirection : 'asc'}
                onClick={() => handleSort('fullname')}
                style={{ color: 'white' }}
              >
                Full Name
              </TableSortLabel>
            </TableCell>
            <TableCell>
            <TableSortLabel
              active={sortField === 'department'}
              direction={sortField === 'department' ? sortDirection : 'asc'}
              onClick={() => handleSort('department')}
              style={{ color: 'white' }}
            >
              Department
            </TableSortLabel>
          </TableCell>
          <TableCell>
            <TableSortLabel
              active={sortField === 'role'}
              direction={sortField === 'role' ? sortDirection : 'asc'}
              onClick={() => handleSort('role')}
              style={{ color: 'white' }}
            >
              Role
            </TableSortLabel>
          </TableCell>
        </TableRow>
        </TableHead>
      <TableBody>
        {sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
          <TableRow key={row._id}>
            <TableCell>
              {row.email}
            </TableCell>
            <TableCell>
              <Link href={`/administration/users/${row._id}`} >
                {row.fullname}
              </Link>
            </TableCell>
            <TableCell>{row.department}</TableCell>
            <TableCell>{row.role}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      </Table>
    </TableContainer>
    <TablePagination
      rowsPerPageOptions={[5, 10, 25]}
      component="div"
      count={users.length}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
  </Box>  
  )
}

export default ViewUsers;