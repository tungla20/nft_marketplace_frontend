import React, { useState } from 'react';
import { ReactComponent as FooterLogoLight } from '../../static/img/logo.svg';
import { ReactComponent as Insta } from '../../static/img/icons/instagram-round.svg';
import { ReactComponent as Pinterest } from '../../static/img/icons/pinterest.svg';
import { ReactComponent as Twitter } from '../../static/img/icons/twitter-round.svg';
import { ReactComponent as Whatsapp } from '../../static/img/icons/whatsapp.svg';

const Footer = () => {
    return (
        // < !--Footer -- >
        <footer className="footer">
            <div className="footer-main">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-2 col-sm-6">
                            {/* <!-- Widget Nav Menu --> */}
                            <div className="widget widget_nav_menu">
                                <h4 className="widget_title">My Account</h4>
                                <ul>
                                    <li><a href="profile.html">Profile</a></li>
                                    <li><a href="collection.html">My Collections</a></li>
                                </ul>
                            </div>
                            {/* <!-- End Widget Nav Menu --> */}
                        </div>
                        <div className="col-xl-3 col-sm-6">
                            {/* <!-- Widget Nav Menu --> */}
                            <div className="widget widget_nav_menu">
                                <h4 className="widget_title">Marketplace</h4>
                                <div className="footer-list-wrap">
                                    <ul>
                                        <li><a href="explore.html">All NFTs</a></li>
                                        <li><a href="explore.html">Trading Paint</a></li>
                                        <li><a href="explore.html">Art Painting</a></li>
                                        <li><a href="explore.html">Virtual Paints</a></li>
                                        <li><a href="explore.html">Collectibles</a></li>
                                    </ul>
                                </div>
                            </div>
                            {/* <!-- End Widget Nav Menu --> */}
                        </div>
                        <div className="col-xl-3 col-sm-6">

                        </div>
                        <div className="col-xl-4 col-sm-6">
                            {/* <!-- Widget About --> */}
                            <div className="widget text-center text-white widget_about">
                                <FooterLogoLight className='svg' />
                                <p>The anefty first large digital marketplace crypto collectibles & non fungible token buy
                                    sell & discover digital assets.</p>

                                {/* <!-- Socials --> */}
                                <div className="socials d-flex justify-content-center align-items-center">
                                    <a href="https://www.twitter.com/" target="_blank">
                                        <Twitter className='svg' />
                                    </a>
                                    <a href="https://www.instagram.com/" target="_blank">
                                        <Insta className='svg' />
                                    </a>
                                    <a href="https://www.pinterest.com/" target="_blank">
                                        <Pinterest className='svg' />
                                    </a>
                                    <a href="https://www.whatsapp.com/" target="_blank">
                                        <Whatsapp className='svg' />
                                    </a>
                                </div>
                                {/* <!-- End Socials --> */}
                            </div>
                            {/* <!-- End Widget About --> */}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;