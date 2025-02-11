import { Box, Button, Dialog, DialogContent, FormLabel, Grid2, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, ThemeProvider, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { AppTheme } from "../theme";
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useLocation, useNavigate } from "react-router";
import API_URL from "../api/api";
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

const OrgScreen = () => {
  const [addOrg, setAddOrg] = useState(false);
  const [org_code, setOrg_Code] = useState('');
  const [org_title, setOrg_Title] = useState('');
  const [org_desc, setOrg_Desc] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const [orgs, setOrgs] = useState([]);
  const location = useLocation();
  const [success, setSuccess] = useState(false);
  const [confirmDeleteVis, setConfirmDeleteVis] = useState(false);
  const [orgToDelete, setOrgToDelete] = useState(false);
  const [confirmDeleteErr, setConfirmDeleteErr] = useState('');
  const [emps, setEmps] = useState([]);
  const [viewMembers, setViewMembers] = useState(false);
  const [viewMembersFilter, setViewMembersFilter] = useState('');

  const columns = [
    { field: 'ORG_CODE', headerName: 'Organization Code', flex: 0.4 },
    {
      field: 'ORG_TITLE',
      headerName: 'Title',
      flex: 0.5
    },
    {
      field: 'ORG_DESC',
      headerName: 'Description',
      flex: 0.6
    },
    {
      field: 'view_members',
      headerName: 'View Members',
      flex: 0.3,
      sortable: false,
      renderCell: (params) => {

        return (
          <Button onClick={() => { setViewMembersFilter(params.row.ORG_CODE); setViewMembers(true); }}>View Members</Button>
        )
      }
    },
    {
      field: 'delete',
      headerName: 'Delete',
      flex: 0.25,
      sortable: false,
      renderCell: (params) => {

        return (
          <Button onClick={() => confirmDelete(params.row.ORG_CODE)}><DeleteOutlineOutlinedIcon color="error" /></Button>
        )
      }
    },
  ];

  const empColumns = [
    { field: 'EMPID', headerName: 'EMP ID', flex: 0.3 },
    { field: 'F_NAME', headerName: 'First Name', flex: 0.4 },
    {
      field: 'L_NAME',
      headerName: 'Last Name',
      flex: 0.5
    },
    {
      field: 'EFFECTIVE_PAY',
      headerName: 'Effective Pay',
      flex: 0.6,
      valueFormatter: (value) => {
        return (new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
        }).format(value))
      }
    }]


  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getOrgs = async () => {
      try {
        const response = await axiosPrivate.get(API_URL.ORG_URL, {
          signal: controller.signal
        });
        console.log(response.data);
        isMounted && setOrgs(response.data);
      } catch (err) {
        console.error(err);
      }
    }

    getOrgs();

    return () => {
      isMounted = false;
      controller.abort();
      setSuccess(false);
    }
  }, [success])

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getEmps = async () => {
      try {
        const response = await axiosPrivate.get(API_URL.EMP_URL, {
          signal: controller.signal
        });
        console.log(response.data);
        isMounted && setEmps(response.data);
      } catch (err) {
        console.error(err);
      }
    }

    getEmps();

    return () => {
      isMounted = false;
      controller.abort();
    }
  }, [])

  const onClose = () => {
    setOrg_Code('');
    setErrMsg('');
    setOrg_Title('');
    setOrg_Desc('');
    setAddOrg(false);
  }

  const onSubmit = async () => {
    setErrMsg('');
    try {
      const response = await axiosPrivate.post(API_URL.ORG_URL,
        JSON.stringify({ org_code, org_title, org_desc })
      )
      console.log(JSON.stringify(response))
      setAddOrg(false);
      setSuccess(true);
      setOrg_Code('');
      setOrg_Title('');
      setOrg_Desc('');
    } catch (err) {
      if (!err?.response) { setErrMsg('No Server Response') }
      else if (err.response?.status === 409) {
        setErrMsg('Organization Code Taken');
      } else if (err.response?.status === 400) {
        setErrMsg('Organization details missing');
      } else if (err.response?.status === 401) {
        setErrMsg('Unauthorized Access');
      }
      else {
        setErrMsg('Organization failed to be created.')
      }
    }
  }

  function getRowId(row) {
    return row.ORG_CODE;
  }

  function getRowEmpId(row) {
    return row.EMPID;
  }

  const deleteOrg = async () => {
    setConfirmDeleteErr('');
    try {
      const response = await axiosPrivate.delete(API_URL.ORG_URL,
        {
          data: {
            org_code: orgToDelete
          }
        }
      )
      console.log(JSON.stringify(response))
      setConfirmDeleteVis(false);
      setSuccess(true);
      setOrgToDelete('');
    } catch (err) {
      if (!err?.response) { setConfirmDeleteErr('No Server Response') }
      else if (err.response?.status === 400) {
        setConfirmDeleteErr('Org code missing');
      } else if (err.response?.status === 401) {
        setConfirmDeleteErr('Unauthorized Access');
      }
      else {
        setConfirmDeleteErr('Organization failed to be created.')
      }
    }
  }

  const confirmDelete = (org) => {
    setConfirmDeleteVis(true);
    setOrgToDelete(org);
  }



  return (
    <ThemeProvider theme={AppTheme}>
      <Box>
        <Grid2 container paddingTop={'1%'} paddingRight={'3%'} paddingLeft={'3%'} justifyContent="space-between">
          <Grid2 item >
            <Typography variant="h5" >Organizations</Typography>
          </Grid2>
          <Grid2 item justifyContent="flex-end">
            <Button variant="contained" onClick={() => setAddOrg(true)}><AddBoxOutlinedIcon sx={{ paddingRight: '2%' }} /> Add Organization  </Button>
          </Grid2>
        </Grid2>
        <Box sx={{ paddingLeft: '3%',  paddingRight: '3%', paddingBottom: '3%', paddingTop: '1%'}}>
          <TableContainer component={Paper}>
            <DataGrid
              columns={columns}
              rows={orgs}
              getRowId={getRowId}
            />

          </TableContainer>
        </Box>
        <Dialog open={addOrg} onClose={() => setAddOrg(false)}>
          <DialogContent>
            {errMsg ? <Typography color="error">{errMsg}</Typography> : <></>}
            <Typography fontStyle={'h1'} paddingBottom={'2%'}>Create Organization</Typography>
            <FormLabel>Organization Code</FormLabel>
            <TextField
              fullWidth
              variant="outlined"
              size='small'
              value={org_code}
              onChange={(e) => setOrg_Code(e.target.value)}
            />
            <FormLabel>Title</FormLabel>
            <TextField
              fullWidth
              variant="outlined"
              size='small'
              value={org_title}
              onChange={(e) => setOrg_Title(e.target.value)}
            />
            <FormLabel>Description</FormLabel>
            <TextField
              fullWidth
              variant="outlined"
              size='small'
              value={org_desc}
              onChange={(e) => setOrg_Desc(e.target.value)}
            />
            <Grid2 container justifyContent="flex-end" paddingTop={'2%'}>
              <Button variant="contained" color="error" size="small" sx={{ mr: '2%' }} onClick={() => onClose()}>Cancel</Button>
              <Button variant="contained" color="success" size="small" onClick={() => onSubmit()}>Submit</Button>
            </Grid2>
          </DialogContent>

        </Dialog>
        <Dialog open={confirmDeleteVis} onClose={async () => { setConfirmDeleteVis(false); setOrgToDelete(''); setConfirmDeleteErr(''); }}>
          <DialogContent>
            {confirmDeleteErr ? <Typography color="error">{confirmDeleteErr}</Typography> : <></>}
            <Typography>
              Are you sure you want to delete this organization: {orgToDelete}?
            </Typography>
            <Grid2 container justifyContent="center" paddingTop={'2%'}>
              <Button onClick={async () => { setConfirmDeleteVis(false); setOrgToDelete(''); setConfirmDeleteErr(''); }} sx={{ mr: '2%' }} color="error" size="small" variant="contained">Cancel</Button>
              <Button onClick={() => deleteOrg()} color="success" size="small" variant="contained">Confirm</Button>
            </Grid2>
          </DialogContent>
        </Dialog>

        <Dialog fullWidth maxWidth='md' open={viewMembers} onClose={async () => { setViewMembers(false); setViewMembersFilter(''); }}>
          <DialogContent>
            <Grid2 container paddingTop={'2%'} fullWidth justifyContent={"space-between"}>
              <Grid2 item paddingTop={'1.4%'} paddingLeft={'2%'}>
                <Typography>{viewMembersFilter} Employees</Typography>
              </Grid2>
              <Grid2 item >
                <IconButton onClick={async () => { setViewMembers(false); }} sx={{ mr: '2%' }} color="error" size={"large"} children={<CancelOutlinedIcon />} />
              </Grid2>
            </Grid2>
            <Box sx={{ padding: '3%' }}>
              <TableContainer component={Paper}>
                <DataGrid
                  columns={empColumns}
                  rows={emps.filter(emp => emp.ORG_CODE === viewMembersFilter)}
                  getRowId={getRowEmpId}
                />

              </TableContainer>
            </Box>
          </DialogContent>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default OrgScreen;