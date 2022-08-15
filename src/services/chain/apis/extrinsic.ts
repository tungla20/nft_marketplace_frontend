import {
    requireGetProviderApi,
    requireGetServiceKeys,
    requireGetServiceMsaId,
    requireGetSigner,
    requireGetWallet,
    getConfig,
    Config
} from "../../config";
import { DelegateData, DsnpCallback, DsnpErrorCallback, scaleEncodeDelegateData, } from "./common";
import { SignerPayloadRaw } from "@polkadot/types/types";
import { KeyringPair } from "@polkadot/keyring/types";
import { setupProviderApi } from "../index";
import { formatBalance } from '@polkadot/util';
import { web3FromAddress } from "@polkadot/extension-dapp";
import { dotWallet } from "../../wallets/dotWallet";
import { notification } from 'antd';
import { create } from 'ipfs-http-client'
import BN from 'bn.js';

import { getSiName } from '@polkadot/types/metadata/util';
import { unwrapStorageType } from '@polkadot/types/primitive/StorageKey';

/**
 * publishes a single announcement on chain
 *
 * @param announcement
 * @param schemaId of related announcement
 * @param callback to run on success
 * @param errorCallback to run on error
 */
// export const publishAnnouncement = async (
// import {u8, u64} from "@polkadot/types-codec";
//   announcement: unknown,
//   schemaId: number,
//   callback: DsnpCallback,
//   errorCallback: DsnpErrorCallback
// ): Promise<void> => {
//   const api = requireGetProviderApi();
//   const serviceKey = requireGetServiceKeys();
//   const publishExtrinsic = api.tx.announcements.publishAnnouncement(
//     schemaId,
//     announcement
//   );
//
//   publishExtrinsic
//     ?.signAndSend(serviceKey, ({ status, events }) => {
//       callback(status, events);
//     })
//     .catch((error: any) => {
//       errorCallback(error);
//     });
// };

/**
 * creates a new account using credentials key of a service account
 *
 * @param callback to run on success
 * @param errorCallback to run on error
 */
export const createAccountViaService = async (
    callback: DsnpCallback,
    errorCallback: DsnpErrorCallback
): Promise<void> => {
    const api = requireGetProviderApi();
    const serviceKey = requireGetServiceKeys();
    const signer = await requireGetSigner(); // this does the right thing, as documented
    const wallet = await requireGetWallet();
    const serviceMsaId = requireGetServiceMsaId();
    const data: DelegateData = {
        authorizedMsaId: serviceMsaId,
        permission: 0n,
    };

    const signRaw = signer?.signRaw;
    if (!signRaw) throw new Error("Error in signer");

    let walletAddress = wallet.getAddress();

    let encoded = scaleEncodeDelegateData(data);

    const result = await signRaw({
        address: walletAddress,
        data: encoded,
        type: "bytes",
    } as SignerPayloadRaw);

    const extrinsic = api.tx.msa.createSponsoredAccountWithDelegation(
        walletAddress,
        {
            Sr25519: result.signature,
        },
        data,
    );

    // nonce: -1 is needed in latest versions - see
    // https://substrate.stackexchange.com/questions/1776/how-to-use-polkadot-api-to-send-multiple-transactions-simultaneously
    extrinsic
        ?.signAndSend(serviceKey, { nonce: -1 },
            ({ status, events, }) => {
                if (status.isInBlock) {
                    console.log(`Completed at block hash #${status.asInBlock.toString()}`);
                } else {
                    console.log(`Current status: ${status.type}`);
                }
                callback(status, events);
            })
        .catch((error: any) => {
            errorCallback(error);
        });
};

export const createMsaForProvider = async (callback: DsnpCallback,
    errorCallback: DsnpErrorCallback
) => {
    const api = requireGetProviderApi();
    const serviceKeys: KeyringPair = requireGetServiceKeys();
    // instantiate the extrinsic object
    const extrinsic = api.tx.msa.create();
    await extrinsic
        ?.signAndSend(serviceKeys, { nonce: -1 },
            ({ status, events }) => {
                callback(status, events);
            })
        .catch((error: any) => {
            errorCallback(error);
        });
}

const curConfig: Config = getConfig();

export const getBalance = async (
    address: any
): Promise<any> => {
    const api = await setupProviderApi(curConfig);
    const result = await api.query.system.account(address);
    return result;
};

