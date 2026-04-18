const axios = require('axios');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const SYSTEM_PROMPT = `
You are an expert Chrome extension developer. You will receive a user request.
Think step by step about what files are needed (manifest.json, content.js, popup.html, etc.).
Generate valid Manifest V3 code.
Output ONLY a valid, strictly formatted JSON object where keys are filenames and values are file contents.

IMPORTANT INSTRUCTIONS:
1. Ensure all quotes ("), backslashes (\\), and newlines inside the code strings are properly escaped for JSON.
2. Do NOT wrap the JSON in markdown formatting (e.g., do not use \`\`\`json). Return ONLY the raw JSON string.
3. ABSOLUTELY NO IMAGES OR BASE64 STRINGS. Do not generate .png, .jpg, or any image files. Omit the "icons" and "default_icon" fields from the manifest.json so the browser uses the default extension icon.

Example:
{
  "manifest.json": "{\\"name\\": \\"My Ext\\", \\"manifest_version\\": 3, \\"version\\": \\"1.0\\"}",
  "content.js": "console.log(\\"Hello World\\");"
}
`;

async function generateExtensionFiles(userPrompt) {
  let content = '';

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: 'user',
            parts: [{ text: SYSTEM_PROMPT + '\n\n' + userPrompt }],
          },
        ],
      },
    );

    content = response.data.candidates[0].content.parts[0].text;

    // Sanitize: Strip out Markdown backticks if the AI disobeys the prompt
    content = content
      .replace(/^```json\s*/g, '')
      .replace(/```\s*$/g, '')
      .trim();

    const files = JSON.parse(content);
    if (!files['manifest.json']) throw new Error('manifest.json missing');
    return files;
  } catch (err) {
    // Log the actual broken text or the Axios API error
    console.error('--- FAILED JSON CONTENT OR API ERROR ---');
    if (err.response) {
      // If the Gemini API itself threw an error (e.g., 400 Bad Request, 429 Quota)
      console.error(JSON.stringify(err.response.data, null, 2));
    } else {
      // If the AI generated bad JSON
      console.error(content);
    }
    console.error('---------------------------');
    throw new Error('Extension generation failed: ' + err.message);
  }
}

module.exports = { generateExtensionFiles };
