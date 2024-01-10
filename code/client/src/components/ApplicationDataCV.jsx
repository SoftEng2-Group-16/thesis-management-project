import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, Table } from 'react-bootstrap';
import '../App.css'; // Import the custom CSS file
import studentAPI from '../apis/studentAPI';
import professorAPI from '../apis/professorAPI';
import MessageContext from '../messageCtx';



function ApplicationData({ setShowData, handleErrors, setApplicationCV }) {

    const [examList, setExamList] = useState();
    const [selectedFile, setSelectedFile] = useState(null);

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


    useEffect(() => {
        //check if exam list is not null, only the exam list is mandatory when sending cv, in this case update the object for the cv
        if (examList ) {
            setApplicationCV(
                { exams: examList, filePDF: selectedFile }
            )
        }
    }, [selectedFile, examList]);//called every time the selected file is updated or the exam list is loaded


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

                <FileUploader setSelectedFile={setSelectedFile} selectedFile={selectedFile} setApplicationCV={setApplicationCV} />


            </Card.Body>
        </Card>

    )

}


function FileUploader({ setSelectedFile, selectedFile, setApplicationCV }) {
    const { handleErrors } = useContext(MessageContext);
    const [showTick, setShowTick] = useState(false);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);

        // Verifica che il file sia di tipo PDF
        if (file && file.type !== 'application/pdf') {
            setSelectedFile(null);
            handleErrors({ error: "Inserisci un file PDF valido." });

        }
        setShowTick(false);
    };

    const handleUpload = () => {
        if (selectedFile) {
            setShowTick(true);
        } else {
            handleErrors({ error: "Inserisci un file PDF valido." });
            setShowTick(false);
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
                {showTick && <span color='green'>✔</span>}
            </Form>
        </Container>
    );
}

export default ApplicationData;