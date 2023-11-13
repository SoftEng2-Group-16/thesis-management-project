import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';
import '../App.css'; // Import the custom CSS file

function ThesisPage() {
  const { state } = useLocation();
  const [thesisDetails, setThesisDetails] = useState(null);

  useEffect(() => {
    if (!state || !state.thesisDetails) {
      console.error('Thesis details not available.');
      return;
    }

    const thesisDetails = state.thesisDetails;
    setThesisDetails(thesisDetails);
  }, [state]);

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
                  <Card.Text className="mb-2"><strong>Group:</strong> {thesisDetails.group}</Card.Text>
                </Col>
             
              </Row>
              <Row className="mb-4">
                
                <Col md={6}>
                  <Card.Text className="mb-2"><strong>Supervisors:</strong> {thesisDetails.supervisors}</Card.Text>
                  <Card.Text className="mb-2"><strong>Co-Supervisors:</strong> {thesisDetails.cosupervisors.join(', ')}</Card.Text>
                </Col>
              </Row>

              {/* Description in a separate card */}
              <Card >
                <Card.Title className="border-bottom pb-2 mb-4">Description:</Card.Title>
                <Card.Body>
 
                  <Card.Text> {thesisDetails.description}</Card.Text>
                </Card.Body>
              </Card>

             
             <Row>
              <Card.Text className="mt-2"><strong>Keywords:</strong> {thesisDetails.keywords.join(', ')}</Card.Text>
              </Row>
              {/* Additional sections can be added here based on your needs */}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ThesisPage;