export const getFreeUnit = async (balance: any) => {
    const api = await setupProviderApi(curConfig);
    const chainDecimals = api.registry.chainDecimals[0];
    // formatBalance.setDefaults({ unit: 'DOT' });
    // const defaults = formatBalance.getDefaults();
    const free = formatBalance(balance.free, { forceUnit: 'true' }, chainDecimals);
    return free
}

export const getResrvedUnit = async (balance: any) => {
    const api = await setupProviderApi(curConfig);
    const chainDecimals = api.registry.chainDecimals[0];
    // formatBalance.setDefaults({ unit: 'DOT' });
    // const defaults = formatBalance.getDefaults();
    const reserved = formatBalance(balance.reserved, { forceUnit: 'zv' }, chainDecimals);
    return reserved
}
const ipfsApiUrl = 'https://ipfs.infura.io:5001/api/v0';
const ipfs = create({ url: ipfsApiUrl })

function ensureIpfsUriPrefix(cidOrURI: any) {
    let uri = cidOrURI.toString()
    if (!uri.startsWith('ipfs://')) {
        uri = 'ipfs://' + cidOrURI
    }
    // Avoid the Nyan Cat bug (https://github.com/ipfs/go-ipfs/pull/7930)
    if (uri.startsWith('ipfs://ipfs/')) {
        uri = uri.replace('ipfs://ipfs/', 'ipfs://')
    }
    return uri
}

function makeNFTMetadata(assetURI: any, name: any, description: any) {
    assetURI = ensureIpfsUriPrefix(assetURI)
    return {
        name,
        description,
        image: assetURI
    }
}

export const mintNFT = async (name: any, description: any, collection: any, price: any, royalty: any, content: any, basename: any) => {
    const api = await setupProviderApi(curConfig);
    const chainDecimals = api.registry.chainDecimals[0];
    const amountToSend = new BN(price).mul(new BN(10).pow(new BN(chainDecimals)));
    const address = dotWallet.getAddress()
    if (!address) {
        notification['error']({
            message: 'Error',
            description: 'Log in your wallet'
        });
    }
    const injector = await web3FromAddress(address);
    // origin: OriginFor<T>,
    // 		title: Vec<u8>,
    // 		description: Option<Vec<u8>>,
    // 		media: Vec<u8>,
    // 		media_hash: Vec<u8>,
    // 		installment_account: Option<T::AccountId>,
    // 		royalty: Option<Vec<(T::AccountId, u8)>>,
    // 		collection_id: [u8; 16],
    // 		price: BalanceOf<T>

    // const content = await fs.readFile(filename)
    // const basename = path.basename(filename)

    const ipfsPath = '/nft/' + basename
    const { cid: assetCid } = await ipfs.add({ path: ipfsPath, content }, {
        cidVersion: 1,
        hashAlg: 'sha2-256'
    })

    // make the NFT metadata JSON
    const assetURI = ensureIpfsUriPrefix(assetCid) + '/' + basename
    const metadata = makeNFTMetadata(assetURI, name, description)

    // add the metadata to IPFS
    const { cid: metadataCid } = await ipfs.add({ path: '/nft/metadata.json', content: JSON.stringify(metadata) }, {
        cidVersion: 1,
        hashAlg: 'sha2-256'
    })
    const metadataURI = ensureIpfsUriPrefix(metadataCid) + '/metadata.json'
    await api.tx.palletNFT
        .mintNft(
            name,
            description,
            metadata.image,
            null,
            royalty,
            collection,
            amountToSend
        )
        .signAndSend(address, { signer: injector.signer }, ({ events = [], status, dispatchError }) => {
            notification['info']({
                message: 'Transaction status:',
                description: status.type
            });
            if (status.isInBlock) {
                notification['info']({
                    message: 'Included at block hash:',
                    description: status.asInBlock.toHex()
                });

                events.forEach(({ event: { data, method, section }, phase }) => {
                    notification['info']({
                        message: 'Events:',
                        description: '\t' + `${phase.toString()}` + `: ${section}.${method}` + `${data.toString()}`
                    });
                });
            } else if (status.isFinalized) {
                notification['success']({
                    message: 'Finalized block hash:',
                    description: status.asFinalized.toHex()
                });
            }
        });
}

