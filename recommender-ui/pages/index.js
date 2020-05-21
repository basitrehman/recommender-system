
import React, { useState } from 'react';
import GlobalCSS from '../components/GlobalCSS';
import Header from '../components/Header';
import Login from '../components/Login';
import Signin from '../components/Signin';

const Index = () => {
    const [showLogin, setShowLogin] = useState(false);

    let login = "nav-link active"
    let signin = "nav-link login-signin"
    if(!showLogin){
        login = "nav-link login-signin"
        signin = "nav-link active"
    }

    return (
        <div id="index">
            <Header />

            <center>
                <h1>Wiki-Recommender</h1>
            </center>
            <br />

            <div className="container">
                <div className="row">
                    <div>
                        <ul className="nav nav-tabs">
                            <li className="nav-item">
                                <button className={login} data-toggle="tab" onClick={() => setShowLogin(true)}>Login</button>
                            </li>
                            <li className="nav-item">
                                <button className={signin} data-toggle="tab" onClick={() => setShowLogin(false)}>Signin</button>
                            </li>
                        </ul>
                    </div>
                    <div id="tab-content">
                        {!showLogin && <Signin />}
                        {showLogin && <Login />}
                    </div>
                </div>
            </div>

            {/* Global CSS styles */}
            <style jsx global>{`
                html {
                    background: linear-gradient(90deg, rgba(134, 57, 75,1) 0%,  rgba(50, 7, 16,1) 100%);
                }
            `}</style>

            {/* Local CSS styles */}
            <style jsx>{`

                .login-signin {
                    border-bottom: 1px rgb(222, 226, 230) solid;
                    border-color: #495057;
                }

                #tab-content {
                    background-color: white;
                    border: 0px rgb(222, 226, 230) solid;
                    padding-top: 25px;
                    border-radius: 0px 5px 5px 5px;
                    -moz-border-radius: 0px 5px 5px 5px;
                    -webkit-border-radius: 0px 5px 5px 5px;
                    border: 1px solid #EFEBEB;
                    border-top: 0px;
                    width: 300px;
                }
                
                h1 {
                    color: #EA8C55;
                    font: 400% Arial;
                    font-weight: bold;
                    padding-top: 50px;
                }

                #index {
                    background: linear-gradient(90deg, rgba(134, 57, 75,1) 0%,  rgba(50, 7, 16,1) 100%);
                }

                .nav-item {
                    height: -webkit-fill-available;
                }

                .container {
                    color:grey;
                    padding-bottom: 30px;
                    margin-left: auto;
                    margin-right: auto;
                }

                .row { 
                    width: 300px;
                    height: fit-content;
                    line-height:normal;
                    font-size: 16px;
                    font-weight: bold;

                    margin-left: auto;
                    margin-right: auto;
                }

                @media (max-width: 700px) {
                    h1 {
                        font: 300% Arial;
                    }
                }
                
                @media (max-width: 500px) {
                    h1 {
                        font: 200% Arial;
                    }
                }
                
            `}</style>

            {/* Global CSS styles */}
            <GlobalCSS />
        </div>
    );
}

export default Index;