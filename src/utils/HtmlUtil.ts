import { JSDOM } from 'jsdom';

export default class HtmlUtil {
    public static trimHtml(html: string): string {
        let body: string = html.split("<body")[1].split(">").slice(1).join(">").split("</body>")[0];
        body = body.replace(/<br>/g, "\n");
        body = body.replace(/&amp;/g, "&");
        const dom = new JSDOM(body);
        body = dom.window.document.body.textContent as string;
        let fjcuLine: boolean = false;
        let nameLine: boolean = false;
        let noTextInTheFront: boolean = true;
        let list = [];
        for (let line of body.split("\n")) {
            // School name line
            if (!fjcuLine && line.trim() == "天主教輔仁大學") {
                fjcuLine = true;
                continue;
            }
            // Student name line
            if (!nameLine && line.trim().includes(process.env.STUD_NAME as string)) {
                nameLine = true;
                body.replace(process.env.STUD_NAME as string, "同學們");
                continue;
            }
            // Check if it's header line
            if (noTextInTheFront && this.isEmptyLine(line)) continue;
            // Push string
            list.push(line.trim());
            noTextInTheFront = false;
        }
        let lastLine = 0;
        for (let i = 0; i < list.length; i++) {
            if (list[i] != "") lastLine = i;
        }
        list = list.slice(0, lastLine);
        return list.join("\n");
    }

    private static removeHtml(body: string, name: string): string {
        let split = body.split(`<${name}`);
        let data = split[0] + body.split(`<${name}`).slice(1).join(`<${name}`).split(">").slice(1).join(">").split(`</${name}>`).join("");
        return data;
    }
    
    private static isEmptyLine(line: string) {
        return line.replace(/ /g, "") == "";
    }
}