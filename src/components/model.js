import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, Container, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';
import nomal from '../upload.jpg';
import './Model.css';
import pillImage from '../pill_n.png';
import powderImage from '../powder_n.png';
import syrupImage from '../syrup_n.png';
import ointmentImage from '../ointment_n.png';


function Model() {
    const [image, setImage] = useState(null);
    const [latestPredictionImage, setLatestPredictionImage] = useState(nomal);
    const [uploadSuccess, setUploadSuccess] = useState(false); // 업로드 성공 상태 추가
    const inputRef = useRef(); // 파일 입력 참조
    const [localImageUrl, setLocalImageUrl] = useState(nomal); // 초기 이미지 설정
    const [classLabel, setClassLabel] = useState('');
    const [classifiedImagePath, setClassifiedImagePath] = useState(nomal);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setLocalImageUrl(URL.createObjectURL(file));
        }
    };

    const fetchLatestImage = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/latest-prediction-result/');
            setLatestPredictionImage(`http://localhost:8000${response.data.image_url}`);
            setClassLabel(response.data.class_label); // class_label 상태 업데이트 후에 이미지 경로 설정

            // class_label 상태 업데이트 후에 이미지 경로 설정
            switch (response.data.class_label) {
                case 'pill':
                    setClassifiedImagePath(pillImage);
                    break;
                case 'powder':
                    setClassifiedImagePath(powderImage);
                    break;
                case 'syrup':
                    setClassifiedImagePath(syrupImage);
                    break;
                case 'ointment':
                    setClassifiedImagePath(ointmentImage);
                    break;
                default:
                    setClassifiedImagePath(nomal); // 기본 이미지로 설정
            }
        } catch (error) {
            console.error('Error fetching the latest image:', error);
            setLatestPredictionImage(nomal); // 에러 발생 시 기본 이미지로 설정
            setClassifiedImagePath(nomal); // 에러 발생 시 기본 이미지 경로 설정
        }
    };


    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('image', image);

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/upload/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                console.log('Image uploaded successfully');
                await fetchLatestImage();
            } else {
                console.log('Image upload failed');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };


    return (
        <div>
        {/* 상단 50%의 배경 (빨간색) */}
        <div
            style={{ 
                position: 'fixed',
                left: 0, 
                top: 0,
                backgroundColor: 'red', // 수정
                height: '50%', // 추가
            }}
        />
        {/* 하단 50%의 배경 (파란색) */}
        <div
            style={{ 
                position: 'fixed',
                left: 0, 
                bottom: 0, // 수정
                backgroundColor: 'blue', // 수정
                height: '50%', // 추가
            }}
        />
        <Container>
            <Row>
                {/* 첫 번째 카드: 이미지 업로드 */}
                <Col className="mt-5 mx-1">
                    <Card className="custom-card-size">
                        <Card.Body>
                        <Card.Title style={{ fontWeight: 'bold', color: '#333', fontSize: '1.2em' }}>Image Upload</Card.Title>
                        <div className="image-container">
                                <img src={localImageUrl} alt="Upload Preview" className="card-img-top" />
                            </div>
                            
                            <div style={{ display: 'flex', gap: '10px', margin: '10px 0' }}>
                            <Button style={{ flex: 1 }} className="btn btn-dark position-relative overflow-hidden">
                                <span>이미지 업로드</span>
                                <input
                                    type="file"
                                    onChange={handleImageChange}
                                    className="position-absolute w-100 h-100 opacity-0"
                                    style={{ cursor: 'pointer' }}
                                />
                            </Button>
                            <Button style={{ flex: 1 }} className="btn btn-warning" onClick={handleSubmit}>
                                분석하기
                            </Button>
                        </div>

                            {uploadSuccess && <Alert variant="success">Image uploaded successfully!</Alert>}
                        </Card.Body>
                    </Card>
                </Col>

                {/* 두 번째 카드: 객체 탐지된 이미지 표시 */}
                <Col className="mt-5 mx-1">
                    <Card className="custom-card-size">
                        <Card.Body>
                        <Card.Title style={{ fontWeight: 'bold', color: '#333', fontSize: '1.2em' }}>Detected Object</Card.Title>
                            {/* 이미지를 감싸는 div 추가 */}
                            <div className="image-container" style={{display: 'flex'}}>
                                <Card.Img variant="top" src={latestPredictionImage} />
                            </div>
                            <Card.Text className="custom-class-text">
                                {classLabel ? `Class: ${classLabel}` : "No class detected"}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>

                {/* 세 번째 카드: 분류된 클래스에 따른 이미지 표시 */}
                <Col className="mt-5 mx-1">
                    <Card className="custom-card-size3">
                        <Card.Body>
                            <Card.Title style={{ fontWeight: 'bold', color: '#333', fontSize: '1.2em' }}>Classified Image</Card.Title>
                            <img src={classifiedImagePath} alt="Classified" className="card-img-top" />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
        </div>
    );
}
export default Model;
