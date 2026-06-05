-- Replace anonymous / placeholder testimonials with one named quote (audit).
delete from public.testimonials;

insert into public.testimonials (
  quote,
  author_name,
  author_role,
  author_org,
  active
)
values (
  'I have watched a lot of software promise to fix trade and fix nothing. This is the first that understood the documentation, the counterparty risk, and the payment side as one problem. They built from Nigerian reality outward, not from a foreign template inward.',
  'Tochukwu Kpajie',
  'Chairman / CEO',
  'STK Industries Nigeria Ltd',
  true
);
