import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './TableComponent.css'; 

class TableCardComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData: [
        // 테이블 데이터
        [
          { content: '카테고리', colSpan: 2, isHeader: true },
          { content: '개봉 후 기준', colSpan: 3, isHeader: true },
          { content: '조제 날짜 기준', colSpan: 3, isHeader: true }
        ],
        [
          { content: '의약품', colSpan: 2 },
          '안약',
          '일회용 인공눈물',
          '연고',
          { content: '조제약', colSpan: 2 }
        ],
        [
          { content: '유통기한', colSpan: 2, rowSpan: 2 },
          { content: '1개월', rowSpan: 2 },
          { content: '1일', rowSpan: 2 },
          { content: '6개월', rowSpan: 2 },
          { content: '가루약 6개월', colSpan: 2 }
        ],
        [null, null, { content: '시럽약 1개월', colSpan: 2 }]
      ]
    };
  }

  handleLocationCheck = () => {
    window.location.href = 'https://www.data.go.kr/tcs/dss/selectDataSetList.do?dType=TOTAL&keyword=%ED%8F%90%EC%9D%98%EC%95%BD%ED%92%88+%EC%88%98%EA%B1%B0%ED%95%A8+%EC%9C%84%EC%B9%98&operator=AND&detailKeyword=&publicDataPk=&recmSe=N&detailText=&relatedKeyword=&commaNotInData=&commaAndData=&commaOrData=&must_not=&tabId=&dataSetCoreTf=&coreDataNm=&sort=&relRadio=&orgFullName=&orgFilter=&org=&orgSearch=&currentPage=1&perPage=10&brm=&instt=&svcType=&kwrdArray=&extsn=&coreDataNmArray=&pblonsipScopeCode=';
  };

  renderTableCell = (cellData) => {
    const style = {
      fontSize: '28px',
      border: '1px solid black',
      textAlign: 'center',
      verticalAlign: 'middle',
    };

    if (cellData === null) {
      return null;
    }

    if (typeof cellData === 'object' && cellData !== null) {
      return (
        <td colSpan={cellData.colSpan} rowSpan={cellData.rowSpan} style={style}>
          {cellData.content}
        </td>
      );
    }

    return (
      <td style={style}>
        {cellData}
      </td>
    );
  };

  render() {
    const { tableData } = this.state;
    return (
      <div className="container mt-4">
        <div className="text-center mb-3">
          <div className="speech-bubble d-inline-block">
            💊의약품의 유통기한은?💊
          </div>
        </div>

        <div className="medicine-expiry-info">
          <p>식품의 유통기한이 있듯, 약도 사용기한이 있다는 사실!</p>
          <p>의약품 사용기한은 해당 의약품을 허가된 저장 방법에 따라 보관했을 때,</p>
          <p>허가된 효능과 품질이 유지될 것으로 예상되는 기한을 말합니다.</p>
        </div>

        <div className="card w-100">
          <div className="card-header card-header-yellow text-dark">npm
          서비스를 통해 쉽고 환경오염 없이 폐기하는 방법을 알려드리겠습니다. 👌
          </div>
          <div className="card-body d-flex flex-column align-items-center">
            <div className="table-responsive">
              <table className="table table-bordered w-100">
                <tbody>
                  {tableData.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cellData, cellIndex) => (
                        this.renderTableCell(cellData, cellIndex)
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 버튼을 가운데 정렬하기 위한 div 추가 */}
            <div className="d-flex justify-content-center w-100">
              <button className="btn btn-yellow mt-3" onClick={this.handleLocationCheck}>
                폐의약품 수거함 위치 확인
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default TableCardComponent;