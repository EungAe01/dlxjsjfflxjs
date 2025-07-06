import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, ButtonGroup } from 'react-bootstrap';

interface NewsItem {
  title: string;
  summary: string;
  createdAt: string;
  url: string;
  thumbnailUrl: string;
  id: string | number;
  viewCount: number;
  isPinned: boolean;
  isHidden: boolean;
  createdAtForHumans: string;
}

const News: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<
    'news' | 'patchnote' | 'esports' | 'event' | 'broadcasts'
  >('news');

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${window.location.protocol}//${window.location.hostname}:5000/api/news?type=${selectedType}`
      );
      setNews(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching news:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [selectedType]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Latest News</h1>
      <ButtonGroup aria-label="뉴스" className="mb-3">
        <Button
          variant={selectedType === 'news' ? 'primary' : 'secondary'}
          onClick={async () => {
            setSelectedType('news');
            await fetchNews();
          }}
        >
          News
        </Button>
        <Button
          variant={selectedType === 'patchnote' ? 'primary' : 'secondary'}
          onClick={async () => {
            setSelectedType('patchnote');
            await fetchNews();
          }}
        >
          Patch Notes
        </Button>
        <Button
          variant={selectedType === 'esports' ? 'primary' : 'secondary'}
          onClick={async () => {
            setSelectedType('esports');
            await fetchNews();
          }}
        >
          Esports
        </Button>
        <Button
          variant={selectedType === 'event' ? 'primary' : 'secondary'}
          onClick={async () => {
            setSelectedType('event');
            await fetchNews();
          }}
        >
          Events
        </Button>
        <Button
          variant={selectedType === 'broadcasts' ? 'primary' : 'secondary'}
          onClick={async () => {
            setSelectedType('broadcasts');
            await fetchNews();
          }}
        >
          Broadcasts
        </Button>
      </ButtonGroup>
      <div className="row">
        {news
          .filter((item) => item.title !== '')
          .map((item, index) => (
            <div className="col-md-4" key={item.id ?? index}>
              <div className="card mb-4">
                <img
                  src={item.thumbnailUrl}
                  className="card-img-top"
                  alt={item.title}
                />
                <div className="card-body">
                  <h5 className="card-title">{item.title}</h5>
                  <p className="card-text">
                    <small className="text-muted">
                      {item.createdAtForHumans}
                    </small>
                  </p>
                  <a
                    href={item.url}
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
