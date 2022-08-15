import React, { useEffect, useState, useContext } from 'react';
import { ReactComponent as Logo } from '../../static/img/logo.svg';
import { ReactComponent as StickyLogo } from '../../static/img/sticky-logo.svg';
import { ReactComponent as Search } from '../../static/img/icons/search.svg';
import { ReactComponent as User } from '../../static/img/icons/person-circle.svg';
import { NavLink, Link } from "react-router-dom";
import { DataContext } from "../../context/DataContext";

// explore, create, wallet, profile
const Header = () => {
    const { address } = useContext(DataContext)
    const [thisAddress, setThisAddress] = useState()
    useEffect(() => {
        setThisAddress(address)
    }, [address])
    return (
        <header className="header">
            {/* <!-- Header Main --> */}
            <div className="header-main style--three love-sticky">
                <div className="container">
                    <div className="header-inner position-relative px-0 mt-0 bg-transparent">
                        <div className="row align-items-center">
                            <div className="col-lg-4 col-md-6 col-sm-9 col-6">
                                <div className="d-flex align-items-center">
                                    <div className="logo">
                                        <Link to="/">
                                            <Logo className='main-logo' />
                                            <StickyLogo className='sticky-logo' />
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <div
                                className="col-lg-8 col-md-6 col-sm-3 col-6 d-flex align-items-center justify-content-end position-static">
                                <div className="nav-wrapper d-flex align-items-center">
                                    <div className="nav-wrap-inner">
                                        <ul className="nav">
                                            <li>
                                                <NavLink
                                                    to="/explore"
                                                    style={isActive => ({
                                                        color: isActive ? "#ff0076" : ""
                                                    })}
                                                >
                                                    Explore
                                                </NavLink>
                                            </li>
                                            <li>
                                                <NavLink
                                                    to="/create"
                                                    style={isActive => ({
                                                        color: isActive ? "#ff0076" : ""
                                                    })}
                                                >
                                                    Create
                                                </NavLink>
                                            </li>
                                            <li>
                                                <NavLink
                                                    to="/wallet"
                                                    style={isActive => ({
                                                        color: isActive ? "#ff0076" : ""
                                                    })}
                                                >
                                                    Wallet
                                                </NavLink>
                                            </li>
                                            <li>
                                                <NavLink
                                                    to={`/profile/${thisAddress}`}
                                                    style={isActive => ({
                                                        color: isActive ? "#ff0076" : ""
                                                    })}
                                                >
                                                    <User />
                                                </NavLink>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <!-- End Header Main --> */}
        </header>
    )
}

export default Header;