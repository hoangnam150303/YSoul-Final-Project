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
import { useSelector } from "react-redux";
import LoadingPage from "../components/Loading/LoadingPage";
import { Suspense, useEffect } from "react";
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

function App() {
  const {
    id: userId,
    vip: isVip,
    is_admin,
  } = useSelector((state) => state.user);
  return (
    <Suspense fallback={<LoadingPage />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MovieHomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route
          path="/paymentSuccess/:invoice_id"
          element={<PaymentSuccess />}
        />

        {/* WatchPage - chỉ cho người đã đăng nhập */}
        <Route
          path="/watchPage/:movieId"
          element={userId !== "" ? <WatchPage /> : <Navigate to="/login" />}
        />

        {/* PaymentPage - nếu đã là VIP thì không cho vào */}
        <Route
          path="/payment"
          element={isVip ? <Navigate to="/" /> : <PaymentPage />}
        />

        {/* Admin Routes */}
        {is_admin ? (
          <>
            <Route path="/homePageAdmin" element={<AdminHomePage />} />
            <Route path="/movieAdmin" element={<CRUDFilmPage />} />
            <Route path="/musicAdmin" element={<CRUDMusicPage />} />
            <Route path="/userAccount" element={<AccountPage />} />
          </>
        ) : null}

        {/* VIP Routes */}
        {/* Routes yêu cầu VIP */}
        <Route
          path="/*"
          element={isVip ? <VIPRoutes /> : <Navigate to="/payment" />}
        />
      </Routes>
      <Footer />
    </Suspense>
  );
}

export default App;

const VIPRoutes = () => (
  <Routes>
    <Route path="/musicHomePage" element={<MusicHomePage />} />
    <Route path="/userProfile" element={<UserProfilePage />} />
    <Route path="/album/:id" element={<AlbumPage />} />
    <Route path="/singlePage/:id" element={<SinglePage />} />
    <Route path="/artist/:id" element={<ArtistPage />} />
    <Route path="/favouriteMovie" element={<FavouriteMoviePage />} />
    <Route path="/searchPageMuscic" element={<MusicSearchPage />} />
    <Route path="/market" element={<HomePageMarket />} />
    <Route path="/store/:id?" element={<StoreProfile />} />
    <Route path="/socialHomePage" element={<SocialHomePage />} />
    <Route path="/notification" element={<NotificationPage />} />
    <Route path="/network" element={<NetworkPage />} />
    <Route path="/profile/:id" element={<ProfileSocialPage />} />
    <Route path="/post/:id" element={<PostPage />} />
    <Route path="/chat" element={<ChatPage />} />
    <Route path="/NFTs" element={<NFTsPage />} />
    <Route path="/ArtistNFTs" element={<ArtistNFTsPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export { VIPRoutes };
