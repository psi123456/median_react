import React from 'react';
import image from '../식약처2.png'; // 이미지 파일의 정확한 경로로 변경해주세요.
import yellow from '../yellow.jpg';

const Main = () => {
  return (
    <div className="mt-4 position-relative">
      <div
        style={{ 
          margin: '50px 50px 0 0',
          position: 'fixed', 
          width: '100vw', 
          height: '100%', 
          objectFit: 'cover', 
          zIndex: -1, 
          left: 0, 
          top: 0,
          backgroundImage: `url(${yellow})`, // 배경 이미지 추가
        }}
      />
      <main style={{ textAlign: 'center', padding: '20px', zIndex: 1 }}>
        <h1 className="display-3" style={{ color: '#333' }}>환영합니다!</h1>
        <div className="card mx-auto" style={{ maxWidth: '300rem', marginTop: '50px', backgroundColor: 'rgba(255, 255, 204, 0.7)' }}>
          {/* 배경색을 흰색(rgba(255, 255, 204, 0.7))으로 설정 */}
          <div className="card-body">
            <p className="card-text" style={{ fontSize: '1.25rem' }}>
              이곳은 MEDISORT AI 플랫폼의 메인 페이지입니다.
            </p>
            <p className="card-text" style={{ fontSize: '1.25rem' }}>
              저희 플랫폼을 사용하면 의약품을 식별하고 분류하는 일이 훨씬 쉬워집니다.
            </p>
            <p className="card-text" style={{ fontSize: '1.25rem' }}>
              사용자가 업로드한 의약품 이미지를 AI가 분석하여, 해당 의약품의 유형, 폐기 방법, 유통기한 등 중요한 정보를 제공합니다.
            </p>
            <p className="card-text" style={{ fontSize: '1.25rem' }}>
              정확한 정보를 바탕으로 안전하게 의약품을 폐기 하세요. 의약품 처리에 대한 모든 것, MEDISORT AI가 함께합니다.
            </p>
          </div>
        </div>
        <img
          src={image}
          alt="식약처 바로가기"
          style={{ maxWidth: '450px', marginTop: '28px' }}
        />
        <div className="mt-4">
          <a href="https://www.mfds.go.kr/" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg">
            식품의약품안전처 바로가기
          </a>
        </div>
      </main>
    </div>
  );
};
export default Main;