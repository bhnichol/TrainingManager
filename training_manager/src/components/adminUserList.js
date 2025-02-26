import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Checkbox, Dialog, DialogContent, List, ListItem, Typography } from "@mui/material";
import API_URL from "../api/api";
import { CheckBox } from "@mui/icons-material";

const Users = () => {
    const [users, setUsers] = useState();
    const [userView, setUserView] = useState();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();
    const [perms, setPerms] = useState([]);
    const [permVis, setPermVis] = useState(false);

    const columns = [
        { field: 'ID', headerName: 'User ID', flex: 0.1 },
        { field: 'F_NAME', headerName: 'First Name', flex: 0.4 },
        {
            field: 'L_NAME',
            headerName: 'Last Name',
            flex: 0.5
        },
        {
            field: 'EMAIL', headerName: 'Email', flex: 0.4
        },
        {
            field: 'INACTIVE_IND',
            headerName: 'Inactive Indicator',
            flex: 0.3
        },
        {
            headerName: 'Permissions',
            flex: 0.25,
            sortable: false,
            renderCell: (params) => {

                return (
                    <Button onClick={() => {viewPerms(params.row.ID); setUserView(params.row)}}>View</Button>
                )
            }
        }
    ]

    useEffect(() => {
        console.log("Permissions updated:", perms);
    },[perms])

    const viewPerms = async (user) => {
        let isMounted = true;
        const controller = new AbortController();

        const getUserPerms = async () => {
            try {
                const response = await axiosPrivate.get(API_URL.ROLES_URL+'/'+user, {
                    signal: controller.signal,
                });
                if (isMounted) {
                    setPerms(response.data);
                }    
            } catch (err) {
                console.error(err);
                // navigate('/login', { state: { from: location }, replace: true });
            } finally {
                if (isMounted) {
                    setPermVis(true);
                }
                controller.abort();
            }
        }

        getUserPerms();
        return () => {
            isMounted = false;
            controller.abort();
            console.log(perms);
        };
    }

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getUsers = async () => {
            try {
                const response = await axiosPrivate.get('/users', {
                    signal: controller.signal
                });
                isMounted && setUsers(response.data);
            } catch (err) {
                console.error(err);
                navigate('/login', { state: { from: location }, replace: true });
            }
        }

        getUsers();

        return () => {
            isMounted = false;
            controller.abort();
        }
    }, [])

    function getRowId(user) {
        return user.ID;
    }

    return (
        <Box sx={{ paddingLeft: '3%', paddingRight: '3%', paddingBottom: '3%', paddingTop: '1%' }}>
            <DataGrid
                columns={columns}
                rows={users}
                getRowId={getRowId}
            />
            <Dialog open={permVis} onClose={async () => { setPermVis(false); setPerms([]);}}>
            <DialogContent>
                <Typography>User Permisions for {userView?.EMAIL}:</Typography>
                <List>
                {perms.map(perm => {
                    return <ListItem key={perm.ROLE_ID} sx={{justifyContent:'space-between' , display:'flex'}}><Typography>{perm.ROLE_DESC}</Typography><Checkbox key={perm.ROLE_ID} checked={perm.ID} disabled/></ListItem>
                })}
                </List>
          </DialogContent>
            </Dialog>
        </Box>
    );
};

export default Users;