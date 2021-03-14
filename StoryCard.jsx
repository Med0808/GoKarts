import React from 'react'

const StoryCard = ({ story }) => {
    
    const { url, title, by, time, score } = story;
    const date = new Date(time).toISOString();

    return (
        <div className="card bg-light mb-3">
            <div className="card-header">
                <a href={url} style={{ textDecoration: 'none' }} className="card-title h4" target="_blank" rel="noopener noreferrer">{title}</a>
            </div>
            <div className="card-body">
                <h5><small className="text-muted"><span className="font-weight-bold">Author:</span> {by}, <span className="font-weight-bold">Created at:</span> {date}, <span className="font-weight-bold">Score:</span> {score}</small></h5>
                <p className="card-text">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
            </div>
        </div>
    );
}

export default StoryCard