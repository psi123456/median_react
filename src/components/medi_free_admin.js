//관리자

import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'
 


//수정모드
const EditMode = ({ f_title, f_items, f_texts, handleTitleChange, handleItemChange, handleTextChange, addNewItem, removeItem, latestData }) => {
  // 상태를 초기화할 때 최신 데이터를 기반으로 초기화합니다.
  useEffect(() => {
    if (latestData) {
      handleTitleChange({ target: { value: latestData.f_title || '' } });
      latestData.f_items.forEach((item, index) => {
        handleItemChange(index, item);
      });
      latestData.f_texts.forEach((text, index) => {
        handleTextChange(index, text);
      });
    }
  }, [latestData, handleTitleChange, handleItemChange, handleTextChange]);

  

  const handleSave = async () => {
    const apiUrl = 'http://127.0.0.1:8000/save_data/';

    try {
      const dataToSend = {
        f_title: f_title,
        f_items: f_items,
        f_texts: f_texts,
      };

      const response = await axios.post(apiUrl, dataToSend);
      console.log('데이터 저장 성공:', response.data);
      // 저장 후 페이지 새로고침
      window.location.reload();
    } catch (error) {
      console.error('데이터 저장 중 오류:', error);
    }
  };

  return (
    <>
      <div>
        <input
          type="text"
          className="form-control mb-4"
          placeholder="제목 입력"
          value={f_title}
          onChange={(e) => handleTitleChange(e)}
        />

        {f_items.map((item, index) => (
          <div key={index} className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="항목 입력"
              value={item}
              onChange={(e) => handleItemChange(index, e.target.value)}
            />
            <div className="mb-2">
              <textarea
                className="form-control mt-3"
                placeholder="텍스트 입력"
                value={f_texts[index] || ""}
                onChange={(e) => handleTextChange(index, e.target.value)}
              />
              <button
                className="btn btn-outline-danger mt-2"
                onClick={() => removeItem(index)}
              >
                삭제
              </button>
            </div>
          </div>
        ))}

        <button className="btn btn-outline-primary" onClick={addNewItem}>
          항목 추가
        </button>

        
      </div>
    </>
  );
};



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
  const [isEditMode, setIsEditMode] = useState(false);
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
  
  const handleSave = async () => {
    const apiUrl = 'http://127.0.0.1:8000/save_data/';

    if (!f_title || f_items.some(item => !item) || f_texts.some(text => !text)) {
      alert('제목, 항목, 텍스트는 필수 입력 항목입니다.');
      return;
    }

    try {
      const dataToSend = {
        f_title: f_title,
        f_items: f_items,
        f_texts: f_texts,
      };

      const response = await axios.post(apiUrl, dataToSend);
    console.log('데이터 저장 성공:', response.data);
    setIsEditMode(false);

    // 저장 후 페이지 새로고침
    window.location.reload();
  } catch (error) {
    console.error('데이터 저장 중 오류:', error);
  }
};

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleItemChange = (index, value) => {
    const newItems = [...f_items];
    newItems[index] = value;
    setItems(newItems);
  };

  const handleTextChange = (index, value) => {
    const newTexts = [...f_texts];
    newTexts[index] = value;
    setTexts(newTexts);
  };

  const addNewItem = () => {
    setItems([...f_items, '']);
    setTexts([...f_texts, '']);
  };

  const removeItem = (index) => {
    const newItems = f_items.filter((item, i) => i !== index);
    setItems(newItems);

    const newTexts = f_texts.filter((text, i) => i !== index);
    setTexts(newTexts);
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

// 페이지 새로고침
const handleCancel = () => {
  setIsEditMode(false);
  // Reset the form to the latest saved data
  setTitle(latestData?.f_title || '');
  setItems(latestData?.f_items || []);
  setTexts(latestData?.f_texts || []);
};
  
  

  return(
        <div style={{width:'100%', margin:'0px'}}>
          <div className="d-flex">
            <div>
              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                {isEditMode ? (
                  <>
                  <button className="btn btn-warning text-white" onClick={handleSave}>
                    저장하기
                  </button>
                  <button className="btn btn-dark text-white" onClick={handleCancel}>
                    취소
                  </button>
                </>
              ) : (
                <button className="btn btn-warning me-md-2 text-white" onClick={handleEdit}>
                  수정하기
                </button>
              )}
              </div>
              <h4 style={{ color: 'rgb(255, 165, 0)', fontWeight: 'bold' }}>처방전 없이 살 수 있는 의약품</h4>
              <hr className="my-4" />
              <div className="p-3 bg-white">
                {isEditMode ? (
                  <EditMode
                  f_title={f_title}
                  f_items={f_items}
                  f_texts={f_texts}
                  handleTitleChange={(e) => setTitle(e.target.value)}
                  handleItemChange={handleItemChange}
                  addNewItem={addNewItem}
                  removeItem={removeItem}
                  handleTextChange={handleTextChange}
                />
                ) : (
                  <ReadMode
                  f_title={latestData?.f_title || f_title}
                  f_items={latestData?.f_items || f_items}
                  f_texts={latestData?.f_texts || f_texts}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
  )
};

export default Prescription;