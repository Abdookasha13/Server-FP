import Course from "../Models/courseModel.js";
import Category from "../Models/categoryModel.js";
import Event from "../Models/eventModel.js";
import Service from "../Models/servicesModel.js";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

//   try {
//     const { question } = req.body;

//     const courses = await Course.find({}, "title price duration").limit(5);

//     if (!courses.length) {
//       return res.json({ answer: "لا توجد كورسات متاحة حالياً." });
//     }

//     const coursesText = courses
//       .map(
//         (c) =>
//           `- ${c.title} | السعر: ${c.price} جنيه | المدة: ${c.duration}`
//       )
//       .join("\n");

//     const completion = await openai.chat.completions.create({
//       model: "gpt-4o-mini",
//       temperature: 0,
//       messages: [
//         {
//           role: "system",
//           content: `
// أنت مساعد لمنصة تعليمية.
// ممنوع تخترع أي معلومات.
// جاوب فقط من البيانات التالية:
// ${coursesText}
// اللغة: عربي
//           `,
//         },
//         { role: "user", content: question },
//       ],
//     });

//     res.json({
//       answer: completion.choices[0].message.content,
//     });
//   } catch (err) {
//     res.status(500).json({ message: "AI Error" });
//   }
// };

export const autoReply = async (req, res) => {
  try {
    const { question } = req.body;

    const lang = /[\u0600-\u06FF]/.test(question) ? "ar" : "en";

    const courses = await Course.find(
      {},
      "title price discountPrice isFree"
    );
    const categories = await Category.find({}, "name");
    const events = await Event.find({}, "title date location");
    const services = await Service.find({}, "title description");

    const coursesText = courses
      .map((c) => {
        if (c.isFree) {
          return `- ${c.title[lang]} | ${lang === "ar" ? "مجاني" : "Free"}`;
        }

        if (c.discountPrice) {
          return `- ${c.title[lang]}
${lang === "ar" ? "السعر الأصلي" : "Original price"}: ${c.price}
${lang === "ar" ? "السعر بعد الخصم" : "Price after discount"}: ${c.discountPrice}`;
        }

        return `- ${c.title[lang]}
${lang === "ar" ? "السعر" : "Price"}: ${c.price}`;
      })
      .join("\n\n");

    const categoriesText = categories
      .map((c) => `- ${c.name[lang]}`)
      .join("\n");

    const eventsText = events
      .map(
        (e) => `- ${e.title[lang]}
${lang === "ar" ? "المكان" : "Location"}: ${e.location[lang]}`
      )
      .join("\n\n");

    const servicesText = services
      .map(
        (s) => `- ${s.title[lang]}: ${s.description[lang]}`
      )
      .join("\n");

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0,
      messages: [
        {
          role: "system",
          content: `
You are a support assistant for an e-learning platform.
Do NOT invent information.
Answer only from the data below.
Language: ${lang === "ar" ? "Arabic" : "English"}

=== Courses ===
${coursesText}

=== Categories ===
${categoriesText}

=== Events ===
${eventsText}

=== Services ===
${servicesText}
          `,
        },
        { role: "user", content: question },
      ],
    });

    res.json({ answer: completion.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ message: "AI Error" });
  }
};

