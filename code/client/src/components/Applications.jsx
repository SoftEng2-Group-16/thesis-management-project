/* IDEA
if role:
 professors -> shows all the applications for them thesis
 student -> show all the applications sent and their relative status
*/

import { Col, Row, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';


function ThesisApplications (props) {

    let applications = [
        {
            StudentID: 1,
            Student: 'John Doe',
            Thesis: 'Advanced Physics',
            Type: 'Scientific Research',
            ExpirationDate: '2023-12-31'
        },
        {
            StudentID: 2,
            Student: 'Jane Smith',
            Thesis: 'Modern Art Interpretations',
            Type: 'Art History',
            ExpirationDate: '2023-11-30'
        },
        {
            StudentID: 3,
            Student: 'Alex Johnson',
            Thesis: 'Cultural Anthropology',
            Type: 'Social Sciences',
            ExpirationDate: '2024-02-28'
        },
        {
            StudentID: 4,
            Student: 'Emma Brown',
            Thesis: 'Environmental Studies',
            Type: 'Ecology',
            ExpirationDate: '2024-01-15'
        }
    ];
    
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
                                        <th>Expiration Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {applications.map((appl) => (
                                        // choose a better key...student may apply to more than just 1 thesis
                                        //maybe applicationID 
                                        <tr key={appl.StudentID} style={{ fontWeight: 'bold' }}> 
                                            <td>{appl.StudentID}</td>
                                            <td>{appl.Student}</td>
                                            <td>
                                                <Link to={`/application/${0}`} state={{ thesisDetails: appl }}>
                                                    {appl.Thesis}
                                                </Link>
                                            </td>
                                            <td>{appl.Type}</td>
                                            <td>{appl.ExpirationDate}</td>
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