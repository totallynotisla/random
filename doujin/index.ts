import axios, { AxiosResponse } from "axios";
import http from "http";
import fs from "node:fs";
import { HttpsCookieAgent } from "http-cookie-agent/http";
import { Cookie, CookieJar, parse } from "tough-cookie";

/**
 * TODO:
 * Bypass cloudflare
 */
async function main(): Promise<any> {
    let jar = new CookieJar();
    jar.setCookie(<Cookie>parse("cf_clearance=z5XzX0P7upm8yreM5enI49Qr7pQbLlKrwvaII94_UTI-1715841161-1.0.1.1-2cUKiAkIm9cDXVn3BJaXzZ7gvvmsWdOHeBynHzPLs_zsOzjpi6vIUv3PfYkT5..yx_QG1SXdqsJ4J8BW8yyzqw;"), "nhentai.net");
    let agent = new HttpsCookieAgent({ cookies: { jar } });
    let req = axios.create({ httpsAgent: agent });
    req.defaults.headers.common["User-Agent"] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 OPR/109.0.0.0";

    try {
        let res = await req.get("https://nhentai.net");
        console.log("Success");
        console.log(res.headers.getUserAgent);
        fs.writeFileSync("res.html", res.data);
    } catch (err: any) {
        console.log(err.response);
        console.log(err.response.headers.getUserAgent);
        fs.writeFileSync("res.html", err.response.data);
    }
}

main();
