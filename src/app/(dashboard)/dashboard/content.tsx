import { CopyButton } from "@/app/(dashboard)/dashboard/copy-button";
import { WelcomeForm } from "@/app/(dashboard)/dashboard/welcome-form";
import { getUserProfile } from "@/lib/firebase/auth";

export async function DashboardContent() {
  const user = await getUserProfile();
  const userSlug = user?.slug;
  // const userSlug =
  //   "lorem ipson kdfjslfjsldk fklsdjlk fjlsdkj lksdfj lkkl jfsdklj sklf jl skdjf lkj lskfj lksjf klsfjalksdfj skldfj skl;fjs kljsdlkfjf lksj klsdjf klsdj";

  return (
    <>
      <section className="flex flex-col flex-1 p-3 xl:p-6">
        {!userSlug ? (
          <div className="flex flex-col flex-1 items-center justify-center gap-y-3 xl:gap-y-6">
            <h1 className="text-5xl font-bold">Get Started!</h1>
            <p className="text-center whitespace-break-spaces">
              Choose a unique username to get your free Postmark webhook URL
            </p>
            <div className="card bg-base-100 shadow-2xl xl:max-w-xl">
              <div className="card-body items-center">
                <WelcomeForm />
              </div>
            </div>
          </div>
        ) : (
          <div className="card w-full bg-base-300 xl:min-w-xl xl:max-w-6xl">
            <div className="card-body items-center text-center gap-y-3">
              <h1 className="card-title text-3xl">Webhook URL is ready</h1>
              <p className="label whitespace-break-spaces">
                Copy below webhook URL into your Postmark dashboard setting page
              </p>
              <CopyButton slug={userSlug} />
            </div>
          </div>
        )}
      </section>
      {/* <section className="flex flex-col flex-1 items-center justify-center">
        Dashboard Page
      </section> */}
    </>
  );
}
