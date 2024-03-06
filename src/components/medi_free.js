//유저

import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'
 
  // 스크롤 버튼
  const ScrollToTopButton = () => {
    const handleScrollTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
      <div
        className="btn btn-outline-secondary rounded-circle right btn-lg m-4"
        onClick={handleScrollTop}
        style={{ position: 'fixed', right: 20, bottom: 20, width: 80, height: 80, fontSize: '2.5rem'}}
      >
        ↑
      </div>
    );
  };
  
  // 보기모드
const ReadMode = ({ f_title, f_items = [], f_texts = [] }) => {
  const scrollToItem = (index) => {
    const element = document.getElementById(`item-${index}-container`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div>
      <ScrollToTopButton />
      <div className="container mt-5">
        <div className="border rounded p-3 position-relative">
          <h3 className="text-center mb-4">{f_title}</h3>
          <ul>
            {f_items.map((item, index) => (
              <li
                key={index}
                id={`item-${index}`}
                className="mb-2"
                style={{ fontWeight: 'bold', fontSize: '25px' }}
                onClick={() => scrollToItem(index)}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div style={{ padding: '80px 0' }}>
          {f_items.map((item, index) => (
            <div key={index} id={`item-${index}-container`} className="mb-2">
              <div style={{ fontWeight: 'bold', fontSize: '25px' }}>{item}</div>
              <hr />
              <div className="mb-2">
                {f_texts[index] || ""}
                <br />
                <br />
                <br />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


const Prescription = () => {
  const [f_title, setTitle] = useState('');
  const [f_items, setItems] = useState([]);
  const [f_texts, setTexts] = useState([]);
  const [latestData, setLatestData] = useState(null);

  useEffect(() => {
    const fetchLatestData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/get_latest_data/');
        setLatestData(response.data);
        setTitle(response.data?.f_title || '');
        setItems(response.data?.f_items || []);
        setTexts(response.data?.f_texts || []);
      } catch (error) {
        console.error('Error fetching latest data:', error);
      }
    };

    fetchLatestData();
  }, []);

  return(
        <div style={{width:'100%', margin:'0px'}}>
          <div className="d-flex">
            <div>
              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              </div>
              <h4 style={{ color: 'rgb(255, 165, 0)', fontWeight: 'bold' }}>처방전 없이 살 수 있는 의약품</h4>
              <hr className="my-4" />
              <div className="p-3 bg-white">
                  <ReadMode
                  f_title={latestData?.f_title || f_title}
                  f_items={latestData?.f_items || f_items}
                  f_texts={latestData?.f_texts || f_texts}
                  />
              </div>
            </div>
          </div>
        </div>
  )
};

export default Prescription;