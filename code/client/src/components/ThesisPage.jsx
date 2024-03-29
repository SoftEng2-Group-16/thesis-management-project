import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, CardBody, Table, Dropdown, DropdownButton } from 'react-bootstrap';
import '../App.css'; // Import the custom CSS file
import studentAPI from '../apis/studentAPI';
import professorAPI from '../apis/professorAPI';
import generalAPI from '../apis/generalAPI';
import MessageContext from '../messageCtx';
import ApplicationData from './ApplicationDataCV';
import ResponsiveDialog from './ConfirmationDialog';

function ThesisPage(props) {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [thesisDetails, setThesisDetails] = useState(null);
  const studentId = props.user.id;
  const { handleErrors } = useContext(MessageContext);

  const [isEditable, setIsEditable] = useState(true);
  const [isArchived, setArchived] = useState(false);

  const [showApplicationData, setShowData] = useState(false);

  const [applicationCV, setApplicationCV] = useState(undefined);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState({  //state used to configure dynamically the dialog
    title: '', //title displayed in the dialog
    message: '', //message displayed in the dialog
    handleAction: null, //acrion called when the dialog is confirmed
    actionText: '', //text displayed in the dialog button
  });

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const openDialog = (title, message, handleAction, actionText) => { //function to open and configure the dialog
    setDialogConfig({
      title,
      message,
      handleAction,
      actionText,
    });
    setDialogOpen(true);
  };

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
          //i am getting all the applications of this teacher
          //now keep only applications for the specific thesis with state is "accepted" or "pending"
          const acceptedApplications = applications.enhancedApplications.filter(
            item => {
              return item.thesisId === state.thesisDetails.id &&
                (item.status === 'accepted' || item.status === 'pending')
            }
          );
          //check if already exist an accepted application or pending ones for this thesis 
          if (acceptedApplications.length > 0) {
            setIsEditable(false); //used to enable/disable the edit button
          }
        })
        .catch(e => {
          //no application found for the professor, not a problem in this case
          if (e.error && e.status !== 404) {
            handleErrors(e);
          }
        });
      professorAPI.getOwnArchivedProposals().then((archivedProposals) => {
        const wasArchived = archivedProposals.filter(item => item.id === state.thesisDetails.id)

        if (wasArchived.length > 0)
          setArchived(true);
      })
        .catch(e => {
          //handleErrors(e);
        })
    }

  }, [state]);



  const handleApplyClick = () => {
    // Add logic to handle the "Apply" button click (e.g., send an application
    const teacherId = thesisDetails.supervisor.split(",")[0];
    const teacherName = thesisDetails.supervisor.split(",")[1];
    const studentName = props.user.name + " " + props.user.surname;
    studentAPI.insertApplication(studentId, thesisDetails.id, teacherId)

      .then(() => {
        const emailData = {
          subject: `New Application Received`,
          type: 'application-sent',
          studentId: studentId,
          thesisTitle: thesisDetails.title,
          teacherName: teacherName,
          studentName: studentName
        };

        generalAPI.sendEmail(emailData);

      })
      .then(() => {
        props.setMessage({ msg: "Application submitted succesfully!", type: 'success' });
        navigate('/thesis');
      })
      .catch(e => {
        handleErrors(e);
      });
  };

  const handleApplyWithCV = () => {

    const teacherId = parseInt(thesisDetails.supervisor.split(",")[0]);
    const teacherName = thesisDetails.supervisor.split(",")[1];
    const studentName = props.user.name + " " + props.user.surname;

    //send cv data to server

    //format the object to send it to the server
    //the form data will contain the exams and all the application field as a json in body
    //and the cv file in the req.file
    const formData = new FormData();
    if (!applicationCV.filePDF) {
      //application cv is loaded the first time the student click to see the exam details
      handleErrors({ error: "first load a cv file" })
      return;
    }
    formData.append('file', applicationCV.filePDF);
    formData.append('exams', JSON.stringify(applicationCV.exams));
    //upload the cv data and insert the application
    formData.append('proposalId', JSON.stringify(thesisDetails.id));
    formData.append('studentId', JSON.stringify(studentId));
    formData.append('teacherId', JSON.stringify(teacherId));


    studentAPI.insertApplicationWithCV(formData)
      .then((res) => {
        setApplicationCV({cvId: res})
      })
      .then(() => {
        const emailData = {
          subject: `New Application Received`,
          type: 'application-sent',
          studentId: studentId,
          thesisTitle: thesisDetails.title,
          teacherName: teacherName,
          studentName: studentName
        };

        generalAPI.sendEmail(emailData);

      })
      .then(() => {
        props.setMessage({ msg: "Application submitted succesfully!", type: 'success' });
        navigate('/thesis');
      })
      .catch(e => {
        handleErrors(e);
      });


  };


  const handleArchiveClick = () => {
    professorAPI.archiveProposal(thesisDetails.id)
      .then(() => {
        props.setMessage({ msg: "Thesis Proposal succesfully archived!", type: 'success' });
        navigate('/thesis');
      })
      .catch(e => {
        handleErrors(e);
      });
  }

  const handleGoBackClick = () => {
    // Navigate back to /thesis
    props.setMessage('');
    navigate('/thesis');
  };

  const isSupervisor = () => {
    // only supervisor can delete a proposal
    let supervisor = thesisDetails.supervisor.split(",");
    return supervisor[0] == props.user.id.toString();
  }

  const handleDeleteProposal = () => {

    if (isSupervisor) {
      professorAPI.deleteProposal(thesisDetails.id)
        .then(() => {
          props.setMessage({ msg: "Thesis Proposal succesfully deleted!", type: 'success' });
          navigate('/thesis')
        })
        .catch(err => { handleErrors(err); })
    } else {
      props.setMessage({ msg: "Only the supervisor can delete a thesis proposal." });
    }
  }

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

              <Row>
                <Card.Text className="mt-2"><strong>Keywords:</strong> {thesisDetails.keywords.join(', ')}</Card.Text>
              </Row>

              {/* Description in a separate card */}
              <Card>
                <Card.Title className="border-bottom pb-2 mb-4">Description:</Card.Title>
                <Card.Body>
                  <Card.Text>{thesisDetails.description}</Card.Text>
                </Card.Body>
              </Card>

              {/*Only student can see his exams here, the professor will see them in the application */}
              <Row>
                
                {/*data to send with the application just for student */}
                {props.user.role === 'student'  && (
                  <ApplicationData setShowData={setShowData} setApplicationCV={setApplicationCV} handleErrors={handleErrors} userRole={props.user.role} studentId={props.user.id} />
                )}
              </Row>

              {/* Apply button (visible only for students) */}
              {props.user.role === 'student' && (
                <DropdownButton id="dropdown-item-button" title="Send Application" variant='success' className='mt-3 ms-2'>
                  <Dropdown.Item id='button-apply' as="button" primary='success' onClick={() => openDialog('Confirm Apply', 'Are you sure you want to apply this proposal? This action cannot be undone.', handleApplyClick, 'Apply')}>Apply</Dropdown.Item>
                  <Dropdown.Item id='button-apply-cv' as="button" variant='success' onClick={() => openDialog('Confirm Apply', 'Are you sure you want to apply this proposal? This action cannot be undone.', handleApplyWithCV, 'Apply')}>Apply + CV</Dropdown.Item>
                </DropdownButton>
              )}

              {/*edit button (visible only to teacher*/}
              {props.user.role === 'teacher' && !isArchived && (
                <Link id="button-edit-proposal"
                  className={`mt-3 ms-2 btn btn-outline-primary`}
                  to={isEditable ? "/proposal" : null}
                  onClick={(e) => {
                    if (!isEditable) {
                      e.preventDefault();
                      handleErrors({ error: "you cannot edit this proposal since there are pending/accepted applications for it" })
                    }
                  }}
                  state={{ proposal: state.thesisDetails, mode: 'edit' }}
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

              {/* Delete button (visible only for the supervisor) */}
              {props.user.role === 'teacher' && !isArchived && isSupervisor && (
                <Button id="button-delete-proposal" variant="outline-danger" className="mt-3 ms-2" onClick={() => openDialog('Confirm Delete', 'Are you sure you want to delete this proposal? This action cannot be undone.', handleDeleteProposal, 'Delete')}>
                  Delete Proposal
                </Button>
              )}
              {/*archive button */}
              {props.user.role === 'teacher' && !isArchived && (
                <Button id="button-archive-proposal" variant="outline-warning" className="mt-3 ms-2" onClick={() => openDialog('Confirm Archive', 'Are you sure you want to archive this proposal?', handleArchiveClick, 'Archive')}>
                  Archive
                </Button>
              )}

              {/* Go back button */}
              <Button variant="outline-danger" className="mt-3 ms-2" onClick={handleGoBackClick}>
                Go Back
              </Button>

              {/*Dialog shown for confirmation */}
              <ResponsiveDialog
                open={dialogOpen}
                handleClose={handleCloseDialog}
                title={dialogConfig.title}
                message={dialogConfig.message}
                handleAction={dialogConfig.handleAction}
                actionText={dialogConfig.actionText}
              />

            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container >
  );
}


export default ThesisPage;
