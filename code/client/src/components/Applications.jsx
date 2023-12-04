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
    const [NoApplications, setNoApplications] = useState(false);

    useEffect(() => {
        if (props.user && props.user.role === 'teacher') {
            fetchData(professorAPI.getApplications);
        } else if (props.user && props.user.role === 'student') {
            fetchData(studentAPI.getApplications);
        }
    }, [props.user.id, props.user.role]);

    const fetchData = async (apiFunction) => {
        try {
            const listApplications = await apiFunction();
            setApplications(listApplications.enhancedApplications);
        } catch (err) {
            if (err.error && err.status === 404) {
                // Set empty list of applications for a 404 error
                setApplications([]);
                // set no applications to show
                setNoApplications(true);
            } else {
                // Handle other errors using the provided error handler
                handleErrors(err);
            }
        }
    };

    const handleGoBack = () => {
        props.setMessage('');
        // Navigate back to
        navigate('/thesis');
    }

    return (

        <>
            {applications.length === 0 && NoApplications ? (
                <NotFoundApplications handleGoBack={handleGoBack} />
            ) : props.loggedIn && props.user.role === 'teacher' ? (
                <ProfessorApplications applications={applications} user={props.user} />
            ) : props.loggedIn && props.user.role === 'student' ? (
                <StudentApplications applications={applications} user={props.user} />
                // Nothing to see here...go Log in!
            ) : navigate('/login')}
        </>



    );
}


function StudentApplications({ applications, user }) {


    return (

        <div className="mt-4">
            <Row className="mt-5">
                <Row className="d-flex justify-content-center mb-4">
                    <Col lg={9} xs={12} md={12} sm={12} className="text-start">
                        <h2> Thesis applications </h2>
                    </Col>
                </Row>
                <Row className="d-flex justify-content-center">
                    <Col lg={9} xs={12} md={12} sm={12}>
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>Teacher</th>
                                    <th>Thesis</th>
                                    <th>Type</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody className="align-middle">
                                {applications.map((appl, index) => (
                                    // choose a better key...
                                    <tr key={index} style={{ fontWeight: 'bold' }}>
                                        <td>{appl.teacherInfo.surname + ' ' + appl.teacherInfo.name}<br /><small>{appl.teacherInfo.email}</small> </td>
                                        <td>
                                            <Link to={`/application/${index}`} state={{ applicationDetails: appl, user: user }}>
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
            </Row>

        </div>

    );
}


function ProfessorApplications({ applications, user }) {


    return (

        <div className="mt-4">
            <Row className="mt-5">
                <Row className="d-flex justify-content-center mb-4">
                    <Col lg={9} xs={12} md={12} sm={12} className="text-start">
                        <h2> Thesis applications </h2>
                    </Col>
                </Row>
                <Row className="d-flex justify-content-center">
                    <Col lg={9} xs={12} md={12} sm={12}>
                        <Table striped bordered hover responsive>
                            <thead className="align-middle">
                                <tr>
                                    <th>StudentID</th>
                                    <th>Student</th>
                                    <th>Thesis</th>
                                    <th>Type</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody className="align-middle">
                                {applications.map((appl, index) => (
                                    // choose a better key...
                                    <tr key={index} style={{ fontWeight: 'bold' }}>
                                        <td>{appl.studentId}</td>
                                        <td>{appl.studentInfo.surname + ' ' + appl.studentInfo.name}<br /><small>{appl.studentInfo.email}</small> </td>
                                        <td>
                                            <Link to={`/application/${index}`} state={{ applicationDetails: appl, user: user }}>
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
            </Row>

        </div>

    );
}

function NotFoundApplications(props) {

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