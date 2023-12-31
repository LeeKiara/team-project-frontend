import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { AddCartContainer } from "./styles";
import { useBookCartData } from "../AddCart/data";
import http from "@/utils/http";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import eventBanner1 from "@/assets/event-banner.gif";
import CalcuTotalPayment from "./CalcuTotalPayment";
import OrderButton from "@/components/OrderButton";
import ShowMessageModal from "@/components/ShowMessageModal";

const AddCart = () => {
  const [page, setPage] = useState(0);

  const navigate = useNavigate();

  // 장바구니 캐시 데이터
  const { bookCartData: cartlist, mutateCartDataFunction, isBookCartDataValidating } = useBookCartData(page);

  console.log("***CartForm : " + cartlist.length);

  cartlist.map((item, index) => {
    console.log(index + "," + item.title);
  });

  // 장바구니 삭제 item 상태관리
  const [deletedItemId, setDeletedItemId] = useState(null);

  // 주문할 장바구니 도서 상태관리
  const [stateCartData, setStateCartData] = useState(cartlist);

  // 장바구니 수량 상태
  const [qtys, setQtys] = useState([]);
  // 정가 상태
  const [priceStandards, setPriceStandards] = useState([]);
  // 할인가 상태
  const [priceSales, setPriceSales] = useState([]);

  // 주문 가능 여부
  const [isOrder, setIsOrder] = useState(false);

  // 장바구니 상품 선택 박스
  const [checkboxes, setCheckboxes] = useState([]);

  // 선택된 아이템들을 담는 배열
  const [selectedItems, setSelectedItems] = useState([]);

  // 전체 체크박스 선택 상태를 관리
  const [selectAll, setSelectAll] = useState(false);

  const [showMessageModal, setShowMessageModal] = useState(false);

  // 장바구니 데이터로 수량/정가/할인가 초기화 배열 설정
  useEffect(() => {
    if (cartlist && cartlist.length > 0) {
      // 장바구니 수량 cartData에 저장된 값으로 초기화
      const initialNumbers = cartlist.map((item) => item.quantity);
      setQtys(initialNumbers);

      // 정가
      const initialPriceStandard = cartlist.map((item) => parseInt(item.priceStandard, 10));
      setPriceStandards(initialPriceStandard);

      // 할인가
      const initialPriceSales = cartlist.map((item) => parseInt(item.priceSales, 10));
      setPriceSales(initialPriceSales);
    }
  }, [cartlist]);

  // 장바구니 수량이 변경되면 정가와 할인가 변경 처리
  useEffect(() => {
    console.log("!! qtys useEffect : 장바구니 수량이 변경되면 정가와 할인가 변경 처리 ");
    // console.log(qtys + ", " + priceStandards);

    // 정가 다시 계산
    const calcuPriceStandard = qtys.map((item, index) => {
      return item * Number(cartlist[index].priceStandard);
    });

    setPriceStandards(calcuPriceStandard);

    // console.log("calcuPriceStandard:", calcuPriceStandard);
    // console.log("priceStandards:", priceStandards);

    // 할인가 다시 계산
    const calcuPriceSales = qtys.map((item, index) => {
      return item * Number(cartlist[index].priceSales);
    });

    setPriceSales(calcuPriceSales);

    // 주문상품 상태 관리
    const checkedCartItems = createSelectedCartList(stateCartData, qtys);

    checkedCartItems.map((item, index) => {
      console.log(
        " qtys useEffect에서 setStateCartData 확인 >>> id:" +
          item.id +
          ",title:" +
          item.title +
          ", quantity:" +
          item.quantity +
          ", isChecked:" +
          item.isChecked,
      );
    });

    setStateCartData(checkedCartItems);
  }, [qtys]);

  // 주문할 상품 선택박스 상태변경 부가처리
  useEffect(() => {
    if (cartlist && cartlist.length > 0) {
      console.log("++++++++++ useEffect checkboxes");

      const checkedCartItems = createSelectedCartList(stateCartData, qtys);
      setStateCartData(checkedCartItems);

      setIsOrder(true);
    }
  }, [checkboxes]);

  const handleOrder = () => {
    console.log("++++++++++ handleOrder");

    // alert("상품을 선택하세요.");
    setShowMessageModal(true);

    const checkedCartItems = createSelectedCartList(stateCartData, qtys);

    setStateCartData(checkedCartItems);

    setIsOrder(true);
  };

  useEffect(() => {
    // 삭제된 아이템 ID가 설정되면 해당 아이템을 cartlist에서 제거
    if (deletedItemId) {
      console.log("삭제된 아이템 ID가 설정되면 해당 아이템을 cartlist에서 제거 :deletedItemId [" + deletedItemId + "]");

      const updatedCartList = cartlist.filter((item) => item.itemId !== Number(deletedItemId));
      setDeletedItemId(null);

      updatedCartList.map((item) => {
        console.log("item.itemId:" + item.itemId + ",deletedItemId:" + deletedItemId);
      });

      // updatedCartList를 사용하여 cartlist를 업데이트
      mutateCartDataFunction(updatedCartList, false);
    }
  }, [deletedItemId, cartlist]);

  // 체크박스 선택 및 수량 변경에 따른 대상 최종 정보 생성
  function createSelectedCartList(stateCartData, qtys) {
    // console.log("createSelectedCartList:" + checkboxes[0] + "," + checkboxes[1]);

    const checkedCartItems = cartlist
      .map((selectedItem, index) => ({
        id: selectedItem.id,
        itemId: selectedItem.itemId,
        title: selectedItem.title,
        cover: selectedItem.cover,
        priceStandard: selectedItem.priceStandard,
        priceSales: selectedItem.priceSales,
        quantity: qtys[index],
        // isChecked: checkboxes[index], // 체크박스 상태 사용
        isChecked: selectedItems.includes(selectedItem.itemId),
        gubun: "",
        stockStatus: selectedItem.stockStatus,
      }))
      .filter((selectedItem) => selectedItem.isChecked);

    checkedCartItems.map((item, index) => {
      console.log(
        "  createSelectedCartList 최종 장바구니 상품 목록 >>> id:" +
          item.id +
          ",title:" +
          item.title +
          ", quantity:" +
          item.quantity +
          ", isChecked:" +
          item.isChecked +
          ", stockStatus:" +
          item.stockStatus,
      );
    });

    return checkedCartItems;
  }

  // 체크박스 변경에 따른 장바구니 상품목록 상태관리
  const handleCheckboxChange = (index, itemId) => {
    console.log("handleCheckboxChange..................");
    const newCheckboxes = [...checkboxes];
    newCheckboxes[index] = !newCheckboxes[index];
    setCheckboxes(newCheckboxes);

    const updatedSelectedItems = selectedItems.includes(itemId)
      ? selectedItems.filter((id) => id !== itemId)
      : [...selectedItems, itemId];

    setSelectedItems(updatedSelectedItems);
  };

  // 장바구니 수량 변경 이벤트 핸들러
  const handleQtyChange = (e, index) => {
    console.log("** handleQtyChange ");

    const itemQty = parseInt(e.target.value, 10);

    setQtys((prevQtys) => {
      const newQtys = [...prevQtys];
      newQtys[index] = itemQty;
      return newQtys;
    });
  };

  // 수량 1씩 증가
  const handleIncrement = (index) => {
    console.log("●●●●● handleIncrement " + qtys[0] + "," + qtys[1]);

    setQtys((prevQtys) => {
      const newQtys = [...prevQtys];
      newQtys[index] = newQtys[index] + 1;
      return newQtys;
    });
  };

  // 수량 1씩 감소
  const handleDecrement = (index) => {
    setQtys((prevQtys) => {
      const newQtys = [...prevQtys];
      if (newQtys[index] <= 1) {
        newQtys[index] = 1;
      } else {
        newQtys[index] = newQtys[index] - 1;
      }
      return newQtys;
    });
  };

  const handleShowMessageButton = () => {
    setShowMessageModal(true);
  };

  const handleCancel = () => {
    setShowMessageModal(false);
  };

  const handleDeleteCartItem = (itemId) => {
    const isConfirmed = window.confirm("해당 상품을 삭제 하시겠습니까?");
    if (isConfirmed) {
      (async () => {
        try {
          const response = await http.delete(`/api/order-commerce/cart/delete/${itemId}`);

          console.log("(sever fetch) 장바구니 item 삭제 결과 : " + response.status);

          if (response.status === 200) {
            alert("해당 상품이 삭제 되었습니다.");

            setDeletedItemId(itemId);

            // 삭제가 성공한 경우
            // const updatedCartList = cartlist.filter((item) => item.itemId !== itemId);
            // // mutate 함수를 호출하여 cartData를 업데이트
            // mutateCartDataFunction(updatedCartList, false);
          }
        } catch (e: any) {
          console.log(e);
          alert("시스템 오류가 발생하였습니다.");
          navigate("/cart");
        }
      })();
    }
  };

  // 전체 체크박스 선택/해제 함수
  const handleSelectAll = () => {
    setSelectAll(!selectAll);

    // 전체 체크박스 선택
    if (!selectAll) {
      setSelectedItems(cartlist.map((item) => item.itemId)); // 모든 아이템을 선택

      const checkedCartItems = cartlist.map((selectedItem, index) => ({
        id: selectedItem.id,
        itemId: selectedItem.itemId,
        title: selectedItem.title,
        cover: selectedItem.cover,
        priceStandard: selectedItem.priceStandard,
        priceSales: selectedItem.priceSales,
        quantity: qtys[index],
        isChecked: true,
        gubun: "",
        stockStatus: selectedItem.stockStatus,
      }));

      checkedCartItems.map((item, index) => {
        console.log(
          " 전체 체크박스 선택 >> 최종 장바구니 상품 목록 >>> id:" +
            item.id +
            ",title:" +
            item.title +
            ", quantity:" +
            item.quantity +
            ", isChecked:" +
            item.isChecked +
            ", stockStatus:" +
            item.stockStatus,
        );
      });

      setStateCartData(checkedCartItems);
      setIsOrder(true);
    } else {
      // 전체 체크박스 해제
      setSelectedItems([]);
      setStateCartData([]);
      setIsOrder(false);
    }

    selectedItems.map((item, index) => {
      console.log(index + "," + item);
    });
  };

  return (
    <>
      <AddCartContainer>
        <section>
          <article>
            <div className="contain-cart-header-mobile">
              <h3 className="title">장바구니</h3>
            </div>
          </article>
          {cartlist.length > 0 && (
            <article className="cart-layer-title">
              {/* 전체 선택 */}
              <div className="cart-checkbox">
                <input
                  type="checkbox"
                  name="productall_seq"
                  className="listCheckBox"
                  onChange={handleSelectAll}
                  checked={selectAll}
                />
              </div>
              <div>상품정보</div>
              <div>수량</div>
              <div>판매가(정가)</div>
            </article>
          )}

          {/* 장바구니 도서 loop */}
          {cartlist.length > 0 ? (
            cartlist.map((cartCashData, index) => (
              <article className="cart-frame" key={`item-${cartCashData.itemId}`}>
                <div>
                  <div>
                    <label className="cart-checkbox">
                      <input
                        type="checkbox"
                        name="product_seq"
                        className="listCheckBox"
                        key={cartCashData.itemId}
                        onChange={() => handleCheckboxChange(index, cartCashData.itemId)}
                        checked={selectedItems.includes(cartCashData.itemId)}
                      />
                    </label>
                  </div>
                  {/* 도서 이미지 */}
                  <div>
                    <span className="book-image">
                      <Link to={`/page?id=${cartCashData.id}`}>
                        <img src={`${cartCashData.cover}`} alt={`${cartCashData.title}`} />
                      </Link>
                    </span>
                  </div>
                </div>
                <div>
                  {/* 도서제목/상태 */}
                  <div className="bookinfo-title">
                    {cartCashData.stockStatus === "품절" && (
                      <div className="icon-bookgubun">
                        <p>{cartCashData.stockStatus}</p>
                      </div>
                    )}
                    <p>
                      <Link to={`/page?id=${cartCashData.id}`}>{cartCashData.title}</Link>
                      <br />
                    </p>
                  </div>
                  <div>
                    {/* <div>수량</div> */}
                    <div className="bookinfo-quantity">
                      <input
                        type="text"
                        placeholder="0"
                        value={qtys[index]}
                        onChange={(e) => handleQtyChange(e, index)}
                      />
                      <div className="btn-qty-change">
                        <img
                          onClick={() => handleIncrement(index)}
                          src="https://image.aladin.co.kr/img/shop/2018/icon_Aup.png"
                          alt="위 화살표"
                        />
                        <img
                          onClick={() => handleDecrement(index)}
                          src="https://image.aladin.co.kr/img/shop/2018/icon_Adown.png"
                          alt="아래화살표"
                        />
                      </div>
                    </div>
                    {/* <div>가격</div> */}
                    <div className="box-price">
                      <div>
                        <strong>{priceSales[index] && priceSales[index].toLocaleString()}</strong>
                        <p>원</p>
                      </div>
                      <del>정가{priceStandards[index] && priceStandards[index].toLocaleString()}원</del>
                    </div>
                    {/* <div>삭제</div> */}
                    <div className="cart-item-delete" onClick={() => handleDeleteCartItem(`${cartCashData.itemId}`)}>
                      X
                    </div>
                  </div>
                </div>
              </article>
            ))
          ) : (
            // 장바구니가 비어있을 경우
            <article className="cart-layer-title-off">
              <div>
                <div>
                  <ErrorOutlineIcon sx={{ fontSize: 60, color: "gray" }}></ErrorOutlineIcon>
                </div>
                <div>장바구니가 비어있습니다.</div>
              </div>
            </article>
          )}

          {/* 주문합계 */}
          {cartlist.length > 0 && (
            <article className="total-payment-layer">{<CalcuTotalPayment cartBooks={stateCartData} />}</article>
          )}

          {/* 주문버튼 */}
          {cartlist.length > 0 && (
            <article>
              <div className="box-submit-payment">
                <dl>
                  <dt>
                    <ErrorOutlineIcon></ErrorOutlineIcon>&nbsp;&nbsp;주의하세요.
                  </dt>
                  <dd> 주문 총액 2만원 이상이면 배송비가 무료입니다.</dd>
                </dl>

                {/* <span className="btn-order">
                <button onClick={handleOrder}>주문하기</button>
              </span> */}
                {!isOrder && (
                  <button className={"box-blue"} onClick={handleOrder}>
                    주문하기
                  </button>
                )}

                {/* 주문하기 버튼 */}
                {isOrder && <OrderButton cartBooks={stateCartData} />}

                {showMessageModal && <ShowMessageModal message="상품을 선택하세요." onCancel={handleCancel} />}
              </div>
            </article>
          )}

          {/* 이벤트 레이어 */}
          <article className="event-layer1">
            <div>
              <div>
                <a href="/eventbook">
                  <img src={eventBanner1} />
                </a>
              </div>
              <div className="event-layer-sub">
                <a href="/eventbook">상세보기</a>
              </div>
            </div>
          </article>
          <article className="event-layer2">
            <div>
              <div>
                <a href="https://shopping.naver.com/plan/details/688948" target="new">
                  <img src="https://s.pstatic.net/static/www/mobile/edit/20231016_1095/upload_1697416662735yT2fo.png" />
                </a>
                <div className="event-layer-sub">
                  <a href="https://shopping.naver.com/plan/details/688948" target="new">
                    상세보기
                  </a>
                </div>
              </div>
              <div>
                <a href="https://shopping.naver.com/plan/details/688947" target="new">
                  <img src="https://s.pstatic.net/static/www/mobile/edit/20230524_1095/upload_1684893984366Ka03q.jpg" />
                </a>
                <div className="event-layer-sub">
                  <a href="https://shopping.naver.com/plan/details/688947" target="new">
                    상세보기
                  </a>
                </div>
              </div>
            </div>
          </article>
        </section>
      </AddCartContainer>
    </>
  );
};

export default AddCart;
