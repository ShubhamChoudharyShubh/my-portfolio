-- Optional seed: run after migration + creating an admin user.
-- Replace profile/about copy as needed.

insert into public.profiles (name, title, bio, image_url)
values (
  'Shubham Choudhary',
  'Full-Stack & WordPress Developer',
  null,
  '/shubham.png'
);

insert into public.about (description)
values (
  E'Hi, I''m Shubham — a Full-Stack & WordPress Developer passionate about building fast, modern, and scalable web experiences.\n\nI have 3+ years of hands-on experience and have delivered 25+ projects worldwide, working with technologies like React, Next.js, PHP, MySQL, and WordPress.\n\nI''m currently working at MPSEDC - State IT Center as a Graduate Engineer Trainee, focusing on web development and digital solutions.'
);

insert into public.education (title, institute, field, score, start_year, end_year, tech_stack)
values
  ('B.Tech in Computer Science & Business Systems', 'SOIT, RGPV Bhopal', 'Computer Science & Engineering', 'CGPA: 7.2 / 10', '2021', '2025', '[]'::jsonb),
  ('JEE Preparation', 'Allen Career Institute, Kota', 'Engineering Entrance Exam Preparation', '68 Percentile', '2019', '2021', '[]'::jsonb),
  ('Class 12th (MP Board)', 'Government School, Mandsaur', 'Higher Secondary Education', '83%', '2018', '2019', '[]'::jsonb);

insert into public.experience (role, company, description, start_year, end_year, tech_stack)
values
  (
    'Graduate Engineering Trainee',
    'MPSeDC - State IT Center',
    E'Contribute to internal web platforms and digital services for state IT initiatives.\nCollaborate with teams to ship maintainable, accessible interfaces.\nSupport delivery timelines through clear documentation and iterative delivery.',
    'Oct 2025',
    'Present',
    '[]'::jsonb
  ),
  (
    'Freelance Web Developer',
    'Self-Employed',
    E'Built and shipped client sites with React, Next.js, PHP, and WordPress.\nOwned requirements, implementation, and handover for 25+ delivered projects.\nFocused on performance, SEO basics, and responsive layouts across devices.',
    'Jan 2022',
    'Present',
    '[]'::jsonb
  );

insert into public.projects (title, description, tech_stack, category, live_url, image_url)
values
  (
    'The Bake Angels',
    E'E-commerce cake & flower delivery platform\n\nE-commerce storefront with catalog, cart, checkout, and delivery flows.\n\nClearer shopping path and faster page loads for a smoother customer experience.',
    '["WordPress","WooCommerce","PHP","MySQL"]'::jsonb,
    'WordPress',
    'https://thebakeangels.com'
  ),
  (
    'KSW Cargo',
    E'Logistics and air cargo website\n\nCorporate site highlighting services, routes, and inquiry forms for cargo clients.\n\nMore credible brand presence and easier contact for new business leads.',
    '["WordPress","PHP"]'::jsonb,
    'WordPress',
    'https://kswcargo.com'
  ),
  (
    'Securigeek',
    E'Cybersecurity services website\n\nService pages, trust-focused layout, and lead capture tuned for B2B visitors.\n\nImproved clarity of offerings and stronger first impression for prospects.',
    '["WordPress","PHP","MySQL"]'::jsonb,
    'WordPress',
    'https://securigeek.com'
  ),
  (
    'PHP Discussion Board',
    E'Dynamic discussion forum built using PHP and MySQL\n\nForum with threads, replies, auth basics, and server-rendered dynamic pages.\n\nDemonstrated secure-ish patterns and performant listing for community posts.',
    '["PHP","MySQL","HTML/CSS","JavaScript"]'::jsonb,
    'PHP/MySQL',
    'https://discussphp.shubhamchoudharyshubh.in'
  );
