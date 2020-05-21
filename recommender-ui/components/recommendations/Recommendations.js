import React from 'react';

const Recommendations = ({ recommendationData, openArticle }) => {
    return (
        <div className="container">
            <center>
                <h1>Recommendations</h1>
            </center>
            <br />

            <div id="cards">
                {recommendationData.map((recDataItem) => (
                    <>
                        {recDataItem.own_recommendations ?
                            <div className="card rec-card" onClick={() => openArticle(recDataItem.article_id, recDataItem.title)}>
                                <div className="card-header rec-card-header">
                                    <h4 className="card-title">{recDataItem.title}</h4>
                                </div>
                                <div className="card-body">
                                    <p className="card-text">
                                    {recDataItem.abstract.slice(-1) == '.' ?
                                    recDataItem.abstract :
                                    `${recDataItem.abstract}...`}                   
                                    </p>
                                </div>
                            </div> :
                            <div className="card" onClick={() => openArticle(recDataItem.article_id, recDataItem.title)}>
                                <div className="card-header">
                                    <h4 className="card-title">{recDataItem.title}</h4>
                                    <p id="recommended-flag">(recommended for other users)</p>
                                </div>
                                <div className="card-body">
                                    <p className="card-text">
                                    {recDataItem.abstract.slice(-1) == '.' ?
                                    recDataItem.abstract :
                                    `${recDataItem.abstract}...`}                   
                                    </p>
                                </div>
                            </div>
                        }
                    </>
                ))}
            </div>

            {/* Local CSS styles */}
            <style jsx>{`
                .container {
                    padding-top: 100px;
                }

                #cards {
                    display: grid;
                    grid-template-columns: 320px 320px 320px;
                    justify-content: center;
                }

                .card {
                    min-width: 300px;
                    max-width: 300px;
                    margin: 10px 10px;
                    background-color: lightgray;
                    cursor: pointer;
                }

                .rec-card {
                    border: 2px solid #2d132c;
                }

                .card-header {
                    background-color: gray;
                }
                
                .rec-card-header {
                    background-color: #2d132c9c;
                    border-radius: 2px 2px 0px 0px;
                }
                
                #recommended-flag {
                    font-size: x-small;
                    float: right;
                    margin-right: -14px;
                    margin-bottom: -9px;
                }

                @media (max-width: 1050px) {
                    .card {
                        min-width: 200px;
                        max-width: 200px;
                    }
                    #cards {
                        grid-template-columns: 220px 220px 220px;
                    }
                }

                @media (max-width: 750px) {
                    .card {
                        min-width: 90%;
                        max-width: 90%;
                    }
                    #cards {
                        grid-template-columns: 50% 50%;
                    }
                    .container {
                        padding-top: 150px;
                    }
                }

                @media (max-width: 570px) {
                    .card {
                        min-width: 90%;
                        max-width: 90%;
                    }
                    #cards {
                        grid-template-columns: 50% 50%;
                    }
                    .container {
                        padding-top: 150px;
                    }
                }

                @media (max-width: 400px) {
                    .card {
                        min-width: 100%;
                        max-width: 100%;
                        margin: 10px 0px;
                    }
                    #cards {
                        grid-template-columns: 100%;
                    }
                    .container {
                        padding-top: 150px;
                    }
                }
                
            `}</style>
        </div>
    );
}

export default Recommendations;