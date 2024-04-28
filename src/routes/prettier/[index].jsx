import { requestContext } from "@fastify/request-context";
import { escapeEntities } from "jsx-async-runtime";
import * as prettier from "prettier";
import Layout from "../Layout";

/**
 * @param {import("../types").RouteProps} props
 */
export default function Prettier({ request, reply }) {
  const form = request.body || { printWidth: 80, tabWidth: 2 };

  if (request.query["printWidth"] && request.query["tabWidth"]) {
    requestContext.set("response", async (payload) => {
      return typeof payload === "string" &&
        String(reply.getHeader("content-type")).startsWith("text/html")
        ? "<pre>" +
            escapeEntities(
              await prettier.format(payload, {
                parser: "html",
                printWidth: Number(request.query["printWidth"]),
                tabWidth: Number(request.query["tabWidth"]),
              })
            ) +
            "</pre>"
        : payload;
    });
  }

  return (
    <Layout title="Format resulting HTML with Prettier" css="/upload/index.css">
      <main>
        <form action="" method="post" style="width: 70%;">
          <h1>Post process HTML with Prettier</h1>
          <p>
            Jeasx allows you to post-process the resulting HTML output via a
            response-handler. Have a look at the source how things are wired up.
            This is an example for how to use prettier to format the resulting
            HTML.
          </p>
          <label>
            Print width:
            <input type="number" name="printWidth" value={form["printWidth"]} />
          </label>
          <label>
            Tab width:
            <input type="number" name="tabWidth" value={form["tabWidth"]} />
          </label>
          <button type="submit">Submit</button>
        </form>
      </main>
      <iframe
        src={`?printWidth=${form["printWidth"]}&tabWidth=${form["tabWidth"]}`}
        style="width: 70%; height: 300px; margin: 0 15%;"
      ></iframe>
    </Layout>
  );
}
