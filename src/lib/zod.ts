import { z } from "zod";
import slugify from "slugify";

export const zodSlug = z
	.string()
	.min(1, "Slug base must not be empty")
	.transform((val) => slugify(val, { lower: false, strict: true }))
	.refine((val) => /^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/.test(val), {
		message: "Invalid slug format",
	});
