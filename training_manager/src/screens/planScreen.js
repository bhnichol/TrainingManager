import { Box, Button, ThemeProvider, Dialog, DialogContent, Divider, FormControl, FormLabel, Grid2, InputLabel, MenuItem, TextField, Typography, TableContainer, Paper, ListItemButton, List, ListItem, ListItemText, ListItemIcon, Accordion, AccordionSummary, AccordionDetails, Stack, IconButton, AccordionActions } from "@mui/material";
import { AppTheme } from "../theme";
import { useEffect, useRef, useState } from "react";
import API_URL from "../api/api";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined"
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { DataGrid } from "@mui/x-data-grid";
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { computeSlots } from "@mui/x-data-grid/internals";


const RightListCourse = ({ itemCourses, rightCourses, handleCourseChange, setRightCourses, setLeftCourses, leftCourses }) => {

  return (
    <>
      <Paper sx={{ maxHeight: 300, minHeight: 300, overflow: 'auto' }} >
        {
          itemCourses.map((course) => {
            return (
              <Accordion fullWidth divider key={course.id} justifyContent='space-between' expanded={course.expand} onChange={(e) => handleCourseChange(e, course.id, 'expand')}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}>
                  <Typography> {course.TITLE} </Typography>
                </AccordionSummary>
                <AccordionActions>
                  <Grid2 container  >
                    <Grid2 container>
                      <Grid2 sx={{ width: '100%' }}>
                        <TextField
                          label='Tuition'
                          key={course.id + 'tuition'}
                          fullWidth
                          variant="outlined"
                          size='small'
                          sx={{ paddingBottom: 2 }}
                          value={course.TUITION}
                          type="number"
                          onChange={(e) => handleCourseChange(e, course.id, 'tuition')}
                        />
                        <TextField
                          label='Travel Cost'
                          fullWidth
                          variant="outlined"
                          size='small'
                          sx={{ paddingBottom: 2 }}
                          value={course.TRAVEL}

                          onChange={(e) => handleCourseChange(e, course.id, 'travel')}
                        />

                        <TextField
                          label='Travel Hours'
                          fullWidth
                          variant="outlined"
                          size='small'
                          sx={{ paddingBottom: 2 }}
                          value={course.TRAVELHOURS}
                          onChange={(e) => handleCourseChange(e, course.id, 'travelHours')}
                        />

                        <TextField
                          label='Course Hours'
                          fullWidth
                          key={course.id + 'courseHours'}
                          variant="outlined"
                          size='small'
                          value={course.COURSEHOURS}
                          onChange={(e) => handleCourseChange(e, course.id, 'courseHours')}
                        />
                        <Grid2 sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <IconButton sx={{ display: 'flex', justifyContent: 'flex-end' }} key={course.COURSEID} value={course} onClick={() => {
                             setRightCourses(rightCourses.filter((row) => row !== course));
                            
                          }} 
                             children={<CancelOutlinedIcon color="error" />}/* transferLists(rightCourses, setRightCourses, leftCourses, setLeftCourses, course)} */ />
                        </Grid2>
                      </Grid2>
                    </Grid2>
                  </Grid2>
                </AccordionActions>
              </Accordion>
            )
          })
        }
      </Paper>
    </>
  )
}

const ReviewListEdit = (emp, handleReviewChange, courses) => {
  return (
    <List>
        {emp.emp.COURSES.map((course) => {
          return (
            <ListItem key={course.COURSEID}>
              <ListItemText primary={course.TITLE}/>
              <TextField label={"Tuition"} value={course.TUITION} type="number" onChange={(e) => handleReviewChange(emp.emp.EMP.EMPID, e, course.COURSEID, 'tuition')}/>
            </ListItem>
          );
        }
        )
      }
      </List>
  )
}

