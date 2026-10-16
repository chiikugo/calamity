import { expect, test } from "vitest";
import { createNote, deriveTitle, wordCount, charCount } from './noteUtils';


test("making a dummy note", () => {
    const dummy = createNote();

    console.log(dummy);
});

test("testing Title generation", () => {
    const title = deriveTitle("My Title and trail.  ")

    console.log(title);
});

test("testing counts", () => {
    expect(wordCount("Chiku's World")).toBe(2);
});

test("char test", () => {
    expect(charCount("chiku")).toBe(5);
});

