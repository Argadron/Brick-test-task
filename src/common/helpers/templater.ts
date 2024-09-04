import { templateObject } from "../../email/interfaces";

export default function templater(html: string, object: templateObject) {
    return html.replace(/{(\w*)}/g, (m, key) => object.hasOwnProperty(key) ? object[key]: "")
}