import React, { useState, useContext, useEffect } from 'react';
import { ReactComponent as Plus } from '../static/img/icons/plus.svg';
import { useParams } from "react-router-dom";
import { mintNFT, createCollection, getAllCollection } from "../services/chain/apis/extrinsic";
import { Button, Form, Input, Select, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { message, Upload, notification } from 'antd';
import { DataContext } from "../context/DataContext";

const { TextArea } = Input;

const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
};

const beforeUpload = (file) => {
    const isLt2M = file.size / 1024 / 1024 < 100;
    if (!isLt2M) {
        message.error('Image must smaller than 100MB!');
    }
    return isLt2M;
};

const UploadComponent = () => {
    let { id } = useParams();

    const { collecions, setCollections } = useContext(DataContext);

    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState();
    const [thisCollections, setThisCollections] = useState([])
    const [fileName, setFileName] = useState()
    const [blob, setBlob] = useState(null)

    const handleChange = (info) => {
        setBlob(info.file.originFileObj)
        setFileName(info.file.name)
        getBase64(info.file.originFileObj, url => {
            setLoading(false);
            setImageUrl(url);
        });
    };

    const onFinishNFT = async (values) => {
        console.log('Success:', values);
        await mintNFT(values.name, values.description, values.collection, values.price, values.royalty, blob, fileName)
    };

    const onFinishCollection = (values) => {
        console.log('Success:', values);
        if (!values.title && !values.description) {
            notification['error']({
                message: 'Error',
                description: 'Title and description required'
            });
        }
        createCollection(values.title, values.description)
    };

    useEffect(() => {
        async function fetchCollections() {
            let response = await getAllCollection()
            setCollections(response)
            setThisCollections(response)
        }
        fetchCollections()
    }, [])

    return (
        <section className="pt-120 pb-120">
            {
                id == 'nft' ?
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-8">
                                {/* <!-- Section Title --> */}
                                <div className="section-title text-white">
                                    <h2>Mint new NFT</h2>
                                </div>
                                {/* <!-- End Section Title --> */}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                {/* <!-- Form --> */}
                                <Form onFinish={onFinishNFT} layout="vertical" className="upload-form text-white">
                                    <div className="card mb-60">
                                        <div className="card-body">
                                            <div className="dropzone-wrap">
                                                <h3>Image, Video, Audio or 3d Model.</h3>
                                                <p>File types supported: JPG, PNG, GIF, SVG, MP4, WEBM, MP3, MAV, OGG, GLB, GLTF.
                                                    Max size: 100 MB</p>
                                                {/* <!-- Dropzone Start --> */}
                                                <Upload
                                                    name="nft"
                                                    listType="picture"
                                                    className="dropzone"
                                                    showUploadList={false}
                                                    beforeUpload={beforeUpload}
                                                    onChange={handleChange}
                                                >
                                                    {imageUrl ? <img src={imageUrl} alt="nft" style={{ width: '100%' }} /> :
                                                        <span className="upload-btn">
                                                            <Plus className='svg' />
                                                        </span>}
                                                </Upload>
                                                {/* <!-- Dropzone End --> */}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="card">
                                        <div className="card-body">
                                            <div className="upload-info">

                                                <h3>Upload Information</h3>
                                                <div className="form-group">
                                                    <Form.Item name="name" className="row justify-content-between" label="Display Name">
                                                        <Input className="form-control" id="name" placeholder="Item Name " />
                                                    </Form.Item>
                                                </div>
                                                <div className="form-group">
                                                    <Form.Item name="description" className="row justify-content-between" label="Description">
                                                        <TextArea id="description" className="form-control" placeholder="Provide a detailed description of your item " />
                                                    </Form.Item>
                                                </div>
                                                <div className="form-group">
                                                    <Form.Item name="collection" className="row justify-content-between" label="Collection">
                                                        <Select id="collection" className="form-control">
                                                            <Select.Option key={0} value={null}>{'(None)'}</Select.Option>
                                                            {
                                                                thisCollections && thisCollections.map((value, index) => {
                                                                    return (
                                                                        <Select.Option key={index} value={value[0]}>{value[1].title}</Select.Option>
                                                                    )
                                                                })
                                                            }
                                                        </Select>
                                                    </Form.Item>
                                                </div>
                                                <div className="form-group">
                                                    <Form.Item name="price" className="row justify-content-between" label="Price">
                                                        <Input className="form-control" id="price" placeholder="Item Price " />
                                                    </Form.Item>
                                                </div>
                                                {/* <div className="form-group">
                                                    <label style={{ marginLeft: '-30px' }} className="col-md-5">Royalty</label>
                                                    <Form.List name="royalty">
                                                        {(fields, { add, remove }) => (
                                                            <>
                                                                {fields.map(({ key, name, ...restField }) => (
                                                                    <Space key={key} style={{ display: 'flex', marginBottom: 8, marginLeft: '-15px' }} align="baseline">
                                                                        <Form.Item
                                                                            {...restField}
                                                                            name={[name, 'Address']}
                                                                            style={{ width: '500px' }}
                                                                            rules={[{ required: true, message: 'Missing address' }]}
                                                                        >
                                                                            <Input placeholder="Address" />
                                                                        </Form.Item>
                                                                        <Form.Item
                                                                            {...restField}
                                                                            name={[name, 'Percent']}
                                                                            rules={[{ required: true, message: 'Missing percent royalty' }]}
                                                                        >
                                                                            <Input placeholder="Royalty percent" />
                                                                        </Form.Item>
                                                                        <MinusCircleOutlined onClick={() => remove(name)} />
                                                                    </Space>
                                                                ))}
                                                                <Form.Item>
                                                                    <Button style={{ marginLeft: '-15px' }} type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                                                        Add field
                                                                    </Button>
                                                                </Form.Item>
                                                            </>
                                                        )}
                                                    </Form.List>
                                                </div> */}
                                                <div className="form-group d-flex justify-content-end pt-2 mb-0">
                                                    <Form.Item>
                                                        <Button className="btn mint-btn" htmlType="submit">Mint Now</Button>
                                                    </Form.Item>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Form>
                                {/* <!-- End Form --> */}
                            </div>
                        </div>
                    </div>
                    :
                    <div className='container'>
                        <Form layout='vertical' onFinish={onFinishCollection} className="upload-form text-white">
                            <div className="card">
                                <div className="card-body">
                                    <div className="upload-info">
                                        <h3>Upload Information</h3>
                                        <div className="form-group">
                                            <Form.Item name="title" className="row justify-content-between" label="Display Name">
                                                <Input className="form-control" id="name" placeholder="Item Name " />
                                            </Form.Item>
                                        </div>
                                        <div className="form-group">
                                            <Form.Item name="description" className="row justify-content-between" label="Description">
                                                <TextArea id="description" className="form-control" placeholder="Provide a detailed description of your item " />
                                            </Form.Item>
                                        </div>

                                        <div className="form-group d-flex justify-content-end pt-2 mb-0">
                                            <Form.Item>
                                                <Button className="btn mint-btn" htmlType="submit">Create Now</Button>
                                            </Form.Item>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    </div>
            }
        </section>
    )
}

export default UploadComponent