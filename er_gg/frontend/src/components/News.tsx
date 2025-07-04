import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, ButtonGroup } from 'react-bootstrap';

interface NewsItem {
  title: string;
  link: string;
  imageUrl: string;
  date: string;
}

const News: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('news');

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/news?type=${selectedType}`
        );
        setNews(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching news:', error);
        setLoading(false);
      }
    };

    fetchNews();
  }, [selectedType]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Latest News</h1>
      <ButtonGroup aria-label="News Type" className="mb-3">
        <Button variant={selectedType === 'news' ? 'primary' : 'secondary'} onClick={() => setSelectedType('news')}>News</Button>
        <Button variant={selectedType === 'patchnote' ? 'primary' : 'secondary'} onClick={() => setSelectedType('patchnote')}>Patch Notes</Button>
        <Button variant={selectedType === 'esports' ? 'primary' : 'secondary'} onClick={() => setSelectedType('esports')}>Esports</Button>
        <Button variant={selectedType === 'event' ? 'primary' : 'secondary'} onClick={() => setSelectedType('event')}>Events</Button>
        <Button variant={selectedType === 'broadcasts' ? 'primary' : 'secondary'} onClick={() => setSelectedType('broadcasts')}>Broadcasts</Button>
      </ButtonGroup>
      <div className="row">
        {news.map((item, index) => (
          <div className="col-md-4" key={index}>
            <div className="card mb-4">
              <img
                src={item.imageUrl}
                className="card-img-top"
                alt={item.title}
              />
              <div className="card-body">
                <h5 className="card-title">{item.title}</h5>
                <p className="card-text">
                  <small className="text-muted">{item.date}</small>
                </p>
                <a
                  href={item.link}
                  className="btn btn-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read More
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default News;