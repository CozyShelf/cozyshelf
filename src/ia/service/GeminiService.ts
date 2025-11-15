import environment from "../../generic/config/environment";

export default class GeminiService {
	public async talkToAi(prompt: string): Promise<string> {
		const apiKey = environment.ai.apiKey;
		if (!apiKey) {
			throw new Error("Gemini API key is not configured.");
		}

		const response = await fetch(
			`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-goog-api-key": apiKey,
				},
				body: JSON.stringify({
					contents: [
						{
							parts: [
								{
									text: prompt,
								},
							],
						},
					],
				}),
			}
		);

		if (!response.ok) {
			throw new Error(`API request failed: ${response.statusText}`);
		}

		const data = await response.json();
		return data.candidates[0].content.parts[0].text;
	}

	public async talkToAiWithCache(
		prompt: string,
		cacheId: string
	): Promise<string> {
		const apiKey = environment.ai.apiKey;
		if (!apiKey) {
			throw new Error("Gemini API key is not configured.");
		}

		const response = await fetch(
			`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-goog-api-key": apiKey,
				},
				body: JSON.stringify({
					cached_content: cacheId,
					contents: [
						{
							parts: [
								{
									text: prompt,
								},
							],
						},
					],
				}),
			}
		);

		if (!response.ok) {
			throw new Error(`API request failed: ${response.statusText}`);
		}

		const data = await response.json();
		return data.candidates[0].content.parts[0].text;
	}
}
