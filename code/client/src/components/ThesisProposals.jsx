import React, { useContext, useEffect, useState } from 'react';
import MessageContext from '../messageCtx.jsx';
import professorAPI from '../apis/professorAPI.js';
import studentAPI from '../apis/studentAPI.js';
import { Table, Form, Button, Col, Row, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

function ThesisProposals(props) {
  const { handleErrors } = useContext(MessageContext);
  const [allThesis, setAllThesis] = useState([]);
  const [thesis, setThesis] = useState([]);
  const [filter, setFilter] = useState('all');
  const [options, setOptions] = useState([]);
  const [selections, setSelections] = useState([]);
  const [version, setVersion] = useState(0);
  const animatedComponents = makeAnimated();
  const [noProposals, setNoProposals] = useState(false);
  const [activeProposalsButton, setActiveProposalsButton] = useState(true);
  const [archivedProposalsButton, setArchivedProposalsButton] = useState(false);
  const [archivedThesis, setArchivedThesis] = useState([]);
  const [noMatchingThesisMessage, setNoMatchingThesisMessage] = useState('');

  

  

  useEffect(() => {
    const fetchThesis = async () => {
      try {
        let proposals = [];
        if (props.user.role === 'student') {
          proposals = await studentAPI.getThesisProposals(props.user.degree_code);
        } else {
          proposals = await professorAPI.getOwnThesisProposals(props.user.id);
        }

        setAllThesis(proposals);
        setThesis(proposals);
        if (proposals.length === 0) {
          setNoProposals(true);
        } else {
          const allOptions = ['all', 'title', 'supervisor', 'keywords', 'type', 'groups', 'level'];
          setOptions(allOptions);
          setFilter('all');
        }
      } catch (error) {
        console.error(error);
        console.log("here");
        setNoProposals(true);
        setThesis([])
      }
    };

    const fetchArchivedThesisProposals = async () => {
      try {
        let archivedProposals = [];
        if (props.user.role === 'teacher') {
          archivedProposals = await professorAPI.getOwnArchivedProposals(props.user.id);
        }
        setArchivedThesis(archivedProposals);
      } catch (error) {
        console.error(error);
      }
    };

    if (props.loggedIn || props.update) {
      fetchThesis();
      fetchArchivedThesisProposals();
      props.setUpdate(false);
    }
  }, [props.loggedIn, props.update]);

  function handleReset() {
    setVersion(version+1)
    setThesis([...allThesis]);
    changeParameter("all"); // Set the filter back to "all"
    setSelections([]);
    setFilter("all")
    setNoMatchingThesisMessage('');

  }

  function changeParameter(parameter) {
    setVersion(version + 1);
    setFilter(parameter);
    setSelections([]);

    if (parameter === 'all') {
      setThesis([...allThesis]);
    }
  }

  function filtering() {
    let filteredThesis = [...allThesis];
  
    if (filter && filter !== 'all') {
      filteredThesis = filteredThesis.filter((item) => {
        if (filter === 'title' && selections.includes(item.title)) return true;
        if (filter === 'supervisor' && selections.includes(item.supervisor)) return true;
        if (filter === 'type' && selections.includes(item.type)) return true;
        if (filter === 'cds') {
          return item.cds.some((cds) => selections.includes(cds));
        }
        if (filter === 'level' && selections.includes(item.level)) return true;
        if (filter === 'keywords') {
          return item.keywords.some((keyword) => selections.includes(keyword));
        }
        if (filter === 'groups') {
          return item.groups.some((group) => selections.includes(group));
        }
        return false;
      });
    } else if (filter === 'all') {
      // For "all" filter, search across all fields, including arrays
      filteredThesis = filteredThesis.filter((item) => {
        const itemValues = Object.values(item);
        return selections.every((selection) => {
          if (Array.isArray(selection)) {
            // Handle array fields (e.g., groups, keywords)
            return selection.some((value) => itemValues.flat().includes(value));
          } else {
            return itemValues.flat().includes(selection);
          }
        });
      });

            // If no matching thesis found, set a message
      if (filteredThesis.length === 0) {
        setNoMatchingThesisMessage('No matching thesis found matching the desired criteria.');
      } else {
        setNoMatchingThesisMessage('');
      }
    }
    
  
    setThesis(filteredThesis);
  }
  
  

  function changeSelection(selection) {
    setSelections(selection.map((item) => item.value));
  }

  function changeActiveProposalsButtonState() {
    if (!activeProposalsButton && archivedProposalsButton) {
      setActiveProposalsButton(true);
      setArchivedProposalsButton(false);
    }
  }

  function changeArchivedProposalsButtonState() {
    if (activeProposalsButton && !archivedProposalsButton) {
      setActiveProposalsButton(false);
      setArchivedProposalsButton(true);
    }
  }

  function showActiveThesisProposals() {
    setThesis([...allThesis]);
  }

  function showArchivedThesisProposals() {
    setThesis([...archivedThesis]);
  }

  return (
    <>
      {props.loggedIn && props.user.role === 'student' && !noProposals ? (
        <>
          <Row className="d-flex justify-content-center mt-5">
            <Col lg={9} xs={12} md={12} sm={12}>
              <Form className="d-flex">
                <Form.Select
                  aria-label="Default select example"
                  className="selector"
                  onChange={(event) => {
                    changeParameter(event.target.value);
                  }}
                >
                  {options.map((option) => (
                    <option key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </option>
                  ))}
                </Form.Select>
                <Select
                  options={getSuggestions(filter, allThesis)}
                  key={version}
                  className="parameters"
                  closeMenuOnSelect={true}
                  components={animatedComponents}
                  isMulti
                  onChange={(event) => changeSelection(event)}
                />
                <Button id="search-button" variant="outline-success" onClick={() => filtering()}>
                  Search
                </Button>
                <Button id="reset-button" variant="outline-secondary" onClick={() => handleReset()}>
                  Reset
                </Button>
              </Form>
            </Col>
          </Row>
  
          <Row className="d-flex justify-content-center mt-4">
            <Col lg={9} xs={12} md={12} sm={12}>
              {/* Display "No matching thesis found" message */}
              {noMatchingThesisMessage && (
                <p style={{ color: 'red', textAlign: 'center' }}>{noMatchingThesisMessage}</p>
              )}
  
              {/* Conditionally render the table only if there are proposals to show */}
              {thesis.length > 0 && (
                <Table striped bordered hover responsive>
                  <thead className="align-middle">
                    <tr>
                      <th>Type</th>
                      <th>Title</th>
                      <th>Groups</th>
                      <th>Supervisor</th>
                      <th>Expiration Date</th>
                    </tr>
                  </thead>
                  <tbody className="align-middle">
                    {thesis.map((singleThesis) => (
                      <tr key={singleThesis.id} style={{ fontWeight: 'bold' }}>
                        <td>{singleThesis.type}</td>
                        <td>
                          <Link to={`/thesis/${singleThesis.id}`} state={{ thesisDetails: singleThesis }}>
                            {singleThesis.title}
                          </Link>
                        </td>
                        <td>{singleThesis.groups.join(', ')}</td>
                        <td>{singleThesis.supervisor}</td>
                        <td>{singleThesis.expiration}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Col>
          </Row>
        </>
      ) : props.user.role === 'teacher' ? (
        <>
          <Row className="d-flex justify-content-center">
            <Col lg={9} xs={12} md={12} sm={12} className="mt-4">
              <ToggleButtonGroup type="radio" name="options" defaultValue={1}>
                <ToggleButton
                  className={activeProposalsButton ? 'active-toggle-button' : 'not-active-toggle-button'}
                  id="activeProposals"
                  onClick={changeActiveProposalsButtonState}
                  onChange={showActiveThesisProposals}
                >
                  Active Proposals
                </ToggleButton>
                <ToggleButton
                  className={archivedProposalsButton ? 'active-toggle-button' : 'not-active-toggle-button'}
                  id="ArchivedProposals"
                  onClick={changeArchivedProposalsButtonState}
                  onChange={showArchivedThesisProposals}
                >
                  Archived Proposals
                </ToggleButton>
              </ToggleButtonGroup>
            </Col>
            <Col lg={9} xs={12} md={12} sm={12} className="mt-4">
              {thesis.length > 0 ? (
                <Table striped bordered hover responsive>
                  <thead className="align-middle">
                    <tr>
                      <th>Type</th>
                      <th>Title</th>
                      <th>Groups</th>
                      <th>Supervisor</th>
                      <th>Expiration Date</th>
                    </tr>
                  </thead>
                  <tbody className="align-middle">
                    {thesis.map((singleThesis) => (
                      <tr key={singleThesis.id} style={{ fontWeight: 'bold' }}>
                        <td>{singleThesis.type}</td>
                        <td>
                          <Link to={`/thesis/${singleThesis.id}`} state={{ thesisDetails: singleThesis }}>
                            {singleThesis.title}
                          </Link>
                        </td>
                        <td>{singleThesis.groups.join(', ')}</td>
                        <td>{singleThesis.supervisor}</td>
                        <td>{singleThesis.expiration}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <Row>
                  <h4>No thesis proposals to show.</h4>
                </Row>
              )}
            </Col>
          </Row>
        </>
      ) : (
        props.loggedIn &&
        noProposals && (
          <Row className="mt-4">
            <h3>None thesis proposals to show yet</h3>
          </Row>
        )
      )}
    </>
  );
  
  }
  

function getSuggestions(filter, allThesis) {
  switch (filter) {
    case 'title':
      return removeDuplicates(allThesis.map((item) => ({ value: item.title, label: item.title })));
    case 'supervisor':
      return removeDuplicates(allThesis.map((item) => ({ value: item.supervisor, label: item.supervisor })));
    case 'keywords':
      return removeDuplicates(allThesis.flatMap((item) => item.keywords.map((keyword) => ({ value: keyword, label: keyword }))));
    case 'groups':
      return removeDuplicates(allThesis.flatMap((item) => item.groups.map((group) => ({ value: group, label: group }))));
    case 'type':
      return removeDuplicates(allThesis.map((item) => ({ value: item.type, label: item.type })));
    case 'level':
      return removeDuplicates(allThesis.map((item) => ({ value: item.level, label: item.level })));
    case 'cds':
      return removeDuplicates(allThesis.flatMap((item) => item.cds.map((cds) => ({ value: cds, label: cds }))));
      case 'all':
      // Return all suggestions for the "all" filter
      const allSuggestions = [
        ...getSuggestions('title', allThesis),
        ...getSuggestions('supervisor', allThesis),
        ...getSuggestions('keywords', allThesis),
        ...getSuggestions('groups', allThesis),
        ...getSuggestions('type', allThesis),
        ...getSuggestions('level', allThesis),
        ...getSuggestions('cds', allThesis),
      ];
      return removeDuplicates(allSuggestions);
    default:
      return [];
  }
}

function removeDuplicates(array) {
  return array.filter((value, index, self) => self.findIndex((v) => v.value === value.value) === index);
}

export default ThesisProposals;
