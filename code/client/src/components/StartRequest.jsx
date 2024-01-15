import MessageContext from "../messageCtx.jsx"
import { useLocation, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";

import professorAPI from "../apis/professorAPI.js";
import Select from "react-select";
import studentAPI from "../apis/studentAPI.js";

const StartRequest = (props) => {

    const { handleErrors } = useContext(MessageContext);
    const navigate = useNavigate();
    //const location = useLocation();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [supervisor, setSupervisor] = useState('');
    const [cosupervisorsInt, setCosupervisorsInt] = useState([]);
    const [cosupervisorsOptions, setcosupervisorsOptions] = useState([]);

    const [errorMsg, setErrorMsg] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    

    

    useEffect(() => {
        professorAPI.getPossibleCosupervisors()
            .then((cosupervisors) => {
                setcosupervisorsOptions(cosupervisors.internals.map(str => ({ value: str, label: str })));
            })
            .catch((err) => { handleErrors(err); });
    }, []);



    const handleSubmit = (e) => {
        e.preventDefault();

        const errors = {};

        if (!title || title.trim() === '') {
            errors.title = 'Title is required';
        }

        if (!supervisor || supervisor === '') {
            errors.supervisor = 'Supervisor is required';
        }

        if (!description || description.trim() === '') {
            errors.description = 'Description is required';
        }

        if (cosupervisorsInt.length != 0 && cosupervisorsInt.some((obj) => ( obj.value === supervisor.value ))){
            errors.supervisors = 'A teacher can not be both supervisor and cosupervisor';
        }

        if (Object.keys(errors).length !== 0) {
            const errorList = Object.entries(errors).map(([key, value]) => (
                <li key={key}>{value}</li>
            ));
            setErrorMsg(
                <div>
                    <p>Please fix the following errors:</p>
                    <ul>{errorList}</ul>
                </div>
            );
        } else {
            const thesisRequest = {
                thesisTitle: title,
                thesisDescription: description,
                supervisor: supervisor.value,
                cosupervisors: cosupervisorsInt.map(obj => obj.value),
            };
            // insert the start thesis request
            insertStartRequest(thesisRequest);
            setTitle('');
            setDescription('');
            setSupervisor(null);
            setCosupervisorsInt([]);

            setErrorMsg('');
            setSuccessMessage('Start thesis request submitted successfully!');
           
        }
    }

    const insertStartRequest = (request) => {
        studentAPI.insertStartRequest(request)
            .then(() => {})
            .catch(err => { setSuccessMessage(''); handleErrors(err); })
    }

    return (
        <>
            {props.loggedIn ? <Container>
                {errorMsg ?  <Alert variant='danger' onClose={() => setErrorMsg('')} dismissible>{errorMsg}</Alert> :

                successMessage && (
                    <Alert variant='success' onClose={() => { setSuccessMessage('');/*navigate('/thesis') */}} dismissible>
                        {successMessage}
                    </Alert>
                )}
                <Form onSubmit={handleSubmit} id="thesisRequest">
                    <Form.Group controlId="title" >
                        <Form.Label column="lg">Title:</Form.Label>
                        <Form.Control
                            type="text"
                            name="title"
                            value={title}
                            onChange={ev => setTitle(ev.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="description">
                        <Form.Label>Description:</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="description"
                            value={description}
                            onChange={ev => setDescription(ev.target.value)}
                        />
                    </Form.Group>

                    <Row>
                        <Col>
                            <Form.Group as={Row} className="mb-3 mt-3" controlId="supervisor">
                                <Form.Label column >Supervisor:</Form.Label>
                                <Col sm={10}>
                                    <Select
                                        value={supervisor}
                                        name="colors"
                                        options={cosupervisorsOptions}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        onChange={selectedOptions => setSupervisor(selectedOptions)}
                                    />
                                </Col>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group as={Row} className="mb-3 mt-3" controlId="cosupervisors">
                                <Form.Label column>Cosupervisors: (optional)</Form.Label>
                                <Col sm={7}>
                                    <Select
                                        value={cosupervisorsInt}
                                        isMulti
                                        name="colors"
                                        options={cosupervisorsOptions}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        onChange={selectedOptions => setCosupervisorsInt(selectedOptions)}
                                    />
                                </Col>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="justify-content-center" style={{ marginTop: '10%' }}>
                        <Col xs="auto" className="mb-2">
                            <Button variant="primary" type="submit" style={{ marginTop: '10px' }}>
                                Submit request
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Container>
                :
                <div>You need to LOGIN!</div>
            }
        </>

    );
}




export default StartRequest;