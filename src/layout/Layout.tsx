import { Link, Navigate, Outlet, useNavigate } from "react-router-dom";
import { MutableRefObject, Suspense, useEffect, useRef, useState } from "react";
import { LayoutContainer } from "./styles";
import ResetStyle from "@/styles/reset";
import { getCookie } from "@/utils/cookie";
import { AccountCircleOutlined, ExitToApp, LibraryBooks } from "@mui/icons-material";
import home_icon from "../assets/homepage-icon.png";
import { isLocalhost } from "@/modules/books/data";

const Layout = () => {
  const navigate = useNavigate();
  const searchRef = useRef() as MutableRefObject<HTMLInputElement>;

  const [selectedOption, setSelectedOption] = useState("");
  const [cookie, SetCookie] = useState("");

  const handleLogout = () => {
    const serverAddress = window.location.hostname;
    document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${serverAddress}`;
    navigate("/");
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate(`/search?option=${selectedOption}&keyword=${searchRef.current.value}`);
    setSelectedOption("");
    searchRef.current.value = "";
  };

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleMoveCart = () => {
    if (cookie) {
      navigate("/order/list"); // token이 있는 경우에만 이동
    } else {
      alert("로그인 후 이용해주세요.");
    }
  };

  useEffect(() => {
    SetCookie(getCookie("token"));
  }, [getCookie("token")]);

  return (
    <LayoutContainer>
      <ResetStyle />
      <div id="center">
        <header>
          <div>
            <aside>
              {!cookie ? (
                <Link to="/login">
                  <button>
                    <AccountCircleOutlined className="material-symbols-outlined" />
                  </button>
                </Link>
              ) : (
                <button onClick={handleLogout}>
                  <ExitToApp className="material-symbols-outlined" />
                </button>
              )}
              <button onClick={handleMoveCart}>
                <LibraryBooks className="material-symbols-outlined" />
              </button>
            </aside>
            <div id="searchForm">
              <h1>
                <Link to="/">
                  <img src={home_icon} alt="home icon" height={80} />
                </Link>
              </h1>
              <form onSubmit={handleSearch}>
                <label>
                  <select value={selectedOption} onChange={handleChange}>
                    <option value="">통합검색</option>
                    <option value="국내도서">국내도서</option>
                    <option value="외국도서">외국도서</option>
                    {/* <option value="리뷰">리뷰</option> */}
                  </select>
                  <input ref={searchRef} />
                  <button type="submit" className="material-symbols-outlined">
                    search
                  </button>
                </label>
              </form>
            </div>
          </div>
          <nav className="header-nav">
            <ul>
              <li>
                <Link to="/best">베스트도서</Link>
              </li>
              <li>
                <Link to="/new">신간도서</Link>
              </li>
              <li>
                <Link to="/books">국내도서</Link>
              </li>
              <li>
                <Link to="/foreign">외국도서</Link>
              </li>
              <li>
                <Link to="/cart">장바구니</Link>
              </li>
            </ul>
          </nav>
        </header>

        <main>
          {/* 세부경로의 컴포넌트들이 로딩위치 */}
          <Suspense fallback={<div>Loading...</div>}>
            <Outlet />
          </Suspense>
        </main>
      </div>
      <footer className="cite">
        <div>
          <span>
            <h1>B.T.S</h1>
            <h5>be the story</h5>
          </span>
          <address>
            <div>
              <h4>
                <strong>동아출판(주)</strong>
              </h4>
              <p>
                <b>주소 : </b> 서울특별시 마포구 신촌로 94, 7층(노고산동, 그랜드플라자)
              </p>
              <span>
                <b>대표 : </b>김대현
              </span>
              <span>
                <b>사업자번호 : </b>187-85-01021
              </span>
            </div>
            <span>
              <strong>ⓒ THEJOEUN ACADEMY Corp.</strong>
            </span>
          </address>
          <h2>고객센터 : 02.716.1006</h2>
        </div>
      </footer>
    </LayoutContainer>
  );
};

export default Layout;
