/* eslint-disable react/prop-types */
/* IDEA
    editor accessible from professors in two modes:
    1- INSERT MODE, create a new thesis proposals from scratch -> all field empty
    2- EDIT MODE, modify an existant proposal, existing field should be pre filled with the existing ones
        I assume tin the props there is an object called proposal with all the field already set


    
 */


import MessageContext from "../messageCtx.jsx"
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from "react";

import "react-datepicker/dist/react-datepicker.css";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import DatePicker from "react-datepicker";
import Select from "react-select";

import professorAPI from "../apis/professorAPI";

const ProposalForm = (props) => {

    const { handleErrors } = useContext(MessageContext);
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    //const [supervisor, setSupervisor] = useState(props.user.name + " " + props.user.surname);
    const [cosupervisorsInt, setCosupervisorsInt] = useState([]); //to save the choice
    const [cosupervisorsExt, setCosupervisorsExt] = useState([]); //to save the choice
    const [keywords, setKeywords] = useState('');
    const [type, setType] = useState('');
    //const [groups, setGroups] = useState(['']);
    const [description, setDescription] = useState('');
    const [requirements, setRequirements] = useState('');
    const [notes, setNotes] = useState('');
    const [expiration, setExpiration] = useState('');
    const [level, setLevel] = useState('');
    const [cds, setCds] = useState([]);

    const [errorMsg, setErrorMsg] = useState('');

    const [successMessage, setSuccessMessage] = useState('');


    const [cosupervisorsInternal, setCosupervisorsInternal] = useState([]);  //[{value:"", label:""}]
    const [cosupervisorsExternal, setCosupervisorsExternal] = useState([]);



    const [cdsList, setCdsList] = useState()
    const [filteredCDS, setFilteredCDS] = useState([]);
    const [cdsIsDisabled, setCdsDisabled] = useState(true);

    const supervisor = `${props.user.id}, ${props.user.name} ${props.user.surname}`


    useEffect(() => {
        //console.log(props.user);
        professorAPI.getPossibleCosupervisors()
            .then((cosupervisors) => {
                setCosupervisorsInternal(cosupervisors.internals.filter(str => {
                    const id1 = (str.split(' ')[2]).replace(',', '');
                    const idSupervisor = (supervisor.split(' ')[0]).replace(',','');
                    console.log(idSupervisor);
                    console.log(id1)

                    if(id1 !== idSupervisor)
                        return str;
                }).map(str => ({ value: str, label: str })));
                setCosupervisorsExternal(cosupervisors.externals.map(str => ({ value: str, label: str })));
            })
            .catch((err) => { handleErrors(err); });

        professorAPI.getDegreesInfo()
            .then((degreesInfo) => {
                setCdsList(degreesInfo.map(str => ({ value: str, label: str })));
            })
            .catch((err) => { handleErrors(err); });

    }, []);


    const handleSubmit = (e) => {
        e.preventDefault();

        const cosupervisors = cosupervisorsExt ? cosupervisorsExt.concat(cosupervisorsInt) : cosupervisorsInt;

        const errors = {};

        if (!title || title.trim() === '') {
            errors.title = 'Title is required';
        }

        if (!supervisor || supervisor.trim() === '') {
            errors.supervisor = 'Supervisor is required';
        }

        if (cosupervisors.length === 0) {
            errors.cosupervisors = 'Cosupervisors are required';
        }

        if (!keywords || keywords.trim() === '') {
            errors.keywords = 'Keywords are required';
        } else {
            setKeywords(
                [...new Set(keywords.split(',').map(word => word.trim()))].join(',') //removes duplicates
            );
        }

        if (!type || type.trim() === '') {
            errors.type = 'Type is required';
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
            const year = parseInt(dateParts[2]);
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

        if (!cds || cds === undefined) {
            errors.cds = 'CDS is required';
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
            // Send data
            const proposal = {
                title: title,
                supervisor: supervisor,
                cosupervisors: cosupervisors.map(obj => obj.value),
                keywords: keywords,
                type: type,
                groups: [""],
                description: description,
                requirements: requirements,
                notes: notes,
                expiration: expiration,
                level: level,
                cds: cds.map(obj => obj.value),
            };
            //maybe call api POST
            insertProposal(proposal);
            //navigate("/");            
            setSuccessMessage('Proposal submitted successfully!');
        }
    }

    const insertProposal = (proposal) => {
        professorAPI.insertProposal(proposal)
            .then(() => { })
            .catch(err => { handleErrors(err); })
    }

    const handleLevelChange = (ev) => {
        setLevel(ev.target.value);
        setCds([]);
        if (ev.target.value === 'master') {
            setFilteredCDS(cdsList.filter(cds => cds.value.startsWith("LM")))
            setCdsDisabled(false);
        }
        else if (ev.target.value === 'bachelor') {

            setFilteredCDS(cdsList.filter(cds => cds.value.startsWith("LT")));
            setCdsDisabled(false);

        }
        else {
            setCdsDisabled(true);
        }

    }

    return (
        <>
        { props.loggedIn ? <Container>
            {errorMsg ? <Alert variant='danger' onClose={() => setErrorMsg('')} dismissible>{errorMsg}</Alert> : false}

            {successMessage ? (
                <Alert variant='success' onClose={() => {setSuccessMessage(''); navigate("/") }} dismissible>
                    {successMessage}
                </Alert>
            ) :
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="title" >
                        <Form.Label column="lg">Title:</Form.Label>
                        <Form.Control
                            type="text"
                            name="title"
                            value={(props.proposal && props.proposal.title) ? props.proposal.title : title}
                            onChange={ev => setTitle(ev.target.value)}

                        />
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3 mt-3" controlId="supervisor">
                        <Form.Label column >Supervisor:</Form.Label>
                        <Col sm={10}>
                            <Form.Control
                                type="text"
                                name="supervisor"
                                value={supervisor}
                                onChange={ev => setSupervisor(ev.target.value)}
                            />
                        </Col>
                    </Form.Group>

                    <Row>
                        <Col>
                            <Form.Group as={Row} className="mb-3 mt-3" controlId="cosupervisors">
                                <Form.Label column>Select internal Cosupervisors</Form.Label>
                                <Col sm={7}>
                                    <Select
                                        defaultValue={[]}
                                        isMulti
                                        name="colors"
                                        options={cosupervisorsInternal}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        onChange={selectedOptions => setCosupervisorsInt(selectedOptions)}

                                    />
                                </Col>

                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group as={Row} className="mb-3 mt-3" controlId="cosupervisors">
                                <Form.Label column>Select external Cosupervisors</Form.Label>
                                <Col sm={7}>
                                    <Select
                                        defaultValue={[]}
                                        isMulti
                                        name="cosupervisors"
                                        options={cosupervisorsExternal}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        onChange={selectedOptions => setCosupervisorsExt(selectedOptions)}

                                    />
                                </Col>

                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Form.Group as={Row} className="mb-3 mt-3" controlId="keywords">
                                <Form.Label column>Keywords:</Form.Label>
                                <Col sm={10}>
                                    <Form.Control
                                        type="text"
                                        name="keywords"
                                        value={(props.proposal && props.proposal.keywords) ? props.proposal.keywords : keywords}
                                        onChange={ev => setKeywords(ev.target.value)}
                                    />
                                </Col>
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group as={Row} className="mb-3 mt-3" controlId="type">
                                <Form.Label column>Type:</Form.Label>
                                <Col sm={10}>
                                    <Form.Control
                                        type="text"
                                        name="type"
                                        value={(props.proposal && props.proposal.type) ? props.proposal.type : type}
                                        onChange={ev => setType(ev.target.value)}
                                    />
                                </Col>
                            </Form.Group>
                        </Col>
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
                        <Col>
                            <Form.Group as={Row} className="mb-3 mt-3" controlId="level">
                                <Form.Label column>Level:</Form.Label>
                                <Col sm={8}>
                                    <Form.Select value={level} onChange={handleLevelChange}>
                                        <option>select the level</option>
                                        <option value="bachelor">bachelor</option>
                                        <option value="master">master</option>
                                    </Form.Select>
                                </Col>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group as={Row} className="mb-3 mt-3" controlId="cds">
                                <Form.Label column>Select cds:</Form.Label>
                                <Col sm={10}>
                                    <Select
                                        value={cds}
                                        defaultValue={[]}
                                        isMulti
                                        name="cds"
                                        options={filteredCDS}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        onChange={selectedOptions => setCds(selectedOptions)}
                                        isDisabled={cdsIsDisabled}
                                    />
                                </Col>
                            </Form.Group>
                        </Col>
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
            }
        </Container>
        : 
        <div>You need to LOGIN!</div>
        }
    </>

    );
}




export default ProposalForm;