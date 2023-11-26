import React, {useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, CardText } from 'react-bootstrap';
import API from '../apis/professorAPI';
import MessageContext from "../messageCtx.jsx"
import '../App.css';

function ApplicationDetails(props) {
  const { state } = useLocation();
  const navigate = useNavigate();
    const { handleErrors } = useContext(MessageContext);
  const [applInfo, setApplInfo] = useState();
  const [statusStyle,setStatusStyle]=useState();
  
 // const statusStyle = getStatusStyle(applInfo.status);

  useEffect(() => {
    if (!state || !state.applicationDetails) {
      console.error('Application details are not available.');
      return;
    }
    setApplInfo(state.applicationDetails);
    setStatusStyle(getStatusStyle(state.applicationDetails.status))
  }, [state]);

    const handleGoBack = () => {
        // Navigate back to the list of applications
        navigate('/applications');
    }

    const handleDecision = (decision) => {
      console.log(decision);
      const data = {thesisid: applInfo.thesisInfo.id, body: {decision: decision, studentId: applInfo.studentInfo.id}};
      API.setDecision(data).then(() => {
        props.setMessage({ msg: 'Application accepted successfully!', type: (decision === "accepted" ? "success" : "warning") });
        // Navigate back to the list of applications
        navigate('/applications');
      })
      .catch ((err) => {
        handleErrors(err);
      });
    }

    console.log(applInfo);
    if (!state || !state.applicationDetails || !applInfo) {
        return <div>Data Unavailable</div>;
    }

  return (
    <Container className="mt-5">
      <Row >
        <Col md={{ span: 8, offset: 2 }}>
          <Card className="thesis-card">
            <Card.Body>
              <Card.Title className="border-bottom pb-2 mb-4">{applInfo.thesisInfo.title}</Card.Title>

              <CardText className="text-info">Application submitted at: {applInfo.timestamp}</CardText>

              <Card className={`mb-4 ${statusStyle}`} style={{ width: '10rem', height:'5rem' }}>
                <Card.Title>
                  {applInfo.status}
                </Card.Title>

              </Card>

              {/* Student related informations */}
              <Card className="mb-4">
                <Card.Title className="border-bottom pb-2 mb-4">Student Informations</Card.Title>
                <Card.Body>
                  <Card.Text className="mb-2 text-start"><strong>Student ID:</strong> {applInfo.studentInfo.id}</Card.Text>
                  <Card.Text className="mb-2 text-start"><strong>Surname:</strong> {applInfo.studentInfo.surname}</Card.Text>
                  <Card.Text className="mb-2 text-start"><strong>Name:</strong> {applInfo.studentInfo.name}</Card.Text>
                  <Card.Text className="mb-2 text-start"><strong>Gender:</strong> {applInfo.studentInfo.gender}</Card.Text>
                  <Card.Text className="mb-2 text-start"><strong>Nationality:</strong> {applInfo.studentInfo.nationality}</Card.Text>
                  <Card.Text className="mb-2 text-start"><strong>Email:</strong> {applInfo.studentInfo.email}</Card.Text>
                  <Card.Text className="mb-2 text-start"><strong>Degree Code:</strong> {applInfo.studentInfo.degreeCode}</Card.Text>
                  <Card.Text className="mb-2 text-start"><strong>Enrollment year:</strong> {applInfo.studentInfo.enrollmentYear}</Card.Text>
                </Card.Body>
              </Card>

              {/* Grouping Thesis related information */}
              <Row className="mb-4">
                <Col md={6}>
                  <Card.Text className="mb-2"><strong>Type:</strong> {applInfo.thesisInfo.type}</Card.Text>
                  <Card.Text className="mb-2"><strong>Expiration:</strong> {applInfo.thesisInfo.expiration}</Card.Text>
                </Col>
                <Col md={6}>
                  <Card.Text className="mb-2"><strong>Level:</strong> {applInfo.thesisInfo.level}</Card.Text>
                  <Card.Text className="mb-2"><strong>CDS:</strong> {applInfo.thesisInfo.cds.join(', ')}</Card.Text>
                </Col>
              </Row>
              <Row className="mb-4">
                <Col md={6}>
                  <Card.Text className="mb-2"><strong>Supervisors:</strong> {applInfo.thesisInfo.supervisor}</Card.Text>
                  <Card.Text className="mb-2"><strong>Co-Supervisors:</strong> {applInfo.thesisInfo.cosupervisors.join(', ')}</Card.Text>
                </Col>
                <Col md={6}>
                  <Card.Text className="mb-2"><strong>Group:</strong> {applInfo.thesisInfo.groups.join(', ')}</Card.Text>
                </Col>
              </Row>

              {/* Thesis Description in a separate card */}
              <Card>
                <Card.Title className="border-bottom pb-2 mb-4">Description:</Card.Title>
                <Card.Body>
                  <Card.Text>{applInfo.thesisInfo.description}</Card.Text>
                </Card.Body>
              </Card>

              <Row>
                <Card.Text className="mt-2"><strong>Keywords:</strong> {applInfo.thesisInfo.keywords.join(', ')}</Card.Text>
              </Row>

                <Row className="mb-4">
                  <Col md={6} className="d-flex justify-content-start">
                     {/* Go back button */}
                     <Button variant="danger" className="mt-3 ms-2" onClick={handleGoBack}>
                      Go Back
                    </Button>
                  </Col>
                  {applInfo.status === 'pending' && <Col md={6} className="d-flex justify-content-end">
                    {/* Reject button */}
                    <Button variant="dark" className="mt-3 ms-2" onClick={() => {handleDecision("rejected")}}>
                      Reject
                    </Button>

                    {/* Accept button */}
                    <Button variant="success" className="mt-3 ms-2" onClick={()=>{handleDecision("accepted")}}>
                    Accept
                    </Button>
                  </Col>}
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        </Container>
      );
}


function getStatusStyle(status) {
  switch (status) {
    case 'accepted':
      return 'bg-success text-white';
    case 'canceled':
      return 'bg-danger text-white';
    case 'rejected':
      return 'bg-warning';
    case 'pending':
      return 'bg-secondary text-white';
    default:
      return '';
  }
}

export default ApplicationDetails;