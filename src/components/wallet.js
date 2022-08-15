import React, { useState, useEffect, useContext } from 'react';
import { Button, Layout, List, Typography } from "antd";
import { getMsaId, setupChainAndServiceProviders } from "../services/dsnpWrapper";
import { createAccountViaService, getBalance, getFreeUnit, getResrvedUnit } from "../services/chain/apis/extrinsic";
import * as wallet from "../services/wallets/wallet";
import { DataContext } from "../context/DataContext";
const { Content } = Layout;
const { Text, Title } = Typography;
const Wallet = () => {
    const { setAddress, getUser, updateUser } = useContext(DataContext)
    const [walletAccounts, setWalletAccounts] = useState([]);
    const [msaId, setMsaId] = useState(0n);
    const [serviceMsaId, setServiceMsaId] = useState(0n);
    const [walletAddress, setWalletAddress] = useState("");
    const [freeBalance, setFreeBalance] = useState(0);
    const [reservedBalance, setReservedBalance] = useState(0);

    const [chainConnectionClass, setChainConnectionClass] = useState(
        "Footer--chainConnectionState"
    )
    const walletType = wallet.WalletType.DOTJS
    const doConnectWallet = async () => {
        const w = wallet.wallet(walletType);
        const availableAccounts = await w.availableAccounts();
        setWalletAccounts(availableAccounts);
    }

    const connectWallet = () => {
        (async () => doConnectWallet())();
    }

    const getAndSetMsaId = async () => {
        let msa_id = await getMsaId(wallet.wallet(walletType));
        if (msa_id !== undefined) setMsaId(msa_id);
    }

    const doLogin = async (addr, name) => {
        await updateUser({_id: addr, name})
        await getUser(addr)
        await wallet.wallet(walletType).login(addr);
        // await getAndSetMsaId();
    }

    const login = async (addr, name) => {
        (async () => doLogin(addr, name))();
        setWalletAddress(addr);
        setAddress(addr)
        const { nonce, data: balance } = await getBalance(addr)
        let freeUnit = await getFreeUnit(balance)
        let reservedUnit = await getResrvedUnit(balance)
        localStorage.setItem('userAccount', JSON.stringify({
            username: name,
            address: addr,
            freeBalance: freeUnit,
            reservedBalance: reservedUnit
        }));
        setFreeBalance(freeUnit)
        setReservedBalance(reservedUnit)
    }

    const doLogout = async () => {
        wallet.wallet(walletType).logout();
    }
    const logout = () => {
        (async () => doLogout())();
        // setMsaId(0n);
        setWalletAddress("");
        localStorage.removeItem('userAccount')
        setFreeBalance(0)
        setReservedBalance(0)
    }

    const registerMsa = () => {
        (async () => {
            try {
                createAccountViaService(
                    async () => {
                        await getAndSetMsaId();
                    },
                    () => {
                        console.error("fail")
                    }
                )
            } catch (e) {
                console.error(e);
            }
        })();
    }

    useEffect(() => {
        (async () => {
            try {
                let serviceMsaId = await setupChainAndServiceProviders(walletType);
                setServiceMsaId(serviceMsaId);
                setChainConnectionClass("Footer--chainConnectionState connected");
            } catch (e) {
                console.error(e);
            }
        })();
    });

    return (
        <>
            {/* <!-- Create Collectible --> */}
            <section className="pt-120 pb-90">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            {/* <!-- Section Title --> */}
                            <div className="section-title text-center text-white">
                                {
                                    localStorage.getItem('userAccount') ? 
                                    <h2>Open wallet</h2>
                                    :
                                    <h2>Connect Wallet</h2>
                                }
                            </div>
                            {/* <!-- End Section Title --> */}
                        </div>
                    </div>
                    <div className="row">
                        <Content className="Content">
                            {walletAccounts.length > 0 &&
                                <List
                                    dataSource={walletAccounts}
                                    renderItem={(acct) => (
                                        <List.Item>
                                            <List.Item.Meta
                                                title={acct.name}
                                            />
                                            {walletAddress === acct.address &&
                                                <div className="WalletList--walletRow">
                                                    <Text>Logged in as </Text>
                                                    {msaId !== 0n &&
                                                        <Text>MSA Id: {msaId.toString()} </Text>
                                                    }
                                                    <Text strong className="Main--addressList--walletAddress">Address: {acct.address} </Text>
                                                    <Button type="primary" onClick={() => logout()}>logout</Button>
                                                </div>
                                            }
                                            {walletAddress === "" &&
                                                <div>
                                                    <Text>Address: </Text>
                                                    <Text strong className="Main--addressList--walletAddress">{acct.address}</Text>
                                                    <Button type="primary" onClick={() => login(acct.address, acct.name)}>Login with this
                                                        account</Button>
                                                </div>
                                            }
                                        </List.Item>
                                    )}
                                >
                                </List>
                            }
                            {walletAccounts.length === 0 &&
                                <Title level={3}>Wallet is not connected yet.</Title>
                            }
                            {
                                freeBalance ?
                                    <>
                                        <Text>Free Balance: {freeBalance}</Text><br />
                                        <Text>Reserved Balance: {reservedBalance}</Text><br />
                                    </>
                                    :
                                    <></>
                            }
                            {/* {walletAddress !== "" && msaId === 0n &&
                                <Button onClick={registerMsa}>Register MSA</Button>
                            } */}
                            {!walletAccounts.length &&
                                <Button onClick={connectWallet}>Connect Wallet</Button>}
                            {serviceMsaId !== 0n &&
                                <Text className={chainConnectionClass}>{"Service MSA ID: " + serviceMsaId.toString()}</Text>
                            }
                        </Content>
                    </div>
                </div>
            </section>
            {/* <!-- End Create Collectible --> */}
        </>
    )
}

export default Wallet