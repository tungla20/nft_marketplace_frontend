import React, { useEffect, useState, useContext } from 'react';
import { ReactComponent as Share } from '../static/img/icons/share-grey.svg';
import { ReactComponent as Facebook } from '../static/img/icons/facebook.svg';
import { ReactComponent as Twitter } from '../static/img/icons/twitter.svg';
import { ReactComponent as Instagram } from '../static/img/icons/instagram.svg';
import { ReactComponent as Linkedin } from '../static/img/icons/linkedin.svg';
import { ReactComponent as Search } from '../static/img/icons/search.svg';
import { ReactComponent as JudgeIcon } from '../static/img/icons/judge-icon.svg';
import { DataContext } from "../context/DataContext";
import { setNftPrice, payInstallment, burnNft } from "../services/chain/apis/extrinsic";
import { Link, useHistory, useParams } from "react-router-dom";
import { bnToNumber } from "../services/chain/apis/common";
import { Button, Input, notification } from 'antd';
import Timer from './Timer';
import AuthorArea from './author-area';
import EditProfile from './edit_profile';

const Profile = () => {
    const { id } = useParams();
    const history = useHistory()
    const { nfts, collections, pendingOrders, getUser, user } = useContext(DataContext);
    const [ownedNfts, setOwnedNfts] = useState([])
    const [createdNfts, setCreatedNfts] = useState([])
    const [pendingOrderNfts, setPendingOrderNfts] = useState([])
    const [active, setActive] = useState(1);
    const [address, setAddress] = useState();
    const [keyword, setKeyword] = useState('');
    const [price, setPrice] = useState('');
    const [isEditProfile, setIsEditProfile] = useState(false);
    const [thisUser, setThisUser] = useState(user)

    useEffect(() => {
        let userAccount = JSON.parse(localStorage.getItem('userAccount'))
        setAddress(userAccount.address)
        let thisAddress = userAccount.address
        if (id) {
            thisAddress = id
        }
        setOwnedNfts(nfts.filter(el =>
            el[1].owner && el[1].owner == thisAddress && (el[1].title.includes(keyword) || el[0].includes(keyword))
        ))
        setCreatedNfts(nfts.filter(el =>
            el[1].creator && el[1].creator == thisAddress && (el[1].title.includes(keyword) || el[0].includes(keyword))
        ))
    }, [nfts, collections, keyword, id])

    useEffect(() => {
        let userAccount = JSON.parse(localStorage.getItem('userAccount'))
        let thisAddress = userAccount.address
        if (id) {
            thisAddress = id
        }
        setPendingOrderNfts(pendingOrders.filter(el =>
            el[1].creator && el[1].creator == thisAddress && el[0].includes(keyword)
        ))
    }, [pendingOrders, keyword, id])

    useEffect(() => {
        if (localStorage.getItem('userAccount') == null) {
            history.push("/wallet")
        }
    }, [])

    useEffect(() => {
        if (id != address) {
            fetchData();
        }
        async function fetchData() {
            await getUser(id)
        }
    }, [id, address])

    const handleChange = (e) => {
        setKeyword(e.target.value)
    }

    const handleSetPrice = async (nftId) => {
        if (!price) {
            notification['error']({
                message: 'Price required',
            });
        }
        setNftPrice(nftId, price)
    }

    useEffect(() => {
        if (user) {
            setThisUser(user)
        }
    }, [user])

    return (
        <>
            {/* <!-- Author --> */}
            <AuthorArea id={id} address={address} setIsEditProfile={setIsEditProfile} isEditProfile={isEditProfile} />
            {/* <!-- End Author --> */}
            {
                id != address && thisUser && (thisUser.bio || thisUser.url || thisUser.email || thisUser.facebook || thisUser.twitter || thisUser.instagram) ?
                    <section className="pt-120">
                        <div className="container">
                            <div class="author-sidebar">
                                <div class="widget-bio widget card-45">
                                    <h3>Bio</h3>
                                    {
                                        thisUser && thisUser.bio ?
                                            <p>{thisUser && thisUser.bio}</p>
                                            :
                                            <></>
                                    }
                                    {
                                        thisUser.url || thisUser.email || thisUser.facebook || thisUser.twitter || thisUser.instagram ?
                                            <>
                                                <h3>Contact</h3>
                                                {
                                                    thisUser && thisUser.url ?
                                                        <p>Custom url: {thisUser && thisUser.url}</p>
                                                        :
                                                        <></>
                                                }
                                                {
                                                    thisUser && thisUser.email ?
                                                        <p>Email: {thisUser && thisUser.email}</p>
                                                        :
                                                        <></>
                                                }
                                                {
                                                    thisUser && thisUser.facebook ?
                                                        <p>Facebook: {thisUser && thisUser.facebook}</p>
                                                        :
                                                        <></>
                                                }
                                                {
                                                    thisUser && thisUser.twitter ?
                                                        <p>Twitter: {thisUser && thisUser.twitter}</p>
                                                        :
                                                        <></>
                                                }
                                                {
                                                    thisUser && thisUser.instagram ?
                                                        <p>Twitter: {thisUser && thisUser.instagram}</p>
                                                        :
                                                        <></>
                                                }
                                            </>
                                            :
                                            <></>
                                    }

                                </div>
                            </div>
                        </div>
                    </section>
                    :
                    <></>
            }

            {/* <!-- Profile --> */}
            {!isEditProfile ?
                <section className="pt-120 pb-120">
                    <div className="container">
                        <div className="row mb-50">
                            <div className="col-xl-9 order-1 order-xl-0">
                                {/* <!-- Tab Buttons --> */}
                                <ul className="nav tab-buttons justify-content-center justify-content-xl-start">
                                    <li>
                                        <button onClick={() => { setActive(1) }} className={` ${active == 1 ? "active" : ""} select-rounded text-uppercase lg`} data-bs-toggle="tab"
                                            data-bs-target="#collected">Owned <span>{ownedNfts.length}</span></button>
                                    </li>
                                    <li>
                                        <button onClick={() => { setActive(2) }} className={` ${active == 2 ? "active" : ""} select-rounded text-uppercase lg`} data-bs-toggle="tab"
                                            data-bs-target="#created">Created <span>{createdNfts.length}</span></button>
                                    </li>
                                    <li>
                                        <button onClick={() => { setActive(3) }} className={` ${active == 3 ? "active" : ""} select-rounded text-uppercase lg`} data-bs-toggle="tab"
                                            data-bs-target="#created">Pending orders <span>{pendingOrders.length}</span></button>
                                    </li>
                                </ul>
                                {/* <!-- End Tab Buttons --> */}
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
                        {
                            active == 1 ?
                                <div className="row">
                                    {
                                        ownedNfts && ownedNfts.length > 0 && ownedNfts.map((el, index) => {
                                            return (
                                                <div key={index} className="col-lg-4 col-md-6">
                                                    {/* <!-- Single Product --> */}
                                                    <div className="single-product mb-30">
                                                        <img src={el[1].media.replace("ipfs://", "https://ipfs.io/ipfs/").replace("#", "%23")} alt="" />
                                                        {/* <!-- Product Content --> */}
                                                        <div className="product-content">
                                                            <div className="product-top">
                                                                <Link to={`/item-details/${el[0]}`}>
                                                                    <h5>{el[1].title}</h5>
                                                                </Link>
                                                                <div className="d-flex justify-content-between">
                                                                    <h6>{bnToNumber(el[1].price)}</h6>
                                                                </div>
                                                            </div>

                                                            <div className="product-bottom">
                                                                {/* <!-- Button Group --> */}
                                                                <div className="button-group">
                                                                    <div className="dropdown mr-10">
                                                                        <button className="btn-circle btn-border dropdown-toggle"
                                                                            data-bs-toggle="dropdown">
                                                                            <Share className='svg' />
                                                                        </button>
                                                                        <ul className="dropdown-menu">
                                                                            <li><a className="dropdown-item" target="_blank" rel="noreferrer"
                                                                                href="https://www.facebook.com/"><Facebook /> Share on
                                                                                Facebook</a></li>
                                                                            <li><a className="dropdown-item" target="_blank" rel="noreferrer"
                                                                                href="https://www.twitter.com/"><Twitter /> Share on
                                                                                Twitter</a>
                                                                            </li>
                                                                            <li><a className="dropdown-item" target="_blank" rel="noreferrer"
                                                                                href="https://www.Instagram.com/"><Instagram /> Share on
                                                                                Instagram</a></li>
                                                                            <li><a className="dropdown-item" target="_blank" rel="noreferrer"
                                                                                href="https://www.linkedin.com/"><Linkedin /> Share on
                                                                                Linkedin</a></li>
                                                                        </ul>
                                                                    </div>
                                                                    {
                                                                        id != address ?
                                                                            <Link to={`/item-details/${el[0]}`} className="btn btn-border btn-sm">
                                                                                <JudgeIcon className='svg' />
                                                                                More Info
                                                                            </Link>
                                                                            :
                                                                            <div>
                                                                                <Input
                                                                                    className="form-control"
                                                                                    style={{
                                                                                        display: 'inline',
                                                                                        width: '100px',
                                                                                        marginRight: '5px',
                                                                                        padding: '0px 5px',
                                                                                        marginBottom: 'unset',
                                                                                        height: '40px'
                                                                                    }}
                                                                                    onChange={(e) => {
                                                                                        setPrice(e.target.value)
                                                                                    }} placeholder="Price " />
                                                                                <Button className="btn btn-border btn-sm" onClick={() => handleSetPrice(el[0])}>Set price</Button>
                                                                            </div>
                                                                    }
                                                                </div>
                                                                {/* <!-- End Button Group --> */}
                                                            </div>
                                                        </div>
                                                        {/* <!-- End Product Content --> */}
                                                    </div>
                                                    {/* <!-- End Single Product --> */}
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                : active == 2 ?
                                    <div className="row">
                                        {
                                            createdNfts && createdNfts.length > 0 && createdNfts.map((el, index) => {
                                                return (
                                                    <div key={index} className="col-lg-4 col-md-6">
                                                        {/* <!-- Single Product --> */}
                                                        <div className="single-product mb-30">
                                                            <img src={el[1].media.replace("ipfs://", "https://ipfs.io/ipfs/").replace("#", "%23")} alt="" />
                                                            {/* <!-- Product Content --> */}
                                                            <div className="product-content">
                                                                <div className="product-top">
                                                                    <Link to={`/item-details/${el[0]}`} className="btn btn-border btn-sm">
                                                                        <JudgeIcon className='svg' />
                                                                        <h5>{el[1].title}</h5>
                                                                    </Link>
                                                                    <div className="d-flex justify-content-between">
                                                                        <h6>{bnToNumber(el[1].price)}</h6>
                                                                    </div>
                                                                </div>

                                                                <div className="product-bottom">
                                                                    {/* <!-- Button Group --> */}
                                                                    <div className="button-group">
                                                                        <div className="dropdown mr-10">
                                                                            <button className="btn-circle btn-border dropdown-toggle"
                                                                                data-bs-toggle="dropdown">
                                                                                <Share className='svg' />
                                                                            </button>
                                                                            <ul className="dropdown-menu">
                                                                                <li><a className="dropdown-item" target="_blank" rel="noreferrer"
                                                                                    href="https://www.facebook.com/"><Facebook /> Share on
                                                                                    Facebook</a></li>
                                                                                <li><a className="dropdown-item" target="_blank" rel="noreferrer"
                                                                                    href="https://www.twitter.com/"><Twitter /> Share on
                                                                                    Twitter</a>
                                                                                </li>
                                                                                <li><a className="dropdown-item" target="_blank" rel="noreferrer"
                                                                                    href="https://www.Instagram.com/"><Instagram /> Share on
                                                                                    Instagram</a></li>
                                                                                <li><a className="dropdown-item" target="_blank" rel="noreferrer"
                                                                                    href="https://www.linkedin.com/"><Linkedin /> Share on
                                                                                    Linkedin</a></li>
                                                                            </ul>
                                                                        </div>

                                                                        {/* <Link to={`/item-details/${el[0]}`} className="btn btn-border btn-sm">
                                                                            <JudgeIcon className='svg' />
                                                                            More Info
                                                                        </Link> */}
                                                                        {
                                                                            el[1].creator == el[1].owner ?
                                                                                <Button className="btn btn-border btn-sm" onClick={() => burnNft(el[0])}>Burn NFT</Button>
                                                                                :
                                                                                <></>
                                                                        }
                                                                    </div>
                                                                    {/* <!-- End Button Group --> */}
                                                                </div>
                                                            </div>
                                                            {/* <!-- End Product Content --> */}
                                                        </div>
                                                        {/* <!-- End Single Product --> */}
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                    :
                                    <div className="row">
                                        {
                                            pendingOrderNfts && pendingOrderNfts.length > 0 && pendingOrderNfts.map((el, index) => {
                                                let rs = nfts.find(element => element[0] == el[0]);
                                                let date = new Date(parseInt(el[1].createdAt.replaceAll(',', '')));
                                                date.setDate(date.getDate() + 30);
                                                return (
                                                    <div key={index} className="col-lg-4 col-md-6">
                                                        {/* <!-- Single Product --> */}
                                                        <div className="single-product mb-30">
                                                            <img src={rs[1].media.replace("ipfs://", "https://ipfs.io/ipfs/").replace("#", "%23")} alt="" />
                                                            {/* <!-- Product Content --> */}
                                                            <div className="product-content">
                                                                <div className="product-top">
                                                                    <h5>{rs[1].title}</h5>
                                                                    <Timer expiryTimestamp={date} />
                                                                    <div className="d-flex justify-content-between">
                                                                        <h6>{bnToNumber(rs[1].price)}</h6>
                                                                    </div>
                                                                </div>

                                                                <div className="product-bottom">
                                                                    {/* <!-- Button Group --> */}
                                                                    <div className="button-group">
                                                                        <div className="dropdown mr-10">
                                                                            <button className="btn-circle btn-border dropdown-toggle"
                                                                                data-bs-toggle="dropdown">
                                                                                <Share className='svg' />
                                                                            </button>
                                                                            <ul className="dropdown-menu">
                                                                                <li><a className="dropdown-item" target="_blank" rel="noreferrer"
                                                                                    href="https://www.facebook.com/"><Facebook /> Share on
                                                                                    Facebook</a></li>
                                                                                <li><a className="dropdown-item" target="_blank" rel="noreferrer"
                                                                                    href="https://www.twitter.com/"><Twitter /> Share on
                                                                                    Twitter</a>
                                                                                </li>
                                                                                <li><a className="dropdown-item" target="_blank" rel="noreferrer"
                                                                                    href="https://www.Instagram.com/"><Instagram /> Share on
                                                                                    Instagram</a></li>
                                                                                <li><a className="dropdown-item" target="_blank" rel="noreferrer"
                                                                                    href="https://www.linkedin.com/"><Linkedin /> Share on
                                                                                    Linkedin</a></li>
                                                                            </ul>
                                                                        </div>
                                                                        {
                                                                            id != address ?
                                                                                <Link to={`/item-details/${rs[0]}`} className="btn btn-border btn-sm">
                                                                                    <JudgeIcon className='svg' />
                                                                                    More Info
                                                                                </Link>
                                                                                :
                                                                                <Button className="btn btn-border btn-sm" onClick={() => payInstallment(rs[0], parseInt(rs[1].price) / 2)}>Pay half left</Button>
                                                                        }
                                                                    </div>
                                                                    {/* <!-- End Button Group --> */}
                                                                </div>
                                                            </div>
                                                            {/* <!-- End Product Content --> */}
                                                        </div>
                                                        {/* <!-- End Single Product --> */}
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                        }
                    </div>
                </section>
                :
                <EditProfile address={address} />
            }
            {/* <!-- End Profile --></div> */}
        </>
    )
}

export default Profile