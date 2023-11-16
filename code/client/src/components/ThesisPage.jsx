import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import '../App.css'; // Import the custom CSS file
import studentAPI from '../apis/studentAPI';

function ThesisPage(props) {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [thesisDetails, setThesisDetails] = useState(null);
  const studentId = props.user.id;

  useEffect(() => {
    console.log(state)
    if (!state || !state.thesisDetails) {
      console.error('Thesis details not available.');
      return;
    }
    setThesisDetails(state.thesisDetails);
  }, [state]);

  const handleApplyClick = () => {
    // Add logic to handle the "Apply" button click (e.g., send an application)
    console.log(thesisDetails);
    studentAPI.insertApplication(studentId, thesisDetails.id)
      .then(() => {
        props.setMessage({ msg: "Application submitted succesfully!", type: 'success' });
        navigate('/thesis');
      })
      .catch( e => {
        console.log(e);
        props.setMessage({ msg: e, type: 'danger' });
      });
  };

  const handleGoBackClick = () => {
    // Navigate back to /thesis
    props.setMessage('');
    navigate('/thesis');
  };

  if (!state || !state.thesisDetails || !thesisDetails) {
    return <div>Data Unavailable</div>;
  }

  return (
    <Container className="mt-5">
      <Row>
        <Col md={{ span: 8, offset: 2 }}>
          <Card className="thesis-card">
            <Card.Body>
              <Card.Title className="border-bottom pb-2 mb-4">{thesisDetails.title}</Card.Title>

              {/* Grouping related information */}
              <Row className="mb-4">
                <Col md={6}>
                  <Card.Text className="mb-2"><strong>Type:</strong> {thesisDetails.type}</Card.Text>
                  <Card.Text className="mb-2"><strong>Expiration:</strong> {thesisDetails.expiration}</Card.Text>
                </Col>
                <Col md={6}>
                  <Card.Text className="mb-2"><strong>Level:</strong> {thesisDetails.level}</Card.Text>
                  <Card.Text className="mb-2"><strong>Group:</strong> {thesisDetails.groups.join(', ')}</Card.Text>
                </Col>
              </Row>
              <Row className="mb-4">
                <Col md={6}>
                  <Card.Text className="mb-2"><strong>Supervisors:</strong> {thesisDetails.supervisor}</Card.Text>
                  <Card.Text className="mb-2"><strong>Co-Supervisors:</strong> {thesisDetails.cosupervisors.join(', ')}</Card.Text>
                </Col>
              </Row>

              {/* Description in a separate card */}
              <Card>
                <Card.Title className="border-bottom pb-2 mb-4">Description:</Card.Title>
                <Card.Body>
                  <Card.Text>{thesisDetails.description}</Card.Text>
                </Card.Body>
              </Card>

              <Row>
                <Card.Text className="mt-2"><strong>Keywords:</strong> {thesisDetails.keywords.join(', ')}</Card.Text>
              </Row>

              {/* Apply button (visible only for students) */}
              {props.user.role === 'student' && (
                <Button variant="success" className="mt-3" onClick={handleApplyClick}>
                  Apply
                </Button>
              )}

              {/* Go back button */}
              <Button variant="danger" className="mt-3 ms-2" onClick={handleGoBackClick}>
                Go Back
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ThesisPage;
