import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Button,  Card, Container} from '@mui/material';
import {Form, Table} from 'react-bootstrap'
import config from "../config.jsx";

const Templates = () => {
    const [templates, setTemplates] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [editingTemplateId, setEditingTemplateId] = useState(null);
    const [formVisible, setFormVisible] = useState(false);
    const [status, setStatus] = useState('');

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            const response = await axios.get(config.apiUrl+'api/templates/');
            setTemplates(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching templates:', error);
        }
    };

    const handleCreateTemplate = async () => {
        try {
            let x=false;
            if(status==="true") {
                x=true;
            }
            await axios.post(config.apiUrl+'api/templates/', { name:name, description:description, status:x });
            fetchTemplates();
            setName('');
            setDescription('');
            setStatus('false')
        } catch (error) {
            console.error('Error creating template:', error);
        }
    };

    const handleEditTemplate = async (id) => {
        setFormVisible(true);
        setEditingTemplateId(id);
        const templateToEdit = templates.find((template) => template.id === id);
        if (templateToEdit) {
            setName(templateToEdit.name);
            setDescription(templateToEdit.description);
            if (templateToEdit.status===true) {
                setStatus("true");
            } else {
                setStatus("false");

            }
        }
    };

    const handleUpdateTemplate = async () => {
        try {
            await axios.put(config.apiUrl+`/api/templates/${editingTemplateId}/`, { name, description });
            fetchTemplates();
            setName('');
            setDescription('');
            setEditingTemplateId(null);
        } catch (error) {
            console.error('Error updating template:', error);
        }
    };

    const handleDeleteTemplate = async (id) => {
        try {
            await axios.delete(config.apiUrl+`/api/templates/${id}/`);
            fetchTemplates();
        } catch (error) {
            console.error('Error deleting template:', error);
        }
    };

    return (
        <Container className="p-1 m-2">
            <h3 className="m-2">Templates</h3>
            {formVisible?
                <Card className="my-2 ">
                <Form className="m-2">
                <Form.Group controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId="description">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <Form.Label>Status</Form.Label>
                    <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="false">Inactive</option>
                        <option value="true">Active</option>
                        {/* Add more options here */}
                    </Form.Select>
                </Form.Group>
                <Button variant="outlined" size="small" color="success" onClick={handleCreateTemplate}>Save</Button><Button size="small" variant="outlined" color="error" className="m-2" onClick={()=>setFormVisible(false)}>Close</Button>
            </Form>
                </Card>:null}
           <Card className="p-3">
            {formVisible?null:<Button size="small" variant="outlined" className="m-2" onClick={()=>setFormVisible(true)}>Create Template</Button>}
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Date Created</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {templates.map((template) => (
                    <tr key={template.id}>
                        <td>{template.name}</td>
                        <td>{template.description}</td>
                        <td>{template.status?<span className="bg-success m-1">Active</span>:<span className="bg-danger">Inactive</span>}</td>
                        <td>{template.created_at.slice(0,10)}</td>
                        <td>
                            <Button variant="contained" size="small" className="m-1" onClick={() => handleEditTemplate(template.id)}>Edit</Button>
                            <Button variant="outlined"  size="small" className="m-1" onClick={() => handleDeleteTemplate(template.id)}>Delete</Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
           </Card>
        </Container>
    );
};

export default Templates;
