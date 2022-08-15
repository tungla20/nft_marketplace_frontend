import React, { useState, useEffect } from 'react';
import Single from '../static/img/media/single-upload.png';
import Multiple from '../static/img/media/multiple-upload.png';
import { Link } from 'react-router-dom';
import { Redirect } from "react-router-dom";

const Create = () => {
    const [address, setAddress] = useState();
    useEffect(()=>{
        setAddress(localStorage.getItem('userAccount'))
        if (localStorage.getItem('userAccount') == null) {
            return <Redirect to="/wallet" />
        }
    }, [address])
    
    return (
        <>
            {/* <!-- Create Collectible --> */}
            <section className="pt-120 pb-90">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            {/* <!-- Section Title --> */}
                            <div className="section-title text-center text-white">
                                <h2>Create Collectible</h2>
                            </div>
                            {/* <!-- End Section Title --> */}
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-xl-3 col-lg-4 col-md-5 col-sm-6">
                            {/* <!-- Single Create --> */}
                            <div className="create-box">
                                <Link to="/upload/nft">
                                    <img src={Single} alt=""></img>
                                    <h3>Create NFT</h3>
                                </Link>
                            </div>
                            {/* <!-- End Single Create --> */}
                        </div>
                        <div className="col-xl-3 col-lg-4 col-md-5 col-sm-6">
                            {/* <!-- Multiple Create --> */}
                            <div className="create-box">
                                <Link to="/upload/collection">
                                    <img src={Multiple} alt=""></img>
                                    <h3>Create collection</h3>
                                </Link>
                            </div>
                            {/* <!-- End Multiple Create --> */}
                        </div>
                    </div>
                </div>
            </section>
            {/* <!-- End Create Collectible --> */}
        </>
    )
}

export default Create