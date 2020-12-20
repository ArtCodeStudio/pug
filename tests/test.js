import * as pug from "../mod.js";
import { extname, join } from "../deps.js";
import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.81.0/testing/asserts.ts";

const dirname = join(Deno.cwd(), "/tests/cases");

for await (const entry of Deno.readDir(dirname)) {
  if (!entry.isFile || extname(entry.name) !== ".pug") {
    continue;
  }

  const expected = Deno.readTextFileSync(
    join(dirname, entry.name.replace(".pug", ".html")),
  );

  const fn = pug.compile(
    Deno.readTextFileSync(join(dirname, entry.name)),
    {
      filename: join(dirname, entry.name),
      basedir: dirname,
      pretty: true,
      filters: {
        custom: function (str, options) {
          assert(options.opt === "val");
          assert(options.num === 2);
          return "BEGIN" + str + "END";
        },
      },
    },
  );
  const result = fn({ title: "Pug" });

  assertEquals(result.trim(), expected.trim());
}