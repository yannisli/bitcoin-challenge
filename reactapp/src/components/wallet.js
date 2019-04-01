import React, {Component} from 'react';

import {connect} from 'react-redux';

import {Link, Redirect, withRouter} from 'react-router-dom';

import bitcoin from 'bitcoinjs-lib';

import NavBar from './navbar';

import './styles/wallet.css';

import loading from '../loading.svg';

import Transactions from './transactions';

import crypto from 'crypto';
import eccrypto from 'eccrypto';

class Wallet extends Component
{
    constructor(props)
    {
        super(props);
        this.showSendingModal = this.showSendingModal.bind(this);
        this.hideSendingModal = this.hideSendingModal.bind(this);
        this.trySendPayment = this.trySendPayment.bind(this);
    }
    trySendPayment()
    {
        // Validate
        let amount = document.getElementById("walletamount").value;
        if(typeof(amount) === "string")
            amount = parseInt(amount, 10);
        if(amount <= 0)
        {
            this.props.dispatch({type: "WALLET_ERROR", data: "Must provide valid amount"});
            return;
        }
        let to = document.getElementById("walletto").value;
        if(to.length === 0)
        {
            this.props.dispatch({type: "WALLET_ERROR", data: "Must provide valid address"});
            return;
        }

        if(amount > this.props.Data.balance)
        {
            this.props.dispatch({type: "WALLET_ERROR", data: "Insufficient Funds"});
            return;
        }
        // Send this to Blockcypher...
        let newtx = {
            inputs: [{addresses: [this.props.ECPair.Address]}],
            outputs: [{addresses: [to], value: amount}]
        };

        // POST now
        fetch('https://api.blockcypher.com/v1/btc/test3/txs/new', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(newtx)
        }).then(res => {

            if(!res.ok)
            {
                console.log("Response was not okay");
                console.log(res);
                res.text().then(body => this.props.dispatch({type: "ERROR_RESPONSE", data: `Received server response code ${res.status}\n${body}`})).catch(err => console.log(err));
                
            }
            else
            {
                res.json().then(json => {
                    console.log("JSON done", json);
                    let tmptx = Object.assign({}, json);

                    tmptx.pubkeys = [];
                    tmptx.signatures = [];
                    let counter = 0;
                    for(let n in tmptx.tosign) 
                    {
                        let tosign = tmptx.tosign[n];
                        tmptx.pubkeys.push(this.props.ECPair.KP.publicKey.toString("hex"));
                        let buf = Buffer.from(tosign, "hex");

                        let msg = crypto.createHash("sha256").update(buf).digest();
                        eccrypto.sign(this.props.ECPair.KP.privateKey, buf).then(sig => {
                            console.log("Sig in DER:", sig.toString('hex'));
                            tmptx.signatures[n] = sig.toString('hex');
                            eccrypto.verify(this.props.ECPair.KP.publicKey, buf, sig).then(() => console.log("OK")).catch(() => console.log("nope"));
                            counter++;
                            if(counter === tmptx.tosign.length)
                            {
                                // Then send fetch??
                                console.log("Can fetch now");
                                // Another request
                                fetch('https://api.blockcypher.com/v1/btc/test3/txs/send', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify(tmptx)
                                }).then(res => {
                                    if(res.ok)
                                    {
                                        console.log("Ok?!!!");
                                        this.fetchAddressData();
                                    }
                                    else
                                    {
                                        console.log("Not ok...");
                                        console.log(res);
                                        this.props.dispatch({type: "ERROR_RESPONSE", data: `Received server response code ${res.status}`});
                                    }
                                }).catch(err => console.log(err));
                            }
                        });
                    }
                    

                    


                }).catch(err => console.log(err));
            }

        }).catch(err => {
            console.log(err);
            this.props.dispatch({type: "ERROR_RESPONSE", data: err});
        })
    }
    showSendingModal()
    {
        this.props.dispatch({type: "WALLET_SHOW_SENDING"});
    }
    hideSendingModal()
    {
        this.props.dispatch({type: "WALLET_HIDE_SENDING"});
    }
    fetchAddressData(ecpair)
    {
        if((!this.props.ECPair || !this.props.ECPair.KP) && !ecpair)
            return;
        let ec = ecpair ? ecpair : this.props.ECPair.KP;
        const addr = bitcoin.payments.p2pkh({ pubkey: ec.publicKey, network: bitcoin.networks.testnet});
        this.props.dispatch({type: "WALLET_FETCHING_DATA"});
        // Fetch from Blockcypher now
        console.log(addr.address);

        fetch(`https://api.blockcypher.com/v1/btc/test3/addrs/${addr.address}/full`,
        {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        }).then(res => {
            if(!res.ok)
            {
                console.log("Not good response");
                this.props.dispatch({type: "ERROR_RESPONSE", data: `Received response code ${res.status} from server`});
                this.props.dispatch({type: "WALLET_FETCHED_DATA"});
            }
            else
            {
                res.json().then(json => {
                    console.log(json);
                    this.props.dispatch({type: "WALLET_FETCHED_DATA", data: json});
                }).catch(err => console.log(err));
            }
        }).catch(err => {
            console.log(err);
            this.props.dispatch({type: "ERROR_RESPONSE", data: err});
            this.props.dispatch({type: "WALLET_FETCHED_DATA"});
        })
    }
    render()
    {
        let exists = false;
        for(let i = 0 ; i < this.props.Addrs.length; i++)
        {
            if(this.props.Addrs[i].wif === this.props.match.params.walletId)
            {
                exists = i;
                break;
            }
        }
        if(exists === false)
        {
            return <Redirect to="/"/>
        }
        let walletRoot = document.getElementById("walletroot");
        if(walletRoot !== null)
            if(this.props.Display)
                walletRoot.style.filter = 'blur(5px)';
            else
                walletRoot.style.filter = 'none';

        let toRender = [];
        toRender.push(<div key="walletroot" id="walletroot" className="wallet-root">
            <NavBar/>
            <div className="wallet-container">
                <div className="wallet-row">
                    <Link to="/dashboard" style={{width: '45%', alignSelf: 'flex-start', textDecoration: 'none'}}>
                        <div className="error-button" style={{'padding': '5px'}}>
                            Back to Dashboard
                        </div>
                    </Link>
                    <div className="wallet-button" onClick={this.showSendingModal}>
                        Send Payment
                    </div>
                </div>
                {this.props.ECPair && this.props.ECPair.Nick !== "" && 
                    <div className="wallet-header">
                        "{this.props.ECPair.Nick}"
                    </div>
                }
                {this.props.ECPair &&
                    <div>
                        Public Key
                        <div className="wallet-subheader">
                            "{this.props.ECPair.Address}"
                        </div>
                    </div>
                }
                <div>
                    WIF
                    <div className="wallet-subheader">
                        "{this.props.Addrs[exists].wif}"
                    </div>
                </div>
                {this.props.Loading &&
                    <img src={loading} alt="Loading..." className="login-loading" />
                }
                
                {!this.props.Loading && this.props.Loaded && this.props.Data &&
                    <div className="wallet-row">
                        <div className="wallet-row-body">
                            <div className="wallet-row-header">
                                Balance (sat)
                            </div>
                            <div className="wallet-row-content">
                                Current: {this.props.Data.balance}
                            </div>
                            <div className="wallet-row-content">
                                Unconfirmed: {this.props.Data.unconfirmed_balance}
                            </div>
                            <div className="wallet-row-content">
                                Total: {this.props.Data.final_balance}
                            </div>
                        </div>
                        <div className="wallet-row-body">
                            <div className="wallet-row-header">
                                Transactions
                            </div>
                            <div className="wallet-row-content">
                                Confirmed: {this.props.Data.n_tx}
                            </div>
                            <div className="wallet-row-content">
                                Pending: {this.props.Data.unconfirmed_n_tx}
                            </div>
                            <div className="wallet-row-content">
                                Total: {this.props.Data.final_n_tx}
                            </div>
                        </div>
                        {/*<div className="wallet-row-body">
                            <div className="wallet-row-header">
                                In/Out
                            </div>
                            <div className="wallet-row-content">
                                Received: {this.props.Data.total_received}
                            </div>
                            <div className="wallet-row-content">
                                Sent: {this.props.Data.total_sent}
                            </div>
                </div>*/}
                    </div>
                }
                {!this.props.Loading && this.props.Loaded && <Transactions AddressData={this.props.Data}/>}
            </div>
           
        </div>);
        
        if(this.props.Display) 
            toRender.push(<div key="walletmodal" className="wallet-modal">
                <div className="wallet-modal-container">
                    <div className="wallet-modal-header" style={this.props.Error ? {color: "#F04747"} : {}}>
                        {this.props.Error ? this.props.Error : "Sending payment..."}
                    </div>
                    <div className="wallet-modal-field">
                        AMOUNT
                    </div>
                    <textarea id="walletamount" className="wallet-modal-textarea"/>
                    <div className="wallet-modal-field">
                        TO
                    </div>
                    <textarea id="walletto" className="wallet-modal-textarea"/>
                    <div className="wallet-modal-button" onClick={this.trySendPayment}>
                        Confirm
                    </div>
                    <div className="wallet-modal-cancel" onClick={this.hideSendingModal}>
                        Cancel
                    </div>
                </div>
            </div>);
            
        return toRender;
    }
    componentDidMount()
    {
        if(this.props.ECPair && this.props.ECPair.Address === this.props.match.params.walletId)
            return;
        let exists = false;
        for(let i in this.props.Addrs)
        {
            if(this.props.Addrs[i].wif === this.props.match.params.walletId)
            {
                exists = i;
                break;
            }
        }
        // Fetch data from Blockcypher if we don't have data!
        if(exists)
        {
            // From WIF
            let ecpair = new bitcoin.ECPair.fromWIF(this.props.Addrs[exists].wif, bitcoin.networks.testnet);
            console.log(ecpair);
            const addr = bitcoin.payments.p2pkh({ pubkey: ecpair.publicKey, network: bitcoin.networks.testnet});
            this.props.dispatch({type: "WALLET_SET_ECPAIR", data: {KP: ecpair, Address: addr.address, Nick: this.props.Addrs[exists].nick}});

            this.fetchAddressData(ecpair);
        }
    }
}

export default withRouter(connect(state => {
    console.log(state);
    return {
        Addrs: state.dashboard.addresses,
        Loading: state.wallet.loading,
        Loaded: state.wallet.loaded,
        Data: state.wallet.data,
        ECPair: state.wallet.ecpair,
        Display: state.wallet.display,
        Error: state.wallet.error
    }
})(Wallet));