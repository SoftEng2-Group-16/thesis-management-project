/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from 'react';

import MessageContext from '../messageCtx.jsx';
import API from '../apis/generalAPI.js';
import { LoadingLayout } from './PageLayout.jsx';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Select from 'react-select';
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Table } from 'react-bootstrap';
import makeAnimated from 'react-select/animated';

/*
here we can implement the home, the home shows the thesis;
if role:
 professor -> shows all active thesis, show edit botton for those related to it
 student -> show all the thesis COMPATIBLE with the student plus functionalities to apply - show more infos - collapse/expand row
*/


function ThesisProposals(props) {

  const { handleErrors } = useContext(MessageContext);
  //array where we save all the thesis that we fetch
  const [Allthesis, setAllThesis] = useState([]);
  //this are the thesis that we need to show
  const [thesis, setThesis] = useState([]);
  //this is the filter type that we selected
  const [filter, setFilter] = useState();
  //this are all the possible result for a specific filter type
  const [options, setOptions] = useState([]);
  //this are all the selected results for a specific filter type 
  const [selections, setSelections] = useState([]);
  //here we save all the data for the specific types
  const [title, setTitle] = useState([])
  const [supervisor, setSupervisor] = useState([])
  const [keywords, setKeywords] = useState([])
  const [type, setType] = useState([])
  const [level, setLevel] = useState([])
  const [cds, setCds] = useState([])
  const [groups, setGroups] = useState([])

  //this is used to reset the filter
  const [version, setVersion] = useState(0);

  //function to reset the selector
  function handleReset() {
    setVersion(version + 1);
  }


  //constant to animate the filter selector
  const animatedComponents = makeAnimated();

  function remove(arrayAssociativo) {
    var uniqueElements = {};
    Object.keys(arrayAssociativo).forEach(key => {
        var value = arrayAssociativo[key];
        uniqueElements[value] = key; // Memorizza solo l'ultima chiave associata al valore
    });

    var uniqueArrayAssociativo = {};
    Object.keys(uniqueElements).forEach(value => {
        var key = uniqueElements[value];
        uniqueArrayAssociativo[key] = value;
    });

    return uniqueArrayAssociativo;
}


  useEffect(() => {

    //api fetch

    const fetchThesis = async () => {
      try {
        const proposals = await API.getThesisProposals();
        setAllThesis(proposals)
        setThesis(proposals)
        var titleApp = []
        var supervisorApp = []
        var groupsApp = []
        var keywordsApp = []
        var typeApp = []
        var levelApp = []
        var cdsApp = []
        for (let i = 0; i < proposals.length; i++) {
          if(!titleApp.includes({value: proposals[i].title , label: proposals[i].title})) 
            titleApp.push({value: proposals[i].title , label: proposals[i].title})
          supervisorApp.push({value: proposals[i].supervisor , label: proposals[i].supervisor})
          typeApp.push({value: proposals[i].type , label: proposals[i].type})
          if(!levelApp.includes({value: proposals[i].level , label: proposals[i].level}))
            levelApp.push({value: proposals[i].level , label: proposals[i].level})
          cdsApp.push({value: proposals[i].cds , label: proposals[i].cds})
          //inserting double values
          for(let x = 0; x < proposals[i].keywords.length; x++){
            if(!keywordsApp.includes({value: proposals[i].keywords[x] , label: proposals[i].keywords[x]}))
              keywordsApp.push({value: proposals[i].keywords[x] , label: proposals[i].keywords[x]})
          }
          for(let x = 0; x < proposals[x].groups.length; x++){
            if(!groupsApp.includes({value: proposals[i].groups[x] , label: proposals[i].groups[x]}) )
              groupsApp.push({value: proposals[i].groups[x] , label: proposals[i].groups[x]})
          }
         
        }
        titleApp = removeDuplicates(titleApp) 
        supervisorApp = removeDuplicates(supervisorApp) 
        keywordsApp = removeDuplicates(keywordsApp) 
        groupsApp = removeDuplicates(groupsApp) 
        typeApp = removeDuplicates(typeApp) 
        levelApp = removeDuplicates(levelApp) 
        cdsApp = removeDuplicates(cdsApp)
         
        setTitle(titleApp)
        setSupervisor(supervisorApp)
        setKeywords(keywordsApp)
        setGroups(groupsApp)
        setType(typeApp)
        setLevel(levelApp)
        setCds(cdsApp)
        setOptions(titleApp)

      } catch (error) {
        console.error(error);
        // Handle error
      }
    };
    if(props.loggedIn){fetchThesis()}
    
    

  }, []);


  function changeParameter(parameter) {
    setFilter(parameter)
    setSelections([])
    if(parameter == "title") setOptions(title)
    if(parameter == "supervisor") setOptions(supervisor)
    if(parameter == "keywords") setOptions(keywords)
    if(parameter == "type") setOptions(type)
    if(parameter == "level") setOptions(level)
    if(parameter == "cds") setOptions(cds)
    handleReset()
    /*
    if(parameter = )
    let array = []
    selection.forEach(item => {
        array.push(item.value)
    })
    setSelections(array)*/
  }

  function filtering() {
    var listThesis = [...Allthesis]
    if (filter.lenght == 0) {
      setThesis(listThesis)
    } else {

      listThesis = listThesis.filter((item) => {

        if (filter == "title") {if(selections.includes(item.title)) return item}
        
        if (filter == "supervisor"){if(selections.includes(item.supervisor)) return item} 
        if (filter == "type") {if(selections.includes(item.type)) return item} 
        if (filter == "cds") {if(selections.includes(item.cds)) return item} 
        if (filter == "level") {if(selections.includes(item.level)) return item} 
        if (filter == "keywords") {
          var check = false
          //iterate two arrays to see if there are elements in common
          for (let i = 0; i < item.keywords.length; i++) { 
  
            for (let j = 0; j < selections.length; j++) { 
      
                if (item.keywords[i] == selections[j]) { 
                    check = true; 
                } 
            }
          }
          if(check) return item
        
      }
      setThesis(listThesis)
    })
  }
}

  function changeSelection(selection) {
    if (selection.lenght == 0) {
      setOptions([])
    } else {
      let array = []
      selection.forEach(item => {
        array.push(item.value)
      })
      setSelections(array)
    }
  }



  return (
    <>
      {props.loggedIn ? (
        <div style={{ marginTop: '10px' }}>
          <Form className="d-flex" >
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
      ):(
        <div>You need to LOGIN!</div>
      )
      }

    </>
  );
}


export default ThesisProposals;
