/* IDEA
if role:
 professors -> shows all the applications for them thesis
 student -> show all the applications sent and their relative status
*/

import { Col, Row, Table, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import API from '../apis/professorAPI.js';
import { useState, useEffect, useContext } from 'react';
import '../App.css';
import MessageContext from '../messageCtx.jsx';
import professorAPI from '../apis/professorAPI.js';
import studentAPI from '../apis/studentAPI.js';


function ThesisApplications(props) {
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const { handleErrors } = useContext(MessageContext);

    useEffect(() => {
        if (props.user && props.user.role === 'teacher') {
             fetchData(professorAPI.getApplications, handleErrors);
        } else if (props.user && props.user.role === 'student') {
             fetchData(studentAPI.getApplications, handleErrors);
        }
    }, [props.user.id, props.user.role]);

    const fetchData = async (apiFunction, errorHandler) => {
        try {
            const listApplications = await apiFunction();
            console.log(listApplications);
            setApplications(listApplications.enhancedApplications);
        } catch (err) {
            if (err.error && err.status === 404) {
                // Set empty list of applications for a 404 error
                setApplications([]);
            } else {
                // Handle other errors using the provided error handler
                errorHandler(err);
            }
        }
    };

    const handleGoBack = () => {
        // Navigate back to
        navigate('/thesis');
    }

    return (

        <>
            { applications.length === 0 ? (
                <NotFoundApllications handleGoBack={handleGoBack} />
            ) : props.loggedIn && props.user.role === 'teacher' ? (
                <ProfessorApplications applications={applications} />
            ) : props.loggedIn && props.user.role === 'student' ? (
                <StudentApplications applications={applications}/>
            ) : null}
        </>



    );
}


function StudentApplications({ applications }) {


    return (

        <div style={{ marginTop: '10px' }}>

            <Row style={{ marginTop: '20px' }}>
                <Col style={{ marginBottom: '15px' }}><h2> Thesis applications </h2></Col>
                <Col xs={12}>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Teacher</th>
                                <th>Thesis</th>
                                <th>Type</th>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map((appl, index) => (
                                // choose a better key...
                                <tr key={index} style={{ fontWeight: 'bold' }}>
                                    <td>{appl.studentInfo.surname + ' ' + appl.studentInfo.name}<br /><small>{appl.studentInfo.email}</small> </td>
                                    <td>
                                        <Link to={`/application/${index}`} state={{ applicationDetails: appl }}>
                                            {appl.thesisInfo.title}
                                        </Link>
                                    </td>
                                    <td>{appl.thesisInfo.type}</td>
                                    <td>{appl.timestamp.split(' ')[0]}</td>
                                    <td>{appl.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>

        </div>

    );
}


function ProfessorApplications({ applications }) {


    return (

        <div style={{ marginTop: '10px' }}>

            <Row style={{ marginTop: '20px' }}>
                <Col style={{ marginBottom: '15px' }}><h2> Thesis applications </h2></Col>
                <Col xs={12}>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>StudentID</th>
                                <th>Student</th>
                                <th>Thesis</th>
                                <th>Type</th>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map((appl, index) => (
                                // choose a better key...
                                <tr key={index} style={{ fontWeight: 'bold' }}>
                                    <td>{appl.studentId}</td>
                                    <td>{appl.studentInfo.surname + ' ' + appl.studentInfo.name}<br /><small>{appl.studentInfo.email}</small> </td>
                                    <td>
                                        <Link to={`/application/${index}`} state={{ applicationDetails: appl }}>
                                            {appl.thesisInfo.title}
                                        </Link>
                                    </td>
                                    <td>{appl.thesisInfo.type}</td>
                                    <td>{appl.timestamp.split(' ')[0]}</td>
                                    <td>{appl.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>

        </div>

    );
}

function NotFoundApllications(props) {

    return (
        <Card className="thesis-card">
            <Card.Title>
                No applications to show yet!
            </Card.Title>
            <Card.Body>
                <Button variant="danger" className="mt-3 ms-2" onClick={props.handleGoBack}>
                    Go Back
                </Button>
            </Card.Body>
        </Card>
    );
}


export default ThesisApplications;