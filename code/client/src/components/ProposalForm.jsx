/* eslint-disable react/prop-types */
/* IDEA
    editor accessible from professors in two modes:
    1- INSERT MODE, create a new thesis proposals from scratch -> all field empty
    2- EDIT MODE, modify an existant proposal, existing field should be pre filled with the existing ones
        I assume tin the props there is an object called proposal with all the field already set


    
 */



import { useState } from "react";
import { Alert, Button, Col, Form, Row } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const ProposalForm = (props) => {

    //const [proposal, setProposal] = useState(undefined);


    const [title, setTitle] = useState('');
    const [supervisor, setSupervisor] = useState('');
    const [cosupervisors, setCosupervisors] = useState('');
    const [keywords, setKeywords] = useState('');
    const [type, setType] = useState('');
    const [groups, setGroups] = useState('');
    const [description, setDescription] = useState('');
    const [requirements, setRequirements] = useState('');
    const [notes, setNotes] = useState('');
    const [expiration, setExpiration] = useState('');
    const [level, setLevel] = useState('');
    const [cds, setCds] = useState('');

    const [errorMsg, setErrorMsg] = useState('');


    const handleSubmit = (e) => {
        e.preventDefault();

        console.log(title);
        // Esegui la convalida dei dati qui
        const errors = {};

        if (!title || title.trim() === '') {
            errors.title = 'Title is required';
        }

        if (!supervisor || supervisor.trim() === '') {
            errors.supervisor = 'Supervisor is required';
        }

        if (!cosupervisors || cosupervisors.trim() === '') {
            errors.cosupervisors = 'Cosupervisors are required';
        }

        if (!keywords || keywords.trim() === '') {
            errors.keywords = 'Keywords are required';
        }

        if (!type || type.trim() === '') {
            errors.type = 'Type is required';
        }

        if (!groups || groups.trim() === '') {
            errors.groups = 'Groups are required';
        }

        if (!description || description.trim() === '') {
            errors.description = 'Description is required';
        }

        if (!requirements || requirements.trim() === '') {
            errors.requirements = 'Requirements are required';
        }

        if (!notes || notes.trim() === '') {
            errors.notes = 'Notes are required';
        }

        if (!expiration || expiration.trim() === '') {
            errors.expiration = 'Expiration date is required';
        } else {
            const dateParts = expiration.split('-');//format dd-mm-yyyy
            const year = parseInt(dateParts[3]);
            const month = parseInt(dateParts[1]);
            const day = parseInt(dateParts[0]);
            const currentDate = new Date();
            const inputDate = new Date(year, month - 1, day); // month starts from 0
            if (isNaN(inputDate) || inputDate < currentDate) {
                errors.expiration = 'Invalid or past date';
            }
        }

        if (!level || level.trim() === '') {
            errors.level = 'Level is required';
        }

        if (!cds || cds.trim() === '') {
            errors.cds = 'CDS is required';
        }

        if (Object.keys(errors).length !== 0) {
            const errorString = Object.values(errors).join('\n');
            setErrorMsg(errorString);
        } else {
            // Send data
            const proposal = {
                title: title,
                supervisor: supervisor,
                cosupervisors: cosupervisors,
                keywords: keywords,
                type: type,
                groups: groups,
                description: description,
                requirements: requirements,
                notes: notes,
                expiration: expiration,
                level: level,
                cds: cds,
            };

            props.setProposal(proposal);
        }
    }


    return (
        <>
            {errorMsg ? <Alert variant='danger' onClose={() => setErrorMsg('')} dismissible>{errorMsg}</Alert> : false}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="title">
                    <Form.Label>Title:</Form.Label>
                    <Form.Control
                        type="text"
                        name="title"
                        value={(props.proposal && props.proposal.title) ? props.proposal.title : title}
                        onChange={ev => setTitle(ev.target.value)}
                    />
                </Form.Group>
                <Row>
                    <Form.Group as={Col} controlId="supervisor">
                        <Form.Label>supervisor:</Form.Label>
                        <Form.Control
                            type="text"
                            name="supervisor"
                            value={(props.proposal && props.proposal.supervisor) ? props.proposal.supervisor : supervisor}
                            onChange={ev => setSupervisor(ev.target.value)}
                        />
                    </Form.Group>

                    <Form.Group as={Col} controlId="cosupervisors">
                        <Form.Label>Cosupervisors:</Form.Label>
                        <Form.Control
                            type="text"
                            name="cosupervisors"
                            value={(props.proposal && props.proposal.cosupervisors) ? props.proposal.cosupervisors : cosupervisors}
                            onChange={ev => setCosupervisors(ev.target.value)}

                        >
                        </Form.Control>
                    </Form.Group>
                </Row>

                <Row>
                    <Form.Group as={Col} controlId="keywords">
                        <Form.Label>Keywords:</Form.Label>
                        <Form.Control
                            type="text"
                            name="keywords"
                            value={(props.proposal && props.proposal.keywords) ? props.proposal.keywords : keywords}
                            onChange={ev => setKeywords(ev.target.value)}
                        />
                    </Form.Group>

                    <Form.Group as={Col} controlId="type">
                        <Form.Label>Type:</Form.Label>
                        <Form.Control
                            type="text"
                            name="type"
                            value={(props.proposal && props.proposal.type) ? props.proposal.type : type}
                            onChange={ev => setType(ev.target.value)}
                        />
                    </Form.Group>

                    <Form.Group as={Col} controlId="groups">
                        <Form.Label>Groups:</Form.Label>
                        <Form.Control
                            type="text"
                            name="groups"
                            value={(props.proposal && props.proposal.groups) ? props.proposal.groups : groups}
                            onChange={ev => setGroups(ev.target.value)}
                        />
                    </Form.Group>
                </Row>
                <Form.Group controlId="description">
                    <Form.Label>Description:</Form.Label>
                    <Form.Control
                        as="textarea"
                        name="description"
                        value={(props.proposal && props.proposal.description) ? props.proposal.description : description}
                        onChange={ev => setDescription(ev.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId="requirements">
                    <Form.Label>Requirements:</Form.Label>
                    <Form.Control
                        as="textarea"
                        name="requirements"
                        value={(props.proposal && props.proposal.requirements) ? props.proposal.requirements : requirements}
                        onChange={ev => setRequirements(ev.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId="notes">
                    <Form.Label>Notes:</Form.Label>
                    <Form.Control
                        as="textarea"
                        name="notes"
                        value={(props.proposal && props.proposal.notes) ? props.proposal.notes : notes}
                        onChange={ev => setNotes(ev.target.value)}
                    />
                </Form.Group>

                <Row>
                    <Form.Group as={Col} controlId="level">
                        <Form.Label>Level:</Form.Label>
                        <Form.Control
                            type="text"
                            name="level"
                            value={(props.proposal && props.proposal.level) ? props.proposal.level : level}
                            onChange={ev => setLevel(ev.target.value)}
                        />
                    </Form.Group>

                    <Form.Group as={Col} controlId="cds">
                        <Form.Label>CDS:</Form.Label>
                        <Form.Control
                            type="text"
                            name="cds"
                            value={(props.proposal && props.proposal.cds) ? props.proposal.cds : cds}
                            onChange={ev => setCds(ev.target.value)}
                        />
                    </Form.Group>
                </Row>

                <Form.Group controlId="expiration">
                    <Form.Label>Expiration:</Form.Label>
                    <Row>
                        <Col>
                            <DatePicker
                                value={(props.proposal && props.proposal.expiration) ? props.proposal.expiration : expiration}
                                onChange={(date) => {
                                    const yyyy = date.getFullYear();
                                    let mm = date.getMonth() + 1; // Months start at 0!
                                    let dd = date.getDate();
                                    const formattedDate = dd + '-' + mm + '-' + yyyy;
                                    setExpiration(formattedDate);
                                }}

                                dateFormat="dd/MM/yyyy"  // Puoi personalizzare il formato della data
                            />
                        </Col>
                    </Row>
                </Form.Group>

                <Button variant="primary" type="submit" style={{ marginTop: '10px' }}>
                    Submit
                </Button>
            </Form>
        </>
    );
}

export default ProposalForm;