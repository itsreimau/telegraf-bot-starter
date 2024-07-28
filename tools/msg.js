const {
    translate
} = require("bing-translate-api");

const format = {
    html: {
        escape(text) {
            return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        },
        bold(text) {
            return `<b>${text}</b>`;
        },
        italic(text) {
            return `<i>${text}</i>`;
        },
        strikethrough(text) {
            return `<s>${text}</s>`;
        },
        underline(text) {
            return `<u>${text}</u>`;
        },
        blockquote(text) {
            return `<blockquote>${text}</blockquote>`;
        },
        spoiler(text) {
            return `<span class="tg-spoiler">${text}</span>`;
        },
        tgEmoji(fallback, emojiId) {
            return `<tg-emoji emoji-id="${emojiId}">${fallback}</tg-emoji>`;
        },
        monospace(text) {
            return `<code>${this.escape(text)}</code>`;
        },
        monospaceBlock(text, programmingLanguage) {
            if (programmingLanguage) {
                return `<pre><code class="language-${programmingLanguage}">${this.escape(text)}</code></pre>`;
            }
            return `<pre>${this.escape(text)}</pre>`;
        },
        url(label, url) {
            return `<a href="${url}">${label}</a>`;
        },
        userMention(label, userId) {
            return this.url(label, `tg://user?id=${userId}`);
        }
    },
    markdown: {
        escapeInternal(text, escapeChars) {
            return text.replace(new RegExp(`[${escapeChars}\\\\]`, "g"), "\\$&");
        },
        escape(text) {
            return text.replace(/[_*[\]()~`>#+\-=|{}.!\\]/g, "\\$&");
        },
        bold(text) {
            return `**${text}**`;
        },
        italic(text) {
            return `*${text}*`;
        },
        strikethrough(text) {
            return `~~${text}~~`;
        },
        underline(text) {
            return `<u>${text}</u>`; // Markdown does not support underlines directly
        },
        blockquote(text) {
            return text.split("\n").map(line => `> ${line}`).join("\n");
        },
        spoiler(text) {
            return `||${text}||`;
        },
        tgEmoji(fallback, emojiId) {
            return `![${fallback}](tg://emoji?id=${emojiId})`;
        },
        monospace(text) {
            return `\`${this.escapeInternal(text, "`")}\``;
        },
        monospaceBlock(text, programmingLanguage) {
            let result = "```";
            if (programmingLanguage) {
                result += programmingLanguage;
            }
            result += "\n" + this.escapeInternal(text, "`") + "\n```";
            return result;
        },
        url(label, url) {
            return `[${label}](${this.escapeInternal(url, ")")})`;
        },
        userMention(label, userId) {
            return this.url(label, `tg://user?id=${userId}`);
        }
    }
};

async function msgTranslate(msg, lc) {
    if (lc === "en") {
        return msg; // Not translated due to system language
    }

    try {
        const {
            translation
        } = await translate(msg, null, lc);
        return translation;
    } catch (error) {
        console.error("Error:", error);
    }
}


module.exports = {
    format,
    translate
};