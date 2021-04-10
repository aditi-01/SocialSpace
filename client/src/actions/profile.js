import axios from 'axios';
import {setAlert} from './alert';
import{
    CLEAR_PROFILE,
    DELETE_ACCOUNT,
    GET_PROFILE,
    GET_PROFILES,
    PROFILE_ERROR,
    UPDATE_PROFILE
} from './types';
//Get current user's profile
export const getCurrentProfile = () => async dispatch =>{
    try {
        const res = await axios.get('/api/profile/me');
        dispatch({
            type:GET_PROFILE,
            payload:res.data
        });
    } catch (err) {
        dispatch({
            type:PROFILE_ERROR,
            payload:{msg:err.response.statusText,status:err.response.status}
        });
        
    }
};
//Get all profiles
export const getProfiles = () => async dispatch =>{
    dispatch({type:CLEAR_PROFILE});
    try {
        const res = await axios.get('/api/profile');
        dispatch({
            type:GET_PROFILES,
            payload:res.data
        });
    } catch (err) {
        dispatch({
            type:PROFILE_ERROR,
            payload:{msg:err.response.statusText,status:err.response.status}
        });
        
    }
};
//Get profile by ID
export const getProfileById = userId => async dispatch =>{
    try {
        const res = await axios.get(`/api/user/${userId}`);
        dispatch({
            type:GET_PROFILES,
            payload:res.data
        });
    } catch (err) {
        dispatch({
            type:PROFILE_ERROR,
            payload:{msg:err.response.statusText,status:err.response.status}
        });
        
    }
};

// Create or update profile
export const createProfile =(FormData, history, edit = false ) => async (dispatch)=>{
    try {
        const config ={
            headers:{
                'Content-Type': 'application/json'
            }
        }
        const res =await axios.post('/api/profile',FormData,config);
        dispatch({
            type:GET_PROFILE,
            payload:res.data
        });
        dispatch(setAlert(edit?'Profile Updated':'Profile Created','success'));
        if(!edit){
            history.push('/dashboard')
        }
    } catch (err) {
        const errors = err.response.data.errors;
        if (errors){
            errors.forEach(error=>dispatch(setAlert(error.msg,'danger')));
        }
        dispatch({
            type:PROFILE_ERROR,
            payload:{msg:err.response.statusText,status:err.response.status}
        });
        
    }
};
//Add experience
export const addExperience = (FormData, history) => async dispatch => {

    try {
        const config ={
            headers:{
                'Content-Type': 'application/json'
            }
        }
        const res =await axios.put('/api/profile/experience',FormData,config);
        dispatch({
            type:UPDATE_PROFILE,
            payload:res.data
        });
        dispatch(setAlert('Experience added','success'));
            history.push('/dashboard');
    } catch (err) {
        const errors = err.response.data.errors;
        if (errors){
            errors.forEach(error=>dispatch(setAlert(error.msg,'danger')));
        }
        dispatch({
            type:PROFILE_ERROR,
            payload:{msg:err.response.statusText,status:err.response.status}
        });
        
    }
}
//Add education
export const addEducation = (FormData, history) => async dispatch => {

    try {
        const config ={
            headers:{
                'Content-Type': 'application/json'
            }
        }
        const res =await axios.put('/api/profile/education',FormData,config);
        dispatch({
            type:UPDATE_PROFILE,
            payload:res.data
        });
        dispatch(setAlert('Education added','success'));
            history.push('/dashboard');
    } catch (err) {
        const errors = err.response.data.errors;
        if (errors){
            errors.forEach(error=>dispatch(setAlert(error.msg,'danger')));
        }
        dispatch({
            type:PROFILE_ERROR,
            payload:{msg:err.response.statusText,status:err.response.status}
        });
        
    }
};

//Delete  experience 
export const deleteExperience = id => async dispatch =>{
    try {
        const res = await axios.delete(`/api/profile/experience/${id}`);
        dispatch({
            type: UPDATE_PROFILE,
            payload : res.data
        });
        dispatch(setAlert('Experience removed','success'));
    } catch (err) {
        dispatch({
            type:PROFILE_ERROR,
            payload:{msg:err.response.statusText,status:err.response.status}
        });
        
    }
};

//Delete  education
export const deleteEducation = id => async dispatch =>{
    try {
        const res = await axios.delete(`/api/profile/education/${id}`);
        dispatch({
            type: UPDATE_PROFILE,
            payload : res.data
        });
        dispatch(setAlert('Education removed','success'));
    } catch (err) {
        dispatch({
            type:PROFILE_ERROR,
            payload:{msg:err.response.statusText,status:err.response.status}
        });
        
    }
};
//Delete Account & Profile 
export const deleteAccount = () => async dispatch =>{
    if(window.confirm('Are you sure?')){
        try {
             await axios.delete(`/api/profile`);
            dispatch({type: CLEAR_PROFILE});
            dispatch({type:DELETE_ACCOUNT})
            dispatch(setAlert('Your account is deleted','success'));
        } catch (err) {
            dispatch({
                type:PROFILE_ERROR,
                payload:{msg:err.response.statusText,status:err.response.status}
            });
            
        }

    }
    
};



