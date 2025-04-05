import React, { useEffect } from "react";
import { SocialProfileHeader } from "../../components/Header/SocialProfileHeader";
import { ListPost } from "../../components/Post/ListPost";
import { SocialHeader } from "../../components/Header/SocialHeader";
import { useParams } from "react-router-dom";
import userApi from "../../hooks/userApi";

export const ProfileSocialPage = () => {
  const {id} = useParams();
  const [data, setData] = React.useState([]);
  const fetchUserProfile = async ()=>{
    const response = await userApi.getDetailUser(id);
    console.log(response.data.data);
    setData(response.data.data);
    if (response.success) {
      setUser(response.user);
    } else {
      console.log(response.error);
    }
  }
  useEffect(() => {
    fetchUserProfile();
  }, [id]);
  return (
    <>
    <SocialHeader />
      <div className="max-w-4xl mx-auto p-4 ">
        <SocialProfileHeader data={data} />
        <div>
          <ListPost type={"profile"} />
        </div>
      </div>
    </>
  );
};
