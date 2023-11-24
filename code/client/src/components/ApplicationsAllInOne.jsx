import { Col, Row, Table, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import API from '../apis/professorAPI.js';
import { useState, useEffect, useContext } from 'react';
import '../App.css';
import MessageContext from '../messageCtx.jsx';
import professorAPI from '../apis/professorAPI.js';
import studentAPI from '../apis/studentAPI.js';



function ApplicationsTable({ role, applications }) {
    const columns =
        role === 'teacher'
            ? ['StudentID', 'Student', 'Thesis', 'Type', 'Date', 'Status']
            : ['Teacher', 'Thesis', 'Type', 'Date', 'Status'];

    const getRowContent = (appl, index) => {
        return (
            <tr key={index} style={{ fontWeight: 'bold' }}>
                {role === 'teacher' ? (
                    <>
                        <td>{appl.studentId}</td>
                        <td>{appl.studentInfo.surname + ' ' + appl.studentInfo.name}<br /><small>{appl.studentInfo.email}</small> </td>
                    </>
                ) : (
                    <>
                        <td>{appl.teacherInfo.surname + ' ' + appl.teacherInfo.name}<br /><small>{appl.teacherInfo.email}</small> </td>
                    </>
                )}
                <td>
                    <Link to={`/application/${index}`} state={{ applicationDetails: appl }}>
                        {appl.thesisInfo.title}
                    </Link>
                </td>
                <td>{appl.thesisInfo.type}</td>
                <td>{appl.timestamp.split(' ')[0]}</td>
                <td>{appl.status}</td>
            </tr>
        );
    };

    return (
        <div style={{ marginTop: '10px' }}>
            <Row style={{ marginTop: '20px' }}>
                <Col style={{ marginBottom: '15px' }}>
                    <h2> Thesis applications </h2>
                </Col>
                <Col xs={12}>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                {columns.map((column, index) => (
                                    <th key={index}>{column}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map((appl, index) => getRowContent(appl, index))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </div>
    );
}

function ThesisApplicationsBro(props) {
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const { handleErrors } = useContext(MessageContext);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const apiFunction =
                    props.user && props.user.role === 'teacher'
                        ? professorAPI.getApplications
                        : studentAPI.getApplications;

                const listApplications = await apiFunction();
                setApplications(listApplications.enhancedApplications);
            } catch (err) {
                if (err.error && err.status === 404) {
                    // Set empty list of applications for a 404 error
                    setApplications([]);
                } else {
                    // Handle other errors using the provided error handler
                    handleErrors(err);
                }
            }
        };

        fetchApplications();
    }, [props.user.id, props.user.role]);

    const handleGoBack = () => {
        // Navigate back to
        navigate('/thesis');
    };

    return (
        <>
            {applications.length === 0 ? (
                <NotFoundApllications handleGoBack={handleGoBack} />
            ) : props.loggedIn && props.user.role === 'teacher' ? (
                <ApplicationsTable role="teacher" applications={applications} />
            ) : props.loggedIn && props.user.role === 'student' ? (
                <ApplicationsTable role="student" applications={applications} handleGoBack={handleGoBack} />
            ) : null}
        </>
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


export default ThesisApplicationsBro;