import React, { Component } from 'react'

import { fetchTopStories, fetchStoryData } from './api'
import StoryCard from './components/StoryCard'

class App extends Component {

    state = {
        topStories: [],
        StoriesData: []
    }

    async componentDidMount() {

        // FETCH ALL THE TOP STORIES FROM THE API
        const topStories = await fetchTopStories();
        this.setState({ topStories });
        
        // GET THE METADATA OF THE FIRST 10 TOP STORIES
        for( let i=0; i<10; i++ ){
            const StoriesData = await fetchStoryData(topStories[i]);
            this.setState({ StoriesData: [...this.state.StoriesData, StoriesData] });
        }
    }

    render(){
        const { StoriesData } = this.state;
        return (
            <div className='container'>
                <div className="m-5">
                { StoriesData.map(story => <StoryCard key={story.id} story={story} />) }
                </div>
            </div>
        );
    }
}

export default App