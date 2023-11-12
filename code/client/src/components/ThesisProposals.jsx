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
import Select from 'react-select'
import { Col, Row } from 'react-bootstrap';

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
  const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
  ]


  useEffect(() => {
    //This will be deleted when the BE part will be finished
    setAllThesis([{ 
      id: "1",
      title: "Thesis 1", 
      supervisors:"1001", 
      cosupervisors:"1001, 10101", 
      keywords: "AI", 
      type: "Company Thesis", 
      group: "AI Research Group, Medical Research Group", 
      description: "Develop AI-powered healthcare solutions for diagnosing diseases.", 
      requirements: "Machine Learning, Medical Science, Data Analysis", 
      notes: "This project focuses on leveraging AI for healthcare advancements.", 
      expiration: "20-11-24", 
      level: "bachelor", 
      cds: "LT-2" 
    },{ 
      id: "2",
      title: "Thesis 2",
      supervisors:"1001",  
      cosupervisors:"1001, 10101", 
      keywords: "AI", 
      type: "Company Thesis", 
      group: "AI Research Group, Medical Research Group", 
      description: "Develop AI-powered healthcare solutions for diagnosing diseases.", 
      requirements: "Machine Learning, Medical Science, Data Analysis", 
      notes: "This project focuses on leveraging AI for healthcare advancements.", 
      expiration: "20-11-24", 
      level: "bachelor", 
      cds: "LT-2" 
    },{ 
      id: "3",
      title: "Thesis 3", 
      supervisors:"1001", 
      cosupervisors:"1001, 10101", 
      keywords: "Data Science", 
      type: "Company Thesis", 
      group: "AI Research Group, Medical Research Group", 
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
      cosupervisors:"1001, 10101", 
      keywords: "AI", 
      type: "Company Thesis", 
      group: "AI Research Group, Medical Research Group", 
      description: "Develop AI-powered healthcare solutions for diagnosing diseases.", 
      requirements: "Machine Learning, Medical Science, Data Analysis", 
      notes: "This project focuses on leveraging AI for healthcare advancements.", 
      expiration: "20-11-24", 
      level: "bachelor", 
      cds: "LT-2" 
    },{ 
      id: "2",
      title: "Thesis 2",
      supervisors:"1001",  
      cosupervisors:"1001, 10101", 
      keywords: "AI", 
      type: "Company Thesis", 
      group: "AI Research Group, Medical Research Group", 
      description: "Develop AI-powered healthcare solutions for diagnosing diseases.", 
      requirements: "Machine Learning, Medical Science, Data Analysis", 
      notes: "This project focuses on leveraging AI for healthcare advancements.", 
      expiration: "20-11-24", 
      level: "bachelor", 
      cds: "LT-2" 
    },{ 
      id: "3",
      title: "Thesis 3", 
      supervisors:"1001", 
      cosupervisors:"1001, 10101", 
      keywords: "Data Science", 
      type: "Company Thesis", 
      group: "AI Research Group, Medical Research Group", 
      description: "Develop AI-powered healthcare solutions for diagnosing diseases.", 
      requirements: "Machine Learning, Medical Science, Data Analysis", 
      notes: "This project focuses on leveraging AI for healthcare advancements.", 
      expiration: "20-11-24", 
      level: "bachelor", 
      cds: "LT-2" 
    }])
    
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
 

  function filtering(){
    var listThesis = [...Allthesis]
    if(filter == "") {setThesis(listThesis)
    }else{
    listThesis = listThesis.filter((item) => {
      if(filter == item.keywords) return item
    });
    console.log(listThesis)
    setThesis(listThesis)}
  }


  return (
    <>
    {props.loggedIn && props.user.role === "student" ? (
      <div style={{ marginTop: '10px' }}> 
                <Form className="d-flex" onChange={(event) => {setFilter(event.target.value)}}>
                <Form.Select aria-label="Default select example" style={{ lenght: '10px' }}>
                  <option value="title">Title</option>
                  <option value="group">Group</option>
                  <option value="keyword">Keyword</option>
                </Form.Select>
                <Select options={options} />
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
