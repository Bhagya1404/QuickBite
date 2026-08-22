const { GoogleGenerativeAI } = require("@google/generative-ai");
const Food = require("../models/Food");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const askAI = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
    }

    // Get all foods from MongoDB
    const foods = await Food.find();

    const menu = foods.map((food) => ({
      name: food.name,
      price: food.price,
      description: food.description,
      category: food.category,
    }));

    const model = genAI.getGenerativeModel({
      model: "gemini-3.5-flash",
    });

    const result = await model.generateContent(`
    You are QuickBite AI, a friendly AI food assistant.

    You ONLY recommend foods from the menu below.

    MENU:
    ${JSON.stringify(menu)}

    Conversation:
    ${prompt}

    Rules:

    1. Understand the conversation.
    2. If user asks "something different", NEVER recommend the previous food.
    3. If user asks "surprise me", randomly choose ANY food from the menu.
    4. Recommend only ONE food.
    5. Explain why.
    6. Confidence should be between 80-99.
    7. Never invent foods not in menu.
    8. Be friendly and conversational.

    Return ONLY valid JSON.

    {
    "foodName":"Veg Burger",
    "reason":"Short conversational reason",
    "confidence":95
    }
    `);

    const text = result.response.text();

    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const aiResponse = JSON.parse(cleaned);

    const recommendedFood = await Food.findOne({
      name: aiResponse.foodName,
    });

    res.status(200).json({
      success: true,
      recommendation: recommendedFood,
      reason: aiResponse.reason,
      confidence: aiResponse.confidence,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  askAI,
};