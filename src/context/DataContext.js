import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAllCollection, getAllNFT, getPendingOrderNFT } from "../services/chain/apis/extrinsic";

export const DataContext = React.createContext();

const callApi = async (url, method, data, success) => {
  return axios({
    url: `http://localhost:4000/${url}`,
    method: method,
    data: data,
    headers: { 'Access-Control-Allow-Origin': "http://127.0.0.1:4000", "Content-Type": "multipart/form-data" },
  })
    .then(function (res) {
      if (success) {
        success(res)
      }
    })
    .catch(function (err) {
      console.log(err)
    });
};

const getApi = async (url, method, data, success) => {
  return axios({
    url: `http://localhost:4000/${url}`,
    method: method,
    params: data,
  })
    .then(function (res) {
      if (success) {
        success(res)
      }
    })
    .catch(function (err) {
      console.log(err)
    });
};

export const DataProvider = ({ children }) => {
  const [collections, setCollections] = useState([])
  const [nfts, setNfts] = useState([])
  const [pendingOrders, setPendingOrders] = useState([])
  const [address, setAddress] = useState()
  const [user, setUser] = useState({
    // _id: 
    // name: ,
    // url: ,
    // email: ,
    // bio: ,
    // facebookUrl: ,
    // twitterUrl: ,
    // instagramUrl: ,
    // avatar: ,
    // banner: ,
  })
  const [otherUser, setOtherUser] = useState({})

  useEffect(() => {
    async function fetchCollections() {
      let collections = await getAllCollection()
      setCollections(collections)
      let nfts = await getAllNFT()
      setNfts(nfts)
      let pendingOrder = await getPendingOrderNFT()
      setPendingOrders(pendingOrder)
    }
    fetchCollections()
  }, [])

  const updateUser = async (data) => {
    await callApi("api/updateUser", "POST", data, function (res) {
      console.log(res);
    });
  }

  const getUser = async (data) => {
    await getApi("api/getUser", "GET", { id: data }, function (res) {
      setUser(res.data.data)
    });
  }

  const getOtherUser = async (data) => {
    await getApi("api/getUser", "GET", { id: data }, function (res) {
      setOtherUser(res.data.data)
    });
  }

  return (
    <DataContext.Provider
      value={{
        collections,
        setCollections,
        nfts,
        setNfts,
        pendingOrders,
        setPendingOrders,
        setAddress,
        address,
        getUser,
        user,
        updateUser,
        getOtherUser,
        otherUser
      }}
    >
      {children}
    </DataContext.Provider>
  );
}