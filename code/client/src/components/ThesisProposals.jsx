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
import makeAnimated from 'react-select/animated';

/*
here we can implement the home, the home shows the thesis;
if role:
 professor -> shows all active thesis, show edit botton for those related to it
 student -> show all the thesis COMPATIBLE with the student plus functionalities to apply - show more infos - collapse/expand row
*/


function ThesisProposals(props) {

  const [loggedIn, setLoggedIn] = useState(false);
  const { handleErrors } = useContext(MessageContext);
  const [Allthesis, setAllThesis] = useState([]);
  const [thesis, setThesis] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [filter, setFilter] = useState();
  const [options, setOptions] = useState([]);
  const [selections, setSelections] = useState([]);
  const [title, setTitle] = useState([])
  const [supervisor, setSupervisor] = useState([])
  const [cosupervisors, setCosupervisors] = useState([])
  const [keywords, setKeywords] = useState([])
  const [type, setType] = useState([])
  const [groups, setGroups] = useState([])
  const [level, setLevel] = useState([])
  const [cds, setCds] = useState([])

  const [version, setVersion] = useState(0);

  //function to reset the selector
  function handleReset() {
    setVersion(version + 1);
  }


  //constant to animate the filter selector
  const animatedComponents = makeAnimated();


  useEffect(() => {
    //This will be deleted when the BE part will be finished
    setAllThesis([{ 
      id: "1",
      title: "Thesis 1", 
      supervisors:"1001", 
      cosupervisors:["10001", "10101"], 
      keywords: ["AI"], 
      type: "Company Thesis", 
      group: ["AI Research Group"], 
      description: "Develop AI-powered healthcare solutions for diagnosing diseases.", 
      requirements: "Machine Learning, Medical Science, Data Analysis", 
      notes: "This project focuses on leveraging AI for healthcare advancements.", 
      expiration: "20-11-24", 
      level: "bachelor", 
      cds: "LT-2" 
    },{ 
      id: "2",
      title: "Thesis 2",
      supervisors:"1002",  
      cosupervisors:["10002", "10103"], 
      keywords: ["AI","Data Science"], 
      type: "Company Thesis", 
      group: ["Data Research Group", "Medical Research Group"], 
      description: "Develop AI-powered healthcare solutions for diagnosing diseases.", 
      requirements: "Machine Learning, Medical Science, Data Analysis", 
      notes: "This project focuses on leveraging AI for healthcare advancements.", 
      expiration: "20-11-24", 
      level: "Master", 
      cds: "LT-2" 
    },{ 
      id: "3",
      title: "Thesis 3", 
      supervisors:"1003", 
      cosupervisors:["10002", "10101"], 
      keywords: ["Data Science"], 
      type: "Research Thesis", 
      group: ["AI Research Group", "Medical Research Group"], 
      description: "Develop AI-powered healthcare solutions for diagnosing diseases.", 
      requirements: "Machine Learning, Medical Science, Data Analysis", 
      notes: "This project focuses on leveraging AI for healthcare advancements.", 
      expiration: "20-11-24", 
      level: "bachelor", 
      cds: "LT-2" 
    }]);

    setThesis([{ 
      id: "1",
      title: "Thesis 1", 
      supervisors:"1001", 
      cosupervisors:["10001", "10101"], 
      keywords: ["AI"], 
      type: "Company Thesis", 
      group: ["AI Research Group"], 
      description: "Develop AI-powered healthcare solutions for diagnosing diseases.", 
      requirements: "Machine Learning, Medical Science, Data Analysis", 
      notes: "This project focuses on leveraging AI for healthcare advancements.", 
      expiration: "20-11-24", 
      level: "bachelor", 
      cds: "LT-2" 
    },{ 
      id: "2",
      title: "Thesis 2",
      supervisors:"1002",  
      cosupervisors:["10002", "10103"], 
      keywords: ["AI","Data Science"], 
      type: "Company Thesis", 
      group: ["Data Research Group", "Medical Research Group"], 
      description: "Develop AI-powered healthcare solutions for diagnosing diseases.", 
      requirements: "Machine Learning, Medical Science, Data Analysis", 
      notes: "This project focuses on leveraging AI for healthcare advancements.", 
      expiration: "20-11-24", 
      level: "Master", 
      cds: "LT-2" 
    },{ 
      id: "3",
      title: "Thesis 3", 
      supervisors:"1003", 
      cosupervisors:["10002", "10101"], 
      keywords: ["Data Science"], 
      type: "Research Thesis", 
      group: ["AI Research Group", "Medical Research Group"], 
      description: "Develop AI-powered healthcare solutions for diagnosing diseases.", 
      requirements: "Machine Learning, Medical Science, Data Analysis", 
      notes: "This project focuses on leveraging AI for healthcare advancements.", 
      expiration: "20-11-24", 
      level: "bachelor", 
      cds: "LT-2" 
    }])

    setFilter("title")

    setTitle(["Thesis 1","Thesis 2","Thesis 3"])
    setSupervisor(["1001","1002","1002"])
    setCosupervisors(["10001", "10002", "10103", "10101"])
    setKeywords(["AI", "Data Science"])
    setType(["Company Thesis", "Research Thesis"])
    setLevel(["Bachelor", "Master"])
    setGroups(["Data Research Group", "Medical Research Group", "AI Research Group"])
    setCds(["LT-1", "LT-2", "LT-3"])
    setOptions([
      { value: "Thesis 1", label: "Thesis 1"},
      { value: "Thesis 2", label: "Thesis 2"},
      { value: "Thesis 3", label: "Thesis 3"}])
    
    /*this part will be used later and changed in order to set up the thesis array depending on the user type

    const checkAuth = async () => {
      if (loggedIn) {
        try {
          const user = await API.getUserInfo(); // we have the user info here 
          if (user) {
            setUser({ //TODO this needs to be changed to set the new info
              id: user.id,
              role: user.role, //for now role?
            })

            setLoggedIn(true);
          }
        } catch { (err) => { return null; } }

      }
    }
    checkAuth();*/
  }, []);
  

  function changeParameter(parameter){
    setFilter(parameter)
    setSelections([])
    setOptions(options)
    handleReset()
    console.log(parameter)
    /*
    if(parameter = )
    let array = []
    selection.forEach(item => {
        array.push(item.value)
    })
    setSelections(array)*/
  }

  function filtering(){
    var listThesis = [...Allthesis]
    console.log(options)
    if(filter.lenght == 0) {setThesis(listThesis)
    }else{

    listThesis = listThesis.filter((item) => {

      if(filter == item.keywords) return item
    });
    console.log(listThesis)
    setThesis(listThesis)}
  }

  function changeSelection(selection){
    if(selection.lenght == 0){
      setOptions([])
    }else{
      let array = []
      selection.forEach(item => {
          array.push(item.value)
      })
      setSelections(array)
    }
  }



  return (
    <>
    {props.loggedIn && props.user.role === "student" ? (
      <div style={{ marginTop: '10px' }}> 
                <Form className="d-flex" >
                <Form.Select aria-label="Default select example" className="selector"onChange={(event) => {changeParameter(event.target.value)}}>
                  <option value="title">Title</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="cosupervisors">Cosupervisors</option>
                  <option value="keywords">Keywords</option>
                  <option value="Type">Type</option>
                  <option value="groups">Groups</option>
                  <option value="level">Level</option>
                  <option value="cds">Course of study</option>
                </Form.Select>
                <Select options={options} key={version} className="parameters"  closeMenuOnSelect={true} components={animatedComponents} isMulti onChange={(event) => changeSelection(event)}/>
            <Button variant="outline-success" onClick={()=>filtering()}>Search</Button>
          </Form>

      {thesis.map((singleThesis) => (

    <Card border="primary" style={{ marginTop: '20px' }}>
    <Card.Header as="h3">{singleThesis.title}</Card.Header>
    <Card.Body>
      <Card.Title as="h4">{singleThesis.group}</Card.Title>
      <Card.Text >
        {singleThesis.description}
      </Card.Text>
      <Button variant="primary" onClick={() => setModalShow(singleThesis)}>Show me more</Button>
    </Card.Body>
  </Card>
      
      ))}
            <MyVerticallyCenteredModal
            thesis = {modalShow}
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
      
      </div>
      ) : props.loggedIn && props.user.role === "teacher" ?(
        <div>Logged in as a professor!</div> //TODO: Insert here code to the professor page
      ):(
        <div>You need to LOGIN!</div> 

      )
    }

    </>
  );
}

function MyVerticallyCenteredModal(props) {
  return (
    <Modal
     {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
            {props.thesis.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>{props.thesis.group}</h4>
        <h5>Professor: {props.thesis.supervisors}    Cosupervisors: {props.thesis.cosupervisors}</h5> 
        <h6>
          {props.thesis.description}
        </h6>
        <h9>{props.thesis.notes}</h9>

        <h10>Final day to apply: {props.thesis.expiration}</h10>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="success" >Submit</Button>
        <Button variant="danger" onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ThesisProposals;
