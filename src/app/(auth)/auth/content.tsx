import { GoogleButton } from "@/app/(auth)/auth/google-button";

export function AuthContent() {
  return (
    <>
      <section className="flex flex-col flex-1 w-full items-center justify-center gap-y-9">
        <form className="flex flex-col w-full items-center p-3 gap-y-6 xl:p-6">
          <h1 className="text-3xl text-center">Login</h1>
          <GoogleButton />
        </form>
      </section>
    </>
  );
}
