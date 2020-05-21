import React from 'react';
import StarRatingComponent from 'react-star-rating-component';

const Article = ({ rating, articleURL, changeRating }) => {
    return (
        <div className="container">
            {('https://en.wikipedia.org/wiki/Main_Page' != articleURL) &&
                <>
                    <span id="rating-stars">
                        <StarRatingComponent 
                            name="rateing" 
                            starCount={5}
                            value={rating}
                            onStarClick={changeRating}
                            style={{fontSize: '3rem'}}
                        />
                    </span>
                    <span id="rating-info">
                        (Rate articles and get better Recommendations)
                    </span>
                </>
            }
            <iframe 
                src={articleURL}>
            </iframe> 

            {/* Local CSS styles */}
            <style jsx>{`
                .container div.dv-star-rating label.dv-star-rating-star {
                    font-size: 3rem;
                    border: 1px !important;
                }

                .container {
                    padding-top: 100px;
                    grid-template-columns: auto 100% auto;
                    margin: 0px;
                    padding: 0px;
                    overflow: hidden;
                    position: absolute;
                    top: 60px;
                    left: 0px;
                    right: 0px;
                    bottom: 0px;
                    margin-left: 5%;
                    font-size: 30px;
                }

                iframe {
                    border: 0px;
                    height: 100vh;
                    width: 100%;
                }

                #rating-info {
                    font-size: small;
                    float: right;
                    margin-top: 15px;
                    margin-right: 10px;
                }

                #rating-stars {
                    float: right;
                }

                @media (max-width: 1230px) {
                    .container {
                        margin-left: 3%;
                    }
                }
                
                @media (max-width: 1199px) {
                    .container {
                        margin-left: 10%;
                    }
                }

                @media (max-width: 1125px) {
                    .container {
                        margin-left: 5%;
                    }
                }

                @media (max-width: 1080px) {
                    .container {
                        margin-left: 5%;
                    }
                }

                @media (max-width: 1030px) {
                    .container {
                        margin-left: 1%;
                    }
                }

                @media (max-width: 991px) {
                    .container {
                        margin-left: 7%;
                    }
                }

                @media (max-width: 860px) {
                    .container {
                        margin-left: 5%;
                    }
                }
                
                @media (max-width: 767px) {
                    .container {
                        margin-left: 10%;
                    }
                }
                
                @media (max-width: 575px) {
                    .container {
                        margin-left: 7%;
                        padding-top: 35px;
                    }
                    iframe {
                        width: 90%;
                    }
                    #rating-info {
                        display: none;
                    }
                    #rating-stars {
                        padding-right: 30px;
                    }
                }

                @media (max-width: 600px) {
                    .container {
                        margin-left: 25px;
                    }
                }

            `}</style>
        </div>
    );
}

export default Article;