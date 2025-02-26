import { Box, Button, ThemeProvider, Dialog, DialogContent, Divider, FormControl, FormLabel, Grid2, InputLabel, MenuItem, TextField, Typography, TableContainer, Paper, ListItemButton, List, ListItem, ListItemText, ListItemIcon, Accordion, AccordionSummary, AccordionDetails, Stack, IconButton, AccordionActions, Icon, Card } from "@mui/material";
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
      <Paper sx={{ maxHeight: '49vh', minHeight: '49vh', overflow: 'auto' }} >
        {
          itemCourses.map((course) => {
            return (
              <Accordion divider="true" key={course.id} expanded={course.expand} onChange={(e) => handleCourseChange(e, course.id, 'expand')}>
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

const ReviewListEdit = ({ emp, handleReviewChange, courses }) => {
  return (
    <List>
      {/* Takes an employee which contains their courses and maps them to textfields to edit tuition, travel, and/or travel hours */}
      {emp.COURSES.map((course) => {
        return (
          <ListItem key={course.COURSEID.toString() + emp.EMP.EMPID.toString() + 'List'}>
            <ListItemText primary={course.TITLE} sx={{ width: '50%' }} />
            <TextField sx={{ mr: '2%' }} label={"Course Hours"} value={course.COURSEHOURS} key={course.COURSEID.toString() + emp.EMP.EMPID.toString() + 'hours'} type="number" disabled />
            <TextField sx={{ mr: '2%' }} label={"Tuition"} value={course.TUITION} key={course.COURSEID.toString() + emp.EMP.EMPID.toString() + 'tuition'} type="number" onChange={(e) => handleReviewChange(e, emp.EMP.EMPID, course.COURSEID, 'tuition')} />
            <TextField sx={{ mr: '2%' }} label={"Travel Cost"} value={course.TRAVEL} key={course.COURSEID.toString() + emp.EMP.EMPID.toString() + 'travelCost'} type="number" onChange={(e) => handleReviewChange(e, emp.EMP.EMPID, course.COURSEID, 'travel')} />
            <TextField sx={{ mr: '2%' }} label={"Travel Hours"} value={course.TRAVELHOURS} key={course.COURSEID.toString() + emp.EMP.EMPID.toString() + 'travelHours'} type="number" onChange={(e) => handleReviewChange(e, emp.EMP.EMPID, course.COURSEID, 'travelHours')} />
            {/* Button to delete a course for a specific employee*/}
            <IconButton children={<CancelOutlinedIcon color="error" />} onClick={(e) => { handleReviewChange(e, emp.EMP.EMPID, course.COURSEID, 'deletion') }} />
          </ListItem>
        );
      }
      )
      }
    </List>
  )
}

const AddReviewList = ({ reviewList, handleReviewChange, courses, valueFormatter, allEmps }) => {
  const [addEmp, setAddEmp] = useState(false);
  const [empToAdd, setEmpToAdd] = useState({ "F_NAME": "", "L_NAME": "" });
  const [addCourse, setAddCourse] = useState(false);
  const [courseToAdd, setCourseToAdd] = useState({ "TITLE": "" });
  return (
    <Paper sx={{ maxHeight: '49vh', minHeight: '49vh', overflow: 'auto' }} >
      {
        /* Takes reviewList which is all employees and related courses and maps each employee to an accordion*/
        reviewList.map(item => {
          return (
            <Accordion key={item.EMP.EMPID} sx={{ mb: '5px', mr: '2px', ml: '2px' }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "primary.contrastText" }} />} sx={{ backgroundColor: "primary.main" }}>
                <Typography variant="body1" sx={{ width: '53%', color: "primary.contrastText" }}> {item.EMP.F_NAME + ' ' + item.EMP.L_NAME + ' (' + valueFormatter.format(item.EMP.EFFECTIVE_PAY) + ' /hr)'} </Typography>
                <Typography variant="body1" sx={{ width: '20%', color: "primary.contrastText", display:'flex'}}> Labor: 
                  <Typography variant="body1" sx={{display: 'flex', justifyContent: 'flex-end', paddingRight: '5%', color: "primary.contrastText" , ml:'8px'  }}>{valueFormatter.format(item.COURSES.reduce((accumulator, course) => accumulator + (course.TRAVELHOURS || 0) + (course.COURSEHOURS || 0), 0) * item.EMP.EFFECTIVE_PAY)}</Typography>
                </Typography>
                <Typography variant="body1" sx={{ width: '20%', color: "primary.contrastText", display:'flex' }}> Non-Labor: 
                  <Typography variant="body1" sx={{display: 'flex', justifyContent: 'flex-end', color: "primary.contrastText", ml:'8px' }}>{valueFormatter.format(item.COURSES.reduce((accumulator, course) => accumulator + (course.TUITION || 0) + (course.TRAVEL || 0), 0))}</Typography>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {/* Takes the employee course array and maps it to a list where each value can be edited*/}
                <ReviewListEdit key={item.EMP.EMPID} courses={courses} emp={item} handleReviewChange={handleReviewChange} />

                {addCourse ?
                  <Card sx={{ pt: '10px', display: 'flex', justifyContent: 'space-between', mb: '1%' }}>
                    <TextField label="Course" size="small" variant="outlined" select sx={{ width: '40%', ml: '1%', pb: '1%', mb: '1%' }} value={courseToAdd.TITLE}>
                      {
                        courses.map((course) => {
                          return <MenuItem key={course.TITLE} onClick={() => setCourseToAdd(course)} value={course.TITLE}>{course.TITLE}</MenuItem>
                        })
                      }
                    </TextField>
                    <Grid2 display='flex' flexDirection='row' sx={{
                      width: '20%', pb: '1.5%', pr: '1%'
                    }}>
                      <Button variant="contained" color="error" size="small" sx={{ mr: '5%' }} onClick={() => { setAddCourse(false); setCourseToAdd({ "TITLE": "" }) }}>Cancel</Button>
                      <Button variant="contained" color="success" size="small" onClick={(e) => { setAddCourse(false); handleReviewChange(e, item.EMP.EMPID, courseToAdd.COURSEID, "addition"); setCourseToAdd({ "TITLE": "" }) }}>Add</Button>
                    </Grid2>
                  </Card>
                  : <></>}
                <Grid2 container flexDirection={"row"} justifyContent={"flex-end"} display={"flex"}>
                  {addCourse ?
                    <></>
                    :
                    <Button color="success" variant="outlined" sx={{ justifySelf: 'flex-end', display: 'flex', mr: "25px" }} onClick={(e) => setAddCourse(true)}>Add Course</Button>
                  }

                  <Button color="error" variant="outlined" sx={{ justifySelf: 'flex-end', display: 'flex' }} onClick={(e) => { handleReviewChange(e, item.EMP.EMPID, "", "empDelete") }}>Remove Employee</Button>
                </Grid2>
              </AccordionDetails>
            </Accordion>
          )
        })
      }
      {/* Add Employee Button on Review State of plan creation*/}
      {addEmp ?
        <Card sx={{ pt: '10px', display: 'flex', justifyContent: 'space-between' }}>
          <TextField label="Employee" size="small" variant="outlined" select sx={{ width: '40%', ml: '1%', pb: '1%', mb: '1%' }} value={empToAdd.F_NAME + ' ' + empToAdd.L_NAME}>
            {
              allEmps.map((emp) => {
                return <MenuItem key={emp.EMPID} onClick={() => setEmpToAdd(emp)} value={emp.F_NAME + ' ' + emp.L_NAME}>{emp.F_NAME + ' ' + emp.L_NAME}</MenuItem>
              })
            }
          </TextField>
          <Grid2 display='flex' flexDirection='row' sx={{
            width: '20%', pb: '1.5%', pr: '1%'
          }}>
            <Button variant="contained" color="error" size="small" sx={{ mr: '5%' }} onClick={() => { setAddEmp(false); setEmpToAdd({ "F_NAME": "", "L_NAME": "" }) }}>Cancel</Button>
            <Button variant="contained" color="success" size="small" onClick={(e) => { setAddEmp(false); handleReviewChange(e, empToAdd.EMPID, "", "empAdd"); setEmpToAdd({ "F_NAME": "", "L_NAME": "" }) }}>Add</Button>
          </Grid2>
        </Card>
        : allEmps.length > 0 ?
          <Button variant="contained" sx={{ color: 'white', borderWidth: 3, justifySelf: 'center', display: 'flex', mt: '2%', mb: '1%' }} onClick={(e) => setAddEmp(true)}> <AddBoxOutlinedIcon sx={{ paddingRight: '5%' }} /> Employee</Button>
          : <></>
      }
    </Paper>
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
  const [totalLabor, setTotalLabor] = useState(0);
  const [totalNonLabor, setTotalNonLabor] = useState(0);

  const columns = [
    { field: 'EMP_NAME', headerName: 'Employee', flex: 0.35 },
    {
      field: 'TITLE',
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
          <Button onClick={() => confirmDelete(params.row.PLAN_COURSE_ID, params.row.TITLE, params.row.EMP_NAME)}><DeleteOutlineOutlinedIcon color="error" /></Button>
        )
      }
    },
  ];

  const valueFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });

  const confirmDelete = (planCourse, courseTitle, empName) => {
    setConfirmDeleteVis(true);
    setPlanCourseToDelete({ID: planCourse, TITLE: courseTitle, EMP_NAME: empName});
  }

  function getRowId(row) {
    return row.PLAN_COURSE_ID;
  }

  const handleCourseChange = (e, id, f) => {
    let updateRow = {};
    let tableContext = rightCourses;
    const myRowIndex = tableContext.findIndex((row) => row.id === id);

    if (f === "tuition") { updateRow = { ...tableContext[myRowIndex], TUITION: parseFloat(e.target.value) }; }
    else if (f === "travel") updateRow = { ...tableContext[myRowIndex], TRAVEL: parseFloat(e.target.value) };
    else if (f === "courseHours") updateRow = { ...tableContext[myRowIndex], COURSEHOURS: parseFloat(e.target.value) };
    else if (f === "travelHours") updateRow = { ...tableContext[myRowIndex], TRAVELHOURS: parseFloat(e.target.value) };
    else if (f === "expand") updateRow = { ...tableContext[myRowIndex], expand: !tableContext[myRowIndex].expand };
    tableContext = [...rightCourses.filter((row) => row.id !== id), updateRow];
    console.log(tableContext);
    setRightCourses(tableContext.sort(function (a, b) { return a.id - b.id }));
  }

  const handleReviewChange = (e, empid, id, f) => {
    if (f === "empAdd") {
      // adding an employee
      let empToAdd = emps[emps.findIndex(emp => emp.EMPID === empid)];
      transferLists(leftEmps, setLeftEmps, rightEmps, setRightEmps, empToAdd);
      setPlan_Course_New(prevState => [
        ...prevState,
        {
          "PLAN_ID": selectPlan.PLAN_ID,
          "EMP": empToAdd, // or a new unique EMPID if needed
          "COURSES": rightCourses // initialize with an empty array
        }
      ]);
    }
    else if (f === "empDelete") {
      let empToDelete = emps[emps.findIndex(emp => emp.EMPID === empid)];
      transferLists(rightEmps, setRightEmps, leftEmps, setLeftEmps, empToDelete)
      setPlan_Course_New(plan_Course_New.filter(item => item.EMP.EMPID !== empid));

    }
    else {
      setPlan_Course_New(prevState => prevState.map(emp => {
        if (emp.EMP.EMPID === empid) {
          if (f === "deletion") {
            // Remove the course from the COURSES array
            const updatedCourses = emp.COURSES.filter(course => course.COURSEID !== id);
            return { ...emp, COURSES: updatedCourses };
          }
          else if (f === "addition") {
            const updatedCourses = [...emp.COURSES, courses[courses.findIndex(course => course.COURSEID === id)]]
            console.log(updatedCourses);
            return { ...emp, COURSES: updatedCourses };
          }
          else {
            // Update the course field
            const updatedCourses = emp.COURSES.map(course => {
              if (course.COURSEID === id) {
                return { ...course, [f.toUpperCase()]: parseFloat(e.target.value) };
              }
              return course;
            });
            return { ...emp, COURSES: updatedCourses };
          }
        }
        return emp;
      }
      ))
    }
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
        setPlanErrMsg('Plan failed to be created.');
      }
    }
  }

  const deletePlanCourse = async () => {
    setConfirmDeleteErr('');
    try {
      const response = await axiosPrivate.delete(API_URL.PLAN_COURSE_URL,
        {
          data: {
            plan_course_id: planCourseToDelete.ID
          }
        }
      )
      console.log(JSON.stringify(response))
      setConfirmDeleteVis(false);
      setSuccessPlanCourses(true);
      setPlanCourseToDelete('');
    } catch (err) {
      if (!err?.response) { setConfirmDeleteErr('No Server Response'); }
      else if (err.response?.status === 400) {
        setConfirmDeleteErr('Plan course id missing');
      } else if (err.response?.status === 401) {
        setConfirmDeleteErr('Unauthorized Access');
      }
      else {
        setConfirmDeleteErr('Plan course failed to be deleted.');
      }
    }
  }

  const onSubmitPlanCourseStep1 = async () => {
    if (planEditState === 'employee') {
      setPlanEditState('courses');
    }
    else if (planEditState === 'courses') {
      setPlan_Course_New(rightEmps.map((emp) => {
        return ({ 'PLAN_ID': selectPlan.PLAN_ID, 'EMP': emp, 'COURSES': rightCourses })
      }));
      setPlanEditState('review');
      console.log(plan_Course_New);
    }

  }

  const onSubmitPlanCourse = async () => {
    setPlanCourseErrMsg('');
    try {
      const response = await axiosPrivate.post(API_URL.PLAN_COURSE_URL,
        JSON.stringify({ plans: plan_Course_New })
      )
      console.log(JSON.stringify(response))
      setAddPlanCourses(false);
      setSuccessPlanCourses(true);
      setPlan_Course_New([]);
      setLeftCourses(courses);
      setRightCourses([]);
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
      <Paper sx={{ maxHeight: '49vh', minHeight: '49vh', overflow: 'auto' }} >
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
      <Paper sx={{ maxHeight: '49vh', minHeight: '49vh', overflow: 'auto' }} >
        <List>
          {
            itemEmps.map((emp) => {
              return (
                <ListItem divider key={emp.EMPID}>
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
      <Paper sx={{ maxHeight: '49vh', minHeight: '49vh', overflow: 'auto' }} >
        <List>
          {
            itemCourses.map((course) => {
              if (!rightCourses.some(row => row.COURSEID === course.COURSEID)) {
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






  useEffect(() => {
    setTotalLabor(valueFormatter.format(
      plan_Course_New.map(item => {
        return (item.COURSES.reduce((accumulator, course) => accumulator + (course.TRAVELHOURS || 0) + (course.COURSEHOURS || 0), 0) * item.EMP.EFFECTIVE_PAY);
      }).reduce((accumulator, emp) => accumulator + emp, 0)
    ))
    setTotalNonLabor(valueFormatter.format(
      plan_Course_New.map(item => {
        return (item.COURSES.reduce((accumulator, course) => accumulator + (course.TUITION || 0) + (course.TRAVEL || 0), 0));
      }).reduce((accumulator, emp) => accumulator + emp, 0)
    ))
  }, [plan_Course_New])


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
        setLeftCourses(response.data);
        setRightCourses([])
      } catch (err) {
        console.error(err);
      }
    }

    getCourses();

    return () => {
      isMounted = false;
      controller.abort();
      setCourseSuccess(false);
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

        setLeftEmps(response.data);
        setRightEmps([]);
      } catch (err) {
        console.error(err);
      }
    }

    getEmps();

    return () => {
      isMounted = false;
      controller.abort();
      setEmpSuccess(false);
    }
  }, [])

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
        <Dialog fullWidth maxWidth='lg' open={addPlanCourses} onClose={() => setAddPlanCourses(false)}>
          <DialogContent sx={{ minHeight: '65vh', maxHeight: '65vh' }}>
            {planCourseErrMsg ? <Typography color="error">{planCourseErrMsg}</Typography> : <></>}

            {/*Employee selection state */}
            {planEditState === 'employee' ?
              <>
                <Typography fontStyle={'h1'} paddingBottom={'2%'}>Adding Employees to: {selectPlan.TITLE}</Typography>
                <Grid2 container justifyContent="space-between" display={"flex"}>
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
                {/*Course selection state */}
                <Typography fontStyle={'h1'} paddingBottom={'2%'}>Adding Courses to: {selectPlan.TITLE}</Typography>
                <Grid2 container justifyContent="space-between">
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
                  {/*Review state */}
                  <Typography fontStyle={'h1'} paddingBottom={'2%'}>Reviewing Plan: {selectPlan.TITLE}</Typography>
                  <AddReviewList reviewList={plan_Course_New} handleReviewChange={handleReviewChange} courses={courses} valueFormatter={valueFormatter} allEmps={leftEmps} />
                  <Grid2 flexDirection="row" display='flex' justifyContent='space-between' sx={{ paddingTop: '2%' }}>
                    <Grid2 display='flex' flexDirection={"row"} width={'70%'}>
                      <Paper elevation={3} sx={{ marginRight: '5%', paddingLeft: '2%', paddingRight: '2%', backgroundColor: 'white', justifyContent: 'center', flexDirection: 'column', display: 'flex' }}>
                        <Typography >Total Labor: {totalLabor} </Typography>
                      </Paper>
                      <Paper elevation={3} sx={{ marginRight: '5%', paddingLeft: '2%', paddingRight: '2%', backgroundColor: 'white', justifyContent: 'center', flexDirection: 'column', display: 'flex' }}>
                        <Typography>Total Non-Labor: {totalNonLabor} </Typography>
                      </Paper>
                    </Grid2>
                    <Grid2 width={'19%'} display='flex' flexDirection='row' justifyContent='space-between' >
                      <Button variant="contained" color="error" size="small" sx={{ mr: '2%' }} onClick={() => onClosePlanCourse()}>Cancel</Button>
                      <Button variant="contained" color="success" size="small" onClick={() => onSubmitPlanCourse()}>Submit</Button>
                    </Grid2>
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

        {/* Modal for plan course delete confirmation */}
        <Dialog open={confirmDeleteVis} onClose={async () => { setConfirmDeleteVis(false); setPlanCourseToDelete(''); setConfirmDeleteErr(''); }}>
          <DialogContent>
            {confirmDeleteErr ? <Typography color="error">{confirmDeleteErr}</Typography> : <></>}
            <Typography>
              Are you sure you want to delete {planCourseToDelete.TITLE} from {planCourseToDelete.EMP_NAME}'s plan ?
            </Typography>
            <Grid2 container justifyContent="center" paddingTop={'2%'}>
              <Button onClick={async () => { setConfirmDeleteVis(false); setPlanCourseToDelete(''); setConfirmDeleteErr(''); }} sx={{ mr: '2%' }} color="error" size="small" variant="contained">Cancel</Button>
              <Button onClick={() => deletePlanCourse()} color="success" size="small" variant="contained">Confirm</Button>
            </Grid2>
          </DialogContent>
        </Dialog>

      </Box>
    </ThemeProvider>
  );
};

export default PlanScreen;