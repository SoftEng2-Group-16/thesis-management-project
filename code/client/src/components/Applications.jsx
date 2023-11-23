/* IDEA
if role:
 professors -> shows all the applications for them thesis
 student -> show all the applications sent and their relative status
*/

import { Col, Row, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import API from '../apis/professorAPI.js';

import { useContext, useState, useEffect } from 'react';


function ThesisApplications (props) {
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    
    useEffect(() => {
        API.getApplications().then((listApplications) => {
            setApplications(listApplications.enhancedApplications);
        })
        .catch((err) => {
            console.log(err);
            props.handleErrors(err);
            navigate('/thesis')
        });
    }, [props.user.id]);

    return (
        <>
            {props.loggedIn & props.user.role === 'teacher' ? (
                <div style={{ marginTop: '10px' }}>

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
                                        // choose a better key...student may apply to more than just 1 thesis
                                        //maybe applicationID 
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
                </div>
            ) : (
                props.loggedIn & props.user.role === 'student' ? <div>STUDENT VIEW!</div> : <div>You need to LOGIN!</div>
                )
            }
        </>
    );
}

export default ThesisApplications;

// {
//     "enhancedApplications": [
//       {
//         "studentId": 200001,
//         "thesisId": 3,
//         "timestamp": "08/11/2023 16:42:50",
//         "status": "pending",
//         "teacherId": 268553,
//         "studentInfo": {
//           "id": 200001,
//           "surname": "Rossi",
//           "name": "Mario",
//           "gender": "M",
//           "nationality": "Italian",
//           "email": "mario.rossi@studenti.polito.it",
//           "degreeCode": "LM-1",
//           "enrollmentYear": "2010"
//         },
//         "thesisInfo": {
//           "id": 3,
//           "title": "Blockchain Technology and Cryptocurrencies",
//           "supervisor": "268555, Ferrari Giovanna",
//           "cosupervisors": [
//             "Maria Rossi, 268553, DAD",
//             "Luigi Bianchi, 268554, DAUIN"
//           ],
//           "keywords": [
//             "Blockchain",
//             " Cryptocurrency",
//             " Security"
//           ],
//           "type": "Company Thesis",
//           "groups": [
//             "AI",
//             "SO",
//             "SE"
//           ],
//           "description": "Explore the potential of blockchain technology and cryptocurrencies.",
//           "requirements": "Blockchain Development, Security, Financial Technology",
//           "notes": "This project focuses on the security and applications of blockchain and cryptocurrencies.",
//           "expiration": "31/12/2023",
//           "level": "master",
//           "cds": [
//             "LM-1",
//             "LM-2",
//             "LM-3"
//           ]
//         }
//       },
//     ]
//   }