import { Route, Routes } from "react-router-dom";
import { LoginPage } from "../pages/GeneralPages/LoginPage";
import { MovieHomePage } from "../pages/MoviePages/MovieHomePage";
import { SignUpPage } from "../pages/GeneralPages/SignUpPage";
import { ApproveAccount } from "../pages/GeneralPages/ApproveAccount";
import { Footer } from "../components/Footer/Footer";
import { WatchPage } from "../pages/MoviePages/WatchPage";
import { SearchPage } from "../pages/MoviePages/SearchPage";
import { NotFoundPage } from "../pages/GeneralPages/404";
import { FavouriteMoviePage } from "../pages/MoviePages/FavouriteMoviePage";
import { AdminHomePage } from "../pages/AdminPages/AdminHomePage";
import { CRUDFilmPage } from "../pages/AdminPages/CRUDFilmPage";
import PaymentPage from "../pages/GeneralPages/paymentPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<MovieHomePage />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/signup" element={<SignUpPage />}></Route>
        <Route path="/approve" element={<ApproveAccount />}></Route>
        <Route path="/watchPage/:movieId" element={<WatchPage />}></Route>
        <Route path="/search" element={<SearchPage />}></Route>
        <Route path="/*" element={<NotFoundPage />}></Route>
        <Route path="/favouriteMovie" element={<FavouriteMoviePage />}></Route>
        <Route path="/homePageAdmin" element={<AdminHomePage />}></Route>
        <Route path="/movieAdmin" element={<CRUDFilmPage />}></Route>
        <Route path="/payment" element={<PaymentPage />}></Route>
      </Routes>
      <Footer />
    </>
  );
}

export default App;
