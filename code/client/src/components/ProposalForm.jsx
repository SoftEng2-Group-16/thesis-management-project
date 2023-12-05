/* eslint-disable react/prop-types */
/* IDEA
    editor accessible from professors in two modes:
    1- INSERT MODE, create a new thesis proposals from scratch -> all field empty
    2- EDIT MODE, modify an existant proposal, existing field should be pre filled with the existing ones
        I assume tin the props there is an object called proposal with all the field already set


    
 */


import MessageContext from "../messageCtx.jsx"
import { useLocation, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import DatePicker from "react-datepicker";
import AsyncSelect from "react-select/async";

import professorAPI from "../apis/professorAPI";
import Select from "react-select";

const ProposalForm = (props) => {

    const { handleErrors } = useContext(MessageContext);
    const navigate = useNavigate();
    const location = useLocation();
    const proposal = location.state ? location.state.thesisDetails : null;

    const [title, setTitle] = useState((proposal && proposal.title) || '');
    const [cosupervisorsInt, setCosupervisorsInt] = useState((proposal && proposal.cosupervisors.filter(s => s.split(',').length === 3).map(str => ({ value: str, label: str }))) || []);
    const [cosupervisorsExt, setCosupervisorsExt] = useState((proposal && proposal.cosupervisors.filter(s => s.split(',').length === 2).map(str => ({ value: str, label: str }))) || []);
    const [keywords, setKeywords] = useState((proposal && proposal.keywords.join(",")) || '');
    const [type, setType] = useState((proposal && proposal.type) || '');
    const [description, setDescription] = useState((proposal && proposal.description) || '');
    const [requirements, setRequirements] = useState((proposal && proposal.requirements) || '');
    const [notes, setNotes] = useState((proposal && proposal.notes) || '');
    const [expiration, setExpiration] = useState((proposal && proposal.expiration) || '');
    const [level, setLevel] = useState((proposal && proposal.level) || '');
    const [cds, setCds] = useState(
        (proposal && proposal.cds.map(str => ({ value: str, label: str }))) || []
    );

    const [errorMsg, setErrorMsg] = useState('');

    const [successMessage, setSuccessMessage] = useState('');


    const [cosupervisorsInternal, setCosupervisorsInternal] = useState([]);  //[{value:"", label:""}]
    const [cosupervisorsExternal, setCosupervisorsExternal] = useState([]);



    const [cdsList, setCdsList] = useState()
    const [cdsIsDisabled, setCdsDisabled] = useState(proposal ? false : true);

    const supervisor = `${props.user.id}, ${props.user.name} ${props.user.surname}`

    const loadOptions = () => {
        return new Promise((resolve) => {
            if (!cdsList) {
                professorAPI.getDegreesInfo()
                    .then((degreesInfo) => {
                        const list = degreesInfo.map(str => ({ value: str, label: str }));
                        setCdsList(list);
                        const filteredOptions = list.filter(cds => {
                            if (level === 'master') {
                                return cds.value.startsWith('LM');
                            } else if (level === 'bachelor') {
                                return cds.value.startsWith('LT');
                            }
                            return true;
                        });
                        resolve(filteredOptions);
                    })
                    .catch((err) => { handleErrors(err); });
            }
            else {
                const filteredOptions = cdsList.filter(cds => {
                    if (level === 'master') {
                        return cds.value.startsWith('LM');
                    } else if (level === 'bachelor') {
                        return cds.value.startsWith('LT');
                    }
                    return true;
                });

                resolve(filteredOptions);
            }
        });
    };




    useEffect(() => {
        professorAPI.getPossibleCosupervisors()
            .then((cosupervisors) => {
                setCosupervisorsInternal(cosupervisors.internals.filter(str => {//removes supervisor from internsals
                    const id1 = (str.split(' ')[2]).replace(',', '');
                    const idSupervisor = (supervisor.split(' ')[0]).replace(',', '');

                    if (id1 !== idSupervisor)
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
        console.log(proposal);
        const cosupervisors = cosupervisorsExt ? cosupervisorsExt.concat(cosupervisorsInt) : cosupervisorsInt;

        const errors = {};

        if (!title || title.trim() === '') {
            errors.title = 'Title is required';
        }

        if (!supervisor || supervisor.trim() === '') {
            errors.supervisor = 'Supervisor is required';
        }
        console.log(keywords);
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

        if (!expiration || expiration.trim() === '') {
            errors.expiration = 'Expiration date is required';
        } else {
            const dateParts = expiration.split('/');//format dd/mm/yyyy
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

        if (!cds || cds.length === 0) {
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
            const newProposal = {
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
                cds: cds.map(obj => obj.value.split(' ')[0]), //should be just the code like LT-2
            };
            console.log(newProposal);
            if (proposal) {
                newProposal.id=proposal.id;
                editProposal(newProposal)
            } else {
                insertProposal(newProposal);
            }

            setSuccessMessage('Proposal submitted successfully!');
        }
    }

    const insertProposal = (proposal) => {
        professorAPI.insertProposal(proposal)
            .then(() => { })
            .catch(err => { handleErrors(err); })
    }

    const editProposal = (proposal) => {
        professorAPI.editProposal(proposal)
            .then(() => { })
            .catch(err => { handleErrors(err); })
    }

    const handleLevelChange = (ev) => {
        setLevel(ev.target.value);
        setCds([]);
        if (ev.target.value === "master" || ev.target.value === "bachelor") {
            setCdsDisabled(false);
        }
        else {
            setCdsDisabled(true)
        }
    }

    const handleGoBack = () => {
        // Navigate back to /thesis
        props.setMessage('');
        navigate(-1)
    };

    return (
        <>
            {props.loggedIn ? <Container>
                {errorMsg ? <Alert variant='danger' onClose={() => setErrorMsg('')} dismissible>{errorMsg}</Alert> : false}

                {successMessage ? (
                    <Alert variant='success' onClose={() => { setSuccessMessage(''); navigate("/") }} dismissible>
                        {successMessage}
                    </Alert>
                ) :
                    <Form onSubmit={handleSubmit} id="form-proposal">
                        <Form.Group controlId="title" >
                            <Form.Label column="lg">Title:</Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                value={title}
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
                                    disabled={true}
                                />
                            </Col>
                        </Form.Group>
                        <Row>
                            <Col>
                                <Form.Group as={Row} className="mb-3 mt-3" controlId="cosupervisors">
                                    <Form.Label column>Select internal Cosupervisors (optional)</Form.Label>
                                    <Col sm={7}>
                                        <Select
                                            value={cosupervisorsInt}
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
                                    <Form.Label column>Select external Cosupervisors (optional)</Form.Label>
                                    <Col sm={7}>
                                        <Select
                                            value={cosupervisorsExt}
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
                                            value={keywords}
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
                                            value={type}
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
                                value={description}
                                onChange={ev => setDescription(ev.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="requirements">
                            <Form.Label>Requirements: (optional)</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="requirements"
                                value={requirements}
                                onChange={ev => setRequirements(ev.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="notes">
                            <Form.Label>Notes: (optional)</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="notes"
                                value={notes}
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
                                        <AsyncSelect
                                            key={level}
                                            value={cds}
                                            defaultOptions
                                            isMulti
                                            loadOptions={loadOptions}
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
                                        className='mydatepicker'
                                        value={expiration}
                                        onChange={(date) => {
                                            const yyyy = date.getFullYear();
                                            let mm = (date.getMonth() + 1).toString().padStart(2, '0'); // Aggiunge uno zero iniziale se il mese è inferiore a 10
                                            let dd = date.getDate().toString().padStart(2, '0'); // Aggiunge uno zero iniziale se il giorno è inferiore a 10
                                            const formattedDate = dd + '/' + mm + '/' + yyyy;
                                            setExpiration(formattedDate);
                                        }}

                                        dateFormat="dd/mm/yyyy"  // Puoi personalizzare il formato della data
                                    />
                                </Col>
                            </Row>
                        </Form.Group>


                        <Button variant="primary" type="submit" style={{ marginTop: '10px' }}>
                            {proposal ? "Edit" : "Submit"}
                        </Button>
                        &nbsp;
                        <Button variant="danger" style={{ marginTop: '10px' }} onClick={handleGoBack}>
                            Go Back
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