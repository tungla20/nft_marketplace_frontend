import React, { useState, useEffect, useContext } from 'react';
import { ReactComponent as CopyIcon } from '../static/img/icons/copy-icon.svg';
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { DataContext } from "../context/DataContext";
const Collection = () => {
    let { id } = useParams();
    const { nfts, collections } = useContext(DataContext);
    const [thisCollection, setThisCollection] = useState([])
    const [thisNft, setThisNft] = useState([])

    useEffect(() => {
        let choosenCollection = collections.filter(el => el[0] == id)
        let nftInCollection = nfts.filter(el => el[1].collectionId && el[1].collectionId == id && el[1].installmentAccount == null)
        setThisCollection(choosenCollection)
        setThisNft(nftInCollection)
    }, [collections, nfts, id])
    
    return (
        <>
            {/* <!-- Author Profile --> */}
            <section className="pt-120 pb-120">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 mb-60 mb-lg-0">
                            <div className="row">
                                {
                                    thisNft.length > 0 && thisNft.map((el, index) => {
                                        let url = el[1].media.replace("ipfs://", "https://ipfs.io/ipfs/").replace("#", "%23")
                                        return (
                                            <div key={index} className="col-md-6">
                                                {/* <!-- Category --> */}
                                                <Link to={`/item-details/${el[0]}`} className="category-item mb-30">
                                                    <img src={url} alt="" />

                                                    <div className="content">
                                                        <img src={url} alt="" />
                                                        <h5>{el[1].title}</h5>
                                                    </div>
                                                </Link>
                                                {/* <!-- End Category --> */}
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                        <div className="col-lg-4">
                            {/* <!-- Author Sidebar --> */}
                            <div className="author-sidebar">
                                <div className="widget-profile widget card-45 mb-30">
                                    {/* <!-- Profile --> */}
                                    <div className="author-profile mt-0 text-center text-white d-inline-block pb-4">
                                        {/* <div className="user-avatar">
                                            <img src="assets/img/media/profile-avatar.png" alt="" />
                                        </div> */}

                                        <h5 className="user_name text-white">{thisCollection && thisCollection[0] && thisCollection[0][1].title}</h5>
                                    </div>
                                    {/* <!-- End Profile --> */}

                                    <div className="d-flex flex-wrap align-items-center justify-content-center">
                                        {/* <!-- Copy Clipboard --> */}
                                        <div className="copy-clipboard-wrap mr-10 mb-4">
                                            <input className="form-control" id="get-link" type="text"
                                                value={thisCollection && thisCollection[0] && thisCollection[0][0]} readOnly />

                                            {/* <!-- Copy Button --> */}
                                            <a href="#" id="copy-link-btn">
                                                <CopyIcon className='svg' />
                                            </a>
                                            {/* <!-- End Copy Button --> */}
                                        </div>
                                        {/* <!-- End Copy Clipboard --> */}
                                    </div>
                                </div>
                            </div>
                            {/* <!-- End Author Sidebar --> */}
                        </div>
                    </div>
                </div>
            </section>
            {/* <!-- End Author Profile --> */}

        </>
    )
}

export default Collection