import { Box, Button, Dialog, DialogContent, FormLabel, Grid2, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, ThemeProvider, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { AppTheme } from "../theme";
import { makeStyles } from "@mui/styles"
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useLocation, useNavigate } from "react-router";
import API_URL from "../api/api";


const CourseScreen = () => {
    const [addCourse, setAddCourse] = useState(false);
    const [course_title, setCourse_title] = useState('');
    const [course_desc, setCourse_desc] = useState('');
    const [course_hours, setCourse_hours] = useState('');
    const [course_tuition, setCourse_tuition] = useState('');
    const [course_travel, setCourse_travel] = useState('');
    const [course_travelHours, setCourse_travelHours] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const axiosPrivate = useAxiosPrivate();
    const [courses, setCourses] = useState([]);
    const [success, setSuccess] = useState(false);
    const [confirmDeleteVis, setConfirmDeleteVis] = useState(false);
    const [courseToDelete, setCourseToDelete] = useState({});
    const [confirmDeleteErr, setConfirmDeleteErr] = useState('');

    const ValidateInputs = () => {
        if (course_desc.length > 250) {
            setErrMsg('Course Description is too long must be less than 250 characters.');
            return true;
        }
        else if (course_title.length > 50) {
            setErrMsg('Course Title is too long must be less than 50 characters.');
            return true;
        }
        return false;
    }

    const columns = [
        { field: 'COURSEID', headerName: 'Course ID', flex: 0.35 },
        {
            field: 'TITLE',
            headerName: 'Title',
            flex: 0.3
        },
        {
            field: 'COURSEDESC',
            headerName: 'Description',
            flex: 0.4
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
                    <Button onClick={() => confirmDelete(params.row.COURSEID, params.row.TITLE)}><DeleteOutlineOutlinedIcon color="error" /></Button>
                )
            }
        },
    ];

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getCourses = async () => {
            try {
                const response = await axiosPrivate.get(API_URL.COURSE_URL, {
                    signal: controller.signal
                });
                console.log(response.data);
                isMounted && setCourses(response.data);
            } catch (err) {
                console.error(err);
            }
        }

        getCourses();

        return () => {
            isMounted = false;
            controller.abort();
            setSuccess(false);
        }
    }, [success])


    const onClose = () => {
        setCourse_title('');
        setCourse_tuition('');
        setCourse_travel('');
        setCourse_travelHours('');
        setCourse_hours('');
        setErrMsg('');
        setCourse_desc('');
        setAddCourse(false);
    }

    const onSubmit = async () => {
        setErrMsg('');
        if (ValidateInputs()) {
            return;
        }
        try {
            const response = await axiosPrivate.post(API_URL.COURSE_URL,
                JSON.stringify({ course_title, course_desc, course_hours, course_travelHours, course_travel, course_tuition })
            )
            console.log(JSON.stringify(response))
            setAddCourse(false);
            setSuccess(true);
            setCourse_title('');
            setCourse_tuition('');
            setCourse_travel('');
            setCourse_travelHours('');
            setCourse_hours('');
            setErrMsg('');
            setCourse_desc('');
        } catch (err) {
            if (!err?.response) { setErrMsg('No Server Response') }
            else if (err.response?.status === 409) {
                setErrMsg('CourseId Taken');
            } else if (err.response?.status === 400) {
                setErrMsg('Course details missing');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized Access');
            }
            else {
                setErrMsg('Course failed to be created.')
            }
        }
    }

    function getRowId(row) {
        return row.COURSEID;
    }

    const onChangeInt = (e, setValue) => {
        if (e.target.value.match(/[^0-9]/)) {
            e.preventDefault();
            return;
        }

        setValue(e.target.value);
    }

    const deleteCourse = async () => {
        setConfirmDeleteErr('');
        try {
            const response = await axiosPrivate.delete(API_URL.COURSE_URL,
                {
                    data: {
                        courseId: courseToDelete.id
                    }
                }
            )
            console.log(JSON.stringify(response))
            setConfirmDeleteVis(false);
            setSuccess(true);
            setCourseToDelete({});
        } catch (err) {
            if (!err?.response) { setConfirmDeleteErr('No Server Response') }
            else if (err.response?.status === 400) {
                setConfirmDeleteErr('COURSEID missing');
            } else if (err.response?.status === 401) {
                setConfirmDeleteErr('Unauthorized Access');
            }
            else {
                setConfirmDeleteErr('Course failed to be created.')
            }
        }
    }

    const confirmDelete = (courseId, courseTitle) => {
        setConfirmDeleteVis(true);
        setCourseToDelete({ id: courseId, title: courseTitle });
    }



    return (
        <ThemeProvider theme={AppTheme}>
            <Box>
                <Grid2 container paddingTop={'1%'} paddingRight={'3%'} paddingLeft={'3%'} justifyContent="space-between">
                    <Grid2 item >
                        <Typography variant="h5" >Courses</Typography>
                    </Grid2>
                    <Grid2 item justifyContent="flex-end" >
                        <Button variant="contained" onClick={() => setAddCourse(true)}><AddBoxOutlinedIcon sx={{ paddingRight: '2%' }} /> Add Course  </Button>
                    </Grid2>
                </Grid2>
                <Box sx={{ paddingLeft: '3%',  paddingRight: '3%', paddingBottom: '3%', paddingTop: '1%'}}>
                    <TableContainer component={Paper}>
                        <DataGrid
                            columns={columns}
                            rows={courses}
                            getRowId={getRowId}
                            sx={{
                                "& .MuiDataGrid-cell, & .MuiDataGrid-columnHeaderTitle": {
                                    textOverflow: "clip"
                                }
                            }}
                            getRowHeight={(params) => "auto"}
                        />

                    </TableContainer>
                </Box>
                <Dialog open={addCourse} onClose={() => setAddCourse(false)}>
                    <DialogContent>
                        {errMsg ? <Typography color="error">{errMsg}</Typography> : <></>}
                        <Typography fontStyle={'h1'} paddingBottom={'2%'}>Create Course</Typography>
                        <FormLabel>Course Title</FormLabel>
                        <TextField
                            fullWidth
                            variant="outlined"
                            size='small'
                            value={course_title}
                            onChange={(e) => setCourse_title(e.target.value)}
                            autoComplete='off'
                        />
                        <FormLabel>Description</FormLabel>
                        <TextField
                            fullWidth
                            variant="outlined"
                            size='small'
                            value={course_desc}
                            onChange={(e) => setCourse_desc(e.target.value)}
                            autoComplete='off'
                        />
                        <FormLabel>Course Hours</FormLabel>
                        <TextField
                            fullWidth
                            variant="outlined"
                            size='small'
                            value={course_hours}
                            onChange={(e) => onChangeInt(e, setCourse_hours)}
                            autoComplete='off'
                        />
                        <FormLabel>Travel Hours</FormLabel>
                        <TextField
                            fullWidth
                            variant="outlined"
                            size='small'
                            value={course_travelHours}
                            onChange={(e) => onChangeInt(e, setCourse_travelHours)}
                            autoComplete='off'
                        />
                        <FormLabel>Travel Cost</FormLabel>
                        <TextField
                            fullWidth
                            variant="outlined"
                            size='small'
                            type="number"
                            value={course_travel}
                            onChange={(e) => setCourse_travel(e.target.value)}
                            autoComplete='off'
                        />
                        <FormLabel>Tuition</FormLabel>
                        <TextField
                            fullWidth
                            variant="outlined"
                            size='small'
                            type="number"
                            value={course_tuition}
                            onChange={(e) => setCourse_tuition(e.target.value)}
                            autoComplete='off'
                        />
                        <Grid2 container justifyContent="flex-end" paddingTop={'2%'}>
                            <Button variant="contained" color="error" size="small" sx={{ mr: '2%' }} onClick={() => onClose()}>Cancel</Button>
                            <Button variant="contained" color="success" size="small" onClick={() => onSubmit()}>Submit</Button>
                        </Grid2>
                    </DialogContent>

                </Dialog>
                <Dialog open={confirmDeleteVis} onClose={async () => { setConfirmDeleteVis(false); setCourseToDelete({}); setConfirmDeleteErr(''); }}>
                    <DialogContent>
                        {confirmDeleteErr ? <Typography color="error">{confirmDeleteErr}</Typography> : <></>}
                        <Typography>
                            Are you sure you want to delete this course: {courseToDelete.title}?
                        </Typography>
                        <Grid2 container justifyContent="center" paddingTop={'2%'}>
                            <Button onClick={async () => { setConfirmDeleteVis(false); setCourseToDelete({}); setConfirmDeleteErr(''); }} sx={{ mr: '2%' }} color="error" size="small" variant="contained">Cancel</Button>
                            <Button onClick={() => deleteCourse()} color="success" size="small" variant="contained">Confirm</Button>
                        </Grid2>
                    </DialogContent>
                </Dialog>
            </Box>
        </ThemeProvider>
    );
};

export default CourseScreen;