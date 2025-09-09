import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "../pages/GeneralPages/LoginPage";
import { MovieHomePage } from "../pages/MoviePages/MovieHomePage";
import { SignUpPage } from "../pages/GeneralPages/SignUpPage";
import { Footer } from "../components/Footer/Footer";
import { WatchPage } from "../pages/MoviePages/WatchPage";
import { SearchPage } from "../pages/MoviePages/SearchPage";
import { NotFoundPage } from "../pages/GeneralPages/404";
import { AdminHomePage } from "../pages/AdminPages/AdminHomePage";
import { CRUDFilmPage } from "../pages/AdminPages/CRUDFilmPage";
import PaymentPage from "../pages/GeneralPages/PaymentPage";
import PaymentSuccess from "../pages/GeneralPages/PaymentSuccessPage";
import { MusicHomePage } from "../pages/MusicPages/MusicHomePage";
import { AlbumPage } from "../pages/MusicPages/AlbumPage";
import { CRUDMusicPage } from "../pages/AdminPages/CRUDMusicPage";
import { ArtistPage } from "../pages/MusicPages/ArtistPage";
import UserProfilePage from "../pages/GeneralPages/UserProfilePage";
import { useSelector, useDispatch } from "react-redux";
import LoadingPage from "../components/Loading/LoadingPage";
import { Suspense, useEffect, useState } from "react";
import { AccountPage } from "../pages/AdminPages/AccountPage";
import { MusicSearchPage } from "../pages/MusicPages/MusicSearchPage";
import HomePageMarket from "../pages/NFTMarketPlacePage/HomePageMarket";
import StoreProfile from "../pages/NFTMarketPlacePage/StoreProfile";
import { SocialHomePage } from "../pages/SocialMediaPage/SocialHomePage";
import { NotificationPage } from "../pages/SocialMediaPage/NottificationPage";
import { NetworkPage } from "../pages/SocialMediaPage/NetworkPage";
import { ProfileSocialPage } from "../pages/SocialMediaPage/ProfileSocialPage";
import PostPage from "../pages/SocialMediaPage/PostPage";
import ChatPage from "../pages/SocialMediaPage/ChatPage";
import NFTsPage from "../pages/NFTMarketPlacePage/NFTsPage";
import { ArtistNFTsPage } from "../pages/NFTMarketPlacePage/ArtistNFTsPage";
import SinglePage from "../pages/MusicPages/SinglePage";
import FavouritePage from "../pages/GeneralPages/FavouritePage";

import { getUserRequest } from "../reducers/user";
import SendCodePage from "../pages/GeneralPages/SendCodePage";
import { ForgotPasswordPage } from "../pages/GeneralPages/ForgotPasswordPage";
function AppRoutes() {
  const dispatch = useDispatch();

  const [hasFetchedUser, setHasFetchedUser] = useState(false);

  const userId = useSelector((state) => state.user.id);
  const isVip = useSelector((state) => state.user.vip);
  const is_admin = useSelector((state) => state.user.is_admin);

  const isLoggedIn = userId !== null && userId !== undefined && userId !== 0;

  // ✅ Sau khi redux-persist khôi phục xong, ta fetch lại user (1 lần duy nhất)
  useEffect(() => {
    const fetchUserOnce = async () => {
      try {
        await dispatch(getUserRequest());
        setHasFetchedUser(true);
      } catch (err) {
        setHasFetchedUser(true); // vẫn set true để không kẹt mãi
      }
    };
    fetchUserOnce();
  }, [dispatch]);

  // ⏳ Trong lúc chưa fetch xong user, render loading
  if (!hasFetchedUser) return <LoadingPage />;

  return (
    <Suspense fallback={<LoadingPage />}>
      <Routes>
        {/* Public */}
        <Route path="/" element={<MovieHomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/sendCode" element={<SendCodePage />} />
        <Route path="/forgotPassword" element={<ForgotPasswordPage />} />

        <Route
          path="/paymentSuccess/:invoice_id"
          element={<PaymentSuccess />}
        />
        <Route path="/singlePage/:id" element={<SinglePage />} />

        {/* Login required */}
        <Route
          path="/watchPage/:movieId"
          element={isLoggedIn ? <WatchPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/userProfile"
          element={isLoggedIn ? <UserProfilePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/favourite"
          element={isLoggedIn ? <FavouritePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/socialHomePage"
          element={isLoggedIn ? <SocialHomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/notification"
          element={isLoggedIn ? <NotificationPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/network"
          element={isLoggedIn ? <NetworkPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile/:id"
          element={
            isLoggedIn ? <ProfileSocialPage /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/post/:id"
          element={isLoggedIn ? <PostPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/chat"
          element={isLoggedIn ? <ChatPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/payment"
          element={
            isLoggedIn ? (
              isVip ? (
                <Navigate to="/" />
              ) : (
                <PaymentPage />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Admin */}
        {isLoggedIn && is_admin && (
          <>
            <Route path="/homePageAdmin" element={<AdminHomePage />} />
            <Route path="/movieAdmin" element={<CRUDFilmPage />} />
            <Route path="/musicAdmin" element={<CRUDMusicPage />} />
            <Route path="/userAccount" element={<AccountPage />} />
          </>
        )}

        {/* VIP */}
        <Route
          path="/*"
          element={
            isLoggedIn ? (
              isVip ? (
                <VIPRoutes />
              ) : (
                <Navigate to="/payment" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
      <Footer />
    </Suspense>
  );
}

export default AppRoutes;

// VIP-only routes
const VIPRoutes = () => (
  <Routes>
    <Route path="/musicHomePage" element={<MusicHomePage />} />

    <Route path="/album/:id" element={<AlbumPage />} />
    <Route path="/artist/:id" element={<ArtistPage />} />

    <Route path="/searchPageMuscic" element={<MusicSearchPage />} />
    <Route path="/market" element={<HomePageMarket />} />
    <Route path="/store/:id?" element={<StoreProfile />} />

    <Route path="/NFTs" element={<NFTsPage />} />
    <Route path="/ArtistNFTs" element={<ArtistNFTsPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export { VIPRoutes };
