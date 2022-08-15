import React, { useState, useEffect, useContext } from 'react';
import { ReactComponent as Share } from '../static/img/icons/share.svg';
import { ReactComponent as Facebook } from '../static/img/icons/facebook.svg';
import { ReactComponent as Twitter } from '../static/img/icons/twitter.svg';
import { ReactComponent as Instagram } from '../static/img/icons/instagram.svg';
import { ReactComponent as Linkedin } from '../static/img/icons/linkedin.svg';
import { ReactComponent as JudgeIcon } from '../static/img/icons/judge-icon.svg';
import { ReactComponent as Search } from '../static/img/icons/search.svg';
import { DataContext } from "../context/DataContext";
import { Link } from "react-router-dom";
import { Select } from 'antd';
import { bnToNumber } from "../services/chain/apis/common";

const Explore = () => {
    const { nfts, collections } = useContext(DataContext);
    const [thisNfts, setThisNfts] = useState([])
    const [thisCollections, setThisCollections] = useState([])
    const [keyword, setKeyword] = useState('');
    const [selectedCollection, setThisSelectedCollection] = useState('')

    useEffect(() => {
        setThisNfts(nfts.filter(el => el[1].installmentAccount == null && parseInt(el[1].price) > 0 && (el[1].title.includes(keyword) || el[0].includes(keyword))))
    }, [nfts, keyword])

    useEffect(() => {
        if (selectedCollection) {
            setThisNfts(nfts.filter(el => el[1].collectionId == selectedCollection && parseInt(el[1].price) > 0 && el[1].installmentAccount == null))
        } else {
            setThisNfts(nfts.filter(el => el[1].installmentAccount == null && parseInt(el[1].price) > 0))
        }
    }, [selectedCollection, nfts])

    useEffect(() => {
        setThisCollections(collections)
    }, [collections])

    const handleChange = (e) => {
        setKeyword(e.target.value)
    }

    const handleSelect = (value) => {
        setThisSelectedCollection(value)
    }

    return (
        <>
            {/* <!-- Explore --> */}
            <section className="pt-120 pb-120">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-9 order-1 order-xl-0">
                            <Select id="collection"  onChange={handleSelect} placeholder={"Select collection"} className="form-control">
                                <Select.Option key={-1} value={null}>{'All'}</Select.Option>
                                {
                                    thisCollections && thisCollections.map((value, index) => {
                                        return (
                                            <Select.Option key={index} value={value[0]}>{value[1].title}</Select.Option>
                                        )
                                    })
                                }
                            </Select>
                        </div>
                        <div className="col-xl-3 order-0 order-xl-1 mb-4 mb-xl-0">
                            {/* <!-- Search Form --> */}
                            <form className="search-form style--two">
                                <div className="form-group ms-auto me-auto me-xl-0 mw-100">
                                    <input type="text" className="form-control mb-0" placeholder="Search item…" onChange={handleChange} />
                                    <button type="submit">
                                        <Search className='svg' />
                                    </button>
                                </div>
                            </form>
                            {/* <!-- End Search Form --> */}
                        </div>
                    </div>
                    <div className="row">
                        {
                            thisNfts.length > 0 && thisNfts.map((el, index) => (
                                <div key={index} className="col-lg-4 col-md-6">
                                    {/* <!-- Single Product --> */}
                                    <div className="single-product mb-30">
                                        <img src={el[1].media.replace("ipfs://", "https://ipfs.io/ipfs/").replace("#", "%23")} alt="" />

                                        {/* <!-- Product Content --> */}
                                        <div className="product-content">
                                            <div className="product-top">
                                                <h5>{el[1].title}</h5>
                                                <div className="d-flex justify-content-between">
                                                    <h6>{bnToNumber(el[1].price)}</h6>
                                                </div>
                                            </div>

                                            <div className="product-bottom">
                                                {/* <!-- Button Group --> */}
                                                <div className="button-group">
                                                    <div className="dropdown mr-10">
                                                        <button className="btn-circle btn-border dropdown-toggle" data-bs-toggle="dropdown">
                                                            <Share className='svg' />
                                                        </button>
                                                        <ul className="dropdown-menu">
                                                            <li><a className="dropdown-item" target="_blank"
                                                                href="https://www.facebook.com/">
                                                                <Facebook /> Share on
                                                                Facebook</a></li>
                                                            <li><a className="dropdown-item" target="_blank"
                                                                href="https://www.twitter.com/"><Twitter /> Share on Twitter</a>
                                                            </li>
                                                            <li><a className="dropdown-item" target="_blank"
                                                                href="https://www.Instagram.com/"><Instagram /> Share on
                                                                Instagram</a></li>
                                                            <li><a className="dropdown-item" target="_blank"
                                                                href="https://www.linkedin.com/"><Linkedin /> Share on
                                                                Linkedin</a></li>
                                                        </ul>
                                                    </div>

                                                    <Link to={`/item-details/${el[0]}`} className="btn btn-border btn-sm">
                                                        <JudgeIcon className='svg' />
                                                        Buy
                                                    </Link>
                                                </div>
                                                {/* <!-- End Button Group --> */}
                                            </div>
                                        </div>
                                        {/* <!-- End Product Content --> */}
                                    </div>
                                    {/* <!-- End Single Product --> */}
                                </div>
                            ))
                        }
                    </div>
                </div>
            </section>
            {/* <!-- End Explore --> */}
        </>
    )
}

export default Explore;