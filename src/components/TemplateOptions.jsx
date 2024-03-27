import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Form } from 'react-bootstrap';
import {Card, Button} from "@mui/material";

const TemplateOptions = () => {
    const [templateOptions, setTemplateOptions] = useState([]);
    const [templatePages, setTemplatePages] = useState([]);
    const [templatePage, setTemplatePage] = useState('');
    const [type, setType] = useState('');
    const [text, setText] = useState('');
    const [value, setValue] = useState('');
    const [description, setDescription] = useState('');
    const [editingTemplateOptionId, setEditingTemplateOptionId] = useState(null);
    const [formVisibility, setFormVisibility] = useState(false);

    useEffect(() => {
        fetchTemplateOptions();
    }, []);

    const makeFormVisible = () => {
        setFormVisibility(true);
    }

    const makeFormInvisible = () => {
        setFormVisibility(false);
        setType('');
        setText('');
        setValue('');
        setDescription('');
    }

    const fetchTemplateOptions = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/template-options/');
            setTemplateOptions(response.data);
        } catch (error) {
            console.error('Error fetching template options:', error);
        }
        try {
            const response = await axios.get('http://localhost:8000/api/template-pages/');
            setTemplatePages(response.data);
        } catch (error) {
            console.error('Error fetching template options:', error);
        }
    };



    const handleCreateTemplateOption = async () => {
        try {
            const payload = {};
            if (type) payload.type = type;
            if (text) payload.text = text;
            if (value) payload.value = value;
            if (description) payload.description = description;
            if (templatePage) payload.template_pageId = templatePage;
            await axios.post('http://localhost:8000/api/template-options/', payload);
            fetchTemplateOptions();
            setType('');
            setText('');
            setValue('');
            setDescription('');
        } catch (error) {
            console.error('Error creating template option:', error);
        }
    };

    const handleEditTemplateOption = async (id) => {
        setEditingTemplateOptionId(id);
        const templateOptionToEdit = templateOptions.find((templateOption) => templateOption.id === id);
        if (templateOptionToEdit) {
            setType(templateOptionToEdit.type);
            setText(templateOptionToEdit.text);
            setValue(templateOptionToEdit.value);
            setDescription(templateOptionToEdit.description);
            setTemplatePage(templateOptionToEdit.template_page.id)
        }
    };

    const handleUpdateTemplateOption = async () => {
        try {
            await axios.put(`http://localhost:8000/api/template-options/${editingTemplateOptionId}/`, {
                type:type,
                text:text,
                value:value,
                description:description,
                template_pageId:templatePage
            });
            fetchTemplateOptions();
            setType('');
            setText('');
            setValue('');
            setDescription('');
            setEditingTemplateOptionId(null);
        } catch (error) {
            console.error('Error updating template option:', error);
        }
    };

    const handleDeleteTemplateOption = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/api/template-options/${id}/`);
            fetchTemplateOptions();
        } catch (error) {
            console.error('Error deleting template option:', error);
        }
    };

    return (
        <div className="container mt-4">
            <h4 className="mb-4">Template Options</h4>
            {formVisibility?
                <Card className='p-4 m-2'>
                    <Form className="mb-4">
                        <Form.Group controlId="type">
                            <Form.Label>Type</Form.Label>
                            <Form.Control as="select" value={type} onChange={(e) => setType(e.target.value)}>
                                <option value="">Select an option type</option>
                                <option value="text">Text</option>
                                <option value="button">Button</option>
                                <option value="list">List</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="text">
                            <Form.Label>Text</Form.Label>
                            <Form.Control
                                type="text"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="value"Page>
                            <Form.Label>Points To</Form.Label>
                            <Form.Control as="select" value={value} onChange={(e) => setValue(e.target.value)}>
                                <option value="">Select a template page to navigate to</option>
                                {templatePages.map((item)=>(
                                    <option key={item.id} value={item.id}>{item.name}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="description">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </Form.Group>
                        {type === 'button' || type === 'list' ?
                            <Form.Group controlId="templatePage">
                                <Form.Label>Template Page</Form.Label>
                                <Form.Control as="select" value={templatePage} onChange={(e) => setTemplatePage(e.target.value)}>
                                    <option value="">Select a template page to add to</option>
                                    {templatePages.map((item)=>(
                                        <option key={item.id} value={item.id}>{item.name}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>:null }

                        {editingTemplateOptionId ? (
                            <Button className='m-1' size='small' color='success' variant="outlined" onClick={handleUpdateTemplateOption}>Save</Button>
                        ) : (
                            <Button className='m-1' size='small' color='success' variant="outlined" onClick={handleCreateTemplateOption}>Save</Button>
                        )}  <Button className='m-1' size='small' color='error' variant="outlined" onClick={makeFormInvisible}>Close</Button>
                    </Form>
                </Card>

                :
            null
            }
            {!formVisibility? <Button className='m-1' size='small' variant="outlined" onClick={makeFormVisible}>Create Template Option</Button> : null}
            <Card className='m-2'>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>Type</th>
                    <th>Text</th>
                    <th>To</th>
                    <th>Description</th>
                    <th>Page</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {templateOptions.map((templateOption) => (
                    <tr key={templateOption.id}>
                        <td>{templateOption.type}</td>
                        <td>{templateOption.text}</td>
                        <td>{templatePages.filter((option) => option.id === parseInt(templateOption.value)).map((item) => item.name)}</td>
                        <td>{templateOption.description}</td>
                        <td>{templateOption.template_page.name}</td>
                        <td>
                            <Button className='m-1' variant="contained" size='small' onClick={() => handleEditTemplateOption(templateOption.id)}>Edit</Button>
                            <Button className='m-1' variant="outlined" size='small' color='error' onClick={() => handleDeleteTemplateOption(templateOption.id)}>Delete</Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
            </Card>
        </div>
    );
};

export default TemplateOptions;
