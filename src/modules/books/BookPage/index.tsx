import { MutableRefObject, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { PageContainer } from "./styles";
import { AlamData, BookComment, BookItem, LikesItem, ReplyComment, isLocalhost } from "../data";
import axios from "axios";
import {
  Notifications,
  NotificationsOutlined,
  ThumbDown,
  ThumbDownOffAlt,
  ThumbUp,
  ThumbUpOffAlt,
} from "@mui/icons-material";
import { getCookie } from "@/utils/cookie";
import CommentList from "../CommentList";
import { ProfileData } from "@/modules/cart/userdata";
import CartButton from "@/components/CartButton";
import StoreHeartButton from "@/components/StoreHeartButton";

const BookPage = () => {
  const token = getCookie("token");
  const navigate = useNavigate();
  const serverAddress = isLocalhost();

  //북 itemId
  const [itemId, setItemId] = useState(null);
  //유저 정보
  const [profile, setProfile] = useState<ProfileData | null>(null);

  //디테일 페이지 상태값
  const [detail, setDetail] = useState<BookItem | null>(null);
  //디테일 페이지 id가져오기
  const [searchParams] = useSearchParams();

  //카트데이터 수량값
  const [number, setNumber] = useState(1);

  //알림설정 디스플레이
  const [storeBelltStates, setStoreBellStates] = useState(false);

  //선호작품 상태값
  const [showHeartState, setShowHeartState] = useState(false);
  const [likeList, setLikeList] = useState<LikesItem[] | null>(null);
  // 추천 상태값
  const [storeThumbStates, setStoreThumbState] = useState({});
  //싫어요 상태값
  const [storeThumbDownStates, setStoreThumbDownState] = useState({});
  //댓글
  const [commentList, setCommentList] = useState<BookComment[] | null>(null);

  const commentText = useRef() as MutableRefObject<HTMLTextAreaElement>;

  //디테일 페이지 id값 가져오기
  const id = searchParams.get("id");
  //디테일 페이지 id값 가져오기
  const newId = searchParams.get("new");
  //검색된 페이지 id값 가져오기
  const searchItemId = searchParams.get("itemId");

  //수량
  // const numberValue = useRef() as MutableRefObject<HTMLInputElement>;

  //수량 더하기 빼기
  const handlePlus = () => {
    setNumber(number + 1);
  };
  const handleMinus = () => {
    setNumber(number - 1);
  };

  //선호작품
  const handleBookSave = async (itemId: number) => {
    if (!token) {
      alert("로그인 후 이용해주세요.");
      const loginCheck = confirm("로그인 페이지로 이동하시겠습니까?");
      if (loginCheck) {
        navigate("/login");
      }
    } else {
      const newParam = newId ? 0 : null;
      const likes = !showHeartState;
      if (likes) {
        alert("선호작품 등록되었습니다.");
      } else {
        alert("선호작품 등록이 취소되었습니다.");
      }
      const newStoreHearts = {
        new: newParam,
        like: likes,
      };

      setShowHeartState(likes);
      try {
        const response = await axios.put(`${serverAddress}/books/${itemId}/like`, newStoreHearts, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          console.log("선호작품 등록/수정 성공..!");
        }
      } catch (e: any) {
        console.log(e + "선호작품 오류");
        alert("선호작품 등록에 실패하였습니다. 다시 시도해주세요.");
      }
    }
  };

  //알림설정 등록 및 수정
  const handleBell = async (itemId: number) => {
    if (!token) {
      alert("로그인 후 이용해주세요.");
    } else {
      const alamDisplay = !storeBelltStates;
      if (alamDisplay) {
        alert("알림 설정이 등록되었습니다.");
      } else {
        alert("알림 설정 등록이 취소되었습니다.");
      }
      const newAlamDisplay = {
        alamDisplay: alamDisplay,
      };
      setStoreBellStates(alamDisplay);
      try {
        const response = await axios.put(`${serverAddress}/books/${itemId}/alam`, newAlamDisplay, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          console.log("알림설정 수정/등록 성공..!");
        }
      } catch (e: any) {
        console.log(e + "알림설정 오류");
        alert("알림 설정 등록에 실패하였습니다. 다시 시도해주세요.");
      }
    }
  };

  //추천
  const handleThumbUp = (itemId: number) => {
    setStoreThumbState((prevStates) => ({
      ...prevStates,
      [itemId]: !prevStates[itemId],
    }));
  };
  //비추천
  const handleThumbDown = (itemId: number) => {
    setStoreThumbDownState((prevStates) => ({
      ...prevStates,
      [itemId]: !prevStates[itemId],
    }));
  };

  //댓글추가
  const handleSaveComment = (e) => {
    e.preventDefault();
    if (!token) {
      const confirmation = window.confirm("로그인이 필요한 서비스입니다. 로그인 페이지로 이동하시겠습니까?");
      if (confirmation) {
        navigate("/login");
      }
    } else {
      console.log(commentText.current.value);
      const newComment = commentText.current.value;
      if (newComment.trim() === "") {
        // 댓글이 공백일 경우 아무 작업도 수행하지 않음
        alert("댓글을 입력해주세요");
      }
      const time = new Date().getTime();
      console.log(time);
      const newParam = newId ? 0 : null;
      const newCommentItem = {
        new: newParam,
        comment: commentText.current.value,
        nickname: profile.nickname,
        createdDate: time,
      };

      const fetchBookComment = async (itemId: string) => {
        try {
          const response = await axios.post<BookComment>(`${serverAddress}/books/${itemId}`, newCommentItem, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.status === 201) {
            console.log("댓글추가성공");
            setCommentList((prevComments) => [response.data, ...(prevComments || [])]);
          }
        } catch (e: any) {
          console.log(e + "댓글 추가 오류");
        }
      };

      if (id) {
        console.log(id + "도서댓글 추가");
        fetchBookComment(id);
      } else if (newId) {
        console.log(newId + "신간댓글 추가");
        fetchBookComment(newId);
      }

      // 댓글 입력창 비우기
      commentText.current.value = "";
    }
  };

  //댓글 삭제
  const handleDelete = async (itemId) => {
    try {
      const response = await axios.delete(`${serverAddress}/books/${itemId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        console.log("댓글 삭제 성공");
        setCommentList(commentList.filter((comment) => comment.id !== itemId));
      }
    } catch (e: any) {
      console.log(e);
    }
  };

  //댓글 수정
  const handleModify = async (itemId, modifyValue) => {
    const modifyComment = JSON.stringify({ comment: modifyValue });
    try {
      const response = await axios.put(`${serverAddress}/books/${itemId}`, modifyComment, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        console.log("댓글 수정 성공");
        setCommentList(
          commentList.map((item) => (item.id === itemId ? { ...item, comment: modifyValue } : { ...item })),
        );
      }
    } catch (e: any) {
      console.log(e);
    }
  };

  // useEffect(() => {
  //   if (commentList && commentList.length > 0) {
  //     const sortedComments = [...commentList].sort((a, b) => b.id - a.id);
  //     setCommentList(sortedComments);
  //     console.log(sortedComments + "댓글리스트");

  //     });
  //   }
  // }, [commentList]);

  //화면 조회 swr
  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const response = await axios.get<BookData>(
  //         `http://localhost:9090/books`
  //       );
  //       if (response.status === 200) {
  //         const bookItem: BookItem | undefined = response.data[0].item.find(
  //           (book) => book.itemId === Number(keyword)
  //         );
  //         setDetail(bookItem);
  //       }
  //     } catch (e: any) {
  //       console.log(e);
  //     }
  //   })();
  // }, [keyword]);

  //회원정보 담기
  // useEffect(() => {
  //   if (token) {
  //     (async () => {
  //       try {
  //         const response = await axios.get<ProfileData>(`http://localhost:8081/auth/profile`, {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         });
  //         setProfile(response.data);
  //       } catch (e: any) {
  //         console.log(e);
  //       }
  //     })();
  //   }
  // }, []);

  //알림설정 디스플레이 조회
  useEffect(() => {
    if (token) {
      (async () => {
        try {
          const response = await axios.get<AlamData[]>(`${serverAddress}/books/alam`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.status === 200) {
            console.log("알림 설정값 조회 성공");
            const findedAlam = response.data.find((data) => (data.bookItemId = itemId));
            setStoreBellStates(findedAlam.alamDisplay);
          }
        } catch (e: any) {
          console.log(e + "알림설정 조회 오류");
        }
      })();
    }
  }, [itemId, setItemId]);

  useEffect(() => {
    if (token) {
      if (likeList && likeList.length > 0) {
        const likeItem = likeList.find((item) => item.profileId === profile.profileId);
        if (likeItem && likeItem.likes) {
          setShowHeartState(true);
        } else {
          setShowHeartState(false);
        }
      }
    }
  }, [likeList]);

  //서버 화면 조회
  useEffect(() => {
    const fetchBookDetail = async (itemId: string, isNew: boolean) => {
      try {
        const url = `${serverAddress}/books/${isNew ? "new/" : ""}${itemId}?${
          profileId ? `profileId=${profileId}` : ""
        }`;
        const response = await axios.get<BookItem>(url);

        if (response.status === 200) {
          setDetail(response.data);
          setItemId(response.data.itemId);
          const sortedComments = [...response.data.bookComment].sort((a, b) => b.id - a.id);
          setCommentList(sortedComments);
          setLikeList(response.data.likedBook);
        }
      } catch (e: any) {
        console.log(e);
      }
    };
    //회원 정보 담고 profileId 설정
    let profileId = 0;
    if (token) {
      (async () => {
        try {
          const response = await axios.get<ProfileData>(`${serverAddress}/auth/profile`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setProfile(response.data);
          profileId = response.data.profileId;
          if (id) {
            fetchBookDetail(id, false);
          } else if (newId) {
            console.log(newId + "신간");
            fetchBookDetail(newId, true);
          }
          if (searchItemId) {
            console.log(searchItemId + "검색 도서");
            try {
              const response = await axios.get<BookItem>(`${serverAddress}/books/itemId?itemId=${searchItemId}`);
              if (response.status === 200) {
                setDetail(response.data);
                setItemId(response.data.itemId);
                const sortedComments = [...response.data.bookComment].sort((a, b) => b.id - a.id);
                setCommentList(sortedComments);
                setLikeList(response.data.likedBook);
              }
            } catch (e: any) {
              console.log(e.message + "검색도서 조회 에러");
              if (e.message.includes("404")) {
                alert("해당 도서는 재고가 없습니다.");
                navigate("/");
              }
            }
          }
        } catch (e: any) {
          console.log(e);
        }
      })();
    } else {
      if (id) {
        fetchBookDetail(id, false);
      } else if (newId) {
        console.log(newId + "신간");
        fetchBookDetail(newId, true);
      } else if (searchItemId) {
        (async () => {
          try {
            const response = await axios.get<BookItem>(`${serverAddress}/books/itemId?itemId=${searchItemId}`);
            if (response.status === 200) {
              setDetail(response.data);
              setItemId(response.data.itemId);
              const sortedComments = [...response.data.bookComment].sort((a, b) => b.id - a.id);
              setCommentList(sortedComments);
              setLikeList(response.data.likedBook);
            }
          } catch (e: any) {
            console.log(e.message + "검색도서 조회 에러");
            if (e.message.includes("404")) {
              alert("해당 도서는 재고가 없습니다.");
              navigate("/");
            }
          }
        })();
      }
    }
  }, []);

  return (
    <>
      <PageContainer>
        <main>
          {detail ? (
            <article>
              <figure>
                <img src={`${detail.cover}`} alt={`${detail.title}`} />
              </figure>
              <aside>
                <h2>{`${detail.title}`}</h2>
                <hr />
                <div>
                  <dl>
                    <dt>출판사: </dt>
                    <p>{`${detail.publisher}`}</p>
                  </dl>
                  <dl>
                    <dt>발행일: </dt>
                    <p>{`${detail.pubDate}`}</p>
                  </dl>
                  <dl>
                    <dt>지은이: </dt>
                    <p>{`${detail.author}`}</p>
                  </dl>
                  <dl>
                    <dt>isbn: </dt>
                    <p>{`${detail.isbn}`}</p>
                  </dl>
                  <dl>
                    <dt>재고: </dt>
                    <p>{`${detail.stockStatus}`}</p>
                  </dl>
                  <dl>
                    <dt>정가: </dt>
                    <p>
                      <del>{`${detail.priceStandard}`} 원</del>
                    </p>
                  </dl>
                  <dl>
                    <dt>판매가: </dt>
                    <p>{`${detail.priceSales.toLocaleString()}`}원</p>
                  </dl>
                </div>
                <div id="amount">
                  수량:
                  <input
                    type="number"
                    // ref={numberValue}
                    value={number}
                    onChange={(e) => setNumber(parseInt(e.target.value, 10))}
                  />
                  <div>
                    <img
                      onClick={handlePlus}
                      src="https://image.aladin.co.kr/img/shop/2018/icon_Aup.png"
                      alt="위 화살표"
                    />
                    <img
                      onClick={handleMinus}
                      src="https://image.aladin.co.kr/img/shop/2018/icon_Adown.png"
                      alt="아래화살표"
                    />
                  </div>
                </div>
              </aside>
              <nav>
                <ul>
                  <StoreHeartButton id={detail.id} onClick={handleBookSave} liked={showHeartState} />
                  <li
                    onClick={() => {
                      handleThumbUp(detail.itemId);
                    }}>
                    <button className="btn">
                      {storeThumbStates[detail.itemId] ? (
                        <ThumbUp className="material-icons-outlined thumb" />
                      ) : (
                        <ThumbUpOffAlt className="material-icons-outlined" />
                      )}
                      추천
                    </button>
                  </li>
                  <li
                    onClick={() => {
                      handleThumbDown(detail.itemId);
                    }}>
                    <button className="btn">
                      {storeThumbDownStates[detail.itemId] ? (
                        <ThumbDown className="material-icons-outlined thumb" />
                      ) : (
                        <ThumbDownOffAlt className="material-icons-outlined" />
                      )}
                      싫어요
                    </button>
                  </li>
                  {detail.stockStatus !== "" &&
                    detail.stockStatus !== "0" &&
                    detail.stockStatus !== "예약판매" &&
                    detail.stockStatus !== "품절" && (
                      <CartButton
                        itemId={detail.itemId}
                        quantity={number}
                        title={detail.title}
                        cover={detail.cover}
                        priceStandard={detail.priceStandard.toString()}
                        priceSales={detail.priceSales.toString()}
                      />
                    )}
                  {(detail.stockStatus === "예약판매" ||
                    detail.stockStatus === "품절" ||
                    detail.stockStatus === "") && (
                    <button
                      className="bell"
                      onClick={() => {
                        handleBell(detail.itemId);
                      }}>
                      {storeBelltStates ? (
                        <Notifications className="material-icons-outlined" />
                      ) : (
                        <NotificationsOutlined className="material-icons-outlined" />
                      )}
                      알림설정
                    </button>
                  )}
                </ul>
              </nav>
            </article>
          ) : (
            <p>책을 찾을 수 없습니다.</p>
          )}
          <section>
            <h2>도서정보</h2>
            <hr />
            {detail?.categoryName ? (
              <span>
                <p>&lt; 카테고리 &gt;</p>
                <p>{detail.categoryName}</p>
              </span>
            ) : null}
            <figure>
              <img
                style={{ margin: "auto" }}
                src="https://image.aladin.co.kr/img/img_content/K972830273_01.jpg"
                alt="이벤트사진"
              />
            </figure>
            {detail ? (
              <article>
                {detail.description ? (
                  <>
                    <hr />
                    <div>
                      <h3>책소개</h3>
                      <p>{detail.description}</p>
                    </div>
                  </>
                ) : null}
                {detail.seriesInfo ? (
                  <>
                    <hr />
                    <div>
                      <h3>시리즈</h3>
                      <Link to={detail.seriesInfo.seriesLink}>
                        <p>{detail.seriesInfo.seriesName}</p>
                      </Link>
                    </div>
                    <hr />
                  </>
                ) : null}
              </article>
            ) : (
              <div>
                <p>책 소개 글이 없습니다.</p>
              </div>
            )}
          </section>
          <footer className="input-comment">
            <form>
              <h4>
                독자서평쓰기
                <sub>로그인을 하시면 댓글을 작성할 수 있습니다.</sub>
              </h4>
              <label>
                <textarea placeholder="댓글을 입력해주세요" cols={100} rows={10} ref={commentText}></textarea>
                <button
                  onClick={(e) => {
                    handleSaveComment(e);
                  }}>
                  등록
                </button>
              </label>
            </form>
            <CommentList comments={commentList} onClick={handleDelete} onConfirm={handleModify} id={id} newId={newId} />
          </footer>
        </main>
      </PageContainer>
    </>
  );
};

export default BookPage;
