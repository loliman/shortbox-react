export function generateStoryTitle(s) {
    if (s.title)
        return s.title;
    else
        return "ohne Titel";
}

export function generateIssueSubHeader(i) {
    let header = i.title;
    if (i.format) {
        header += " [" + i.format;
        if (i.variant)
            header += " " + i.variant;
        header += "]"
    }
    return header;
}