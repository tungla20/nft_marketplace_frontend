import React, { useState, useEffect, useContext } from 'react';
import { ReactComponent as CopyIcon } from '../static/img/icons/copy-icon.svg';
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { DataContext } from "../context/DataContext";
import { Button, Input, Form } from 'antd';
import { ReactComponent as SaveNow } from '../static/img/icons/btn-save.svg';

const { TextArea } = Input;

const EditProfile = ({ address }) => {
    const [form] = Form.useForm();

    const { updateUser, user } = useContext(DataContext);

    const handleFinish = async (values) => {
        values._id = address
        await updateUser(values)
    }

    useEffect(() => {
        if (user) {
            form.setFieldsValue(user)
        }
    }, [user])

    return (
        <section className="pt-120 pb-120 mt-n1">
            <div className="container">
                <div className="row">
                    <div className="col-md-8">
                        <div className="section-title">
                            <h2 className="text-white">Profile Setting</h2>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12">
                        <Form form={form} onFinish={handleFinish} layout="vertical" className="edit-profile-form text-white">
                            <div className="card mb-60">
                                <div className="card-body">
                                    <div className="account-info">
                                        <h3>Account Information</h3>
                                        <div style={{ marginLeft: '15px' }} className="form-group">
                                            <Form.Item name="name" label="Display Name">
                                                <Input className="form-control" id="name" placeholder="Item Name " />
                                            </Form.Item>
                                        </div>
                                        <div style={{ marginLeft: '15px' }} className="form-group">
                                            <Form.Item name="url" label="Custom URL">
                                                <Input className="form-control" id="customUrl" placeholder="Example @www.anefty.com/" />
                                            </Form.Item>
                                        </div>
                                        <div style={{ marginLeft: '15px' }} className="form-group">
                                            <Form.Item name="email" label="Email address">
                                                <Input className="form-control" id="email" placeholder="Example @support.anefty@gmail.com" />
                                            </Form.Item>
                                        </div>
                                        <div style={{ marginLeft: '15px' }} className="form-group mb-0">
                                            <Form.Item name="bio" className="mb-0" label="Bio">
                                                <TextArea id="bio" className="form-control" placeholder="Write your bio" />
                                            </Form.Item>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="card">
                                <div className="card-body">
                                    <div className="social-media">
                                        <h3>Social Media</h3>
                                        <div style={{ marginLeft: '15px' }} className="form-group">
                                            <Form.Item name="facebook" label="Facebook account">
                                                <Input className="form-control" id="facebook" placeholder="Example @anefty_alexder" />
                                            </Form.Item>
                                        </div>
                                        <div style={{ marginLeft: '15px' }} className="form-group">
                                            <Form.Item name="twitter" label="Twitter account">
                                                <Input className="form-control" id="twitter" placeholder="Example @anefty_alexder" />
                                            </Form.Item>
                                        </div>
                                        <div style={{ marginLeft: '15px' }} className="form-group">
                                            <Form.Item name="instagram" label="Instagram account">
                                                <Input className="form-control" id="instagram" placeholder="Example @anefty_alexder" />
                                            </Form.Item>
                                        </div>
                                        <div className="d-flex justify-content-end">
                                            <Button className="btn" htmlType="submit">
                                                <SaveNow className="svg" />
                                                Save Now
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default EditProfile