"use client";

import React from "react";
import {
  FaXTwitter,
  FaGithub,
  FaInstagram,
  FaWhatsapp,
  FaLinkedinIn,
} from "react-icons/fa6";
import { TbMailFilled } from "react-icons/tb";
import { socialLinks } from "app/config";

function SocialLink({ href, icon: Icon }) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : "_self"}
      rel="noopener noreferrer"
      className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-700 dark:border-neutral-600 dark:bg-neutral-950 dark:text-neutral-300"
    >
      <Icon className="text-lg" />
    </a>
  );
}

function SocialLinks() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <SocialLink href={socialLinks.twitter} icon={FaXTwitter} />
      <SocialLink href={socialLinks.github} icon={FaGithub} />
      <SocialLink href={socialLinks.instagram} icon={FaInstagram} />
      <SocialLink href={socialLinks.linkedin} icon={FaLinkedinIn} />
      <SocialLink href={socialLinks.email} icon={TbMailFilled} />
      <SocialLink href={socialLinks.whatsapp} icon={FaWhatsapp} />
    </div>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-12 border-t border-neutral-200 py-8 dark:border-neutral-800 w-full">
      <div className="w-full">
        <div className="mb-6">
          <h3 className="mb-4 text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Connect with me
          </h3>
          <SocialLinks />
        </div>

        <div className="text-sm text-neutral-500 dark:text-neutral-400">
          <p>&copy; {currentYear} Shubham Choudhary. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
