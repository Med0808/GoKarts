import axios from 'axios'

export const fetchTopStories = async () => {
    try {
        const response = await axios.get('https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty');
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export const fetchStoryData = async id => {
    try {
        const response = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}