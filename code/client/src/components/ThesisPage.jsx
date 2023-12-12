import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import '../App.css'; // Import the custom CSS file
import studentAPI from '../apis/studentAPI';
import professorAPI from '../apis/professorAPI';
import MessageContext from '../messageCtx';

function ThesisPage(props) {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [thesisDetails, setThesisDetails] = useState(null);
  const studentId = props.user.id;
  const { handleErrors } = useContext(MessageContext);

  const [isAccepted, setAccepted] = useState(false);

  useEffect(() => {
    (state)
    props.setMessage('');
    if (!state || !state.thesisDetails) {
      console.error('Thesis details not available.');
      return;
    }
    setThesisDetails(state.thesisDetails);
    if (props.user.role === "teacher") {
      professorAPI.getApplications()
        .then((applications) => {
          const acceptedApplications = applications.enhancedApplications.filter(item => item.thesisId === state.thesisDetails.thesisId)
          //check if already exist an accepted application for this thesis 
          if (acceptedApplications.lenght > 0) {
            setAccepted(true); //used to enable/disable the edit button
          }
        })
        .catch(e => {
          //no application found for the professor, not a problem in this case
          if (err.error && err.status !== 404) {
            handleErrors(e);
          }
        });
    }

  }, [state]);

  const handleApplyClick = () => {
    // Add logic to handle the "Apply" button click (e.g., send an application)
    const teacherId = thesisDetails.supervisor.split(",")[0];
    studentAPI.insertApplication(studentId, thesisDetails.id, teacherId)
      .then(() => {
        props.setMessage({ msg: "Application submitted succesfully!", type: 'success' });
        navigate('/thesis');
      })
      .catch(e => {
        console.log(e);
        handleErrors(e);
      });
  };

  const handleArchiveClick = () => {

  }

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
              <Card.Title className="border-bottom pb-2 mb-4" id="card-title">{thesisDetails.title}</Card.Title>

              {/* Grouping related information */}
              <Row className="mb-4">
                <Col md={6}>
                  <Card.Text className="mb-2"><strong>Type:</strong> {thesisDetails.type}</Card.Text>
                  <Card.Text className="mb-2"><strong>Expiration:</strong> {thesisDetails.expiration}</Card.Text>
                </Col>
                <Col md={6}>
                  <Card.Text className="mb-2"><strong>Level:</strong> {thesisDetails.level}</Card.Text>
                  <Card.Text className="mb-2"><strong>CDS:</strong> {thesisDetails.cds.join(', ')}</Card.Text>
                </Col>
              </Row>
              <Row className="mb-4">
                <Col md={6}>
                  <Card.Text className="mb-2"><strong>Supervisors:</strong> {thesisDetails.supervisor}</Card.Text>
                  <Card.Text className="mb-2"><strong>Co-Supervisors:</strong> {thesisDetails.cosupervisors.join(', ')}</Card.Text>
                </Col>
                <Col md={6}>
                  <Card.Text className="mb-2"><strong>Group:</strong> {thesisDetails.groups.join(', ')}</Card.Text>

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

              {/*edit button */}
              {props.user.role === 'teacher' && (
                <Link
                  className=" mt-3 ms-2 btn btn-outline-primary"
                  to={"/proposal"}
                  state={{ proposal: state.thesisDetails, mode: 'edit' }}
                  disabled={isAccepted}
                >
                  Edit
                </Link>
              )}

              {/*copy button */}
              {props.user.role === 'teacher' && (
                <Link
                  className=" mt-3 ms-2 btn btn-outline-success"
                  to={"/proposal"}
                  state={{ proposal: state.thesisDetails, mode: 'copy' }}
                >
                  Copy
                </Link>
              )}

              {/*archive button */}
              {props.user.role === 'teacher' && (
                <Button variant="outline-warning" className="mt-3 ms-2" onClick={handleArchiveClick}>
                  Archive
                </Button>
              )}

              {/* Go back button */}
              <Button variant="outline-danger" className="mt-3 ms-2" onClick={handleGoBackClick}>
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
