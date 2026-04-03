const { GoogleGenerativeAI } = require("@google/generative-ai");

const chatWithAI = async (req, res) => {
    try {
        // Kiểm tra xem API Key đã tồn tại chưa để tránh lỗi crash server
        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ message: "Thiếu cấu hình API Key cho AI!" });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const { message, userName } = req.body;

        // Prompt được trau chuốt hơn để AI tập trung vào thực đơn của quán
        const prompt = `Bạn là Lisieen AI, trợ lý ảo thông minh của quán CaféSync. 
        Khách hàng tên là ${userName || 'Bạn'}. 
        Nhiệm vụ: Tư vấn menu (Cà phê, Trà, Đá xay) và các tùy chọn (Size S/M/L, Đường/Đá 0-50-100%).
        Phong cách: Ấm áp, hóm hỉnh, chuyên nghiệp. 
        Câu hỏi của khách: ${message}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;

        // Trả về câu trả lời kèm theo định dạng JSON
        res.json({ reply: response.text() });
    } catch (error) {
        console.error("Lỗi Gemini AI:", error.message);
        res.status(500).json({ message: "Lisieen AI đang bận pha máy, bạn đợi một chút nhé! ☕" });
    }
};

module.exports = { chatWithAI };