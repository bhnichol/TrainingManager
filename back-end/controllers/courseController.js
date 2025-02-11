const oracledb = require('oracledb');
const dbConn = require('../config/dbConn');

const getAllCourses = async (req, res) => {
    try {
        const conn = await oracledb.getConnection(dbConn);
        const results = await conn.execute('SELECT * FROM trainingapp.courses WHERE INACTIVE_IND <> 1',[],{outFormat: oracledb.OUT_FORMAT_OBJECT});
        res.send(results.rows);
        if(conn){
            conn.close()
        }
    } catch (err) {
        res.send(err);
    }
}

const createCourse = async (req, res) => {
    const { course_title, course_desc, course_hours, course_travelHours, course_travel , course_tuition } = req.body;
    if (!course_title || !course_hours)  return res.status(400).json({ 'message': 'missing course details' });
    const timestamp = new Date();
    try {
        const conn = await oracledb.getConnection(dbConn);
        const results = await conn.execute('INSERT INTO trainingapp.courses (TITLE, COURSEDESC, COURSEHOURS, TRAVELHOURS, TRAVEL, TUITION, INACTIVE_IND, CREATE_DATE) VALUES (:TITLE, :COURSEDESC, :COURSEHOURS, :TRAVELHOURS, :TRAVEL, :TUITION, 0, :CREATE_DATE)', [course_title, course_desc, course_hours, course_travelHours || 0, course_travel || 0, course_tuition || 0, timestamp],{autoCommit: true});
        res.status(201).json({'message': `Course successfully created.`})
        if(conn){
            conn.close()
        }
    } catch (err) {
        res.status(400).send(err);
    }
}

const deleteCourse = async (req, res) => {
    if (!req?.body?.courseId) return res.status(400).json({ "message": 'COURSEID required' });
    const timestamp = new Date();
    try {
        const conn = await oracledb.getConnection(dbConn);
        const results = await conn.execute('UPDATE trainingapp.courses SET INACTIVE_IND = 1, DELETE_DATE = :DELETE_DATE WHERE COURSEID = :COURSEID', [timestamp, req.body.courseId],{autoCommit: true});
        res.json(results)
        if(conn){
            conn.close()
        }
    } catch (err) {
        res.status(400).send(err)
    }
}

module.exports = {getAllCourses, deleteCourse, createCourse};