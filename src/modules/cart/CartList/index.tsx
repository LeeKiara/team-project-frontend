import { MutableRefObject, useRef, useState, useEffect } from "react";
import { CartContainer } from "./styles";
import { useNavigate } from "react-router-dom";
import { useCartData } from "../cartdata";
import axios from "axios";
import * as React from "react";

const CartList = () => {
  const { cartData: cartlist, isCartDataValidating } = useCartData();
  const [numbers, setNumbers] = useState([]);

  const navigate = useNavigate();
  const quantityRef = useRef() as MutableRefObject<HTMLInputElement>;

  useEffect(() => {
    // cartData가 로드되면 initialNumbers 배열을 설정
    if (cartlist && cartlist.length > 0) {
      const initialNumbers = cartlist.map((item) =>
        parseInt(item.quantity, 10)
      );
      setNumbers(initialNumbers);
    }
  }, [cartlist]);

  // 서버/스토리지의 데이터와 캐시데이터 비교중인지 여부를 표시
  console.log("---validating---");
  console.log(isCartDataValidating);

  const handleQtyChange = (e, index) => {
    const itemQty = parseInt(e.target.value, 10);

    setNumbers((prevNumbers) => {
      const newNumbers = [...prevNumbers];
      newNumbers[index] = itemQty;
      return newNumbers;
    });
  };

  const handleIncrement = (index) => {
    setNumbers((prevNumbers) => {
      const newNumbers = [...prevNumbers];
      newNumbers[index] = newNumbers[index] + 1;
      return newNumbers;
    });
  };

  const handleOrder = () => {
    navigate("/cart/order");
  };

  return (
    <>
      <CartContainer>
        <section>
          <article>
            <div className="cart-header">
              <h3 className="title">장바구니</h3>
            </div>
          </article>
          <article className="cart-layer-title">
            <div>
              <input
                type="checkbox"
                name="productall_seq"
                className="listCheckBox"
              />
            </div>
            <div>상품정보</div>
            <div>수량</div>
            <div>판매가(정가)</div>
          </article>
          {/* 장바구니 상품 리스트(Loop) */}
          {cartlist.map((cartCashData, index) => (
            <article className="cart-layer" key={`item-${cartCashData.id}`}>
              {/* 도서정보(책이미지/도서명) */}
              <div className="bookinfo">
                <label className="form-checkbox">
                  <input
                    type="checkbox"
                    name="product_seq"
                    className="listCheckBox"
                    key={`item-${cartCashData.id}`}
                  />
                </label>
                <figure>
                  <span className="image">
                    <a href="" target="_blank">
                      <img src={cartCashData.cover} alt={cartCashData.title} />
                    </a>
                  </span>
                </figure>
                <div>
                  <div className="box-bookgubun">
                    <span className="icon-bookgubun">{cartCashData.gubun}</span>
                  </div>
                  <p>
                    {cartCashData.id},{cartCashData.title}
                  </p>
                </div>
              </div>
              {/* 가격정보 */}
              <div className="priceinfo">
                {/* 수량 */}
                <div style={{ width: "150px" }}>
                  <input
                    type="text"
                    placeholder="0"
                    value={numbers[index]}
                    onChange={(e) => handleQtyChange(e, index)}
                  />
                  <button onClick={() => handleIncrement(index)}>1 증가</button>
                </div>

                {/* 할인가/정가 */}
                <div>
                  <div className="box-price">
                    <strong>{cartCashData.priceSales}</strong>원
                    <del>정가{cartCashData.priceStandard}원</del>
                  </div>
                </div>

                {/* 삭제버튼 */}
                <div className="box-delete">X</div>
              </div>
            </article>
          ))}

          {/* 주문합계 */}
          <article>
            <div className="box-total-payment">
              <div className="total-text">주문합계</div>
              <div className="total-sum">
                상품금액 <strong id="fixedsum">1,0000</strong>원 <i>-</i>
                할인금액 <strong id="discountsum">2,000</strong>원 <i>+</i>
                배송비 <strong id="deliveryfee">2,000</strong>원
              </div>
              <div className="total-price">
                결제 예정 금액 <strong id="totalsum">10,000</strong>원
              </div>
            </div>
          </article>

          {/* 주문버튼 */}
          <article>
            <div className="box-submit-payment">
              <dl>
                <dt>주의하세요.</dt>
                <dd>· 주문 총액 2만원 이상이면 배송비가 무료입니다.</dd>
              </dl>
              <span className="btn-order">
                <button onClick={handleOrder}>주문하기</button>
              </span>
            </div>
          </article>
        </section>
      </CartContainer>
    </>
  );
};

export default CartList;