export const createCollection = async (title: any, description: any) => {
    const api = await setupProviderApi(curConfig);
    const address = dotWallet.getAddress()
    if (!address) {
        notification['error']({
            message: 'Error',
            description: 'Log in your wallet'
        });
    }
    const injector = await web3FromAddress(address);
    await api.tx.palletNFT
        .createCollection(
            title,
            description
        )
        .signAndSend(address, { signer: injector.signer }, ({ events = [], status, dispatchError }) => {
            notification['info']({
                message: 'Transaction status:',
                description: status.type
            });
            if (status.isInBlock) {
                notification['info']({
                    message: 'Included at block hash:',
                    description: status.asInBlock.toHex()
                });

                events.forEach(({ event: { data, method, section }, phase }) => {
                    notification['info']({
                        message: 'Events:',
                        description: '\t' + `${phase.toString()}` + `: ${section}.${method}` + `${data.toString()}`
                    });
                });
            } else if (status.isFinalized) {
                notification['success']({
                    message: 'Finalized block hash:',
                    description: status.asFinalized.toHex()
                });
            }
        });
}

export const convertToHash = (entry: any) =>
    `0x${entry[0].toJSON().slice(-64)}`;

export const getAllCollection = async () => {
    const api = await setupProviderApi(curConfig);
    let rs = await api.query.palletNFT.collectionById.entries().then((commentsMap) => {
        const c = commentsMap.reduce((acc, commentsEntry) => {
            return {
                ...acc,
                [`${commentsEntry[0].toHuman()}`]: commentsEntry[1].toHuman(),
            }
        }, {})
        return c
    })
    return Object.entries(rs)
}

export const getAllNFT = async () => {
    const api = await setupProviderApi(curConfig);
    let rs = await api.query.palletNFT.tokenById.entries().then((commentsMap) => {
        console.log(commentsMap);
        
        const c = commentsMap.reduce((acc, commentsEntry) => {
            return {
                ...acc,
                [`${commentsEntry[0].toHuman()}`]: commentsEntry[1].toHuman(),
            }
        }, {})
        return c
    })
    return Object.entries(rs)
}

export const getPendingOrderNFT = async () => {
    const api = await setupProviderApi(curConfig);
    let rs = await api.query.palletNFT.orderByTokenId.entries().then((commentsMap) => {
        const c = commentsMap.reduce((acc, commentsEntry) => {
            return {
                ...acc,
                [`${commentsEntry[0].toHuman()}`]: commentsEntry[1].toHuman(),
            }
        }, {})
        return c
    })
    return Object.entries(rs)
}

export const buyNft = async (nftId: any) => {
    const api = await setupProviderApi(curConfig);
    const address = dotWallet.getAddress()
    if (!address) {
        notification['error']({
            message: 'Error',
            description: 'Log in your wallet'
        });
    }
    const injector = await web3FromAddress(address);
    await api.tx.palletNFT.buyNft(nftId).signAndSend(address, { signer: injector.signer }, ({ events = [], status, dispatchError }) => {
        notification['info']({
            message: 'Transaction status:',
            description: status.type
        });
        if (status.isInBlock) {
            notification['info']({
                message: 'Included at block hash:',
                description: status.asInBlock.toHex()
            });

            events.forEach(({ event: { data: [error, info], method, section }, phase }) => {
                notification['info']({
                    message: 'Events:',
                    description: '\t' + `${phase.toString()}` + `: ${section}.${method}` + `${info.toString()}`
                });
            });
        } else if (dispatchError) {
            if (dispatchError.isModule) {
                // for module errors, we have the section indexed, lookup
                const decoded = api.registry.findMetaError(dispatchError.asModule);
                const { docs, name, section } = decoded;
                notification['error']({
                    message: 'Events:',
                    description: `${section}.${name}: ${docs.join(' ')}`
                });
            } else {
                notification['error']({
                    message: 'Events:',
                    description: dispatchError.toString()
                });
                // Other, CannotLookup, BadOrigin, no extra info
            }
        } else if (status.isFinalized) {
            notification['success']({
                message: 'Finalized block hash:',
                description: status.asFinalized.toHex()
            });
        }
    });
}

