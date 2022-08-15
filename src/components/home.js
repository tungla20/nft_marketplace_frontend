import React, { useEffect, useState, useContext } from 'react';
import { ReactComponent as Discover } from '../static/img/icons/discover.svg';
import { ReactComponent as CreateIcon } from '../static/img/icons/create-icon.svg';
import { ReactComponent as Share } from '../static/img/icons/share.svg';
import { ReactComponent as Facebook } from '../static/img/icons/facebook.svg';
import { ReactComponent as Twitter } from '../static/img/icons/twitter.svg';
import { ReactComponent as Instagram } from '../static/img/icons/instagram.svg';
import { ReactComponent as Linkedin } from '../static/img/icons/linkedin.svg';
import { ReactComponent as JudgeIcon } from '../static/img/icons/judge-icon.svg';
import Background from '../static/img/bg/bg-design-shape.png';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { DataContext } from "../context/DataContext";
import { bnToNumber } from "../services/chain/apis/common";

import { Link } from "react-router-dom";

const Home = () => {
    const { nfts, collections } = useContext(DataContext);
    const [thisCollections, setThisCollections] = useState([])
    const [thisNfts, setThisNfts] = useState([])

    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        arrows: false,
        autoplay: true,
        autoplaySpeed: 3000
    };

    useEffect(() => {
        async function fetchCollections() {
            setThisCollections(collections.slice(0, 8))
            setThisNfts(nfts.filter(el => el[1].installmentAccount == null && parseInt(el[1].price) > 0).slice(0, 8))
        }
        fetchCollections()
    }, [nfts, collections])



    return (
        <>
            {/* <!-- Banner --> */}
            <div className="banner ov-hidden" style={{ background: `url(${Background})`, backgroundColor: "#f7f7f8" }}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6">
                            {/* <!-- Banner Content --> */}
                            <div className="banner-content mt-xl-5 pt-xl-2 mb-5 mb-lg-0">
                                <h1>Digital Collection & Sell on <span>NFTs</span> Marketplace</h1>
                            </div>
                            {/* <!-- End Banner Content --> */}
                        </div>
                        <div className="col-lg-6">
                            {/* <!-- Banner IMG --> */}
                            <div className="banner-img mb-60 mb-lg-0">
                                {/* // newest nft */}
                                <img src={thisNfts[0] && thisNfts[0][1].media.replace("ipfs://", "https://ipfs.io/ipfs/").replace("#", "%23")} alt="" />

                                <div className="banner-img-content">
                                    <h2>{thisNfts[0] && thisNfts[0][1].title}</h2>

                                    {/* <!-- Button Group --> */}
                                    <div className="button-group">
                                        <div className="dropdown mr-10">
                                            <button className="btn-circle dropdown-toggle" data-bs-toggle="dropdown">
                                                <Share className='svg' />
                                            </button>
                                            <ul className="dropdown-menu">
                                                <li><a className="dropdown-item" target="_blank"
                                                    href="https://www.facebook.com/"> <Facebook /> Share on Facebook</a>
                                                </li>
                                                <li><a className="dropdown-item" target="_blank"
                                                    href="https://www.twitter.com/"><Twitter /> Share on Twitter</a></li>
                                                <li><a className="dropdown-item" target="_blank"
                                                    href="https://www.Instagram.com/"><Instagram /> Share on Instagram</a>
                                                </li>
                                                <li><a className="dropdown-item" target="_blank"
                                                    href="https://www.linkedin.com/"><Linkedin /> Share on Linkedin</a>
                                                </li>
                                            </ul>
                                        </div>

                                        <Link to={`/item-details/${thisNfts[0] && thisNfts[0][0]}`} className="btn btn-sm">
                                            <img src="assets/img/icons/judge-icon.svg" alt="" className="svg" />
                                            Buy now
                                        </Link>
                                    </div>
                                    {/* <!-- End Button Group --> */}
                                </div>
                            </div>
                            {/* <!-- End Banner IMG --> */}
                        </div>
                    </div>
                </div>
            </div>
            {/* <!-- End Banner --> */}

            {/* <!-- Explore Feeds --> */}
            <section className="pt-120 pb-120" style={{ backgroundColor: "#f7f7f8" }}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-7">
                            {/* <!-- Section Title --> */}
                            <div className="section-title text-center">
                                <h2>Explore Feeds</h2>
                            </div>
                            {/* <!-- End Section Title --> */}
                        </div>
                    </div>
                </div>

                <Slider {...settings}>
                    {
                        thisNfts.length > 0 && thisNfts.map((el, index) => {
                            return (
                                <div key={index} className="single-product style--one">
                                    <img src={el[1].media.replace("ipfs://", "https://ipfs.io/ipfs/").replace("#", "%23")} alt="" />
                                    <div className="product-content">
                                        <div className="product-top">
                                            <h5>{el[1].title}</h5>
                                            <div className="d-flex justify-content-between">
                                                <h6>{bnToNumber(el[1].price)}</h6>
                                            </div>
                                        </div>

                                        <div className="product-bottom">
                                            <div className="button-group">
                                                <div className="dropdown mr-10">
                                                    <button className="btn-circle btn-border dropdown-toggle" data-bs-toggle="dropdown">
                                                        <Share className="svg" />
                                                    </button>
                                                    <ul className="dropdown-menu">
                                                        <li><a className="dropdown-item" target="_blank"
                                                            href="https://www.facebook.com/"><img
                                                                src="assets/img/icons/facebook.svg" alt="" /> Share on
                                                            Facebook</a></li>
                                                        <li><a className="dropdown-item" target="_blank"
                                                            href="https://www.twitter.com/"><img
                                                                src="assets/img/icons/twitter.svg" alt="" /> Share on Twitter</a>
                                                        </li>
                                                        <li><a className="dropdown-item" target="_blank"
                                                            href="https://www.Instagram.com/"><img
                                                                src="assets/img/icons/instagram.svg" alt="" /> Share on
                                                            Instagram</a></li>
                                                        <li><a className="dropdown-item" target="_blank"
                                                            href="https://www.linkedin.com/"><img
                                                                src="assets/img/icons/linkedin.svg" alt="" /> Share on
                                                            Linkedin</a></li>
                                                    </ul>
                                                </div>

                                                <Link to={`/item-details/${el[0]}`} className="btn btn-border btn-sm">
                                                    <JudgeIcon className='svg' />
                                                    More Info
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </Slider>

            </section>
            {/* <!-- End Explore Feeds --> */}

            {/* <!-- Top Collection --> */}
            <section className="pt-120 pb-90" style={{ backgroundColor: "#f7f7f8" }}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-7">
                            {/* <!-- Section Title --> */}
                            <div className="section-title text-center">
                                <h2>New Collections</h2>
                            </div>
                            {/* <!-- End Section Title --> */}
                        </div>
                    </div>
                    <div className="row">
                        {/* 4x3 collectibles */}
                        {
                            thisCollections && thisCollections.map((el, index) => {
                                return (
                                    <div key={index} className="col-xl-3 col-lg-4 col-sm-6">
                                        {/* <!-- Collection --> */}
                                        <Link to={`/collection/${el[0]}`} className="single-collection">
                                            <div className="collection-img">
                                                <img src="assets/img/collections/collection1.png" alt="" />
                                            </div>
                                            <div className="content">
                                                <h5>{el[1].title}</h5>
                                            </div>
                                        </Link>
                                        {/* <!-- End Collection --> */}
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </section>
            {/* <!-- End Top Collection --> */}
        </>
    )
}

export default Home;