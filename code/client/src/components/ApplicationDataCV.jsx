import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, Table } from 'react-bootstrap';
import '../App.css'; // Import the custom CSS file
import studentAPI from '../apis/studentAPI';
import professorAPI from '../apis/professorAPI';
import MessageContext from '../messageCtx';



function ApplicationData({ setShowData, handleErrors }) {

    const [examList, setExamList] = useState();

    useEffect(() => {
        studentAPI.getExams()
            .then((exams) => {
                setExamList(exams)
            })
            .catch(e => {
                // Handle errors
                if (e.error && e.status !== 404) {
                    handleErrors(e);
                }
            });
    }, []);




    return (
        <Card className='mt-3'>
            <Card.Title className="border-bottom pb-2 mb-4">List of passed exams</Card.Title>
            <Card.Body>
                {examList && examList.length > 0 ? (  //show the list of passed exams if there are some
                    <Table>
                        <thead>
                            <tr>
                                <th>Course Code</th>
                                <th>Title</th>
                                <th>CFU</th>
                                <th>Grade</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody className="align-middle">
                            {examList.map((exam, index) => (
                                <tr key={index} >
                                    <td>{exam.courseCode}</td>
                                    <td> {exam.courseTitle} </td>
                                    <td>{exam.cfu}</td>
                                    <td>{exam.grade}</td>
                                    <td>{exam.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>)
                    :
                    <h2>no exam passed</h2>
                }

                <FileUploader />


            </Card.Body>
        </Card>

    )

}


function FileUploader() {
    const [selectedFile, setSelectedFile] = useState(null);
    const { handleErrors } = useContext(MessageContext);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);

        // Verifica che il file sia di tipo PDF
        if (file && file.type !== 'application/pdf') {
            setSelectedFile(null);
            handleErrors({ error: "Inserisci un file PDF valido." });
        }



    };

    const handleUpload = () => {
       

        if (selectedFile) {
            //create the object formatted the right way to be sent in the POST
            const formData = new FormData();
            formData.append('file', selectedFile);

            studentAPI.uploadFile(formData)
                .then(() => { })
                .catch(err => { handleErrors(err); });
        }
        else {
            handleErrors({ error: "Seleziona un file prima di effettuare l'upload." });
        }

    };

    return (
        <Container>
            <Form>
                <Form.Label>Upload any additional file</Form.Label>
                <Form.Group controlId="formFile" className="mb-3">
                    <Form.Control type="file" onChange={handleFileChange} />
                </Form.Group>
                <Button variant="primary" className='mb-3' onClick={handleUpload} >
                    Upload
                </Button>
            </Form>
        </Container>
    );
}

export default ApplicationData;
