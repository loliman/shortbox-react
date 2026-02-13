import { LoginSchema } from "./yupSchema";

describe("LoginSchema", () => {
  it("validates a complete payload", async () => {
    await expect(
      LoginSchema.validate({
        name: "admin",
        password: "secret",
      })
    ).resolves.toEqual({
      name: "admin",
      password: "secret",
    });
  });

  it("rejects missing fields", async () => {
    await expect(
      LoginSchema.validate(
        {
          name: "",
        },
        { abortEarly: false }
      )
    ).rejects.toMatchObject({
      errors: expect.arrayContaining(["Pflichtfeld"]),
    });
  });
});
