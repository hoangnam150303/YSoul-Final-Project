import {
  FacebookFilled,
  InstagramFilled,
  LinkedinFilled,
  MailFilled,
} from "@ant-design/icons";
import React from "react";

export const Footer = () => {
  return (
    <footer className="py-6 bg-black text-white border-t border-gray-800 ">
      <div className="container mx-auto px-4 md:px-8 flex flex-col items-center justify-between md:flex-row gap-6 md:gap-0">
        {/* Copyright Section */}
        <p className="text-center text-sm leading-relaxed md:text-left">
          &copy; 2024 Entertainment App. All Rights Reserved. Built by
          <a
            href="https://github.com/hoangnam150303"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4 ml-1 hover:text-gray-300"
          >
            Hoang Nam
          </a>
        </p>

        {/* Contact Section */}
        <div className="flex items-center justify-center gap-4">
          <a
            href="https://www.facebook.com/hoangnam.vu.50767/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-gray-400 transition duration-200"
          >
            <FacebookFilled className="text-xl" />
          </a>
          <a
            href="https://mail.google.com/mail/u/0/?tab=rm&ogbl"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-gray-400 transition duration-200"
          >
            <MailFilled className="text-xl" />
          </a>
          <a
            href="https://www.instagram.com/duela.alq/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-gray-400 transition duration-200"
          >
            <InstagramFilled className="text-xl" />
          </a>
          <a
            href="https://www.linkedin.com/in/nam-vu-hoang-a671382a8/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-gray-400 transition duration-200"
          >
            <LinkedinFilled className="text-xl" />
          </a>
        </div>
      </div>
    </footer>
  );
};
