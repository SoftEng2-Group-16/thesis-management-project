import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, CardText } from 'react-bootstrap';
import '../App.css';

function ApplicationDetails() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [applInfo, setApplInfo] = useState();

    useEffect(() => {
      if (!state || !state.applicationDetails) {
        console.error('Application details are not available.');
        return;
      }
        setApplInfo(state.applicationDetails);
    }, [state]);

    const handleGoBack = () => {
        // Navigate back to the list of applications
        navigate('/applications');
    }
    console.log(applInfo);
    if (!state || !state.applicationDetails || !applInfo) {
        return <div>Data Unavailable</div>;
    }

    return (
        <Container className="mt-5">
            <Row>
          <Col md={{ span: 8, offset: 2 }}>
            <Card className="thesis-card">
              <Card.Body>
                <Card.Title className="border-bottom pb-2 mb-4">{applInfo.thesisInfo.title}</Card.Title>
                
                <CardText className="text-info">Application submitted at: {applInfo.timestamp}</CardText>
                
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

                {/* Go back button */}
                <Button variant="danger" className="mt-3 ms-2" onClick={handleGoBack}>
                  Go Back
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        </Container>
      );
}

export default ApplicationDetails;