import { CopyButton } from "@/app/(dashboard)/dashboard/copy-button";
import { WelcomeForm } from "@/app/(dashboard)/dashboard/welcome-form";
import { getUserProfile } from "@/lib/firebase/auth";

export async function DashboardContent() {
  const user = await getUserProfile();
  const userSlug = user?.slug;

  return (
    <>
      <section className="flex flex-col flex-1 items-center p-3 xl:p-6">
        {userSlug ? (
          <div className="card flex flex-col bg-base-300 gap-y-6 xl:min-w-xl">
            <div className="card-body items-center text-center gap-y-3">
              <h1 className="card-title text-3xl">Webhook URL is ready</h1>
              <p className="text-xs text-base-content/60">
                Copy below webhook URL into your Postmark dashboard setting page
              </p>
              <input
                className="input input-lg w-full text-center"
                disabled
                type="text"
                placeholder={`${process.env.APP_ORIGIN}/webhook/${userSlug}`}
              />
              <CopyButton slug={userSlug} />
            </div>
          </div>
        ) : (
          <div className="hero bg-base-200 h-full">
            <div className="hero-content flex-col">
              <div className="text-center">
                <h1 className="text-5xl font-bold">Get Started!</h1>
                <p className="py-3 xl:max-w-2xl">
                  Choose a unique username to get your free Postmark webhook URL
                </p>
              </div>
              <div className="card bg-base-100 w-full shrink-0 shadow-2xl">
                <div className="card-body">
                  <WelcomeForm />
                </div>
              </div>
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
