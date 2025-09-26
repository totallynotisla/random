function mix(s1, s2) {
	const chars = new Map();
	const temp = new Map();
	const ex = /[a-z]/;

	// Counting character frequencies in s1
	for (const char of s1) {
		if (!ex.test(char) || temp.has(`${char.toLowerCase()}`)) continue;

		const x = new RegExp(char, "g");
		const count = s1.match(x)?.length || 0;
		if (count > 1) chars.set(`${char.toLowerCase()}`, ["1", count]);
	}

	temp.clear();
	// Counting character frequencies in s2
	for (const char of s2) {
		if (!ex.test(char) || temp.has(`${char.toLowerCase()}`)) continue;

		const x = new RegExp(char, "g");
		const e = chars.get(`${char.toLowerCase()}`)?.[1];
		const count = s2.match(x)?.length || 0;

		if (count < 2) continue;
		else if (e && e === count) chars.set(`${char.toLowerCase()}`, ["=", count]);
		else if (!e || e < count) chars.set(`${char.toLowerCase()}`, ["2", count]);
	}

	// Creating the result string
	return Array.from(chars)
		.map(([char, [owner, count]]) => `${owner}:${char.repeat(count)}`)
		.join("/");
}

console.log(mix("Are they here", "yes, they are here")); // "2:eeeee/2:yy/=:hh/=:rr"
