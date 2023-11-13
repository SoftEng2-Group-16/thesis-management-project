/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from 'react';
import MessageContext from '../messageCtx.jsx';
import API from '../apis/generalAPI.js';
import { LoadingLayout } from './PageLayout.jsx';
import Button from 'react-bootstrap/Button';
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Table } from 'react-bootstrap';
import makeAnimated from 'react-select/animated';
import Select from 'react-select';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';

function removeDuplicates(array) {
  return array.filter((value, index, self) => self.findIndex(v => v.value === value.value) === index);
}

function ThesisProposals(props) {
  const { handleErrors } = useContext(MessageContext);
  const [Allthesis, setAllThesis] = useState([]);
  const [thesis, setThesis] = useState([]);
  const [filter, setFilter] = useState();
  const [options, setOptions] = useState([]);
  const [selections, setSelections] = useState([]);
  const [title, setTitle] = useState([]);
  const [supervisor, setSupervisor] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [type, setType] = useState([]);
  const [level, setLevel] = useState([]);
  const [cds, setCds] = useState([]);
  const [groups, setGroups] = useState([]);
  const [version, setVersion] = useState(0);
  const animatedComponents = makeAnimated();

  useEffect(() => {
    const fetchThesis = async () => {
      try {
        const proposals = await API.getThesisProposals();
        setAllThesis(proposals);
        setThesis(proposals)

        const uniqueByTitle = removeDuplicates(proposals.map(item => ({ value: item.title, label: item.title })));
        setTitle(uniqueByTitle);

        setSupervisor(removeDuplicates(proposals.map(item => ({ value: item.supervisor, label: item.supervisor }))));
        setKeywords(removeDuplicates(proposals.flatMap(item => item.keywords.map(keyword => ({ value: keyword, label: keyword })))));
        setGroups(removeDuplicates(proposals.flatMap(item => item.groups.map(group => ({ value: group, label: group })))));
        setType(removeDuplicates(proposals.map(item => ({ value: item.type, label: item.type }))));
        setLevel(removeDuplicates(proposals.map(item => ({ value: item.level, label: item.level }))));
        setCds(removeDuplicates(proposals.map(item => ({ value: item.cds, label: item.cds }))));

        setOptions(uniqueByTitle);
      } catch (error) {
        console.error(error);
        // Handle error
      }
    };

    if (props.loggedIn) {
      fetchThesis();
    }
  }, [props.loggedIn]);

  function handleReset() {
    setFilter(null);
    setSelections([]);
    setOptions([]);
    setThesis([...Allthesis]);
    setVersion(version + 1);
  }

  function changeParameter(parameter) {
    setFilter(parameter);
    setSelections([]);
    if (parameter === "title") setOptions(title);
    if (parameter === "supervisor") setOptions(supervisor);
    if (parameter === "keywords") setOptions(keywords);
    if (parameter === "type") setOptions(type);
    if (parameter === "level") setOptions(level);
    if (parameter === "cds") setOptions(cds);
  }

  function filtering() {
    let filteredThesis = [...Allthesis];

    if (filter) {
      filteredThesis = filteredThesis.filter((item) => {
        if (filter === "title" && selections.includes(item.title)) return true;
        if (filter === "supervisor" && selections.includes(item.supervisor)) return true;
        if (filter === "type" && selections.includes(item.type)) return true;
        if (filter === "cds" && selections.includes(item.cds)) return true;
        if (filter === "level" && selections.includes(item.level)) return true;
        if (filter === "keywords") {
          return item.keywords.some((keyword) => selections.includes(keyword));
        }
        return false;
      });
    }

    setThesis(filteredThesis);
  }

  function changeSelection(selection) {
    if (selection.length === 0) {
      setOptions([]);
    } else {
      let array = selection.map(item => item.value);
      setSelections(array);
    }
  }

  return (
    <>
      {props.loggedIn ? (
        <div style={{ marginTop: '10px' }}>
          <Form className="d-flex">
            <Form.Select aria-label="Default select example" className="selector" onChange={(event) => { changeParameter(event.target.value) }}>
              <option value="title">Title</option>
              <option value="supervisor">Supervisor</option>
              <option value="keywords">Keywords</option>
              <option value="Type">Type</option>
              <option value="groups">Groups</option>
              <option value="level">Level</option>
              <option value="cds">Course of study</option>
            </Form.Select>
            <Select options={options} key={version} className="parameters" closeMenuOnSelect={true} components={animatedComponents} isMulti onChange={(event) => changeSelection(event)} />
            <Button variant="outline-success" onClick={() => filtering()}>Search</Button>
            <Button variant="outline-secondary" onClick={() => handleReset()}>Reset</Button>
          </Form>

          <Row style={{ marginTop: '20px' }}>
            <Col xs={12}>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Title</th>
                    <th>Groups</th>
                    <th>Supervisor</th>
                    <th>Expiration Date</th>
                  </tr>
                </thead>
                <tbody>
                  {thesis.map((singleThesis) => (
                    <tr key={singleThesis.id} style={{ fontWeight: 'bold' }}>
                      <td>{singleThesis.type}</td>
                      <td>
                        <Link to={`/thesis/${singleThesis.id}`} state={{ thesisDetails: singleThesis }}>
                          {singleThesis.title}
                        </Link>
                      </td>
                      <td>{singleThesis.groups}</td>
                      <td>{singleThesis.supervisor}</td>
                      <td>{singleThesis.expiration}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
        </div>
      ) : (
        <div>You need to LOGIN!</div>
      )}
    </>
  );
}

export default ThesisProposals;
