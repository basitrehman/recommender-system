import React, { useState } from 'react';
import Router from 'next/router';
import fetch from 'isomorphic-unfetch';
import configData from '../config/configData';
import { toast, ToastContainer } from 'react-nextjs-toast';

const Index = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    async function handleSubmit(){
        try {
            const body = {
                'email': email,
                'pw': password
            }
            const res = await fetch(configData.server + ':' + configData.port + '/v1/login/', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            })
            const data = await res.json()
            if(data.result != undefined){
                Router.push({
                    pathname: '/home',
                    query: { userId: data.result[0].id }
                })
            } else {
                toast.notify('Failed to log in!', {
                    duration: 5,
                    type: "error"
                })
            }
        } catch (err) {
            toast.notify('POST-Request failed!', {
                duration: 5,
                type: "error"
            })
        }
    }

    return (
        <>
            <ToastContainer />

            <div className="form-group">
                <label htmlFor="email">Email address:</label>
                <input type="email" className="form-control" id="email" onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
                <label htmlFor="pwd">Password:</label>
                <input type="password" className="form-control" id="pwd" onChange={e => setPassword(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary" onClick={handleSubmit}>Submit</button>

            {/* Local CSS styles */}
            <style jsx>{`

                .form-group{
                    margin-left: 10px;
                    margin-right: 10px;
                    background: white;
                }

                button {
                    margin-left: 10px;
                    margin-right: 10px;
                    margin-bottom: 10px;
                }

            `}</style>
        </>
    );
}

export default Index;