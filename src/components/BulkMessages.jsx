import { Button, Card } from '@mui/material';
import { Table } from "react-bootstrap";
import {useEffect, useState} from "react";
import axios from 'axios';

export default function BulkMessages() {
    const [language, setLanguage] = useState('');
    const [templateName, setTemplateName] = useState('');
    const [variable, setVariable] = useState('');
    const [csvFile, setCsvFile] = useState(null);
    const [messageLogs, setMessageLogs] = useState([]);

    // Function to handle CSV file upload
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setCsvFile(file);
    };

    // Function to send data to the server using Axios
    const sendDataToServer = () => {
        // Prepare data to send to the server (example)
        const data = new FormData();
        data.append('language', language);
        data.append('template', templateName);
        data.append('file', csvFile);
        data.append('variable',variable);

        // Send data to the server using Axios
        axios.post('http://localhost:8000/bot/bulk/', data)
            .then(response => {
                // Handle response from the server
                console.log('Response from server:', response);
                getMessageLogs()
            })
            .catch(error => {
                // Handle errors
                console.error('Error sending data to server:', error);
            });
    };

    const getMessageLogs = () => {
        axios.get('http://localhost:8000/bot/bulk/')
            .then(response => {
                setMessageLogs(response.data.message_logs);
                console.log('Response from server:', response.data.message_logs);
            })
            .catch(error => {
                // Handle errors
                console.error('Error sending data to server:', error);
            });
    }

    useEffect(() => {
        getMessageLogs()
    }, []);

    return (
        <>
            <Card className='my-2 p-2'>
                <h4>Upload CSV</h4>

                {/* Input for CSV file */}
                <input type="file" accept=".csv" onChange={handleFileChange} />

                {/* Select for language */}
                <select className='form-control m-2' onChange={(e) => setLanguage(e.target.value)}>
                    <option value=''>Select Template Language</option>
                    <option value='en_GB'>English UK</option>
                    <option value='en_US'>English US</option>
                </select>

                {/* Input for template name */}
                <input value={templateName} className='form-control m-2' placeholder='Template Name' type='text' onChange={(e) => setTemplateName(e.target.value)} />

                <input value={variable} className='form-control m-2' placeholder='Variable' type='text' onChange={(e) => setVariable(e.target.value)} />

                {/* Button to upload */}
                <Button size='small' variant='outlined' className='m-2' color='success' onClick={sendDataToServer}>Upload</Button>

            </Card>
            <Card className='my-2 p-2'>
                <h4>Total sent message 0</h4>
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>Phone Number</th>
                        <th>Outgoing Template</th>
                        <th>Language</th>
                        <th>Status</th>
                        <th>Sent At</th>
                    </tr>
                    </thead>
                    <tbody>
                    {messageLogs.map((log)=>(
                        <tr key={log.id}>
                            <td>{log.number.phone_number}</td>
                            <td>{log.batch.template}</td>
                            <td>{log.batch.language}</td>
                            <td>{log.status}</td>
                            <td>{log.created_at}</td>
                        </tr>
                    ))}

                    </tbody>
                </Table>
            </Card>
        </>
    );
}
