import React, { useState, useContext, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { DataContext } from "../context/DataContext";
import { buyNft, payInstallment } from "../services/chain/apis/extrinsic";
import { Link } from "react-router-dom";
import { bnToNumber } from "../services/chain/apis/common";

const ItemDetail = () => {
    let { id } = useParams();
    const { nfts } = useContext(DataContext);
    const [thisNft, setThisNft] = useState(nfts.find(el => el[0] == id))
    useEffect(() => {
        setThisNft(nfts.find(el => el[0] == id))
    }, [])

    const handleBuy = async (nftId) => {
        await buyNft(nftId)
    }

    const handlePay = async (nftId, fullPrice) => {
        await payInstallment(nftId, parseInt(fullPrice) / 2)
    }

    return (
        <section className="pt-120 pb-120">
            <div className="container">
                <div className="row justify-content-between">
                    <div className="col-lg-6 order-1 order-lg-0">
                        {/* <!-- Item Details Content --> */}
                        <div className="item-details ov-hidden">
                            <h2 className="product-title">{thisNft && thisNft[1].title}</h2>

                            <p>Description</p>

                            <div className="row pt-1">
                                <div className="col-sm-6">
                                    {/* <!-- Price --> */}
                                    <div className="price mb-4 mb-sm-0">
                                        <h6>Item Price</h6>
                                        <h3 style={{ marginBottom: '20px' }}>{thisNft && bnToNumber(thisNft[1].price)}</h3>
                                    </div>
                                    {/* <!-- End Price --> */}
                                </div>
                            </div>

                            <div className="button-group style--two">
                                <button disabled={thisNft[1].price == 0} onClick={() => handleBuy(thisNft[0])} className="btn btn-border btn-sm"><img
                                    src="assets/img/icons/btn-buy-now-icon.svg" alt="" className="svg" /> Buy Now</button>
                                <button disabled={thisNft[1].price == 0} onClick={() => handlePay(thisNft[0], thisNft[1].price)} className="btn btn-sm"><img src="assets/img/icons/judge-icon.svg"
                                    alt="" className="svg" />Pay half now</button>
                            </div>

                            <div className="row mb-4 mt-40 pt-1">
                                <div className="col-sm-12">
                                    {/* <!-- Creator --> */}
                                    <Link to={`/profile/${thisNft[1].creator}`} className="hz-profile creator media mb-4 mb-sm-0">
                                        <div className="avatar">
                                            <img src="assets/img/media/creator-avatar.png" alt="" />
                                        </div>
                                        <div className="content media-body">
                                            <h6>Creator</h6>
                                            <h5>{thisNft[1].creator}</h5>
                                        </div>
                                    </Link>
                                    {/* <!-- End Creator --> */}
                                </div>
                                <div className="col-sm-12">
                                    {/* <!-- Owner --> */}
                                    <Link to={`/profile/${thisNft[1].owner}`} className="hz-profile owner media">
                                        <div className="avatar">
                                            <img src="assets/img/media/owner-avatar.png" alt="" />
                                        </div>
                                        <div className="content media-body">
                                            <h6>Owner</h6>
                                            <h5>{thisNft[1].owner}</h5>
                                        </div>
                                    </Link>
                                    {/* <!-- End Owner --> */}
                                </div>
                                <div className="col-sm-12">
                                    {/* <!-- Owner --> */}
                                    <a href="profile.html" className="hz-profile owner media">
                                        <div className="avatar">
                                            <img src="assets/img/media/owner-avatar.png" alt="" />
                                        </div>
                                        <div className="content media-body">
                                            <h6>NFTs ID</h6>
                                            <h5>{thisNft[0]}</h5>
                                        </div>
                                    </a>
                                    {/* <!-- End Owner --> */}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-5 col-lg-6 order-0 order-lg-1">
                        {/* <!-- Item Details IMG --> */}
                        <div className="item-details-img mb-5 mb-lg-0">
                            {/* nft pic */}
                            {
                                thisNft ?
                                    <img src={thisNft[1].media.replace("ipfs://", "https://ipfs.io/ipfs/").replace("#", "%23")} alt="" />
                                    :
                                    <></>
                            }
                        </div>
                        {/* <!-- End Item Details IMG --> */}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ItemDetail