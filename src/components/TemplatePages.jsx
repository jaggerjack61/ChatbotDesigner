import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Form } from 'react-bootstrap';
import {Button, Card} from "@mui/material";
import Templates from "./Templates.jsx";

const TemplatePages = () => {
    const [templates, setTemplates] = useState([]);
    const [templatePages, setTemplatePages] = useState([]);
    const [defaultPage ,setDefaultPage] = useState('');
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [header, setHeader] = useState('');
    const [body, setBody] = useState('');
    const [footer, setFooter] = useState('');
    const [menuTitle, setMenuTitle] = useState('');
    const [editingTemplatePageId, setEditingTemplatePageId] = useState(null);
    const [formVisible, setFormVisible] = useState(false);
    const [template, setTemplate] = useState('');

    useEffect(() => {
        fetchTemplatePages();
    }, []);

    const makeFormVisible = () => {

        setFormVisible(true)
    }

    const makeFormInvisible = () => {
        setFormVisible(false)
        setName('');
        setBody('');
        setType('');
        setFooter('');
        setHeader('');
    }
    const fetchTemplatePages = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/template-pages/');
            setTemplatePages(response.data);
        } catch (error) {
            console.error('Error fetching template pages:', error);
        }
        try {
            const response = await axios.get('http://localhost:8000/api/templates/');
            setTemplates(response.data);
        } catch (error) {
            console.error('Error fetching template pages:', error);
        }
    };

    const handleCreateTemplatePage = async () => {
        try {
            const payload = {};
            if (name) payload.name = name;
            if (type) payload.type = type;
            if (header) payload.header = header;
            if (body) payload.body = body;
            if (footer) payload.footer = footer;
            if (menuTitle) payload.menu_title = menuTitle;
            if (template) payload.templateId = template;
            if (defaultPage === 'true') payload.is_default = true;
            if (defaultPage === 'false') payload.is_default = false;

            await axios.post('http://localhost:8000/api/template-pages/', payload)
                .then(()=>{
                    makeFormInvisible()
                    fetchTemplatePages();
                    setName('');
                    setType('');
                    setHeader('');
                    setBody('');
                    setFooter('');
                    setMenuTitle('');
                    setTemplate('')
                    setDefaultPage('')
                });

        } catch (error) {
            console.error('Error creating template page:', error);
        }
    };


    const handleEditTemplatePage = async (id) => {
        makeFormVisible();
        setEditingTemplatePageId(id);
        const templatePageToEdit = templatePages.find((templatePage) => templatePage.id === id);
        if (templatePageToEdit) {
            setName(templatePageToEdit.name);
            setType(templatePageToEdit.type);
            setHeader(templatePageToEdit.header);
            setBody(templatePageToEdit.body);
            setFooter(templatePageToEdit.footer);
            setMenuTitle(templatePageToEdit.menuTitle);
            setTemplate(templatePageToEdit.template.id);
        }
    };

    const handleUpdateTemplatePage = async () => {
        try {

            await axios.put(`http://localhost:8000/api/template-pages/${editingTemplatePageId}/`, {
                name,
                type,
                header,
                body,
                footer,
                menuTitle
            });
            fetchTemplatePages();
            setName('');
            setType('');
            setHeader('');
            setBody('');
            setFooter('');
            setMenuTitle('');
            setEditingTemplatePageId(null);
        } catch (error) {
            console.error('Error updating template page:', error);
        }
    };

    const handleDeleteTemplatePage = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/api/template-pages/${id}/`);
            fetchTemplatePages();
        } catch (error) {
            console.error('Error deleting template page:', error);
        }
    };

    return (
        <div>
            <h4 className="mb-4">Template Pages</h4>
            {formVisible ?
            <Card className='p-4'>


                    <Form className="mb-4">
                        <Form.Group controlId="name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="type">
                            <Form.Label>Type</Form.Label>
                            <Form.Control as="select" value={type} onChange={(e) => setType(e.target.value)}>
                                <option value="">Select a page type</option>
                                <option value="text">Text</option>
                                <option value="button">Button</option>
                                <option value="list">List</option>
                            </Form.Control>
                        </Form.Group>
                        {type === 'button' || type === 'list' ?
                            <Form.Group controlId="header">
                                <Form.Label>Header</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={header}
                                    onChange={(e) => setHeader(e.target.value)}
                                />
                            </Form.Group>
                            : null}

                        <Form.Group controlId="body">
                            <Form.Label>Body</Form.Label>
                            <Form.Control
                                type="text"
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                            />
                        </Form.Group>
                        {type === 'button' || type === 'list' ?
                            <Form.Group controlId="footer">
                                <Form.Label>Footer</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={footer}
                                    onChange={(e) => setFooter(e.target.value)}
                                />
                            </Form.Group>
                            : null}

                        {type === 'list' ?
                            <Form.Group controlId="menuTitle">
                            <Form.Label>Menu Title</Form.Label>
                            <Form.Control
                                type="text"
                                value={menuTitle}
                                onChange={(e) => setMenuTitle(e.target.value)}
                            />
                        </Form.Group>
                            : null}

                        <Form.Group controlId="template">
                            <Form.Label>Template</Form.Label>
                        <Form.Control as="select" value={template} onChange={(e) => setTemplate(e.target.value)}>
                            <option value="">Select a template</option>
                            {templates.map((item)=>(
                                <option key={item.id} value={item.id}>{item.name}</option>
                            ))}
                        </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="default">
                            <Form.Label>Default</Form.Label>
                            <Form.Control as="select" value={defaultPage} onChange={(e) => setDefaultPage(e.target.value)}>
                                <option value="">Is this your default page</option>
                                <option value="true">Yes</option>
                                <option value="false">No</option>

                            </Form.Control>
                        </Form.Group>


                        <Button variant="outlined" className='m-2' color='success' size='small' onClick={handleCreateTemplatePage}>Save</Button>
                        <Button variant="outlined" color='error' className='m-2' size='small' onClick={makeFormInvisible}>Close</Button>
                    </Form>


            </Card>: null}
            <Button className='m-2' variant="outlined" size='small'  onClick={makeFormVisible}>Create Template Page</Button>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Header</th>
                    <th>Body</th>
                    <th>Footer</th>
                    <th>Menu Title</th>
                    <th>Template</th>
                    <th>Is Default</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {templatePages.map((templatePage) => (
                    <tr key={templatePage.id}>
                        <td>{templatePage.name}</td>
                        <td>{templatePage.type}</td>
                        <td>{templatePage.header}</td>
                        <td>{templatePage.body}</td>
                        <td>{templatePage.footer}</td>
                        <td>{templatePage.menu_title}</td>
                        <td>{templatePage.template.name}</td>
                        <td>{templatePage.is_default?'Yes':'No'}</td>
                        <td>
                            <Button className='m-1' size='small' variant="contained" onClick={() => handleEditTemplatePage(templatePage.id)}>Edit</Button>
                            <Button className='m-1' size='small' variant="outlined" color='error' onClick={() => handleDeleteTemplatePage(templatePage.id)}>Delete</Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
    );
};

export default TemplatePages;
