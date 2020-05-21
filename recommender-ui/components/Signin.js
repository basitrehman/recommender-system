import React, { useState } from 'react'
import fetch from 'isomorphic-unfetch'
import configData from '../config/configData';
import { toast, ToastContainer } from 'react-nextjs-toast';

const Signin = () => {
    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    async function handleSubmit(){
        try {
            const body = {
                'name': firstname,
                'surname': lastname,
                'email': email,
                'pw': password
            }
            const res = await fetch(configData.server + ':' + configData.port + '/v1/signin/', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            })
            const data = await res.json()
            if(data.message = 'Successful Registration'){
                toast.notify('Successful Registration', {
                    duration: 5,
                    type: "success"
                })
            } else {
                toast.notify('Failed to sign in!', {
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
                <label htmlFor="first-name">Firstname:</label>
                <input type="text" className="form-control" id="first-name" onChange={e => setFirstname(e.target.value)} />
            </div>
            <div className="form-group">
                <label htmlFor="last-name">Lastname:</label>
                <input type="text" className="form-control" id="last-name" onChange={e => setLastname(e.target.value)} />
            </div>
            <div className="form-group">
                <label htmlFor="email">Email address:</label>
                <input type="email" className="form-control" id="email" onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
                <label htmlFor="pwd">Password:</label>
                <input type="password" className="form-control" id="pwd" onChange={e => setPassword(e.target.value)} />
            </div>
            <button className="btn btn-primary" onClick={handleSubmit} >Submit</button>

            {/* Local CSS styles */}
            <style jsx>{`
                .form-group{
                    margin-left: 10px;
                    margin-right: 10px;
                    background:white;
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

export default Signin;

