import { HomeOutlined } from "@ant-design/icons";
import { Breadcrumb } from "antd";
import React from "react";

export const BreadCrumb = ({ pageName }) => {
  return (
    <div className="z-50 pl-40 pt-10">
      <Breadcrumb
        items={[
          {
            title: (
              <a href="/MusicHomePage" style={{ color: "white", fontSize: "15px" }}>
                <HomeOutlined />
              </a>
            ),
          },
          {
            title: (
              <a href="" style={{ color: "white", fontSize: "15px" }}>
                {pageName}
              </a>
            ),
          },
          {
            title: <a href="">{pageName}</a>,
          },
        ]}
      />
    </div>
  );
};
