import React, { useState, useEffect, useContext } from 'react';
import { useParams } from "react-router-dom";
import { Button, Upload, message } from 'antd';
import { DataContext } from "../context/DataContext";
import avatar from '../static/img/media/profile-avatar.png'
import banner from '../static/img/bg/author-cover.png'
import { ReactComponent as CopyIcon } from '../static/img/icons/copy-icon.svg';
import { ReactComponent as Share } from '../static/img/icons/share-grey.svg';
import { ReactComponent as Facebook } from '../static/img/icons/facebook.svg';
import { ReactComponent as Twitter } from '../static/img/icons/twitter.svg';
import { ReactComponent as Instagram } from '../static/img/icons/instagram.svg';
import { ReactComponent as Linkedin } from '../static/img/icons/linkedin.svg';

const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
};

const beforeUploadAvatar = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
};

const beforeUploadBanner = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
};

const AuthorArea = ({ id, address, username, setIsEditProfile, isEditProfile }) => {
    const { updateUser, user } = useContext(DataContext);

    const [avatarUrl, setAvatarUrl] = useState();
    const [bannerUrl, setBannerUrl] = useState();

    const handleChangeAvatar = async (info) => {
        if (!address) {
            message.error('Who is this?')
        }
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, url => {
            setAvatarUrl(url);
        });
        const formData = new FormData()
        formData.append("_id", address)
        formData.append("avatar", info.file.originFileObj);
        await updateUser(formData)
    };

    const handleChangeBanner = async (info) => {
        if (!address) {
            message.error('Who is this?')
        }
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, url => {
            setBannerUrl(url);
        });
        const formData = new FormData()
        formData.append("_id", address)
        formData.append("banner", info.file.originFileObj);
        await updateUser(formData)
    };

    useEffect(() => {
        if (user && user.avatar) {
            setAvatarUrl(user.avatar)
        }
        if (user && user.banner) {
            setBannerUrl(user.banner)
        }
    }, [user])

    return (
        <div className="author-area sep-bottom">
            <Upload
                name="banner"
                className="avatar-uploader author-cover author-cover-edit"
                showUploadList={false}
                beforeUpload={beforeUploadBanner}
                onChange={handleChangeBanner}
            >
                {bannerUrl ?
                    <img src={bannerUrl.includes('data') ? `${bannerUrl}` : `http://localhost:4000/uploads/${bannerUrl}`} alt="avatar" style={{ width: '100%' }} />
                    :
                    <img src={banner} alt="" />
                }
            </Upload>
            <div className="author-info">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6 d-flex justify-content-center justify-content-lg-start">
                            {/* <!-- Profile --> */}
                            <div className="author-profile text-center text-white d-inline-block pb-2 pb-lg-4">
                                <div className="user-avatar">
                                    <Upload
                                        name="avatar"
                                        listType="picture-card"
                                        className="avatar-uploader avatar-custom"
                                        showUploadList={false}
                                        beforeUpload={beforeUploadAvatar}
                                        onChange={handleChangeAvatar}
                                    >
                                        {avatarUrl ?
                                            <img src={avatarUrl.includes('data') ? `${avatarUrl}` : `http://localhost:4000/uploads/${avatarUrl}`} alt="avatar" style={{ width: '100%' }} />
                                            :
                                            <img src={avatar} alt="" />
                                        }
                                    </Upload>
                                </div>

                                <h5 className="user_name text-white">{user.name}</h5>
                            </div>
                            {/* <!-- End Profile --> */}
                        </div>
                        <div className="col-lg-6">
                            <div
                                className="d-flex flex-wrap align-items-center mt-10 justify-content-center justify-content-lg-end mb-3 mb-lg-0">
                                {/* <!-- Copy Clipboard --> */}
                                <div className="copy-clipboard-wrap mr-10 mb-10">
                                    <input className="form-control" id="get-link" type="text" value={id}
                                        readOnly />

                                    {/* <!-- Copy Button --> */}
                                    <a href="#" id="copy-link-btn">
                                        <CopyIcon className='svg' />
                                    </a>

                                    {/* <!-- End Copy Button --> */}
                                </div>
                                {/* <!-- End Copy Clipboard --> */}

                                {/* <!-- Share --> */}
                                <div className="dropdown mr-10 mb-10">
                                    <button className="btn-circle style--two dropdown-toggle" data-bs-toggle="dropdown">
                                        <Share className='svg' />
                                    </button>
                                    <ul className="dropdown-menu">
                                        <li><a className="dropdown-item" target="_blank" rel="noreferrer" href="https://www.facebook.com/">
                                            <Facebook /> Share on Facebook</a>
                                        </li>
                                        <li><a className="dropdown-item" target="_blank" rel="noreferrer" href="https://www.twitter.com/">
                                            <Twitter /> Share on Twitter</a></li>
                                        <li><a className="dropdown-item" target="_blank" rel="noreferrer" href="https://www.Instagram.com/">
                                            <Instagram /> Share on Instagram</a>
                                        </li>
                                        <li><a className="dropdown-item" target="_blank" rel="noreferrer" href="https://www.linkedin.com/">
                                            <Linkedin /> Share on Linkedin</a>
                                        </li>
                                    </ul>
                                </div>
                                {
                                    id != address ?
                                        <></>
                                        :
                                        <Button onClick={() => setIsEditProfile(!isEditProfile)} className="btn btn-border btn-sm mb-10">{isEditProfile ? 'Back to Profile' : 'Edit Profile'}</Button>
                                }

                                {/* <!-- End Share --> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AuthorArea