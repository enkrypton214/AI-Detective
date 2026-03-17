function chunkText(text, chunkSize = 120, overlap = 20) {
	const words = text.split(" ");
	const chunks = [];

	for (let i = 0; i < words.length; i += chunkSize - overlap) {
		const chunk = words.slice(i, i + chunkSize).join(" ");
		if (chunk.length > 0) {
			chunks.push(chunk);
		}
	}
	return chunks;
}

module.exports = chunkText;

// breaking down sentences into chunks of 120 characters. however flawed for long sentences for now
//parena
