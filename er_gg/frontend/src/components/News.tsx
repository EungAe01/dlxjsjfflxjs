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
    'all' | 'news' | 'patchnote' | 'esports' | 'event' | 'broadcasts'
  >('all');

  const fetchNews = async () => {
    setLoading(true);
    try {
      const query = selectedType === 'all' ? '' : `?type=${selectedType}`;
      const response = await axios.get(
        `${window.location.protocol}//${window.location.hostname}:5000/api/news${query}`
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
      <h1>최근 소식</h1>
      <ButtonGroup aria-label="뉴스" className="mb-3">
        <Button
          variant={selectedType === 'all' ? 'primary' : 'secondary'}
          onClick={async () => {
            setSelectedType('all');
            await fetchNews();
          }}
        >
          전체
        </Button>
        <Button
          variant={selectedType === 'news' ? 'primary' : 'secondary'}
          onClick={async () => {
            setSelectedType('news');
            await fetchNews();
          }}
        >
          새소식
        </Button>
        <Button
          variant={selectedType === 'patchnote' ? 'primary' : 'secondary'}
          onClick={async () => {
            setSelectedType('patchnote');
            await fetchNews();
          }}
        >
          패치노트
        </Button>
        <Button
          variant={selectedType === 'esports' ? 'primary' : 'secondary'}
          onClick={async () => {
            setSelectedType('esports');
            await fetchNews();
          }}
        >
          E스포츠
        </Button>
        <Button
          variant={selectedType === 'event' ? 'primary' : 'secondary'}
          onClick={async () => {
            setSelectedType('event');
            await fetchNews();
          }}
        >
          이벤트
        </Button>
        <Button
          variant={selectedType === 'broadcasts' ? 'primary' : 'secondary'}
          onClick={async () => {
            setSelectedType('broadcasts');
            await fetchNews();
          }}
        >
          공식 방송
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