const PlanScreen = () => {
  const [plans, setPlans] = useState([]);
  const [success, setSuccess] = useState(false);
  const [addPlanCourses, setAddPlanCourses] = useState(false);
  const [addPlan, setAddPlan] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const [selectPlan, setSelectPlan] = useState({ TITLE: '', PLAN_ID: '', FISCAL_YEAR: '' });
  const [plan_title, setPlan_Title] = useState('');
  const [planErrMsg, setPlanErrMsg] = useState('');
  const [plan_FY, setPlan_FY] = useState('');
  const [confirmDeleteVis, setConfirmDeleteVis] = useState(false);
  const [planCourseToDelete, setPlanCourseToDelete] = useState(false);
  const [confirmDeleteErr, setConfirmDeleteErr] = useState('');
  const [successPlanCourses, setSuccessPlanCourses] = useState(false);
  const [planCourses, setPlanCourses] = useState([]);
  const [planCourseErrMsg, setPlanCourseErrMsg] = useState('');
  const [plan_Course_New, setPlan_Course_New] = useState([]);
  const [courses, setCourses] = useState([]);
  const [emps, setEmps] = useState([]);
  const [leftEmps, setLeftEmps] = useState([]);
  const [rightEmps, setRightEmps] = useState([]);
  const [leftCourses, setLeftCourses] = useState([]);
  const [rightCourses, setRightCourses] = useState([]);
  const [planEditState, setPlanEditState] = useState('employee');
  const [empSuccess, setEmpSuccess] = useState(false);
  const [courseSuccess, setCourseSuccess] = useState(false);

  const columns = [
    { field: 'EMP_NAME', headerName: 'Employee', flex: 0.35 },
    {
      field: 'COURSE_TITLE',
      headerName: 'Course Title',
      flex: 0.3
    },
    {
      field: 'COURSEHOURS',
      headerName: 'Course Hours',
      flex: 0.33,
    },
    {
      field: 'TRAVELHOURS',
      headerName: 'Travel Hours',
      flex: 0.32,
    },
    {
      field: 'TUITION',
      headerName: 'Tuition',
      flex: 0.25,
      valueFormatter: (value) => {
        return (new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
        }).format(value))
      }
    },
    {
      field: 'TRAVEL',
      headerName: 'Travel Cost',
      flex: 0.3,
      valueFormatter: (value) => {
        return (new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
        }).format(value))
      }
    },
    {
      field: 'delete',
      headerName: 'Delete',
      flex: 0.20,
      sortable: false,
      renderCell: (params) => {

        return (
          <Button onClick={() => confirmDelete(params.row.PLAN_COURSE_ID, params.row.COURSEID)}><DeleteOutlineOutlinedIcon color="error" /></Button>
        )
      }
    },
  ];

  const confirmDelete = (planCourse) => {
    setConfirmDeleteVis(true);
    setPlanCourseToDelete(planCourse);
  }

  function getRowId(row) {
    return row.PLAN_COURSE_ID;
  }

  const handleCourseChange = (e, id, f) => {
    let updateRow = {};
    let tableContext = rightCourses;
    const myRowIndex = tableContext.findIndex((row) => row.id === id);

    if (f === "tuition") { updateRow = { ...tableContext[myRowIndex], TUITION: e.target.value }; }
    else if (f === "travel") updateRow = { ...tableContext[myRowIndex], TRAVEL: e.target.value };
    else if (f === "courseHours") updateRow = { ...tableContext[myRowIndex], COURSEHOURS: e.target.value };
    else if (f === "travelHours") updateRow = { ...tableContext[myRowIndex], TRAVELHOURS: e.target.value };
    else if (f === "expand") updateRow = { ...tableContext[myRowIndex], expand: !tableContext[myRowIndex].expand };
    tableContext = [...rightCourses.filter((row) => row.id != id), updateRow]
    setRightCourses(tableContext.sort(function (a, b) { return a.id - b.id }));
  }

  const handleReviewChange = (e, empid, id, f) => {
    let updateRow = {};
    let tableContext = plan_Course_New;
    const myRowIndex = tableContext.findIndex((row) => row.EMPID === empid);

    if (f === "tuition") { updateRow = { ...tableContext[myRowIndex], TUITION: e.target.value }; }
    else if (f === "travel") updateRow = { ...tableContext[myRowIndex], TRAVEL: e.target.value };
    else if (f === "courseHours") updateRow = { ...tableContext[myRowIndex], COURSEHOURS: e.target.value };
    else if (f === "travelHours") updateRow = { ...tableContext[myRowIndex], TRAVELHOURS: e.target.value };
    else if (f === "expand") updateRow = { ...tableContext[myRowIndex], expand: !tableContext[myRowIndex].expand };
    setRightCourses(tableContext.sort(function (a, b) { return a.id - b.id }));
  }

  const ValidateInputs = () => {
    if (plan_title.length > 50) {
      setPlanErrMsg('Plan Title is too long must be less than 50 characters.');
      return true;
    }

    return false;
  }

  const onClose = () => {
    setPlan_Title('');
    setPlanErrMsg('');
    setPlan_FY('');
    setAddPlan(false);
  }

  const onClosePlanCourse = () => {
    if (planEditState === 'employee' || planEditState === 'review') {
      setPlan_Course_New([]);
      setPlanEditState('employee')
      setLeftEmps(emps);
      setLeftCourses(courses);
      setRightEmps([]);
      setRightCourses([]);
      setPlanCourseErrMsg('');
      setAddPlanCourses(false);
    }
    else if (planEditState === 'courses') {
      setPlanEditState('employee');
    }
  }

  const onChangeInt = (e, setValue) => {
    if (e.target.value.match(/[^0-9]/)) {
      e.preventDefault();
      return;
    }

    setValue(e.target.value);
  }

  const onSubmit = async () => {
    setPlanErrMsg('');
    if (ValidateInputs()) {
      return;
    }
    try {
      const response = await axiosPrivate.post(API_URL.PLAN_URL,
        JSON.stringify({ plan_title, plan_FY })
      )
      console.log(JSON.stringify(response))
      setAddPlan(false);
      setSuccess(true);
      setPlan_Title('');
      setPlan_FY('');
      setPlanErrMsg('');
    } catch (err) {
      if (!err?.response) { setPlanErrMsg('No Server Response') }
      else if (err.response?.status === 409) {
        setPlanErrMsg('PlanId Taken');
      } else if (err.response?.status === 400) {
        setPlanErrMsg('Plan details missing');
      } else if (err.response?.status === 401) {
        setPlanErrMsg('Unauthorized Access');
      }
      else {
        setPlanErrMsg('Plan failed to be created.')
      }
    }
  }
  const onSubmitPlanCourseStep1 = async () => {
    if (planEditState === 'employee') {
      setPlanEditState('courses');
    }
    else if (planEditState === 'courses') {
      setPlan_Course_New(rightEmps.map((emp) => {
        return ({ 'PLAN_ID': selectPlan.PLAN_ID, 'EMP': emp, 'COURSES': rightCourses})
      }));
      setPlanEditState('review');
      console.log(plan_Course_New);
    }

  }

  const onSubmitPlanCourse = async () => {
    setPlanCourseErrMsg('');
    try {
      const response = await axiosPrivate.post(API_URL.PLAN_COURSE_URL,
        JSON.stringify({ plan_course: plan_Course_New })
      )
      console.log(JSON.stringify(response))
      setAddPlanCourses(false);
      setSuccessPlanCourses(true);
      setPlan_Course_New([]);
      setPlanEditState('employee')
      setRightEmps([]);
      setLeftEmps(emps);
      setPlanCourseErrMsg('');
    } catch (err) {
      if (!err?.response) { setPlanCourseErrMsg('No Server Response') }
      else if (err.response?.status === 409) {
        setPlanCourseErrMsg('PlanCourseId Taken');
      } else if (err.response?.status === 400) {
        setPlanCourseErrMsg('Plan details missing');
      } else if (err.response?.status === 401) {
        setPlanCourseErrMsg('Unauthorized Access');
      }
      else {
        setPlanCourseErrMsg('Plan failed to be created.')
      }
    }
  }

  const transferLists = (left, setLeft, right, setRight, item) => {
    setLeft(left.filter((row) => row !== item));
    setRight([...right, item]);
  }

  const LeftListEmp = ({ itemEmps }) => {
    return (
      <Paper sx={{ maxHeight: 300, minHeight: 300, overflow: 'auto' }} >
        <List>
          {
            itemEmps.map((emp) => {
              return <ListItem divider key={emp.EMPID}><ListItemButton key={emp.EMPID} value={emp} onClick={() => transferLists(leftEmps, setLeftEmps, rightEmps, setRightEmps, emp)}><ListItemText primary={emp.F_NAME + ' ' + emp.L_NAME} /></ListItemButton></ListItem>
            })
          }
        </List>
      </Paper>
    )
  }

  const RightListEmp = ({ itemEmps }) => {
    return (
      <Paper sx={{ maxHeight: 300, minHeight: 300, overflow: 'auto' }} >
        <List>
          {
            itemEmps.map((emp) => {
              return (
                <ListItem fullWidth divider key={emp.EMPID} justifyContent='space-between'>
                  <ListItemText primary={emp.F_NAME + ' ' + emp.L_NAME} sx={{ width: '60%' }} />
                  <ListItemButton sx={{ display: 'flex', justifyContent: 'flex-end', width: '15%' }} key={emp.EMPID} value={emp} onClick={() => transferLists(rightEmps, setRightEmps, leftEmps, setLeftEmps, emp)}>
                    <ListItemIcon sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }} color="error" children={<CancelOutlinedIcon color="error" />} />
                  </ListItemButton>
                </ListItem>
              )
            })
          }
        </List>
      </Paper>
    )
  }

  const LeftListCourse = ({ itemCourses }) => {
    return (
      <Paper sx={{ maxHeight: 300, minHeight: 300, overflow: 'auto' }} >
        <List>
          {
            itemCourses.map((course) => {
              if (!rightCourses.some(row => row.COURSEID === course.COURSEID)){
              return <ListItem divider key={course.COURSEID}><ListItemButton key={course.COURSEID} value={course} onClick={() => {
                setRightCourses([...rightCourses, {
                  ...course, expand: false, id: rightCourses.length > 0 ? rightCourses.reduce(function (prev, current) {
                    return (prev && prev.id > current.id) ? prev : current
                  }).id + 1 : 1
                }])
              }
              
              }><ListItemText primary={course.TITLE} /></ListItemButton></ListItem>
            }
            })
          
          }
        </List>
      </Paper>
    )
  }



  const AddReviewList = ({ reviewList }) => {
    return (
      <Paper sx={{ maxHeight: 300, minHeight: 300, overflow: 'auto' }} >
        {
          reviewList.map(item => {
            return (
              <Accordion key={item.EMP.EMPID}>
                <AccordionSummary justifyContent={'flex'}
                  expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="body1" sx={{width: '43%'}}> {item.EMP.F_NAME + ' ' + item.EMP.L_NAME} </Typography>
                  <Typography variant="body1" sx={{width: '13%'}}> Labor:  </Typography>
                  <Typography variant="body1" sx={{width: '10%', display:'flex', justifyContent:'flex-end', paddingRight:'5%'}}>${(item.COURSES.reduce((accumulator, course) => accumulator + course.TRAVELHOURS + course.COURSEHOURS, 0) * item.EMP.EFFECTIVE_PAY).toFixed(2)}</Typography>
                  <Typography variant="body1" sx={{width: '13%'}}> Non-Labor:  </Typography>
                  <Typography variant="body1" sx={{width: '10%', display:'flex', justifyContent:'flex-end'}}>${item.COURSES.reduce((accumulator, course) => accumulator + course.TUITION + course.TRAVEL, 0).toFixed(2)}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {/* <List sx={{ paddingTop: 0 }}>
                    {
                      item.COURSES.map(course => {
                        return (
                          <ListItem divider key={course.COURSEID}><ListItemText primary={course.TITLE} /></ListItem>
                        )
                      })

                    }
                  </List> */}
                  <ReviewListEdit courses={courses} emp={item} handleReviewChange={handleReviewChange}/>
                </AccordionDetails>
              </Accordion>
            )
          })
        }
      </Paper>
    )
  }



  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getPlans = async () => {
      try {
        const response = await axiosPrivate.get(API_URL.PLAN_URL, {
          signal: controller.signal
        });
        isMounted && setPlans(response.data);
      } catch (err) {
        console.error(err);
      }
    }

    getPlans();

    return () => {
      isMounted = false;
      controller.abort();
      setSuccess(false);
    }
  }, [success])

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getPlans = async () => {
      try {
        const response = await axiosPrivate.get(API_URL.PLAN_COURSE_URL, {
          signal: controller.signal
        });
        isMounted && setPlanCourses(response.data);
      } catch (err) {
        console.error(err);
      }
    }

    getPlans();

    return () => {
      isMounted = false;
      controller.abort();
      setSuccessPlanCourses(false);
    }
  }, [successPlanCourses])

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getCourses = async () => {
      try {
        const response = await axiosPrivate.get(API_URL.COURSE_URL, {
          signal: controller.signal
        });
        isMounted && setCourses(response.data);

        setRightCourses([])
        console.log(JSON.stringify(courses));
      } catch (err) {
        console.error(err);
      }
    }

    getCourses();

    return () => {
      isMounted = false;
      controller.abort();
      setLeftCourses(courses);
      setCourseSuccess(false);
    }
  }, [courseSuccess])

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getEmps = async () => {
      try {
        const response = await axiosPrivate.get(API_URL.EMP_URL, {
          signal: controller.signal
        });
        isMounted && setEmps(response.data);

        setRightEmps([]);
        console.log(JSON.stringify(leftEmps));
      } catch (err) {
        console.error(err);
      }
    }

    getEmps();

    return () => {
      isMounted = false;
      controller.abort();
      setLeftEmps(emps);
      setEmpSuccess(false);
    }
  }, [empSuccess])

  return (
    <ThemeProvider theme={AppTheme}>
      <Box>

        {/* Content right under the top bar, includes: plan selection, add courses to selected plan button */}
        <Grid2 container paddingTop={'1%'} paddingRight={'3%'} paddingLeft={'3%'} justifyContent="space-between">
          <Grid2 container width={'30%'}>
            <Grid2 >
              <Typography variant="h5" >Plans</Typography>
            </Grid2>
            <Grid2 paddingLeft={'5%'} width={'50%'}>
              <TextField label="Plan" size="small" variant="outlined" select fullWidth value={selectPlan.TITLE}>
                {
                  plans.map((plan) => {
                    return <MenuItem key={plan.PLAN_ID} onClick={() => setSelectPlan(plan)} value={plan.TITLE}>{plan.TITLE}</MenuItem>
                  })
                }
                <Divider />
                <MenuItem onClick={() => setAddPlan(true)}><AddBoxOutlinedIcon sx={{ paddingRight: '2%' }} />Add Plan</MenuItem>
              </TextField>
            </Grid2>
          </Grid2>
          <Grid2 justifyContent="flex-end">
            <Button variant="contained" onClick={() => setAddPlanCourses(true)}><AddBoxOutlinedIcon sx={{ paddingRight: '2%' }} /> Add Courses to Plan </Button>
          </Grid2>
        </Grid2>

        {/* Datagrid that holds the selected plan data */}
        <Box sx={{ paddingLeft: '3%', paddingRight: '3%', paddingBottom: '3%', paddingTop: '1%' }}>
          <TableContainer component={Paper}>
            <DataGrid
              columns={columns}
              rows={planCourses.filter((row) => row.PLAN_ID === selectPlan.PLAN_ID)}
              getRowId={getRowId}
            />
          </TableContainer>
        </Box>

        {/* Modal for adding Courses to a plan */}
        <Dialog fullWidth maxWidth='md' open={addPlanCourses} onClose={() => setAddPlanCourses(false)}>
          <DialogContent>
            {planCourseErrMsg ? <Typography color="error">{planCourseErrMsg}</Typography> : <></>}
            {planEditState === 'employee' ?
              <>
                <Typography fontStyle={'h1'} paddingBottom={'2%'}>Adding Employees to: {selectPlan.TITLE}</Typography>
                <Grid2 container justifyContent="space-between" paddingTop={'2%'}>
                  <Grid2 width={'40%'}>
                    <LeftListEmp itemEmps={leftEmps}></LeftListEmp>
                  </Grid2>
                  <Grid2 alignContent={'center'}>
                    <ArrowCircleRightOutlinedIcon fontSize="large" />
                  </Grid2>
                  <Grid2 width={'40%'}>
                    <RightListEmp itemEmps={rightEmps}></RightListEmp>
                  </Grid2>
                </Grid2>
                <Grid2 container justifyContent="flex-end" paddingTop={'2%'}>
                  <Button variant="contained" color="error" size="small" sx={{ mr: '2%' }} onClick={() => onClosePlanCourse()}>Cancel</Button>
                  <Button variant="contained" color="success" size="small" onClick={() => onSubmitPlanCourseStep1()}>Continue</Button>
                </Grid2>
              </>
              : planEditState === 'courses' ? <>
                <Typography fontStyle={'h1'} paddingBottom={'2%'}>Adding Courses to: {selectPlan.TITLE}</Typography>
                <Grid2 container justifyContent="space-between" paddingTop={'2%'}>
                  <Grid2 width={'40%'}>
                    <LeftListCourse itemCourses={leftCourses}></LeftListCourse>
                  </Grid2>
                  <Grid2 alignContent={'center'}>
                    <ArrowCircleRightOutlinedIcon fontSize="large" />
                  </Grid2>
                  <Grid2 width={'40%'}>
                    <RightListCourse itemCourses={rightCourses} rightCourses={rightCourses} setRightCourses={setRightCourses} handleCourseChange={handleCourseChange}></RightListCourse>
                  </Grid2>
                </Grid2>
                <Grid2 container justifyContent="flex-end" paddingTop={'2%'}>
                  <Button variant="contained" color="error" size="small" sx={{ mr: '2%' }} onClick={() => onClosePlanCourse()}>Back</Button>
                  <Button variant="contained" color="success" size="small" onClick={() => onSubmitPlanCourseStep1()}>Review</Button>
                </Grid2>
              </> :
                <>
                  <Typography fontStyle={'h1'} paddingBottom={'2%'}>Reviewing Plan: {selectPlan.TITLE}</Typography>
                  <AddReviewList reviewList={plan_Course_New}></AddReviewList>
                  <Grid2 container justifyContent="flex-end" paddingTop={'2%'}>
                    <Button variant="contained" color="error" size="small" sx={{ mr: '2%' }} onClick={() => onClosePlanCourse()}>Cancel</Button>
                    <Button variant="contained" color="success" size="small" onClick={() => console.log(plan_Course_New)}>Review</Button>
                  </Grid2>
                </>
            }
          </DialogContent>
        </Dialog>

        {/* Modal for creating new training plan */}
        <Dialog open={addPlan} onClose={() => setAddPlan(false)}>
          <DialogContent>
            {planErrMsg ? <Typography color="error">{planErrMsg}</Typography> : <></>}
            <Typography fontStyle={'h1'} paddingBottom={'2%'}>Create Plan</Typography>
            <FormLabel>Plan Title</FormLabel>
            <TextField
              fullWidth
              variant="outlined"
              size='small'
              value={plan_title}
              onChange={(e) => setPlan_Title(e.target.value)}
            />
            <FormLabel>FY</FormLabel>
            <TextField
              fullWidth
              variant="outlined"
              size='small'
              value={plan_FY}
              onChange={(e) => onChangeInt(e, setPlan_FY)}
            />
            <Grid2 container justifyContent="flex-end" paddingTop={'2%'}>
              <Button variant="contained" color="error" size="small" sx={{ mr: '2%' }} onClick={() => onClose()}>Cancel</Button>
              <Button variant="contained" color="success" size="small" onClick={() => onSubmit()}>Submit</Button>
            </Grid2>
          </DialogContent>

        </Dialog>

      </Box>
    </ThemeProvider>
  );
};

export default PlanScreen;