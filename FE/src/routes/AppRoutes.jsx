import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "../pages/GeneralPages/LoginPage";
import { MovieHomePage } from "../pages/MoviePages/MovieHomePage";
import { SignUpPage } from "../pages/GeneralPages/SignUpPage";
import { Footer } from "../components/Footer/Footer";
import { WatchPage } from "../pages/MoviePages/WatchPage";
import { SearchPage } from "../pages/MoviePages/SearchPage";
import { NotFoundPage } from "../pages/GeneralPages/404";
import { FavouriteMoviePage } from "../pages/MoviePages/FavouriteMoviePage";
import { AdminHomePage } from "../pages/AdminPages/AdminHomePage";
import { CRUDFilmPage } from "../pages/AdminPages/CRUDFilmPage";
import PaymentPage from "../pages/GeneralPages/PaymentPage";
import PaymentSuccess from "../pages/GeneralPages/PaymentSuccessPage";
import { MusicHomePage } from "../pages/MusicPages/MusicHomePage";
import { AlbumPage } from "../pages/MusicPages/AlbumPage";
import { CRUDMusicPage } from "../pages/AdminPages/CRUDMusicPage";
import { ArtistPage } from "../pages/MusicPages/ArtistPage";
import UserProfilePage from "../pages/GeneralPages/UserProfilePage";
import { useDispatch, useSelector } from "react-redux";
import { getUserRequest } from "../reducers/user";
import LoadingPage from "../components/Loading/LoadingPage";
import { Suspense } from "react";
import { AccountPage } from "../pages/AdminPages/AccountPage";

function App() {
  const dispatch = useDispatch();
  dispatch(getUserRequest());
  const isVip = useSelector((state) => state.user.vip);
  const is_admin = useSelector((state) => state.user.is_admin);

  return (
    <Suspense fallback={<LoadingPage />}>
      <Routes>
        <Route path="/" element={<MovieHomePage />}></Route>

        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/signup" element={<SignUpPage />}></Route>
        <Route path="/watchPage/:movieId" element={<WatchPage />}></Route>
        <Route path="/search" element={<SearchPage />}></Route>
        <Route path="/*" element={<NotFoundPage />}></Route>

        {is_admin && (
          <>
            <Route
              path="/homePageAdmin"
              element={is_admin ? <AdminHomePage /> : <Navigate to="/" />}
            ></Route>
            <Route
              path="/movieAdmin"
              element={is_admin ? <CRUDFilmPage /> : <Navigate to="/" />}
            ></Route>
            <Route
              path="/musicAdmin"
              element={is_admin ? <CRUDMusicPage /> : <Navigate to="/" />}
            ></Route>
            <Route path="/userAccount" element={<AccountPage />}>

            </Route>
          </>
        )}
        {isVip && (
          <>
            <Route
              path="/musicHomePage"
              element={isVip ? <MusicHomePage /> : <Navigate to="/payment" />}
            ></Route>
            <Route
              path="/payment"
              element={isVip ? <Navigate to="/" /> : <PaymentPage />}
            ></Route>
            <Route path="/userProfile" element={<UserProfilePage />}></Route>
            <Route
              path="/paymentSuccess/:invoice_id"
              element={isVip ? <Navigate to="/" /> : <PaymentSuccess />}
            ></Route>
            <Route
              path="/album/:id"
              element={isVip ? <AlbumPage /> : <Navigate to="/payment" />}
            ></Route>
            <Route
              path="/artist/:id"
              element={isVip ? <ArtistPage /> : <Navigate to="/payment" />}
            ></Route>
            <Route
              path="/favouriteMovie"
              element={isVip ? <Navigate to="/" /> : <FavouriteMoviePage />}
            ></Route>
          </>
        )}
      </Routes>
      <Footer />
    </Suspense>
  );
}

export default App;
