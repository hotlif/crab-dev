/** Preserve attachment order: a native test may capture several snapshot targets. */
export function indexJsonAttachments(attachments) {
    const indexed = [];
    for (const [attachmentIndex, attachment] of attachments.entries()) {
        if (attachment.contentType !== 'application/json' || !attachment.body) continue;
        try {
            indexed.push({ attachmentIndex, name: attachment.name, value: JSON.parse(Buffer.from(attachment.body, 'base64').toString('utf8')) });
        } catch (error) {
            if (!(error instanceof SyntaxError)) throw error;
            // The unmodified native report retains malformed diagnostic bytes.
        }
    }
    return indexed;
}
