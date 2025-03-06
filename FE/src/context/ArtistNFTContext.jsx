import {
  Children,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import artistNFTApi from "../hooks/artistNFTApi";
import { TransactionContext } from "./TransactionContext";

export const ArtistNFTContext = createContext();
export const ArtistNFTProvier = ({ children }) => {
  const [isArtist, setIsArtist] = useState(false);
  const { currentAccount } = useContext(TransactionContext);
  const checkIsArtist = async () => {
    try {
      const response = await artistNFTApi.getArtist(currentAccount);
      if (response.status !== 200) {
        setIsArtist(false);
      } else {
        setIsArtist(true);
      }
    } catch (error) {
    }
  };
  useEffect(() => {
    checkIsArtist();
  }, [currentAccount]);
  return (
    <ArtistNFTContext.Provider value={{ isArtist }}>
      {children}
    </ArtistNFTContext.Provider>
  );
};
