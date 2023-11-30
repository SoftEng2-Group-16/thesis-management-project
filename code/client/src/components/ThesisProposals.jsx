/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from 'react';
import MessageContext from '../messageCtx.jsx';
import API from '../apis/generalAPI.js';
import professorAPI from '../apis/professorAPI.js';
import studentAPI from '../apis/studentAPI.js';
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
  //the list with all the thesis from the db
  const [Allthesis, setAllThesis] = useState([]);
  //the thesis list that we show
  const [thesis, setThesis] = useState([]);
  //the current filter type that we have
  const [filter, setFilter] = useState();
  //the suggestions that appera on the Select component
  const [options, setOptions] = useState([]);
  //what we have selected from the Select component is saved here
  const [selections, setSelections] = useState([]);
  //the associative array list of all suggestions for the Select component
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
        let proposals = [];
        if(props.user.role === 'student') {
          proposals = await studentAPI.getThesisProposals(props.user.degree_code);
        } else {
          proposals = await professorAPI.getOwnThesisProposals(props.user.id);
        }

        setAllThesis(proposals);
        setThesis(proposals)

        const uniqueByTitle = removeDuplicates(proposals.map(item => ({ value: item.title, label: item.title })));
        setTitle(uniqueByTitle);
        //here we set all the options suggestions that we have divided by filter type. With map we don't put twice the same element
        setSupervisor(removeDuplicates(proposals.map(item => ({ value: item.supervisor, label: item.supervisor }))));
        setKeywords(removeDuplicates(proposals.flatMap(item => item.keywords.map(keyword => ({ value: keyword, label: keyword })))));
        setGroups(removeDuplicates(proposals.flatMap(item => item.groups.map(group => ({ value: group, label: group })))));
        setType(removeDuplicates(proposals.map(item => ({ value: item.type, label: item.type }))));
        setLevel(removeDuplicates(proposals.map(item => ({ value: item.level, label: item.level }))));
        setCds(removeDuplicates(proposals.flatMap(item => item.cds.map(cds => ({ value: cds, label: cds })))));
        setFilter("title")
        setOptions(uniqueByTitle);
      
      } catch (error) {
        console.error(error);
        // Handle error
      }
    };

    if (props.loggedIn || props.update == true) {
      console.log(props.loggedIn);
      fetchThesis();
      props.setUpdate(false);
    }
  }, [props.loggedIn, props.update]);

  // this function is used to give back all the thesis list
  function handleReset() {
    setSelections([]);
    setThesis([...Allthesis]);
  }

  /* this function is called when we have a ne filter type
     we reset the selection done for the Selection component
     then we set the Options based on what filter the use chose
  */
  function changeParameter(parameter) {
    console.log(groups);
    setVersion(version + 1)
    setFilter(parameter)
    setSelections([]);
    if (parameter === "title") setOptions(title);
    if (parameter === "supervisor") setOptions(supervisor);
    if (parameter === "keywords") setOptions(keywords);
    if (parameter === "type") setOptions(type);
    if (parameter === "level") setOptions(level);
    if (parameter === "cds") setOptions(cds);
    if (parameter === "groups") setOptions(groups);

  }

  //This function filters the thesis based on what we have selected on the Select component
  function filtering() {
    let filteredThesis = [...Allthesis];

    if (filter) {
      filteredThesis = filteredThesis.filter((item) => {
        if (filter === "title" && selections.includes(item.title)) return true;
        if (filter === "supervisor" && selections.includes(item.supervisor)) return true;
        if (filter === "type" && selections.includes(item.type)) return true;
        if (filter === "cds") {
          return item.cds.some((cds) => selections.includes(cds));
        }
        if (filter === "level" && selections.includes(item.level)) return true;
        if (filter === "keywords") {
          return item.keywords.some((keyword) => selections.includes(keyword));
        }
        if (filter === "groups") {
          return item.groups.some((group) => selections.includes(group));
        }
        return false;
      });
    }

    setThesis(filteredThesis);
  }

  // function called every time we add or remove a selection from Select component
  function changeSelection(selection) {
    let array = []
    selection.forEach(item => {
      array.push(item.value)
    })
    setSelections(array)

  }

  return (
    <>
      {props.loggedIn && props.user.role != undefined && props.user.role == 'student' && thesis != []?
        <>
          <Row className="d-flex justify-content-center mt-5" >
            <Col lg={9} xs={12} md={12} sm={12}>
              <Form className="d-flex">
                <Form.Select aria-label="Default select example" className="selector" onChange={(event) => { changeParameter(event.target.value) }}>
                  <option value="title">Title</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="keywords">Keywords</option>
                  <option value="type">Type</option>
                  <option value="groups">Groups</option>
                  <option value="level">Level</option>
                  {props.user && props.user.role === "teacher" && <option value="cds">Course of study</option>}
                </Form.Select>
                <Select options={options} key={version} className="parameters" closeMenuOnSelect={true} components={animatedComponents} isMulti onChange={(event) => changeSelection(event)} />
                <Button variant="outline-success" onClick={() => filtering()}>Search</Button>
                <Button variant="outline-secondary" onClick={() => handleReset()}>Reset</Button>
              </Form>
            </Col>
          </Row>

          <Row className="d-flex justify-content-center mt-4">
            <Col lg={9} xs={12} md={12} sm={12}>
              <Table striped bordered hover responsive>
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
                      <td>{singleThesis.groups.join(', ')}</td>
                      <td>{singleThesis.supervisor}</td>
                      <td>{singleThesis.expiration}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
        </>
       : props.user.role == 'teacher'? 
       <>
          <Row className="d-flex justify-content-center">
            <Col lg={9} xs={12} md={12} sm={12} className="mt-5">
              <Row className="text-start">
                <h3>Your Proposals</h3>
              </Row>
            </Col>
            <Col lg={9} xs={12} md={12} sm={12} className="mt-4">
              <Table striped bordered hover responsive>
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
                  { thesis.map((singleThesis) => (
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
            </Col>
          </Row>
          </>
       :
        props.loggedIn && thesis == []?
        <>
          <Row>
              <h3>None thesis proposals to show yet.</h3>
          </Row>
        </>
       : <div>You need to LOGIN!</div>}
    </>
  );
}

export default ThesisProposals;
