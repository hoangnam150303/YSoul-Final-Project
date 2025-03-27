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
import { MusicSearchPage } from "../pages/MusicPages/MusicSearchPage";
import HomePageMarket from "../pages/NFTMarketPlacePage/HomePageMarket";
import StoreProfile from "../pages/NFTMarketPlacePage/StoreProfile";
import { SocialHomePage } from "../pages/SocialMediaPage/SocialHomePage";
import { NotificationPage } from "../pages/SocialMediaPage/NottificationPage";
import { NetworkPage } from "../pages/SocialMediaPage/NetworkPage";

function App() {
  const dispatch = useDispatch();
  dispatch(getUserRequest());
  const isVip = useSelector((state) => state.user.vip);
  const is_admin = useSelector((state) => state.user.is_admin);

  return (
    <Suspense fallback={<LoadingPage />}>
      <Routes>
        <Route path="/" element={<MovieHomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/watchPage/:movieId" element={<WatchPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/*" element={<NotFoundPage />} />

        <Route
          path="/payment"
          element={isVip ? <Navigate to="/" /> : <PaymentPage />}
        />

        {is_admin && (
          <>
            <Route path="/homePageAdmin" element={<AdminHomePage />} />
            <Route path="/movieAdmin" element={<CRUDFilmPage />} />
            <Route path="/musicAdmin" element={<CRUDMusicPage />} />
            <Route path="/userAccount" element={<AccountPage />} />
          </>
        )}

        {isVip ? (
          <>
            <Route path="/musicHomePage" element={<MusicHomePage />} />
            <Route path="/userProfile" element={<UserProfilePage />} />
            <Route
              path="/paymentSuccess/:invoice_id"
              element={<Navigate to="/" />}
            />
            <Route path="/album/:id" element={<AlbumPage />} />
            <Route path="/artist/:id" element={<ArtistPage />} />
            <Route path="/favouriteMovie" element={<FavouriteMoviePage />} />
            <Route path="/searchPageMuscic" element={<MusicSearchPage />} />
            <Route path="/market" element={<HomePageMarket />} />
            <Route path="/store/:id?" element={<StoreProfile />} />
            <Route path="/socialHomePage" element={<SocialHomePage />} />
            <Route path="/notificationPage" element={<NotificationPage />} />
            <Route path="/network" element={<NetworkPage />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/payment" />} />
        )}
      </Routes>
      <Footer />
    </Suspense>
  );
}

export default App;
