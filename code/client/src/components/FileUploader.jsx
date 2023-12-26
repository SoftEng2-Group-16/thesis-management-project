import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import '../App.css'; // Import the custom CSS file
import studentAPI from '../apis/studentAPI';
import professorAPI from '../apis/professorAPI';
import MessageContext from '../messageCtx';



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
        // Qui puoi gestire l'upload del file sul lato front-end.
        // Ad esempio, puoi utilizzare la libreria axios per inviare il file a un server.
        // Non è possibile manipolare direttamente il file lato client per ragioni di sicurezza,
        // ma puoi inviarlo a un server per elaborazione successiva.

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
                <Form.Group controlId="formFile" className="mb-3">
                    <Form.Control type="file" onChange={handleFileChange} />
                </Form.Group>
                <Button variant="primary" onClick={handleUpload} >
                    Upload
                </Button>
            </Form>
        </Container>
    );
}

export default FileUploader;
