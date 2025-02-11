import { Accordion, AccordionActions, Box, Button, Dialog, DialogContent, Grid2, IconButton, InputLabel, MenuItem, OutlinedInput, Paper, Select, TableContainer, TextField, ThemeProvider, Typography } from "@mui/material"
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import { AppTheme } from "../theme";
import { useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { DataGrid } from "@mui/x-data-grid";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import API_URL from "../api/api";

const EmployeeScreen = () => {
  const [addEmpDialog, setAddEmpDialog] = useState(false);
  const [Emps, setEmps] = useState([]);
  const [NewEmps, SetNewEmps] = useState([{ f_name: '', l_name: '', org_code: '', effective_pay: '', index: 0 }]);
  const [orgs, setOrgs] = useState([]);
  const [errMsg, setErrMsg] = useState('')
  const axiosPrivate = useAxiosPrivate();
  const [success, setSuccess] = useState(false);
  const [confirmDeleteVis, setConfirmDeleteVis] = useState(false);
  const [empToDelete, setEmpToDelete] = useState(false);
  const [confirmDeleteErr, setConfirmDeleteErr] = useState('');

  const columns = [
    { field: 'EMPID', headerName: 'EMP ID', flex: 0.4 },
    { field: 'F_NAME', headerName: 'First Name', flex: 0.4 },
    {
      field: 'L_NAME',
      headerName: 'Last Name',
      flex: 0.5
    },
    {
      field: 'EFFECTIVE_PAY',
      headerName: 'Effective Pay',
      flex: 0.4,
      valueFormatter: (value) => {
        return (new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
        }).format(value))
      }
    },
    {
      field: 'ORG_CODE',
      headerName: 'Organization',
      flex: 0.3
    },
    {
      field: 'delete',
      headerName: 'Delete',
      flex: 0.25,
      sortable: false,
      renderCell: (params) => {

        return (
          <Button onClick={() => confirmDelete(params.row.EMPID)}><DeleteOutlineOutlinedIcon color="error" /></Button>
        )
      }
    },
  ];

  const confirmDelete = (emp) => {
    setConfirmDeleteVis(true);
    setEmpToDelete(emp);
  }

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getOrgs = async () => {
      try {
        const response = await axiosPrivate.get(API_URL.ORG_URL, {
          signal: controller.signal
        });
        const org_names = response.data.map(org => org.ORG_CODE);
        isMounted && setOrgs(org_names);
      } catch (err) {
        console.error(err);
      }
    }

    getOrgs();

    return () => {
      console.log(orgs)
      isMounted = false;
      controller.abort();
    }
  }, [])

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getEmps = async () => {
      try {
        const response = await axiosPrivate.get(API_URL.EMP_URL, {
          signal: controller.signal
        });
        isMounted && setEmps(response.data);
      } catch (err) {
        console.error(err);
      }
    }

    getEmps();

    return () => {
      console.log(orgs)
      isMounted = false;
      controller.abort();
      setSuccess(false);
    }
  }, [success])


  const onSubmit = async () => {
    setErrMsg('');
    try {
      const response = await axiosPrivate.post(API_URL.EMP_URL,
        JSON.stringify({ employees: NewEmps })
      )
      console.log(JSON.stringify(response));

      setAddEmpDialog(false);
      SetNewEmps([{ f_name: '', l_name: '', org_code: '', effective_pay: '', index: 0 }]);
      setSuccess(true);
    } catch (err) {
      if (!err?.response) { setErrMsg('No Server Response') }
      else if (err.response?.status === 400) {
        setErrMsg('Employee details missing');
      } else if (err.response?.status === 401) {
        setErrMsg('Unauthorized Access');
      }
      else {
        setErrMsg('Employees failed to be created.')
      }
    }
  }

  const onClose = () => {
    SetNewEmps([{ f_name: '', l_name: '', org_code: '', effective_pay: '', index: 0 }]);
    setErrMsg('');
    setAddEmpDialog(false);
  }

  const handleNewEmpEdit = (e, i, f) => {
    let newEmp = {};
    if (f === "f_name") newEmp = { f_name: e.target.value, l_name: NewEmps[i].l_name, org_code: NewEmps[i].org_code, effective_pay: NewEmps[i].effective_pay, index: i };
    else if (f === "l_name") newEmp = { f_name: NewEmps[i].f_name, l_name: e.target.value, org_code: NewEmps[i].org_code, effective_pay: NewEmps[i].effective_pay, index: i };
    else if (f === "org_code") newEmp = { f_name: NewEmps[i].f_name, l_name: NewEmps[i].l_name, org_code: e.target.value, effective_pay: NewEmps[i].effective_pay, index: i };
    else if (f === "effective_pay") newEmp = { f_name: NewEmps[i].f_name, l_name: NewEmps[i].l_name, org_code: NewEmps[i].org_code, effective_pay: e.target.value, index: i };
    const filteredEmps = NewEmps.filter(emps => emps.index != i);
    SetNewEmps([...filteredEmps, newEmp].sort(function (a, b) { return a.index - b.index }));
  }

  const removeNewEmp = (i) => {
    if (NewEmps.length > 1) {
      const empsBelow = NewEmps.filter(emps => emps.index < i);
      const empsAbove = (NewEmps.filter(emps => emps.index > i)).map(emp => ({ f_name: emp.f_name, l_name: emp.l_name, effective_pay: emp.effective_pay, org_code: emp.org_code, index: emp.index - 1 }))
      SetNewEmps([...empsBelow, ...empsAbove]);
    }
  }

  const deleteEmp = async () => {
    setConfirmDeleteErr('');
    try {
      const response = await axiosPrivate.delete(API_URL.EMP_URL,
        {
          data: {
            empid: empToDelete
          }
        }
      )
      console.log(JSON.stringify(response))
      setConfirmDeleteVis(false);
      setSuccess(true);
      setEmpToDelete('');
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

  function getRowId(row) {
    return row.EMPID;
  }


  return (
    <ThemeProvider theme={AppTheme}>
      <Box>
        <Box>
          <Grid2 container paddingTop={'1%'} paddingRight={'3%'} paddingLeft={'3%'} justifyContent="space-between">
            <Grid2 item >
              <Typography variant="h5" >Employees</Typography>
            </Grid2>
            <Grid2 item justifyContent="flex-end">
              <Button variant="contained" onClick={() => setAddEmpDialog(true)} ><AddBoxOutlinedIcon sx={{ paddingRight: '2%' }} /> Add Employees  </Button>
            </Grid2>
          </Grid2>
        </Box>

        <Box sx={{ paddingLeft: '3%', paddingRight: '3%', paddingBottom: '3%', paddingTop: '1%' }}>
          <TableContainer component={Paper}>
            <DataGrid
              columns={columns}
              rows={Emps}
              getRowId={getRowId}
            />

          </TableContainer>
        </Box>
        <Dialog open={addEmpDialog} onClose={() => setAddEmpDialog(false)} maxWidth="md">
          <DialogContent>
            {errMsg ? <Typography color="error">{errMsg}</Typography> : <></>}
            <Typography fontStyle={'h1'} paddingLeft={'2%'} paddingBottom={'2%'}>Create Employees</Typography>
            {NewEmps.map((emp) => {
              return (
                <Accordion defaultExpanded key={emp.index}>
                  <AccordionActions>
                    <Typography>{emp.index + 1}</Typography>
                    <TextField label="First Name" size="small" variant="outlined" fullWidth value={emp.f_name} onChange={(e) => handleNewEmpEdit(e, emp.index, "f_name")} />
                    <TextField label="Last Name" size="small" variant="outlined" fullWidth value={emp.l_name} onChange={(e) => handleNewEmpEdit(e, emp.index, "l_name")} />
                    <TextField type="number" label="Effective Pay" size="small" variant="outlined" fullWidth value={emp.effective_pay} onChange={(e) => handleNewEmpEdit(e, emp.index, "effective_pay")} />
                    <TextField label="Org Code" size="small" variant="outlined" select fullWidth value={emp.org_code} onChange={(e) => handleNewEmpEdit(e, emp.index, "org_code")}>
                      {
                        orgs.map(org => {
                          return (
                            <MenuItem key={org} value={org}>{org}</MenuItem>
                          )
                        })
                      }
                    </TextField>
                    <IconButton color="error" onClick={() => removeNewEmp(emp.index)} children={<CancelOutlinedIcon />} />
                  </AccordionActions>
                </Accordion>
              )
            })

            }
            <Grid2 container justifyContent="center" paddingTop={'1%'}>
              <Button variant="contained" onClick={() => SetNewEmps([...NewEmps, { f_name: '', l_name: '', org_code: '', effective_pay: '', index: NewEmps.length }])} ><AddCircleOutlineRoundedIcon /></Button>
            </Grid2>
            <Grid2 container justifyContent="flex-end" paddingTop={'2%'}>
              <Button variant="contained" color="error" size="small" sx={{ mr: '2%' }} onClick={() => onClose()}>Cancel</Button>
              <Button variant="contained" color="success" size="small" onClick={() => onSubmit()}>Submit</Button>
            </Grid2>
          </DialogContent>
        </Dialog>
        <Dialog open={confirmDeleteVis} onClose={async () => { setConfirmDeleteVis(false); setEmpToDelete(''); setConfirmDeleteErr(''); }}>
          <DialogContent>
            {confirmDeleteErr ? <Typography color="error">{confirmDeleteErr}</Typography> : <></>}
            <Typography>
              Are you sure you want to delete this Employee: {empToDelete}?
            </Typography>
            <Grid2 container justifyContent="center" paddingTop={'2%'}>
              <Button onClick={async () => { setConfirmDeleteVis(false); setEmpToDelete(''); setConfirmDeleteErr(''); }} sx={{ mr: '2%' }} color="error" size="small" variant="contained">Cancel</Button>
              <Button onClick={() => deleteEmp()} color="success" size="small" variant="contained">Confirm</Button>
            </Grid2>
          </DialogContent>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default EmployeeScreen;