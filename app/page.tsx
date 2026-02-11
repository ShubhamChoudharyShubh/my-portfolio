import Image from "next/image";
import Link from "next/link";
import { socialLinks } from "./config";

export default function Page() {
  return (
    <section className="space-y-8">
      {/* Profile Image */}
      <div className="flex justify-start">
        <div className="relative group">
          <div
            aria-hidden
            className="absolute -inset-1 rounded-[32px] bg-gradient-to-br from-neutral-200 to-neutral-300 opacity-75 blur-lg transition duration-500 group-hover:opacity-100 dark:from-neutral-700 dark:to-neutral-800"
          />
          <Image
            src="/profile.jpg"
            alt="Shubham Choudhary"
            width={160}
            height={160}
            priority
            className="relative rounded-[30px] border-2 border-white object-cover shadow-xl transition duration-500 grayscale hover:grayscale-0 dark:border-neutral-800"
          />
        </div>
      </div>

      {/* Heading */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
          About Me
        </h1>
        <div className="mt-2 h-1 w-16 rounded-full bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-neutral-100 dark:to-neutral-400" />
      </div>

      {/* Content */}
      <div className="prose prose-neutral max-w-none dark:prose-invert prose-p:leading-relaxed prose-a:font-medium prose-a:text-neutral-900 prose-a:underline prose-a:decoration-neutral-300 prose-a:underline-offset-4 hover:prose-a:decoration-neutral-600 dark:prose-a:text-neutral-100 dark:prose-a:decoration-neutral-700 dark:hover:prose-a:decoration-neutral-400">
        <p>
          Hi, I'm Shubham — a Full-Stack & WordPress Developer passionate about
          building fast, modern, and scalable web experiences.
        </p>
        <p>
          I have 3+ years of hands-on experience and have delivered 25+ projects
          worldwide, working with technologies like React, Next.js, PHP,
          MySQL, and WordPress.
        </p>
        <p>
          I'm currently working at <span className="font-medium">MPSEDC - State IT Center</span> as a Graduate Engineer Trainee, focusing on
          web development and digital solutions.
        </p>
        <p>
          Check out my <Link href="/projects">Projects</Link> to see my work or{" "}
          <a href={socialLinks.email}>get in touch</a> to collaborate.
        </p>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-wrap gap-3 pt-2">
        <Link
          href="/projects"
          className="inline-flex items-center justify-center rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl dark:bg-neutral-100 dark:text-neutral-900"
        >
          View Projects
        </Link>
        <a
          href={socialLinks.email}
          className="inline-flex items-center justify-center rounded-lg border-2 border-neutral-300 px-5 py-2.5 text-sm font-semibold text-neutral-700 transition-all hover:-translate-y-0.5 hover:border-neutral-400 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-200"
        >
          Get in Touch
        </a>
      </div>
    </section>
  );
}
