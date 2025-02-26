import { Box, Button, colors, Grid2, lighten, Paper, styled, TableContainer, ThemeProvider, Typography } from "@mui/material"
import { AppTheme } from "../theme";
import API_URL from "../api/api";
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
const HomeScreen = () => {
  const [statuses, setStatuses] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const buttonStyle = {mt: '30px', width: '24%', height: '20vh', borderWidth: '4px'}

  const columns = [
    {
        field: 'DESCRIPTION',
        headerName: 'Status',
        flex: 0.3
    },
    {
        field: 'EFFECT_DATE',
        headerName: 'Effective Date',
        flex: 0.1
    },
    {
      field: 'STATUS_TYPE',
      headerName: 'Status Type',
      flex: 0.1
  }
  ];

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getStatuses = async () => {
        try {
            const response = await axiosPrivate.get(API_URL.STATUS_URL, {
                signal: controller.signal
            });
            console.log(JSON.stringify(response));
            isMounted && setStatuses(response.data);
        } catch (err) {
            console.error(err);
        }
    }

    getStatuses();

    return () => {
        isMounted = false;
        controller.abort();
    }
},[]);

function getRowId(row) {
  return row.STATUS_ID;
}

const StyledDataGrid = styled(DataGrid)(({}) => ({
'& .release-theme': {
  backgroundColor: 'lightgreen'
},
'& .maintenance-theme': {
  backgroundColor: '#FFEE8C'
},
'& .error-theme': {
  backgroundColor: 'red',
  color: 'white'
}
}))

  return (
    <ThemeProvider theme={AppTheme}>
    <Box>
      <Grid2 container sx={{display:'flex', justifyContent:'space-evenly'}}>
          <Button variant="outlined" sx={buttonStyle} href="plan">
            <Typography>Training Plan</Typography>
          </Button>

          <Button variant="outlined" sx={buttonStyle} href="course">
           <Typography>Course Catalog</Typography> 
          </Button>

          <Button variant="outlined" sx={buttonStyle} href="employee">
            <Typography>Employees</Typography>
          </Button>

          <Button variant="outlined" sx={buttonStyle} href="org">
           <Typography>Organizations</Typography>
          </Button>
      </Grid2>
    <Box sx={{ paddingLeft: '1%',  paddingRight: '1%', paddingBottom: '3%', paddingTop: '1%'}}>
                    <TableContainer component={Paper} sx={{minHeight:'300px'}}>
                        <StyledDataGrid
                            columns={columns}
                            rows={statuses}
                            getRowId={getRowId}
                            getRowHeight={() => 'auto'}
                            getRowClassName={(params) => `${params.row.STATUS_TYPE}-theme`}
                            sx={{
                                "& .MuiDataGrid-cell, & .MuiDataGrid-columnHeaderTitle": {
                                    textOverflow: "clip"
                                },
                                minHeight:'300px'
                            }}
                            initialState={{
                              sorting: {
                                sortModel: [{ field: 'EFFECT_DATE', sort: 'aesc' }],
                              },
                            }}

                            
                        />

                    </TableContainer>
                </Box>
    </Box>
    </ThemeProvider>
  );
};

export default HomeScreen;