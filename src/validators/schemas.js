const { z } = require("zod");
const { UPCOMING_STATUSES } = require("../models/UpcomingProduct");
const { STAT_FIELDS } = require("../models/Stats");

const text = (max = 200) => z.string().trim().max(max);
const requiredText = (max = 200) => text(max).min(1, "Required");
const optionalText = (max = 200) => text(max).optional().default("");
const url = z.string().trim().max(2000).url("Must be a valid URL");
const optionalUrl = z.union([url, z.literal("")]).optional().default("");
// Drops blank entries that come from empty repeater rows in admin forms.
const stringList = (max = 300) => z.array(text(max)).max(50).default([]).transform((items) => items.filter(Boolean));
const stringMap = z
  .record(text(100), text(500))
  .default({})
  .transform((map) => Object.fromEntries(Object.entries(map).filter(([key, value]) => key && value)));

const product = z.object({
  id: text(80).optional(),
  name: requiredText(120),
  category: requiredText(80),
  tagline: optionalText(200),
  image: optionalUrl,
  description: optionalText(5000),
  features: stringList(),
  specifications: stringMap,
  dosage: stringMap,
  benefits: z
    .array(z.object({ title: text(120), description: text(500).default(""), icon: text(40).default("") }))
    .max(20)
    .default([])
    .transform((items) => items.filter((b) => b.title)),
});

const upcomingProduct = z.object({
  name: requiredText(120),
  category: requiredText(80),
  expectedLaunch: requiredText(60),
  status: z.enum(UPCOMING_STATUSES).default("In Development"),
});

const facility = z.object({
  name: requiredText(120),
  description: requiredText(2000),
  capacity: requiredText(120),
  features: stringList(),
  icon: text(40).default("Factory"),
});

const cropSolution = z.object({
  name: requiredText(80),
  icon: text(40).default("Sprout"),
  image: url,
  description: requiredText(3000),
  diseases: stringList(),
  solutions: z
    .array(z.object({ name: text(120), type: text(120) }))
    .max(30)
    .default([])
    .transform((items) => items.filter((s) => s.name && s.type)),
  tips: stringList(500),
});

const video = z.object({
  title: requiredText(200),
  crop: requiredText(80),
  category: requiredText(80),
  duration: requiredText(20),
  views: text(20).default("0"),
  description: requiredText(2000),
  thumbnail: url,
  expert: requiredText(120),
  videoUrl: url,
});

const pdfMeta = z.object({
  title: requiredText(200),
  category: requiredText(80),
  description: optionalText(2000),
  date: text(40).optional(),
});

const stats = z.object(Object.fromEntries(STAT_FIELDS.map((field) => [field, text(40).optional()])));

const contact = z.object({
  name: requiredText(100),
  email: z.string().trim().email("Please enter a valid email address").max(200),
  phone: z
    .string()
    .trim()
    .max(20)
    .regex(/^[0-9+\-\s()]*$/, "Please enter a valid phone number")
    .optional()
    .default(""),
  subject: optionalText(200),
  message: requiredText(5000),
  // Honeypot field (hidden on the website); anything here marks the submission as spam.
  website: text(200).optional().default(""),
});

const login = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1).max(200),
});

const changePassword = z.object({
  currentPassword: z.string().min(1),
  newPassword: z
    .string()
    .min(10, "Password must be at least 10 characters")
    .max(200)
    .regex(/[a-z]/i, "Password must include a letter")
    .regex(/[0-9]/, "Password must include a number"),
});

const inquiryUpdate = z.object({ read: z.boolean() });

module.exports = {
  product,
  upcomingProduct,
  facility,
  cropSolution,
  video,
  pdfMeta,
  stats,
  contact,
  login,
  changePassword,
  inquiryUpdate,
};