export const payInstallment = async (nftId: any, paid: any) => {
    const api = await setupProviderApi(curConfig);
    const chainDecimals = api.registry.chainDecimals[0];
    const amountToSend = new BN(paid).mul(new BN(10).pow(new BN(chainDecimals)));
    const address = dotWallet.getAddress()
    if (!address) {
        notification['error']({
            message: 'Error',
            description: 'Log in your wallet'
        });
    }
    const injector = await web3FromAddress(address);
    await api.tx.palletNFT.payInstallment(nftId, amountToSend).signAndSend(address, { signer: injector.signer }, ({ events = [], status, dispatchError }) => {
        notification['info']({
            message: 'Transaction status:',
            description: status.type
        });
        if (status.isInBlock) {
            notification['info']({
                message: 'Included at block hash:',
                description: status.asInBlock.toHex()
            });

            events.forEach(({ event: { data: [error, info], method, section }, phase }) => {
                notification['info']({
                    message: 'Events:',
                    description: '\t' + `${phase.toString()}` + `: ${section}.${method}` + `${info.toString()}`
                });
            });
        } else if (dispatchError) {
            if (dispatchError.isModule) {
                // for module errors, we have the section indexed, lookup
                const decoded = api.registry.findMetaError(dispatchError.asModule);
                const { docs, name, section } = decoded;
                notification['error']({
                    message: 'Events:',
                    description: `${section}.${name}: ${docs.join(' ')}`
                });
            } else {
                notification['error']({
                    message: 'Events:',
                    description: dispatchError.toString()
                });
                // Other, CannotLookup, BadOrigin, no extra info
            }
        } else if (status.isFinalized) {
            notification['success']({
                message: 'Finalized block hash:',
                description: status.asFinalized.toHex()
            });
        }
    });
}

export const setNftPrice = async (nftId: any, price: any) => {
    const api = await setupProviderApi(curConfig);
    const chainDecimals = api.registry.chainDecimals[0];
    const amountToSend = new BN(price).mul(new BN(10).pow(new BN(chainDecimals)));
    const address = dotWallet.getAddress()
    if (!address) {
        notification['error']({
            message: 'Error',
            description: 'Log in your wallet'
        });
    }
    
    const injector = await web3FromAddress(address);
    await api.tx.palletNFT.setNftPrice(nftId, amountToSend).signAndSend(address, { signer: injector.signer }, ({ events = [], status, dispatchError }) => {
        notification['info']({
            message: 'Transaction status:',
            description: status.type
        });
        if (status.isInBlock) {
            notification['info']({
                message: 'Included at block hash:',
                description: status.asInBlock.toHex()
            });

            events.forEach(({ event: { data: [error, info], method, section }, phase }) => {
                notification['info']({
                    message: 'Events:',
                    description: '\t' + `${phase.toString()}` + `: ${section}.${method}` + `${info.toString()}`
                });
            });
        } else if (dispatchError) {
            if (dispatchError.isModule) {
                // for module errors, we have the section indexed, lookup
                const decoded = api.registry.findMetaError(dispatchError.asModule);
                const { docs, name, section } = decoded;
                notification['error']({
                    message: 'Events:',
                    description: `${section}.${name}: ${docs.join(' ')}`
                });
            } else {
                notification['error']({
                    message: 'Events:',
                    description: dispatchError.toString()
                });
                // Other, CannotLookup, BadOrigin, no extra info
            }
        } else if (status.isFinalized) {
            notification['success']({
                message: 'Finalized block hash:',
                description: status.asFinalized.toHex()
            });
        }
    });
}

export const burnNft = async (nftId: any) => {
    const api = await setupProviderApi(curConfig);
    const address = dotWallet.getAddress()
    if (!address) {
        notification['error']({
            message: 'Error',
            description: 'Log in your wallet'
        });
    }
    
    const injector = await web3FromAddress(address);
    await api.tx.palletNFT.burnNft(nftId).signAndSend(address, { signer: injector.signer }, ({ events = [], status, dispatchError }) => {
        notification['info']({
            message: 'Transaction status:',
            description: status.type
        });
        if (status.isInBlock) {
            notification['info']({
                message: 'Included at block hash:',
                description: status.asInBlock.toHex()
            });

            events.forEach(({ event: { data: [error, info], method, section }, phase }) => {
                notification['info']({
                    message: 'Events:',
                    description: '\t' + `${phase.toString()}` + `: ${section}.${method}` + `${info.toString()}`
                });
            });
        } else if (dispatchError) {
            if (dispatchError.isModule) {
                // for module errors, we have the section indexed, lookup
                const decoded = api.registry.findMetaError(dispatchError.asModule);
                const { docs, name, section } = decoded;
                notification['error']({
                    message: 'Events:',
                    description: `${section}.${name}: ${docs.join(' ')}`
                });
            } else {
                notification['error']({
                    message: 'Events:',
                    description: dispatchError.toString()
                });
                // Other, CannotLookup, BadOrigin, no extra info
            }
        } else if (status.isFinalized) {
            notification['success']({
                message: 'Finalized block hash:',
                description: status.asFinalized.toHex()
            });
        }
    });
}