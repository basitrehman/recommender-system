<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
=======
import React, { useState } from 'react';
>>>>>>> 7b630c4d029eec84d559a9fc87e94fa52664b076
import GlobalCSS from '../components/GlobalCSS';
import Header from '../components/Header';
import Recommendations from '../components/recommendations/Recommendations';
import Article from '../components/article/Article';
import HamburgerIcon from '../static/h-manu-icon.svg';
<<<<<<< HEAD
import fetch from 'isomorphic-unfetch';
import configData from '../config/configData';
import Loader from 'react-loader-spinner';
import { toast, ToastContainer } from 'react-nextjs-toast';

const Home = ({userId}) => {
    // const [userId, setUserId] = useState(props.url.query.userId | 0);
    const [recommendationData, setRecommendationData] = useState([]);
=======
import fetch from 'isomorphic-unfetch'
import configData from '../config/configData'
import Loader from 'react-loader-spinner'

const Home = ({ userId, recommendationData }) => {
>>>>>>> 7b630c4d029eec84d559a9fc87e94fa52664b076
    const [loading, setLoading] = useState(false);
    const [showRec, setShowRec] = useState(true)
    const [showSearchRes, setShowSearchRes] = useState(false);
    const [searchResult, setSearchResult] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [rating, setRating] = useState(0);
    const [articleId, setArticleId] = useState(0);
    const [articleURL, setArticleURL] = useState('https://en.wikipedia.org/wiki/Main_Page');

    if(userId == 0) return <PageNotFound />

    async function openArticle(id, title){
        try {
            const res = await fetch(configData.server + ':' + configData.port + `/v1/article?id=${id}&userId=${userId}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            const data = await res.json()
    
            let changedTitle
            if(data.result == undefined){
                changedTitle = title.replace(' ', '_');
                setRating(0)
            } else {
                changedTitle = data.result.article.replace(' ', '_');
                setRating(parseInt(data.result.rating))
            }
            
            const genURL = 'https://en.wikipedia.org/wiki/' + changedTitle
            setArticleURL(genURL)
            setArticleId(id)
            setShowSearchRes(false)
            setShowRec(false)
        } catch (err) {
            toast.notify('GET-Request failed!', {
                duration: 5,
                type: "error"
            })
        }
    }

    async function handleSearch(){
        try {
            setLoading(true)
            const res = await fetch(configData.server + ':' + configData.port + `/v1/search?name=${searchValue}&userId=${userId}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            const data = await res.json()
            if(data.result != undefined){
                setSearchResult(data.result)
                setShowSearchRes(true)
                setLoading(false)
            } else {
                setSearchResult([{title: 'Keine Suche-Ergebnisse gefunden.', id: 0}])
                setShowSearchRes(true)
            }
        } catch (err) {
            setLoading(false)
            toast.notify('GET-Request failed!', {
                duration: 5,
                type: "error"
            })
        }
    }

    function changeRating(nextValue, prevValue, name) {
        setRating(nextValue)
        rateArticle(nextValue)
    }

    async function rateArticle(newRating){
        try {
            const body = {
                "id": articleId,
                "userId": parseInt(userId),
                "stars": `${newRating}`
            }
            const res = await fetch(configData.server + ':' + configData.port + `/v1/rate`, {
                method: 'PATCH',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            })
            const data = await res.json()
            if(data.message == 'Successful Insertion/Update'){
                console.log('Rating Successful')
            } else {
                console.log('Rating failed')
            }
        } catch (err) {
            toast.notify('PATCH-Request failed!', {
                duration: 5,
                type: "error"
            })
        }
    }

    useEffect(() => {
        async function fetchRecommendationData() {
            try {
                const res = await fetch(configData.server + ':' + configData.port + `/v1/recommendations?userId=${userId}`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                })
                const data = await res.json()
                return setRecommendationData(data[1].List_Recommendations)
            } catch (err) {
                return setRecommendationData([])
            }
        }
        fetchRecommendationData();
    }, []);

    return (
        <div>

            <ToastContainer />

            <Header />

            {loading &&
                <div id="loading-div">
                    <Loader
                        type="Puff"
                        color="#c72c41"
                        height={100}
                        width={100}
                        visible={loading}
                    />
                </div>
            }
            
            <nav className="navbar navbar-expand-sm">
                <form 
                    className="form-inline" 
                    action="" 
                    onSubmit={(e) => {
                        e.preventDefault()
                        handleSearch()
                    }}>
                    <input 
                        className="form-control mr-sm-2 search" 
                        onChange={(e) => setSearchValue(e.target.value)} 
                        type="text" 
                        placeholder="Search" />
                    <i className="btn btn-success" id="search" onClick={handleSearch}>Search</i>
                </form>
                {/* {isMobile ? */}
                {/* <DotsIcon /> : */}
                {/* <div className=""> */}
                    <span className="">
                        <a className="nav-link" onClick={() => setShowRec(true)}>Recommendations</a>
                    </span>
                    <span className="">
                        <a className="nav-link" onClick={() => setShowRec(false)}>Article</a>
                    </span>
                    <span id="splitter-span"><p id="splitter">|</p></span>
                    <span className="">
                        <a href="http://localhost:3000" className="nav-link" id="logout" >Logout</a>  
                    </span>
                {/* </div> */}
                {/* } */}
            </nav>
            
            {(!showSearchRes) ? 
            <div className="search-res"><HamburgerIcon onClick={() => setShowSearchRes(!showSearchRes)} /></div> : 
            <div className="search-res search-res-show">
                <HamburgerIcon onClick={() => setShowSearchRes(!showSearchRes)} />
                <div>
                    {searchResult.map((searchItem, i) => { 
                        let className = "search-res-item"
                        if(searchItem.isRecommended) className = "search-res-item search-res-item-recommended"
                        return (
                            <div 
                                onClick={() => openArticle(searchItem.article_id, searchItem.title)} 
                                id="search-item"
                                className={className}
                                key={i}>
                                    {searchItem.isRecommended ?
                                        <>
                                            <div id="search-item-title">
                                                {searchItem.title}
                                            </div>
                                            <div id="search-item-recommended-flag">
                                                (recommended)
                                            </div>
                                        </> :
                                        <>
                                            {searchItem.title}
                                        </>
                                    }
                            </div>
                        )
                    })}
                </div>
            </div>}

            <div onClick={() => setShowSearchRes(false)}>
                {showRec && 
                    <Recommendations 
                        userId={userId} 
                        recommendationData={recommendationData} 
                        openArticle={openArticle} />
                }
                {!showRec && <Article rating={rating} changeRating={changeRating} articleURL={articleURL} /> }
            </div>

            {/* Local CSS styles */}
            <style jsx>{`
                #loading-div {
                    padding-left: 46%;
                    padding-top: 100px;
                    position: fixed;
                    z-index: 9;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.7);
                }

                .navbar {
                    justify-content: space-between;
                    position: fixed;
                    z-index: 100;
                    width: 100%;
                    background-color: #2d132c;

                    margin: 0px;
                    overflow: hidden;
                    position: fixed;
                    top: 0px;
                    left: 0px;
                    right: 0px;
                    min-height: 60px;
                    height: auto;
                    padding: 10px 10px 10px 10px;
                }

                .form-inline {
                    width: 100%;
                }

                .navbar-nav {
                    float: right;
                }

                #search {
                    background-color: #c72c41;
                    border-color: #c72c41;
                    cursor: pointer;
                }

                #splitter {
                    color: white;
                    font-size: x-large;
                    margin-bottom: 0px;
                    margin-left: 10px;
                    margin-right: 10px;
                }

                .nav-link {
                    cursor: pointer;
                    color: #ee4540 !important;
                }

                #logout {
                    color: #801336 !important;
                }

                .search-res {
                    width: 0px;
                    height: 300px;
                    background: #801336;
                    -webkit-transition: width 1s ease-out;
                    transition: width 1s ease-out;
                    position: fixed;
                    height: 100%;
                    z-index: 5;
                }

                .search-res-show {
                    width: 330px !important;
                    overflow: scroll;
                }

                .search-res-show > div {
                    margin-top: 70px;
                }

                #search-item {
                    cursor: pointer;
                }

                .search-res-item {
                    width: 80%;
                    background-color: #2d132c;
                    color: white;
                    margin-left: 50px;
                    margin-right: auto;
                    margin-bottom: 10px;
                    margin-top: 10px;
                    padding: 5px;
                    border-radius: 5px;
                    overflow: auto;
                    overflow-x: hidden;
                }

                .search-res-item-recommended {
                    border: 2px solid #ee4540;
                }

                #search-item-title {
                    width: 50vh;
                    float: left;
                }

                #search-item-recommended-flag {
                    width: 80px;
                    font-size: x-small;
                    float: right;
                    color: gray;
                }

                @media (max-width: 655px) {
                    input {
                        width: 60% !important;
                        margin-right: 3% !important;
                    }
                    #search {
                        width: 37%;
                    }
                }

                @media (max-width: 575px) {
                    input {
                        width: 72% !important;
                        margin-right: 3% !important;
                    }
                    #search {
                        width: 25% !important;
                    }
                    .navbar {
                        height: fit-content;
                    }
                    #splitter-span {
                        display: none;
                    }
                    .search-res {
                        padding-top: 40px;
                    }
                }
                
            `}</style>

            {/* Global CSS styles */}
            <GlobalCSS />
        </div>
    );
}

export default Home;

Home.getInitialProps = async (props) => {
    try {
        const userId = props.query.userId
        // const res = await fetch(configData.server + ':' + configData.port + `/v1/recommendations?userId=${userId}`, {
        //     method: 'GET',
        //     headers: {
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json'
        //     }
        // })
        // const data = await res.json()
        return { userId: userId }
    } catch (err) {
        return { userId: 0 }
    }
}

export const PageNotFound = () => {
    return (
        <>
            <h1>404 - Page Not Found</h1>
            <div id="desc">
                <div>
                    <p>1. Check availability of the Backend-Services!</p>
                    <p>2. Log in again, to get access!</p>
                </div>
            </div>
            <div id="login-div">
                <a href="http://localhost:3000">
                    <button>Login</button>
                </a>
            </div>
            <style jsx>{`
                h1 {
                    color: #2d132c;
                    text-align: center;
                }

                #desc {
                    display: grid;
                }

                #desc div {
                    margin-left: auto;
                    margin-right: auto;
                }

                #login-div {
                    display: grid;
                    text-decoration: none;
                }

                a {
                    margin-left: auto;
                    margin-right: auto;
                    width: 100px;
                }

                button {
                    margin-top: 30px;
                    cursor: pointer;
                    margin-left: auto;
                    margin-right: auto;
                    font-size: larger;
                    width: 100px;
                    height: 50px;
                    background-color: #ee4540;
                    color: #2d132c;
                }
            `}</style>
        </>
    )
}