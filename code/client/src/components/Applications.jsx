/* IDEA
if role:
 professors -> shows all the applications for them thesis
 student -> show all the applications sent and their relative status
*/

import { Col, Row, Table, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import API from '../apis/professorAPI.js';
import { useState, useEffect } from 'react';
import '../App.css';


function ThesisApplications (props) {
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    
    useEffect(() => {
        API.getApplications().then((listApplications) => {
            setApplications(listApplications.enhancedApplications);
        })
        .catch(() => {
            // set empty list of applications
            setApplications([]);
        });
    }, [props.user.id]);

    const handleGoBack = () => {
        // Navigate back to
        navigate('/thesis');
    }
    
    return (
        <>
            {props.loggedIn & props.user.role === 'teacher' ? (
                <div style={{ marginTop: '10px' }}>
                    { applications.length !== 0 ? (
                        <Row style={{ marginTop: '20px' }}>
                        <Col style={{ marginBottom: '15px'}}><h2> Thesis applications </h2></Col>
                        <Col xs={12}>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>StudentID</th>
                                        <th>Student</th>
                                        <th>Thesis</th>
                                        <th>Type</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {applications.map((appl, index) => (
                                        // choose a better key...
                                        <tr key={index} style={{ fontWeight: 'bold' }}> 
                                            <td>{appl.studentId}</td>
                                            <td>{appl.studentInfo.surname + ' ' + appl.studentInfo.name}<br/><small>{appl.studentInfo.email}</small> </td>
                                            <td>
                                                <Link to={`/application/${index}`} state={{ applicationDetails: appl }}>
                                                    {appl.thesisInfo.title}
                                                </Link>
                                            </td>
                                            <td>{appl.thesisInfo.type}</td>
                                            <td>{appl.timestamp.split(' ')[0]}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                    ) : ( // No applications found
                        <Card className="thesis-card">
                            <Card.Title>
                                No applications to show yet!
                            </Card.Title>
                            <Card.Body>
                                <Button variant="danger" className="mt-3 ms-2" onClick={handleGoBack}>
                                Go Back
                                </Button>
                            </Card.Body>
                        </Card>
                    )}
                </div>
            ) : (
                props.loggedIn & props.user.role === 'student' ? <div>STUDENT VIEW!</div> : <div>You need to LOGIN!</div>
                )
            }
        </>
    );
}

export default ThesisApplications;